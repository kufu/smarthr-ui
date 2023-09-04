import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base, BaseElementProps } from '../Base'
import { ResponseMessage } from '../ResponseMessage'

import { useClassNames } from './useClassNames'

type IconType = 'info' | 'success' | 'warning' | 'error'

type Props = {
  /** 表示する情報の種類 */
  type?: IconType
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** 表示する情報の内容 */
  children: ReactNode
}

export const CompactInformationPanel: FC<Props & BaseElementProps> = ({
  type = 'info',
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper {...props} className={`${className} ${classNames.wrapper}`} themes={theme}>
      <ResponseMessage type={type} iconGap={0.5}>
        {children}
      </ResponseMessage>
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({ themes: { spacingByChar, shadow } }) => css`
      display: flex;
      box-shadow: ${shadow.LAYER3};
      padding: ${spacingByChar(1)};
    `}
`
