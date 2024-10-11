/* eslint @typescript-eslint/no-require-imports: 0 */

const path = require('path')

const fs = require('fs-extra')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { ServerStyleSheet, StyleSheetManager } = require('styled-components')

const AccordionPanel = require('../css/components/AccordionPanel/style')
const Button = require('../css/components/Button/style')

const Components = [AccordionPanel, Button]

const compact = (ary) => ary.filter((i) => !!i)

const styleTags = (() => {
  const generateStyle = (Component) => {
    const sheet = new ServerStyleSheet()

    let style
    try {
      ReactDOMServer.renderToString(
        React.createElement(
          StyleSheetManager,
          { sheet: sheet.instance },
          React.createElement(Component.Style, {}),
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
      const nextStyleName = [
        Component.PREFIX,
        ...compact(id.split('-')).filter((_i, index) => index !== 1),
      ].join('-')
      const parsedContent = compact(content.split(','))

      console.log(nextStyleName, parsedContent)

      const styleNameFormatter = (key) => {
        // eslint-disable-next-line no-useless-escape
        style = style.replace(new RegExp(`\.${key}([\{|\.|\[|\: ])`, 'g'), `.${nextStyleName}$1`)
      }

      styleNameFormatter(parsedContent[0])
      styleNameFormatter(id)
    })

    console.log('----------------------')

    style = style.replace(regexp, '\n')
    return style
  }

  return Components.map((C) => generateStyle(C)).join('\n')
})()

console.log(styleTags)
fs.removeSync(path.resolve('css'))
fs.outputFileSync(path.resolve('css', 'style.css'), styleTags)
