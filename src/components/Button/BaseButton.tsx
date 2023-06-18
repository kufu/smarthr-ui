import React, { FC } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

export type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>
export type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

export type BaseProps = {
  /**
   * ボタンの大きさ
   * @default 'default'
   */
  size?: 'default' | 's'
  /**
   * ボタン内に表示する内容
   */
  children?: React.ReactNode
  /**
   * コンポーネントに適用するクラス名
   */
  className?: string
  /**
   * ボタン内の先頭に表示する内容。
   * 通常は、アイコンを表示するために用いる。
   */
  prefix?: React.ReactNode
  /**
   * ボタン内の末尾に表示する内容。
   * 通常は、アイコンを表示するために用いる。
   */
  suffix?: React.ReactNode
  /**
   * `true` のとき、ボタンを正方形にする。
   * @default false
   */
  square?: boolean
  /**
   * `true` のとき、ボタンの `width` を 100% にする。
   */
  wide?: boolean
}

const Button: FC<BaseProps> = ({
  size = 'default',
  className = '',
  square = false,
  children = '',
  prefix = '',
  suffix = '',
  ...props
}) => {
  const theme = useTheme()

  // prettier-ignore
  const classNames = `${size} ${className} ${square ? 'square' : ''} ${prefix ? 'prefix' : ''} ${suffix ? 'suffix' : ''}`

  return (
    <StyledButton {...props} className={classNames} themes={theme}>
      {prefix}
      <TextLabel>{children}</TextLabel>
      {suffix}
    </StyledButton>
  )
}

const StyledButton = styled.button<{ themes: Theme }>``

const TextLabel = styled.span`
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`

/** @deprecated PrimaryButton など、旧コンポーネントで使ってるだけなので削除予定 */
export const BaseButton: FC<ButtonProps> = Button

const ButtonAnchor: FC<AnchorProps> = Button
export const BaseButtonAnchor = styled(ButtonAnchor).attrs({ as: 'a' })`
  text-decoration: none;

  &:not([href]) {
    cursor: not-allowed;

    /* alpha color を使用しているので、背景色と干渉させない */
    background-clip: padding-box;
  }
`
