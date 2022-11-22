import React, { HTMLAttributes } from 'react'
import { Text } from '../Text'
import { Stack } from '../Layout'

type Props = {
  apps: {
    [key: string]: Array<{
      label: string
      url: string
      target?: string
    }>
  }
  urlToShowAll: string
}

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const AppLauncher: React.FC<Props & ElementProps> = ({ apps, urlToShowAll }) => {
  return (
    <Stack>
      {apps.base && <Text>yes</Text>}
      <Text>{urlToShowAll}</Text>
    </Stack>
  )
}
