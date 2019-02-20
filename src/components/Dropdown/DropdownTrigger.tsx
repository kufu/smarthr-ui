import * as React from 'react'
import { DropdownConsumer } from './Dropdown'

export const DropdownTrigger: React.FC<{}> = ({ children }) => (
  <DropdownConsumer>
    {({ keyName, toggleDropdown, active }) => (
      <div
        /* tslint:disable:jsx-no-lambda */
        onClick={e => toggleDropdown(e.currentTarget.getBoundingClientRect())}
        className={keyName}
      >
        {React.Children.map(children, (child: any) => {
          const props = child.props ? child.props : {}
          const { className = '' } = props

          switch (typeof child) {
            case 'string':
              return child

            case 'object':
              return React.cloneElement(child, {
                className: `${active ? 'active' : ''} ${className}`,
              })

            default:
              return null
          }
        })}
      </div>
    )}
  </DropdownConsumer>
)
