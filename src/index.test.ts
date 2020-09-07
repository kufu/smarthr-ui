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
})

const getAllExportPaths = (sourceFile: ts.SourceFile): string[] => {
  const exportPaths: string[] = []
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isExportDeclaration(node)) {
      node.forEachChild((child: ts.Node) => {
        if (ts.isStringLiteral(child)) {
          exportPaths.push(`${child.text}`)
        }
      })
    }
  })
  return exportPaths
}

const isNonComponentsExports = (file: string) => file.indexOf('./components/') !== -1
const getComponentName = (file: string) => file.replace('./components/', '')

const parseFile = async (filePath: string): Promise<string[]> => {
  const source = await readFile(filePath)
  const sourceFile = ts.createSourceFile(filePath, source.toString(), ts.ScriptTarget.Latest)
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
