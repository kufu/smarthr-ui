import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

interface Props {
  children: React.ReactNode
  expanded?: boolean
  disabled?: boolean
  onClick: () => void
}

const AccordionComponent: React.FC<Props> = ({ children, expanded = false, onClick }) => {
  const [trigger, content] = React.Children.toArray(children)
  return (
    <>
      {React.cloneElement(trigger as React.ReactElement<any>, {
        expanded,
        onClick,
      })}
      {React.cloneElement(content as React.ReactElement<any>, {
        expanded,
      })}
    </>
  )
}

export const Accordion = withTheme(AccordionComponent)
