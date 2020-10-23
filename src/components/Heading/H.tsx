import React, { FC, HTMLAttributes, createContext, useContext } from 'react'

export const LevelContext = createContext(1)

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Props = HTMLAttributes<HTMLHeadingElement>

export const H: FC<Props> = ({ children, ...props }) => {
  const level = useContext(LevelContext)
  const Tag = `h${Math.min(level, 6)}` as HeadingTag
  return <Tag {...props}>{children}</Tag>
}
