import { type ReactNode, memo } from 'react'

import { Heading } from '../Heading'
import { Stack } from '../Layout'
import { Text } from '../Text'

export type Props = {
  /** ダイアログタイトル */
  text: ReactNode
  /** ダイアログサブタイトル */
  sub?: ReactNode
  id?: string
}

export const DialogHeading = memo<Props>(({ text, sub, id }) => (
  <Heading className="smarthr-ui-Dialog-headingWrapper">
    <Stack gap={0.25} as="span">
      {sub && (
        <Text size="S" leading="TIGHT" color="TEXT_GREY" className="smarthr-ui-Dialog-heading-sub">
          {sub}
        </Text>
      )}
      <Text id={id} size="L" leading="TIGHT" className="smarthr-ui-Dialog-heading">
        {text}
      </Text>
    </Stack>
  </Heading>
))
