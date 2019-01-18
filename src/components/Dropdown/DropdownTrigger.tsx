import * as React from 'react'

interface Props {
  dropdownKey?: string
  active?: boolean
  onClick?: () => void
}

export const DropdownTrigger: React.FC<Props> = ({ children, dropdownKey, active, onClick }) => (
  <button className="DropdownTrigger" onClick={onClick}>
    {React.Children.map(children, (child: any) => {
      const props = child.props ? child.props : {}
      const { className = '' } = props

      switch (typeof child) {
        case 'string':
          return child

        case 'object':
          return React.cloneElement(child, {
            className: `${dropdownKey} ${active ? 'active' : ''} ${className}}`,
          })

        default:
          return null
      }
    })}
  </button>
)

DropdownTrigger.displayName = 'DropdownTrigger'
