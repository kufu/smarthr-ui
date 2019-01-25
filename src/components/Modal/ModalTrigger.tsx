import * as React from 'react'

interface Props {
  onClick?: () => void
}

export const ModalTrigger: React.FC<Props> = ({ children, onClick }) => (
  <div className="ModalTrigger" onClick={onClick}>
    {children}
  </div>
)

ModalTrigger.displayName = 'ModalTrigger'
