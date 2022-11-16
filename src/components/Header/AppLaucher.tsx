import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Text } from '../Text'
import { Stack } from '../Layout'

type Props = {
  launcher: {
    apps: {
      [key: string]: Array<{
        label: string
        url: string
        target?: string
      }>
    }
    urlToShowAll: string
  }
}

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const AppLauncher: React.VFC<Props & ElementProps> = ({ launcher }) => {
  const { apps, urlToShowAll } = launcher

  return (
    <Stack>
      {apps.base && <Text>yes</Text>}
      <Text>{urlToShowAll}</Text>
    </Stack>
  )
}
