import React, { ComponentProps, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { RadioButton } from '../RadioButton'

import { useClassNames } from './useClassNames'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | React.ComponentType<any>
}

const MEANLESS_TAG_NAMES = ['div', 'span']

export const RadioButtonPanel: React.FC<Props> = ({ onClick, as, className, ...props }) => {
  const theme = useTheme()
  const classNames = useClassNames(className)

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const handleOuterClick = () => {
    innerRef.current?.click()
  }

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <WrapperBase
      role={MEANLESS_TAG_NAMES.includes(`${as || ''}`) ? 'presentation' : undefined}
      onClick={handleOuterClick}
      forwardedAs={as}
      themes={theme}
      className={classNames.wrapper}
    >
      {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
      <RadioButton {...props} ref={innerRef} />
    </WrapperBase>
  )
}

const WrapperBase = styled(Base).attrs({ padding: 1 })<{ themes: Theme }>`
  ${({ themes: { border, shadow, space } }) => css`
    box-shadow: none;
    border: ${border.shorthand};

    :not(:has([disabled])) {
      cursor: pointer;
    }

    /* :focus-visible-within の代替 */
    :has(:focus-visible) {
      ${shadow.focusIndicatorStyles}
    }

    .smarthr-ui-RadioButton-radioButton:focus + span {
      box-shadow: revert;
    }

    .smarthr-ui-RadioButton-label {
      /* 視覚的な調整 */
      margin-inline-start: ${space(0.75)};
    }
  `}
`
