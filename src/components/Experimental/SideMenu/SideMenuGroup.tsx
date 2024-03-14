import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Stack } from '../../Layout'
import { Text } from '../../Text'

import { useClassNames } from './useClassNames'

type Props = PropsWithChildren<{
  /** 分類ラベル */
  name: ReactNode
  /** 分類ラベルの HTML タグ */
  nameTag?: ComponentProps<typeof Text>['as']
}>
type ElementProps = ComponentProps<typeof Stack>

export const SideMenuGroup: React.FC<Props & ElementProps> = ({
  name,
  nameTag = 'h3',
  children,
  className,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <GroupStack {...props} $themes={theme} className={`${className || ''} ${classNames.group}`}>
      <GroupNameText forwardedAs={nameTag} themes={theme}>
        {name}
      </GroupNameText>
      <SideMenuListStack>{children}</SideMenuListStack>
    </GroupStack>
  )
}

const GroupStack = styled(Stack).attrs({ forwardedAs: 'li', gap: 0.5 })<{ $themes: Theme }>`
  ${({ $themes: { border, space } }) => css`
    & + & {
      border-top: ${border.shorthand};
      padding-block-start: ${space(1.25)};
    }
  `}
`
const GroupNameText = styled(Text).attrs({
  color: 'TEXT_GREY',
  leading: 'TIGHT',
  size: 'S',
  weight: 'normal',
})``
const SideMenuListStack = styled(Stack).attrs({ forwardedAs: 'ul', gap: 0 })`
  list-style: none;
`
