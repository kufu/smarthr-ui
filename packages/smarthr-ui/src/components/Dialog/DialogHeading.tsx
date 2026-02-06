import { type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

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

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Dialog-titleArea',
    'shr-border-b-shorthand shr-flex-[0_0_auto] shr-px-1.5 shr-py-1',
  ],
})

export const DialogHeading = memo<Props>(({ text, sub, id }) => {
  const className = useMemo(() => classNameGenerator(), [])

  return (
    <Heading className={className}>
      <Stack gap={0.25} as="span">
        {sub && (
          <Text
            size="S"
            leading="TIGHT"
            color="TEXT_GREY"
            className="smarthr-ui-Dialog-heading-sub"
          >
            {sub}
          </Text>
        )}
        <Text id={id} size="L" leading="TIGHT" className="smarthr-ui-Dialog-heading">
          {text}
        </Text>
      </Stack>
    </Heading>
  )
})
