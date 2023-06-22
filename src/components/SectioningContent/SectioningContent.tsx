import React, { FC, ReactNode, useContext } from 'react'
import styled from 'styled-components'

import { LevelContext } from './levelContext'

const SectioningContent: FC<{
  children: ReactNode
  className?: string
  as?: 'article' | 'aside' | 'nav' | 'section'
}> = ({ children, ...props }) => (
  <Wrapper {...props}>
    <SectioningFragment>{children}</SectioningFragment>
  </Wrapper>
)

const Wrapper = styled.div`
  padding: 0;
  margin: 0;
`

type Props = Omit<React.ComponentProps<typeof SectioningContent>, 'as'>

export const Article: FC<Props> = (props) => <SectioningContent {...props} as="article" />
export const Aside: FC<Props> = (props) => <SectioningContent {...props} as="aside" />
export const Nav: FC<Props> = (props) => <SectioningContent {...props} as="nav" />
export const Section: FC<Props> = (props) => <SectioningContent {...props} as="section" />

export const SectioningFragment: FC<{ children: ReactNode; baseLevel?: number | null }> = ({
  children,
  baseLevel,
}) => {
  const level = useContext(LevelContext)

  return <LevelContext.Provider value={baseLevel || level + 1}>{children}</LevelContext.Provider>
}
