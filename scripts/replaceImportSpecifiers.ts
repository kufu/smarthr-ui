import * as fs from 'fs'
import * as path from 'path'

import { Project } from 'ts-morph'

const project = new Project()
function findFiles(directory: string, regex: RegExp): string[] {
  const filePaths: string[] = []
  function recursivelySearch(currentDir: string) {
    const entries = fs.readdirSync(currentDir)
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry)
      const stat = fs.statSync(entryPath)

      if (stat.isDirectory()) {
        recursivelySearch(entryPath)
      } else if (stat.isFile() && regex.test(entryPath)) {
        filePaths.push(entryPath)
      }
    }
  }
  recursivelySearch(directory)
  return filePaths
}

// { '/Users/aoyagi/smarthr-ui/src/components/Button': '/Users/aoyagi/smarthr-ui/src/components/Button/new' } 的な map を作る
function getComponentReplaceMap() {
  const newComponentFilePaths = findFiles(path.join(__dirname, '../src/components'), new RegExp(/\/index\.ts$/))
  const componentReplaceMap: Map<string, string> = new Map()

  for (const filePath of newComponentFilePaths) {
    const code = fs.readFileSync(filePath, 'utf-8')
    const file = project.createSourceFile(filePath, code, { overwrite: true })
    const statements = file.getStatementsWithComments()
    for (const statement of statements) {
      const commentRanges = statement.getLeadingCommentRanges()
      for (const commentRange of commentRanges) {
        const commentString = commentRange.getText()
        const match = commentString.match(/\/\*\s@new\s(.+)\s\*\//)
        const componentName = match && match[1]
        if (componentName) {
          const keyPath = path.join(__dirname, '../src/components', componentName)
          componentReplaceMap.set(keyPath, path.dirname(filePath))
        }
      }
    }
  }
  return componentReplaceMap
}

function replaceImportDeclaration(componentReplaceMap: Map<string, string>) {
  const storyFilePaths = findFiles(path.join(__dirname, '../src/components'), new RegExp(/stories\.tsx$/))

  for (const filePath of storyFilePaths) {
    const code = fs.readFileSync(filePath, 'utf-8')
    const file = project.createSourceFile(filePath, code, { overwrite: true })
    const importDeclarations = file.getImportDeclarations()
    for (const importDeclaration of importDeclarations) {
      const importPath = importDeclaration.getModuleSpecifierValue()
      const importAbsolutePath = path.join(path.dirname(filePath), importPath) // `../Button` -> `/Users/aoyagi/smarthr-ui/src/components/Button`
      const newComponentAbsolutePath = componentReplaceMap.get(importAbsolutePath)
      if (newComponentAbsolutePath) {
        importDeclaration.getModuleSpecifier().replaceWithText(`'${newComponentAbsolutePath}'`)
      }
    }
    file.saveSync()
  }
}

const componentReplaceMap = getComponentReplaceMap()
replaceImportDeclaration(componentReplaceMap)
