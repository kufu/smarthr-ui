import ts from 'typescript'
import util from 'util'
import fs from 'fs'

const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)

const IGNORE_DIRS = ['__tests__', 'Downloader', 'ProgressBar']

describe('index', () => {
  it('should export all components in the components directory from index.ts', async () => {
    const actual = await getExportedComponents('./src/index.ts')
    const expected = await getExistingComponents('./src/components/', IGNORE_DIRS)
    expect(expected.sort()).toEqual(actual.sort())
  })

  describe('Layout', () => {
    const IGNORE_FILES = ['index.ts', 'type.ts', 'Layout.stories.tsx']

    it('components/Layout ディレクトリの全てのコンポーネントが components/Layout/index.ts 経由で index.ts から export されていること', async () => {
      const actual = await getExportedDirectoryComponents('./src/index.ts', './components/Layout')
      const expected = await getExistingComponents('./src/components/Layout/', IGNORE_FILES)
      expect(expected.sort()).toEqual(actual.sort())
    })
  })
})

const getExportPath = (node: ts.ExportDeclaration) => {
  let path = ''

  node.forEachChild((child: ts.Node) => {
    if (ts.isStringLiteral(child)) {
      path = `${child.text}`
    }
  })

  return path
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

const getExistingComponents = async (file: string, filterDirs: string[]): Promise<string[]> => {
  const dirs = await readdir(file)
  return dirs.filter((dir) => !filterDirs.includes(dir))
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
