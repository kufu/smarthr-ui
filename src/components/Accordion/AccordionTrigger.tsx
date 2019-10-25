import React, { useContext } from 'react'
import { withTheme } from '../../hocs/withTheme'
import { AccordionContext } from './Accordion'

type Props = {
  children: React.ReactElement | string
  disabled?: boolean
  className?: string
}

const AccordionTriggerComponent: React.SFC<Props> = ({
  children,
  disabled = false,
  className = '',
}) => {
  const { expanded, name, onClick } = useContext(AccordionContext)

  const handleClick = () => {
    return onClick(name, !expanded)
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
