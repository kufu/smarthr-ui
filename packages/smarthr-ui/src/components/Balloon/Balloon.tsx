import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'

const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
}
const POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  RIGHT: 'right',
  CENTER: 'center',
  LEFT: 'left',
}

interface Props extends React.Props<{}> {
  theme: 'light' | 'dark'
  horizontal: 'right' | 'center' | 'left'
  vertical: 'top' | 'bottom'
  style?: {}
}

const Balloon: React.SFC<Props> = ({ theme, horizontal, vertical, style = {}, children }) => (
  <Wrapper className={`${theme} ${horizontal} ${vertical}`} style={style}>
    {children}
  </Wrapper>
)

Balloon.propTypes = extendDefaultPropTypes<Props>({
  theme: PropTypes.oneOf([THEME.LIGHT, THEME.DARK]).isRequired,
  horizontal: PropTypes.oneOf([POSITION.RIGHT, POSITION.CENTER, POSITION.LEFT]).isRequired,
  vertical: PropTypes.oneOf([POSITION.TOP, POSITION.BOTTOM]).isRequired,
})

export default Balloon

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px;
  white-space: nowrap;

  &::before,
  &::after {
    display: block;
    position: absolute;
    border-style: solid;
    content: '';
  }

  &.light {
    border: 1px solid #dfdfdf;
    background-color: #fff;
    color: #222;
  }

  &.dark {
    background-color: #222;
    color: #fff;
  }

  &.light.top {
    &::before {
      border-color: transparent transparent #dfdfdf;
    }
    &::after {
      border-color: transparent transparent #fff;
    }
  }
  &.light.bottom {
    &::before {
      border-color: #dfdfdf transparent transparent;
    }
    &::after {
      border-color: #fff transparent transparent;
    }
  }
  &.dark.top {
    &::before,
    &::after {
      border-color: transparent transparent #222;
    }
  }
  &.dark.bottom {
    &::before,
    &::after {
      border-color: #222 transparent transparent;
    }
  }

  &.top {
    &::before,
    &::after {
      border-width: 0 8px 8px;
    }
    &::before {
      top: -8px;
    }
    &::after {
      top: -7px;
    }
  }

  &.bottom {
    &::before,
    &::after {
      border-width: 8px 8px 0;
    }
    &::before {
      bottom: -8px;
    }
    &::after {
      bottom: -7px;
    }
  }

  &.right {
    &::before,
    &::after {
      right: 24px;
    }
  }

  &.center {
    &::before,
    &::after {
      left: 50%;
      transform: translateX(-8px);
    }
  }

  &.left {
    &::before,
    &::after {
      left: 24px;
    }
  }
`
