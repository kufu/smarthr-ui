import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

export interface Rect {
  right: number
  left: number
}
interface Props extends React.Props<{}> {
  clientRect?: Rect
  active?: boolean
}

const POSITION_LEFT = 'left'
const POSITION_RIGHT = 'right'

const getPositionClassName = (clientRect?: Rect): string => {
  if (!clientRect) return ''
  if (clientRect.right < innerWidth / 2) return POSITION_LEFT
  if (clientRect.left > innerWidth / 2) return POSITION_RIGHT
  return ''
}

const DropdownContent: React.SFC<Props> = ({ active, clientRect, children }) => (
  <Wrapper
    className={`DropdownContent ${active ? 'active' : ''} ${getPositionClassName(clientRect)}`}
  >
    {children}
  </Wrapper>
)

DropdownContent.displayName = 'DropdownContent'
DropdownContent.propTypes = {
  clientRect: PropTypes.shape({
    right: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  active: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default DropdownContent

const Wrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  transform: scale(0);

  z-index: 1000;
  position: absolute;
  top: calc(100% + 10px);
  width: auto;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px;
  border: 1px solid #dfdfdf;
  border-radius: 3px;
  background-color: #fff;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
    visibility 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);

  &.active {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
  }

  &::before,
  &::after {
    display: block;
    position: absolute;
    border-style: solid;
    border-width: 0 8px 8px;
    content: '';
  }

  &::before {
    top: -9px;
    border-color: transparent transparent #dfdfdf;
  }

  &::after {
    top: -8px;
    border-color: transparent transparent #fff;
  }

  &.${POSITION_LEFT} {
    left: 0;

    &::before,
    &::after {
      left: 24px;
    }
  }

  &.${POSITION_RIGHT} {
    right: 0;

    &::before,
    &::after {
      right: 24px;
    }
  }
`
