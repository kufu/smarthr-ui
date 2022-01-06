import React, {
  ComponentProps,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  VFC,
} from 'react'
import styled, { css } from 'styled-components'

import { DialogBase as BaseComponent } from '../Base'
import { FaExclamationCircleIcon, FaExclamationTriangleIcon } from '../Icon'
import { Text } from '../Text'
import { Cluster, LineUp } from '../Layout'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type StyleProps = {
  /** コンポーネントの上端から、包含ブロックの上端までの距離 */
  top?: number
  /** コンポーネントの下端から、包含ブロックの下端までの距離 */
  bottom?: number
  /** コンポーネントの `z-index` 値 */
  zIndex?: number
}
type ErrorIcons =
  | FunctionComponentElement<ComponentProps<typeof FaExclamationTriangleIcon>>
  | FunctionComponentElement<ComponentProps<typeof FaExclamationCircleIcon>>
type Props = StyleProps & {
  /** 表示する `PrimaryButton` または `PrimaryButtonAnchor` コンポーネント */
  primaryButton: ReactNode
  /** 表示する `SecondaryButton` または `SecondaryButtonAnchor` コンポーネント */
  secondaryButton?: ReactNode
  /** tertiary 領域に表示するボタン */
  tertiaryButton?: ReactNode
  /** エラーメッセージ */
  errorText?: string
  /**
   * エラーメッセージのアイコン（`FaExclamationCircleIcon` または `FaExclamationTriangleIcon` を指定）
   */
  errorIcon?: ErrorIcons
  /** コンポーネントの幅 */
  width?: string
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const exist = (value: any) => {
  return value !== undefined && value !== null
}

export const FloatArea: VFC<Props & ElementProps> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  errorText,
  errorIcon,
  className = '',
  width = '80%',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Base themes={theme} className={`${className} ${classNames.wrapper}`} $width={width} {...props}>
      <Cluster gap={1}>
        {tertiaryButton && tertiaryButton}
        <RightSide>
          <Cluster gap={1}>
            {errorText && (
              <ErrorMessage gap={0.25} vAlign="center" as="p" className={classNames.errorText}>
                {errorIcon && <ErrorIcon themes={theme}>{errorIcon}</ErrorIcon>}
                <Text size="S">{errorText}</Text>
              </ErrorMessage>
            )}
            <Cluster gap={1}>
              {secondaryButton && secondaryButton}
              {primaryButton && primaryButton}
            </Cluster>
          </Cluster>
        </RightSide>
      </Cluster>
    </Base>
  )
}

const Base = styled(BaseComponent)<StyleProps & { themes: Theme; $width: string }>`
  ${({ themes: { spacingByChar }, top, bottom, $width, zIndex = 500 }) =>
    css`
      position: fixed;
      ${exist(top) && `top: ${top}px;`}
      ${exist(bottom) && `bottom: ${bottom}px;`}
      z-index: ${zIndex};
      width: ${$width};
      padding: ${spacingByChar(1)};
    `}
`
const RightSide = styled.div`
  margin-left: auto;
`
const ErrorMessage = styled(LineUp)`
  margin-top: 0;
  margin-bottom: 0;
`
const ErrorIcon = styled.span<{ themes: Theme }>`
  flex-shrink: 0;

  > svg {
    display: block; /* 隙間対策 */
  }
`
