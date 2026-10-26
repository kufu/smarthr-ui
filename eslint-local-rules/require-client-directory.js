/**
 * @fileoverview 'use client' ディレクティブを持つファイルが client ディレクトリ配下に
 * 置かれているかどうかをチェックするルール
 * @author SmartHR
 */

const path = require('node:path')

const isUseClientDirective = (node) =>
  node.type === 'ExpressionStatement' &&
  (node.directive === 'use client' ||
    (node.expression.type === 'Literal' && node.expression.value === 'use client'))

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
        const [firstStatement] = node.body

        if (!firstStatement || !isUseClientDirective(firstStatement)) {
          return
        }

        const filename = context.filename ?? context.getFilename()
        const normalized = filename.split(path.sep).join(path.posix.sep)
        const segments = normalized.split(path.posix.sep)

        if (!segments.includes('client')) {
          context.report({
            node,
            messageId: 'requireClientDirectory',
          })
        }
      },
    }
  },
}
