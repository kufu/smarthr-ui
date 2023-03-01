import React from 'react'

export const includeDisabledTrigger = (trigger: React.ReactNode) =>
  React.Children.map(trigger, (t) => React.isValidElement(t) && t.props.disabled)?.some(
    (bool: boolean) => bool,
  )
