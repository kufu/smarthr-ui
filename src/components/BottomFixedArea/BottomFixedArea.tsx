import React, {
  ComponentProps,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  VFC,
  useEffect,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base as BaseComponent } from '../Base'
import { AnchorButton, Button } from '../Button'
import { Cluster, Stack } from '../Layout'

import { TertiaryLink } from './TertiaryLink'
import { validateElement } from './bottomFixedAreaHelper'
import { useClassNames } from './useClassNames'

export type Primary =
  | FunctionComponentElement<ComponentProps<typeof Button>>
  | FunctionComponentElement<ComponentProps<typeof AnchorButton>>

export type Secondary =
  | FunctionComponentElement<ComponentProps<typeof Button>>
  | FunctionComponentElement<ComponentProps<typeof AnchorButton>>

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

type Props = {
  /** この領域の説明 */
  description?: ReactNode
  /** 表示する `Button` または `AnchorButton` （`variant="primary"` である必要がある） */
  primaryButton?: Primary
  /** 表示する `Button` または `AnchorButton` （`variant="secondary"` である必要がある）*/
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
      {...props}
      themes={theme}
      zIndex={zIndex}
      className={`${className} ${classNames.wrapper}`}
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
                {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
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
  ${({ themes: { spacingByChar }, zIndex }) => css`
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: ${spacingByChar(1.5)};
    text-align: center;
    z-index: ${zIndex};
    box-shadow: 0 -4px 8px 2px rgba(0, 0, 0, 0.24);
    border-radius: 0;
    box-sizing: border-box;
  `}
`
const Text = styled.div`
  margin: 0;
`
const ListCluster = styled(Cluster).attrs({
  forwardedAs: 'ul',
})`
  list-style: none;
  margin: 0;
  padding: 0;
`
