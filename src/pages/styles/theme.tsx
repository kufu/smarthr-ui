import React from 'react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import {
  FONT_FAMILY,
  defaultBorder as border,
  createTheme,
  defaultFontSize as fontSize,
  defaultRadius as radius,
} from '../..'

import { generateWidth } from './grid'

export const smarthrUITheme = createTheme()
export const layout = {
  fontSize,
  border,
  // leading: smarthrUITheme.leading,
  color: smarthrUITheme.color,
  radius,
  space: smarthrUITheme.spacingByChar,
  width: generateWidth(smarthrUITheme.spacingByChar),
  zIndex: smarthrUITheme.zIndex,
}

export const LayoutProvider: React.VFC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={layout}>{children}</ThemeProvider>
)

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    margin: 0;
    background-color: ${smarthrUITheme.color.BACKGROUND};
    height: 100%;
    font-family: ${FONT_FAMILY};
    color: ${smarthrUITheme.color.TEXT_BLACK};
  }
  #root {
    height: 100%;
  }
  p {
    margin: 0;
  }
  ul,
  ol {
    list-style: none;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
  }
  fieldset {
    margin-right: 0;
    margin-left: 0;
    border-style: none;
    padding: 0;
  }
  figure {
    margin: 0;
  }
`
