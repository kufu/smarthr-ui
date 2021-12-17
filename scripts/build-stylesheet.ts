const React = require('react')
const { renderToString } = require('react-dom/server')
const { ServerStyleSheet, StyleSheetManager } = require('styled-components')
const path = require('path')
const fs = require('fs')
const AccordionPanel = require('../lib/components/AccordionPanel/style')
const Button = require('../lib/components/Button/style')

const Components = [AccordionPanel, Button]

const compact = (ary) => ary.filter((i) => !!i)

const styleTags = (() => {
  const generateStyle = (Component) => {
    const sheet = new ServerStyleSheet()

    let style
    try {
      renderToString(
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
fs.writeFileSync(path.resolve('lib', 'style.css'), styleTags)
