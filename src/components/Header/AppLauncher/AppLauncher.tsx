import React, { HTMLAttributes, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '../../Dropdown'
import { Heading } from '../../Heading'
import { FaToolboxIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { TextLink } from '../../TextLink'

import { useClassNames } from './useClassNames'

import type { DecoratorsType } from '../../../types'

type Category = {
  type?: string
  heading: ReactNode
  items: Array<{
    label: ReactNode
    url: string
    target?: string
  }>
}
type Props = {
  apps: Category[]
  urlToShowAll?: string | null
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'triggerLabel'>
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

const TRIGGER_LABEL = 'アプリ'

export const AppLauncher: React.FC<Props & ElementProps> = ({
  apps,
  urlToShowAll,
  decorators,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  const triggerLabel = useMemo(
    () => decorators?.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL,
    [decorators],
  )

  const baseApps = apps.find(({ type }) => type === 'base')
  const others = apps.filter((category) => category !== baseApps)

  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <AppsButton themes={theme} prefix={<FaToolboxIcon />}>
          {triggerLabel}
        </AppsButton>
      </DropdownTrigger>
      <DropdownContent controllable>
        <Wrapper themes={theme} className={classNames.wrapper}>
          <DropdownScrollArea>
            <Stack gap={1.5}>
              {baseApps && (
                <Section>
                  <Stack gap={0.5} className={classNames.category}>
                    <Heading type="subSubBlockTitle">{baseApps.heading}</Heading>
                    <Cluster as="ul" gap={1}>
                      {baseApps.items.map((item, index) => (
                        <li key={index}>
                          <TextLink
                            href={item.url}
                            target={item.target}
                            className={classNames.link}
                          >
                            {item.label}
                          </TextLink>
                        </li>
                      ))}
                    </Cluster>
                  </Stack>
                </Section>
              )}
              <Cluster gap={1.5}>
                {others.map(({ heading, items }, i) => (
                  <Section key={i}>
                    <Stack gap={0.5} className={classNames.category}>
                      <Heading type="subSubBlockTitle">{heading}</Heading>
                      <Stack gap={0.5} as="ul">
                        {items.map((item, index) => (
                          <li key={index}>
                            <TextLink
                              href={item.url}
                              target={item.target}
                              className={classNames.link}
                            >
                              {item.label}
                            </TextLink>
                          </li>
                        ))}
                      </Stack>
                    </Stack>
                  </Section>
                ))}
              </Cluster>
            </Stack>
          </DropdownScrollArea>

          {urlToShowAll && (
            <Footer themes={theme} className={classNames.footer}>
              <TextLink href={urlToShowAll} style={{ width: 'fit-content' }}>
                すべて見る
              </TextLink>
            </Footer>
          )}
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
const Wrapper = styled(Stack).attrs({ forwardedAs: 'nav', gap: 1.5 })<{ themes: Theme }>`
  ${({ themes: { space, leading } }) => css`
    padding: ${space(1.5)};
    line-height: ${leading.NORMAL};
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
