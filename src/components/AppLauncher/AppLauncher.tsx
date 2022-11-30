import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import {
  Button,
  Cluster,
  Dropdown,
  DropdownContent,
  DropdownScrollArea,
  DropdownTrigger,
  FaToolboxIcon,
  Heading,
  Stack,
  TextLink,
} from '../../'

import { useClassNames } from './useClassNames'

type Category = {
  heading: string
  items: Array<{
    label: string
    url: string
    target?: string
  }>
}
type Props = {
  apps: {
    base: Category
    others: Category[]
  }
  urlToShowAll: string
}

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const AppLauncher: React.FC<Props & ElementProps> = ({
  apps: { base, others },
  urlToShowAll,
  ...props
}) => {
  const theme = useTheme()
  const className = useClassNames()

  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <AppsButton themes={theme} prefix={<FaToolboxIcon />}>
          アプリ
        </AppsButton>
      </DropdownTrigger>
      <DropdownContent controllable>
        <Wrapper themes={theme}>
          <DropdownScrollArea>
            <Stack gap={1.5}>
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
                {others.map(({ heading, items }, i) => (
                  <Stack gap={0.5} className={className.category} key={i} recursive>
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
            </Stack>
          </DropdownScrollArea>
          <Footer themes={theme}>
            <TextLink href={urlToShowAll} style={{ width: 'fit-content' }}>
              すべて見る
            </TextLink>
          </Footer>
        </Wrapper>
      </DropdownContent>
    </Dropdown>
  )
}

const AppsButton = styled(Button)<{ themes: Theme }>`
  ${({ themes: { color, space } }) => css`
    border-color: transparent;
    background-color: transparent;
    padding-inline: ${space(0.25)};
    color: ${color.TEXT_WHITE};
    font-weight: normal;

    &:hover,
    &:focus-visible {
      border-color: transparent;
      background-color: transparent;
    }
  `}
`
const Wrapper = styled(Stack).attrs({ as: 'nav', gap: 1.5 })<{ themes: Theme }>`
  ${({ themes: { space } }) => css`
    padding: ${space(1.5)};
  `}
`
const Footer = styled(Stack)<{ themes: Theme }>`
  ${({ themes: { border, space } }) => css`
    &&& {
      margin-block-end: ${space(-0.25)};
    }
    margin-inline: ${space(-0.75)};
    border-top: ${border.shorthand};
    padding-block-start: ${space(1)};
    padding-inline: ${space(0.75)};
  `}
`
