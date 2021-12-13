import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { hoverable } from '../../hocs/hoverable'

type Tag = 'button' | 'a'

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

export const buttonFactory = <Props extends BaseProps>(tag: Tag) => {
  const BaseTag = hoverable()(tagStore[tag])

  const Button: VFC<Props> = ({
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
      <BaseTag className={classNames} themes={theme} {...props}>
        {prefix}
        <TextLabel>{children}</TextLabel>
        {suffix}
      </BaseTag>
    )
  }
  return Button
}

const Base: any = styled.div<{ themes: Theme; wide: boolean }>`
  ${({ themes, wide }) => {
    const { border, fontSize, leading, radius, shadow, spacingByChar } = themes

    return css`
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: ${spacingByChar(0.5)};
      text-align: center;
      white-space: nowrap;
      border-radius: ${radius.m};

      /* ボタンの高さを合わせるために指定 */
      border: ${border.lineWidth} ${border.lineStyle} transparent;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      font-family: inherit;
      font-size: ${fontSize.M};
      font-weight: bold;
      line-height: ${leading.NONE};
      ${wide && 'width: 100%;'}

      &.square {
        padding: ${spacingByChar(0.75)};
      }

      &.s {
        padding: ${spacingByChar(0.5)};
        font-size: ${fontSize.S};

        /* ボタンラベルの line-height を 0 にしたため、高さを担保する */
        min-height: calc(${fontSize.S} + ${spacingByChar(1)} + (${border.lineWidth} * 2));
      }

      &[disabled] {
        cursor: not-allowed;

        /* alpha color を使用しているので、背景色と干渉させない */
        background-clip: padding-box;
      }

      &:focus {
        ${shadow.focusIndicatorStyles}
      }

      /* baseline より下の leading などの余白を埋める */
      .smarthr-ui-Icon,
      svg {
        display: block;
      }
    `
  }}
`
const TextLabel = styled.span`
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`

const tagStore = {
  button: Base.withComponent('button'),
  a: Base.withComponent('a'),
}

export const BaseButton: VFC<ButtonProps> = buttonFactory<ButtonProps>('button')

const AnchorButton: VFC<AnchorProps> = buttonFactory<AnchorProps>('a')
export const BaseButtonAnchor = styled(AnchorButton)`
  text-decoration: none;

  &:not([href]) {
    cursor: not-allowed;

    /* alpha color を使用しているので、背景色と干渉させない */
    background-clip: padding-box;
  }
`
