import React from 'react'
import { tv } from 'tailwind-variants'

import { Heading, HeadingTagTypes } from '../Heading'
import { Stack } from '../Layout'
import { Text } from '../Text'

export type Props = {
  /** ダイアログタイトル */
  title: React.ReactNode
  /** ダイアログサブタイトル */
  subtitle?: React.ReactNode
  /**
   * ダイアログヘッダーの HTML タグ
   * @deprecated SectioningContent(Article, Aside, Nav, Section)でDialog全体をラップして、ダイアログタイトルのHeadingレベルを設定してください
   */
  titleTag?: HeadingTagTypes
  titleId: string
}

const dialogHeader = tv({
  base: [
    'smarthr-ui-Dialog-titleArea',
    'shr-border-b-shorthand shr-px-1.5 shr-py-1 shr-flex-[0_0_auto]',
  ],
})

export const DialogHeader: React.FC<Props> = ({ title, subtitle, titleTag, titleId }) => {
  const style = dialogHeader()
  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Heading tag={titleTag} className={style}>
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
}
