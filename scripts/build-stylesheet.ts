const React = require('react')
const { renderToString } = require('react-dom/server')
const { ServerStyleSheet, StyleSheetManager } = require('styled-components')
const { Style } = require('../lib/style')

const compact = (ary) => ary.filter((i) => !!i)
const idPrefix = 'static-style-temp-'

const sheet = new ServerStyleSheet()
const styleTags = (() => {
  let style

  try {
    renderToString(
      React.createElement(
        StyleSheetManager,
        { sheet: sheet.instance },
        React.createElement(Style, {}),
      ),
    )
    style = sheet.getStyleTags()
  } catch (error) {
    console.error(error)
  } finally {
    sheet.seal()
  }

  style = style
    // eslint-disable-next-line no-useless-escape
    .replace(/\/\*\!sc\*\//g, '')
    .replace(/^<style.*?>/, '')
    .replace(/<\/style>$/, '')
  style = `${style}\n`

  const regexp = /data-styled\.(.+?})\n/g
  const matcher = style.match(regexp)

  matcher.forEach((m) => {
    const [_line, _gid, id, content] = m.match(
      /^data-styled(.+?)\[id="(.+?)"\]\{content:"(.+?)"\}\n?$/,
    )
    const parsedId = compact(id.split(idPrefix))
    const parsedContent = compact(content.split(','))

    console.log(parsedId, parsedContent)

    // eslint-disable-next-line no-useless-escape
    const partRegex = `\.${parsedContent[0]}([\{|\.|\[|\: ])`
    style = style.replace(new RegExp(partRegex, 'g'), `.${parsedId.join('')}$1`)
  })

  console.log('----------------------')

  style = style.replace(regexp, '\n')
  style = style.replace(new RegExp(`${idPrefix}`, 'g'), '')

  return style
})()

console.log(styleTags)
