import fs from 'fs'
import path from 'path'
import util from 'util'

import ts from 'typescript'

const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)

const IGNORE_COMPONENTS = ['Experimental']
const IGNORE_INNER_DIRS = [
  'FlashMessage/FlashMessageList',
  'Input/InputWithTooltip',
  'Browser/models',
  'stories',
]

describe('index', () => {
  const indexPath = './src/index.ts'
  const componentsPath = './src/components'

  it('src/components 配下に存在する全てのディレクトリからコンポーネントが export されていること', async () => {
    const exported = await getExportedComponents(indexPath)
    const componentDirs = await getComponentDirs(componentsPath, IGNORE_COMPONENTS)
    expect(componentDirs.sort()).toEqual(exported.sort())
  })

  it('各コンポーネントディレクトリ直下に存在する子ディレクトリ名と同名のコンポーネントが export されていること', async () => {
    const componentDirs = await getComponentDirs(componentsPath, IGNORE_COMPONENTS)
    componentDirs.forEach(async (dirName) => {
      const componentDirPath = path.join(componentsPath, dirName)
      const innerComponents = await getComponentDirs(componentDirPath, IGNORE_INNER_DIRS)
      if (innerComponents.length === 0) {
        return
      }
      const exportedCompoenntsFromInnerDir = await getExportedDirectoryComponents(
        indexPath,
        `./components/${dirName}`,
      )
      expect(exportedCompoenntsFromInnerDir.sort()).toEqual(
        expect.arrayContaining(innerComponents.sort()),
      )
    })
  })
})

const getExportPath = (node: ts.ExportDeclaration) => {
  let exportPath = ''

  node.forEachChild((child: ts.Node) => {
    if (ts.isStringLiteral(child)) {
      exportPath = `${child.text}`
    }
  })

  return exportPath
}

const getAllExportPaths = (sourceFile: ts.SourceFile): string[] => {
  const exportPaths: string[] = []

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isExportDeclaration(node)) {
      exportPaths.push(getExportPath(node))
    }
  })

  return exportPaths
}

const isNonComponentsExports = (file: string) => file.indexOf('./components/') !== -1
const getComponentName = (file: string) => file.replace('./components/', '')

const getSourceFile = async (filePath: string) => {
  const source = await readFile(filePath)
  const sourceFile = ts.createSourceFile(filePath, source.toString(), ts.ScriptTarget.Latest)

  return sourceFile
}

const parseFile = async (filePath: string): Promise<string[]> => {
  const sourceFile = await getSourceFile(filePath)
  return getAllExportPaths(sourceFile)
}

const getExportedComponents = async (file: string): Promise<string[]> => {
  const files = await parseFile(file)
  return files.filter(isNonComponentsExports).map(getComponentName)
}

const getComponentDirs = async (dirPath: string, ignoreDirs: string[] = []) => {
  const files = await readdir(dirPath, { withFileTypes: true })
  return files
    .filter(
      (file) =>
        file.isDirectory() &&
        !file.name.match(/^__.+__$/) && // __tests__ や __snapshots__ ディレクトリを除外
        !ignoreDirs.find((ignoreDir) => path.join(dirPath, file.name).match(`${ignoreDir}$`)),
    )
    .map((file) => file.name)
}

const getExportedDirectoryComponents = async (
  filePath: string,
  directoryPath: string,
): Promise<string[]> => {
  const sourceFile = await getSourceFile(filePath)
  const exportComponents: string[] = []

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isExportDeclaration(node) && getExportPath(node) === directoryPath) {
      node.forEachChild((child) => {
        if (ts.isNamedExports(child)) {
          child.elements.forEach((element) => {
            exportComponents.push(`${element.name.escapedText}`)
          })
        }
      })
    }
  })

  return exportComponents
}
