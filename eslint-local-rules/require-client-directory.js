/**
 * @fileoverview 'use client' ディレクティブを持つファイルが client ディレクトリ配下に
 * 置かれているかどうかをチェックするルール
 * @author SmartHR
 */

const path = require('node:path')

const isDirectivePrologueStatement = (node) =>
  node.type === 'ExpressionStatement' && node.directive !== undefined

const findUseClientDirective = (body) => {
  for (const statement of body) {
    if (!isDirectivePrologueStatement(statement)) {
      return undefined
    }
    if (statement.directive === 'use client') {
      return statement
    }
  }
  return undefined
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "'use client' ディレクティブを持つファイルは client ディレクトリ配下に置く",
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      requireClientDirectory:
        "'use client' ディレクティブを持つファイルは client ディレクトリ配下に置いてください。",
    },
  },

  create(context) {
    return {
      Program(node) {
        const useClientStatement = findUseClientDirective(node.body)

        if (!useClientStatement) {
          return
        }

        const filename = context.filename ?? context.getFilename()
        const cwd = context.cwd ?? context.getCwd()
        const relative = path.relative(cwd, filename)
        const normalized = relative.split(path.sep).join(path.posix.sep)
        const segments = normalized.split(path.posix.sep)

        if (!segments.includes('client')) {
          context.report({
            node: useClientStatement,
            messageId: 'requireClientDirectory',
          })
        }
      },
    }
  },
}
