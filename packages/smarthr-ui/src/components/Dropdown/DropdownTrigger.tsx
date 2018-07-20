import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

interface Props extends React.Props<{}> {
  dropdownKey?: string
  active?: boolean
  onClick?: () => {}
}

const DropdownTrigger: React.SFC<Props> = ({ children, dropdownKey, active, onClick }) => (
  <Trigger className="DropdownTrigger" href="" role="button" onClick={onClick}>
    {React.Children.map(children, (child: any) => {
      const props = child.props ? child.props : {}
      const { className } = props

      switch (typeof child) {
        case 'string':
          return child

        case 'object':
          return React.cloneElement(child, {
            className: `${dropdownKey} ${className ? className : ''} ${active ? 'active' : ''}`,
          })

        default:
          return null
      }
    })}
  </Trigger>
)

DropdownTrigger.displayName = 'DropdownTrigger'
DropdownTrigger.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default DropdownTrigger

const Trigger = styled.a`
  display: block;
  text-decoration: none !important;
`
