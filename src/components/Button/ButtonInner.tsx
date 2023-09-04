import React, { VFC } from 'react'
import styled from 'styled-components'

export type Props = {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  children?: React.ReactNode
}

export const ButtonInner: VFC<Props> = ({ prefix, suffix, children }) => (
    <>
      {prefix}
      <TextLabel>{children}</TextLabel>
      {suffix}
    </>
  )

const TextLabel = styled.span`
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`
