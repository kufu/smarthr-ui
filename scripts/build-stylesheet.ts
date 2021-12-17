const React = require('react')
const { renderToString } = require('react-dom/server')
const { ServerStyleSheet, StyleSheetManager } = require('styled-components')
const { Style: ButtonStyle } = require('../lib/components/Button/style')

const compact = (ary) => ary.filter((i) => !!i)

const sheet = new ServerStyleSheet()
const styleTags = (() => {
  let style

  try {
    renderToString(
      React.createElement(
        StyleSheetManager,
        { sheet: sheet.instance },
        React.createElement(ButtonStyle, {}),
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
    const parsedId = compact(id.split('-')).filter((_i, index) => index !== 1)
    const parsedContent = compact(content.split(','))

    console.log(parsedId, parsedContent)

    const styleNameFormatter = (key) => {
      // eslint-disable-next-line no-useless-escape
      style = style.replace(new RegExp(`\.${key}([\{|\.|\[|\: ])`, 'g'), `.${parsedId.join('-')}$1`)
    }

    styleNameFormatter(parsedContent[0])
    styleNameFormatter(id)
  })

  console.log('----------------------')

  style = style.replace(regexp, '\n')

  return style
})()

console.log(styleTags)
