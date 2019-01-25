import * as React from 'react'

interface Props {
  onClick?: () => void
}

export const ModalTrigger: React.FC<Props> = ({ children, onClick }) => (
  <button className="ModalTrigger" onClick={onClick}>
    {children}
  </button>
)

ModalTrigger.displayName = 'ModalTrigger'
