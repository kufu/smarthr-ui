import fs from 'node:fs/promises'
import path from 'node:path'

import { glob } from 'glob'
import * as docgen from 'react-docgen-typescript'
import ts from 'typescript'

/*
 * react-docgen-typescript を使用し型定義ファイルからコンポーネントの Props 情報を抽出し、metadata.json に保存するスクリプト
 * - 型定義ファイルの生成後に実行する
 * - デザインシステムサイトでpropsの一覧テーブルを生成するために使用している
 */

const relativePath = path.relative(process.cwd(), import.meta.dirname)
const SRC_PATH = path.join(relativePath, '../src/**/*.tsx')
const IGNORE_FILE_WORDS = ['test', 'stories', 'libs', 'use', 'hocs', 'setupTests', '.test.']
const excludeFilesRegExp = new RegExp(`^(?!.*(${IGNORE_FILE_WORDS.join('|')})).*$`)
// Props を独自に実装したものに絞る
const propsNameRegExp = /.*(?=Props|TypeLiteral$)/
const IGNORE_DECLARATIONS = ['ElementProps', 'StyleProps']
const excludeDeclarationsRegExp = new RegExp(`^(?!.*(${IGNORE_DECLARATIONS.join('|')})).*$`)

// TypeScriptコンパイラを使って型エイリアスを展開する
function expandTypeAliases(files: string[]) {
  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.React,
    esModuleInterop: true,
  })
  const checker = program.getTypeChecker()
  const typeCache = new Map<string, any>()

  // ファイルから型エイリアスを抽出
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile || !files.includes(sourceFile.fileName)) continue

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isTypeAliasDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name)
        if (symbol) {
          const type = checker.getDeclaredTypeOfSymbol(symbol)
          const typeName = node.name.text
          typeCache.set(
            typeName,
            checker.typeToString(type, undefined, ts.TypeFormatFlags.InTypeAlias),
          )
        }
      }
    })
  }

  return typeCache
}

glob(SRC_PATH).then(
  async (files) => {
    const targets = files.filter((file) => excludeFilesRegExp.test(file))

    // 型エイリアスのキャッシュを作成
    const typeAliasCache = expandTypeAliases(targets)

    const fileParser = docgen.withCompilerOptions(
      { esModuleInterop: true },
      {
        shouldExtractValuesFromUnion: true,
        shouldRemoveUndefinedFromOptional: true,
        propFilter: {
          skipPropsWithName: ['as', 'id', 'inputMode', 'is'],
        },
      },
    )

    // 型情報の中の型エイリアスを展開する関数
    function expandPropType(propType: any): any {
      if (!propType) return propType

      if (propType.name === 'enum' && propType.value) {
        const expandedValue = propType.value.map((v: any) => {
          // 型エイリアスを展開
          let expandedValueString = v.value
          let wasExpanded = false

          typeAliasCache.forEach((expandedType, aliasName) => {
            const regex = new RegExp(`\\b${aliasName}\\b`, 'g')
            if (regex.test(expandedValueString)) {
              expandedValueString = expandedValueString.replace(regex, expandedType)
              wasExpanded = true
            }
          })

          if (wasExpanded) {
            return {
              ...v,
              value: expandedValueString,
              expandedFrom: v.value,
            }
          }
          return v
        })

        // raw フィールドも型エイリアスを展開
        let expandedRaw = propType.raw
        if (expandedRaw) {
          typeAliasCache.forEach((expandedType, aliasName) => {
            expandedRaw = expandedRaw.replace(new RegExp(`\\b${aliasName}\\b`, 'g'), expandedType)
          })
        }

        return {
          ...propType,
          raw: expandedRaw,
          value: expandedValue,
        }
      }

      // 単純な型名の場合
      if (typeof propType.name === 'string' && typeAliasCache.has(propType.name)) {
        return {
          ...propType,
          name: typeAliasCache.get(propType.name),
          expandedFrom: propType.name,
        }
      }

      return propType
    }

    const docs = fileParser.parse(targets).map(({ props, ...rest }) => {
      const filteredProps = Object.keys(props).flatMap((name) => {
        const propItem = props[name]
        const declarations = propItem.declarations

        if (!declarations || declarations.length === 0) {
          return propItem
        }

        const declarationName = declarations[0].name
        if (
          propsNameRegExp.test(declarationName) &&
          excludeDeclarationsRegExp.test(declarationName)
        ) {
          // 型エイリアスを展開
          return {
            ...propItem,
            type: expandPropType(propItem.type),
          }
        }
        return []
      })

      return {
        ...rest,
        props: filteredProps,
      }
    })
    await fs.writeFile(path.join(import.meta.dirname, '../metadata.json'), JSON.stringify(docs))
  },
  (err) => {
    console.error(err)
    process.exitCode = 1
  },
)
