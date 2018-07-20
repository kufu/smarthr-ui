import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import Balloon from '../Balloon/'

export interface Rect {
  right: number
  left: number
}
interface Props extends React.Props<{}> {
  clientRect?: Rect
  active?: boolean
}

const getPositionClassName = (clientRect?: Rect): 'center' | 'left' | 'right' => {
  if (!clientRect) return 'center'
  if (clientRect.right < innerWidth / 2) return 'left'
  if (clientRect.left > innerWidth / 2) return 'right'
  return 'center'
}

const DropdownContent: React.SFC<Props> = ({ active, clientRect, children }) => (
  <Wrapper
    className={`DropdownContent ${active ? 'active' : ''} ${getPositionClassName(clientRect)}`}
  >
    <Balloon theme="light" vertical="top" horizontal={getPositionClassName(clientRect)}>
      {children}
    </Balloon>
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
  transition: visibility 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.active {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
  }
`
