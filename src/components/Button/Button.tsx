import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { BaseProps, Variant } from './types'
import { useClassNames } from './useClassNames'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'
import { Loader as shrLoader } from '../Loader'
import { Cluster } from '../Layout'
import { Tooltip } from '../Tooltip'
import { FaInfoCircleIcon } from '../Icon'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps>(
  (
    {
      type = 'button',
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      disabledDetail,
      className = '',
      children,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme()
    const classNames = useClassNames().button

    const loader = <Loader size="s" type="light" variant={variant} themes={theme} />
    const actualPrefix = !loading && prefix
    const actualSuffix = loading && !square ? loader : suffix
    const disabledOnLoading = loading || disabled
    const actualChildren = loading && square ? loader : children

    const button = (
      <ButtonWrapper
        {...props}
        type={type}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={`${className} ${classNames.wrapper}`}
        buttonRef={ref}
        disabled={disabledOnLoading}
        $loading={loading}
      >
        <ButtonInner prefix={actualPrefix} suffix={actualSuffix}>
          {actualChildren}
        </ButtonInner>
      </ButtonWrapper>
    )

    if (disabled && disabledDetail) {
      const DisabledDetailIcon = disabledDetail.icon || FaInfoCircleIcon

      return (
        <DisabledDetailWrapper themes={theme} className={classNames.disabledWrapper}>
          {button}
          <Tooltip message={disabledDetail.message} triggerType="icon">
            <DisabledDetailIcon />
          </Tooltip>
        </DisabledDetailWrapper>
      )
    }

    return button
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'

const Loader = styled(shrLoader)<{ variant: Variant; themes: Theme }>`
  ${({ variant, themes: { color } }) => css`
    vertical-align: bottom;

    &&& {
      .s {
        width: 1em;
        height: 1em;
      }
    }

    .light {
      border-color: ${variant === 'secondary'
        ? color.TEXT_DISABLED
        : color.disableColor(color.TEXT_WHITE)};
    }
  `}
`

const DisabledDetailWrapper = styled(Cluster).attrs({
  inline: true,
  align: 'center',
})<{ themes: Theme }>`
  ${({ themes: { color, space } }) => css`
    > .smarthr-ui-Tooltip {
      overflow-y: unset;

      .smarthr-ui-Icon {
        /* Tooltip との距離を変えずに反応範囲を広げるために negative space を使う */
        margin: ${space(-0.25)};
        padding: ${space(0.25)};
        color: ${color.TEXT_GREY};
      }
    }
  `}
`
