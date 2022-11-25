import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Cluster, Stack } from '../Layout'
import { Theme, useTheme } from '../../hooks/useTheme'
import { TextLink } from '../TextLink'
import { Heading } from '../Heading'
import { useClassNames } from './useClassNames'

type Props = {
  apps: {
    [key in 'base' | 'roumu' | 'jinmane' | 'renkei' | 'plus']: {
      heading: string
      items: Array<{
        label: string
        url: string
        target?: string
      }>
    }
  }
  urlToShowAll: string
}

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const AppLauncher: React.FC<Props & ElementProps> = ({ apps, urlToShowAll, ...props }) => {
  const className = useClassNames()
  const themes = useTheme()

  const { base, ...otherApps } = apps

  return (
    <Wrapper {...props} themes={themes} className={className.wrapper}>
      <Stack gap={0.5} className={className.category}>
        <Heading type="subSubBlockTitle" tag="h3">
          {base.heading}
        </Heading>
        <Cluster as="ul" gap={1}>
          {base.items.map((item, index) => (
            <li key={index}>
              <TextLink href={item.url} target={item.target} className={className.link}>
                {item.label}
              </TextLink>
            </li>
          ))}
        </Cluster>
      </Stack>
      <Cluster gap={1.5}>
        {Object.entries(otherApps).map(([key, { heading, items }]) => (
          <Stack gap={0.5} className={className.category} key={key} recursive>
            <Heading type="subSubBlockTitle" tag="h3">
              {heading}
            </Heading>
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <TextLink href={item.url} target={item.target} className={className.link}>
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </Stack>
        ))}
      </Cluster>

      <Footer themes={themes}>
        <TextLink href={urlToShowAll} style={{ width: 'fit-content' }}>
          {urlToShowAll}
        </TextLink>
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled(Stack).attrs({ as: 'nav', gap: 1.5 })<{ themes: Theme }>`
  ${({ themes: { space } }) => css`
    /* DropdownButton-panel の持つ padding 分を打ち消し */
    margin-block: ${space(-0.5)};
    padding: ${space(1)};
  `}
`

const Footer = styled(Stack)<{ themes: Theme }>`
  ${({ themes: { border, space } }) => css`
    border-top: ${border.shorthand};
    padding-block-start: ${space(0.75)};
  `}
`
