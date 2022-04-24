import React, {
  ComponentProps,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  VFC,
  useEffect,
} from 'react'
import styled, { css } from 'styled-components'

import { TertiaryLink } from './TertiaryLink'
import { validateElement } from './bottomFixedAreaHelper'

import { Base as BaseComponent } from '../Base'
import {
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
} from '../Button'
import { Cluster, Stack } from '../Layout'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type Primary =
  | FunctionComponentElement<ComponentProps<typeof PrimaryButton>>
  | FunctionComponentElement<ComponentProps<typeof PrimaryButtonAnchor>>

export type Secondary =
  | FunctionComponentElement<ComponentProps<typeof SecondaryButton>>
  | FunctionComponentElement<ComponentProps<typeof SecondaryButtonAnchor>>

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

type Props = {
  /** この領域の説明 */
  description?: ReactNode
  /** 表示する `PrimaryButton` または `PrimaryButtonAnchor` */
  primaryButton?: Primary
  /** 表示する `SecondaryButton` または `SecondaryButtonAnchor` */
  secondaryButton?: Secondary
  /** 表示する tertialy link のプロパティの配列 */
  tertiaryLinks?: Array<React.ComponentProps<typeof TertiaryLink>>
  /** コンポーネントに適用する z-index 値 */
  zIndex?: number
  /** コンポーネントに適用するクラス名 */
  className?: string
}

export const BottomFixedArea: VFC<Props & ElementProps> = ({
  description,
  primaryButton,
  secondaryButton,
  tertiaryLinks,
  zIndex = 500,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  useEffect(() => {
    validateElement(primaryButton, secondaryButton)
  }, [primaryButton, secondaryButton])

  return (
    <Base
      themes={theme}
      zIndex={zIndex}
      className={`${className} ${classNames.wrapper}`}
      {...props}
    >
      <Stack>
        {description && <Text className={classNames.description}>{description}</Text>}
        {(secondaryButton || primaryButton) && (
          <ListCluster justify="center" gap={{ row: 0.5, column: 1 }}>
            {secondaryButton && <li className={classNames.secondaryButton}>{secondaryButton}</li>}
            {primaryButton && <li className={classNames.primaryButton}>{primaryButton}</li>}
          </ListCluster>
        )}
        {tertiaryLinks && tertiaryLinks.length > 0 && (
          <ListCluster justify="center" gap={{ row: 0.5, column: 1 }}>
            {tertiaryLinks.map((tertiaryLink, index) => (
              <li key={index} className={classNames.tertiaryListItem}>
                <TertiaryLink {...tertiaryLink} />
              </li>
            ))}
          </ListCluster>
        )}
      </Stack>
    </Base>
  )
}

const Base = styled(BaseComponent)<{ themes: Theme; zIndex: number }>`
  ${({ themes: { spacingByChar }, zIndex }) => {
    return css`
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: ${spacingByChar(1.5)};
      text-align: center;
      z-index: ${zIndex};
      box-shadow: 0 -4px 8px 2px rgba(0, 0, 0, 0.24);
      border-radius: 0;
      box-sizing: border-box;
    `
  }}
`
const Text = styled.div`
  margin: 0;
`
const ListCluster = styled(Cluster).attrs({
  as: 'ul',
})`
  list-style: none;
  margin: 0;
  padding: 0;
`
