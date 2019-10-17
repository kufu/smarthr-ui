import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

interface Props {
  children: React.ReactElement | string
  accordionKey: string
  expanded?: boolean
  disabled?: boolean
  className?: string
  onClick?: (accordionKey: string) => void
}

const AccordionTriggerComponent: React.SFC<Props> = ({
  children,
  accordionKey,
  expanded = false,
  disabled = false,
  className = '',
  onClick,
}) => {
  const handleClick = () => {
    onClick && onClick(accordionKey)
  }
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${className} ${expanded ? 'expanded' : ''}`}
    >
      {React.Children.map(children, (child: any) => {
        switch (typeof child) {
          case 'string':
            return child

          case 'object':
            return React.cloneElement(child, {
              className: `${expanded ? 'expanded' : ''}`,
            })

          default:
            return null
        }
      })}
    </button>
  )
}

AccordionTriggerComponent.displayName = 'AccordionTriggerComponent'

export const AccordionTrigger = withTheme(AccordionTriggerComponent)
