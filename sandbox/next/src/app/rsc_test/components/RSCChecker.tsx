import React, { FC } from 'react'

type Props = {
  actualComponent: any
}

const CLIENT_COMPONENT_SYMBOL = Symbol.for('react.client.reference')

const isClientComponent = (actualComponent: any) =>
  actualComponent?.$$typeof === CLIENT_COMPONENT_SYMBOL

export const RSCChecker: FC<Props> = ({ actualComponent }) => {
  const message = isClientComponent(actualComponent)
    ? 'This is client component'
    : 'This is server component'
  return <p>{message}</p>
}
