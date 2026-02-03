import { type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Heading, type HeadingTagTypes } from '../Heading'
import { Stack } from '../Layout'
import { Text } from '../Text'

export type Props = {
  /** ダイアログタイトル */
  title: ReactNode
  /** ダイアログサブタイトル */
  subtitle?: ReactNode
  /**
   * ダイアログヘッダーの HTML タグ
   * 可能な限り利用せず、SectioningContent(Article, Aside, Nav, Section)を使ってDialog全体を囲むことで、Dialogのheadingのレベルを調整する方法を検討してください
   */
  unrecommendedTitleTag?: HeadingTagTypes
  titleId: string
}

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Dialog-titleArea',
    'shr-border-b-shorthand shr-flex-[0_0_auto] shr-px-1.5 shr-py-1',
  ],
})

export const DialogHeader = memo<Props>(({ title, subtitle, unrecommendedTitleTag, titleId }) => {
  const className = useMemo(() => classNameGenerator(), [])

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Heading unrecommendedTag={unrecommendedTitleTag} className={className}>
      <Stack gap={0.25} as="span">
        {subtitle && (
          <Text size="S" leading="TIGHT" color="TEXT_GREY" className="smarthr-ui-Dialog-subtitle">
            {subtitle}
          </Text>
        )}
        <Text id={titleId} size="L" leading="TIGHT" className="smarthr-ui-Dialog-title">
          {title}
        </Text>
      </Stack>
    </Heading>
  )
})
