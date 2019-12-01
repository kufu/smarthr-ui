<h1 align="center">SmartHR-UI</h1>

<div align="center">

React components for creating SmartHR applications.

[![npm version](https://badge.fury.io/js/smarthr-ui.svg)](https://badge.fury.io/js/smarthr-ui)
[![CircleCI](https://circleci.com/gh/kufu/smarthr-ui.svg?style=shield)](https://circleci.com/gh/kufu/smarthr-ui)

</div>

## Components

master branch's storybook: https://smarthr-ui.netlify.com/

## Installation

SmartHR-UI is available as an  [npm package](https://www.npmjs.com/package/smarthr-ui).

```sh
// with npm
npm install smarthr-ui

// with yarn
yarn add smarthr-ui
```

Install peerDependencies.

```sh
// with npm
npm install react react-dom styled-components

// with yarn
yarn add react react-dom styled-components
```

## Usage

The simplest and easiest example to get you started.

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, Button } from 'smarthr-ui'

const App: React.FC<{}> = () => (
  <ThemeProvider>
    <Button>Hello World</Button>
  </ThemeProvider>
)

ReactDOM.render(<App />, document.getElementById('app'))
```

When you want the theme customized, use `createTheme`.

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { createTheme, ThemeProvider, Button } from 'smarthr-ui'

const theme = createTheme({
  // palette: {
  //   MAIN: '#000080',
  // }
})

const App: React.FC<{}> = () => (
  <ThemeProvider theme={theme}>
    <Button>Hello World</Button>
  </ThemeProvider>
)

ReactDOM.render(<App />, document.getElementById('app'))
```

## Contributing

We'd greatly appreciate any [contribution](https://github.com/kufu/smarthr-ui/blob/master/CONTRIBUTING.md) you make.

## Changelog

Please read the [changelog](https://github.com/kufu/smarthr-ui/releases).

## License

This project is licensed under the terms of the [MIT license](https://github.com/kufu/smarthr-ui/blob/master/LICENSE).
