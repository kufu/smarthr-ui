const React = require('react')
const { renderToString } = require('react-dom/server')
const { ServerStyleSheet, StyleSheetManager } = require('styled-components')
const { Style } = require('../lib/style')

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

  return style.replace(/^<style.*?>/, '').replace(/<\/style>$/, '')
})()

console.log(styleTags)
