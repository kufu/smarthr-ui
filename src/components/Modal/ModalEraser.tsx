import * as React from 'react'

export const ModalEraser: React.FC<{}> = ({ children }) => (
  <button className="ModalEraser">{children}</button>
)

ModalEraser.displayName = 'ModalEraser'
