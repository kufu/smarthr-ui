import React, { FC, PropsWithChildren, useContext } from 'react'
import styled from 'styled-components'

import { LevelContext } from './levelContext'

const SectioningContent: FC<
  PropsWithChildren<{
    className?: string
    // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
    as?: 'article' | 'aside' | 'nav' | 'section'
    baseLevel?: number
  }>
> = ({ children, baseLevel, ...props }) => (
  <Wrapper {...props}>
    <SectioningFragment baseLevel={baseLevel}>{children}</SectioningFragment>
  </Wrapper>
)

const Wrapper = styled.section``

type Props = Omit<React.ComponentProps<typeof SectioningContent>, 'as'>

export const Section: FC<Props> = SectioningContent
export const Article: FC<Props> = (props) => <SectioningContent {...props} as="article" />
export const Aside: FC<Props> = (props) => <SectioningContent {...props} as="aside" />
export const Nav: FC<Props> = (props) => <SectioningContent {...props} as="nav" />

export const SectioningFragment: FC<PropsWithChildren<{ baseLevel?: number }>> = ({
  children,
  baseLevel,
}) => {
  const level = useContext(LevelContext)

  return <LevelContext.Provider value={baseLevel || level + 1}>{children}</LevelContext.Provider>
}
