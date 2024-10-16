import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Stack } from '../../..'
import { Gap } from '../../../types'

import { ColorBox } from './ComponentsForStories'

/**
 * gapはボリュームが多いため、1回ずつ出るように別途組み合わせます
 * また、asも範囲が広いため、組み合わせていません。
 * $ pict stack.pict.txt
 * inline  align
 * true    center
 * false   baseline
 * false   stretch
 * false   start
 * true    baseline
 * true    flex-end
 * false   end
 * true    start
 * true    flex-start
 * true    end
 * false   flex-end
 * true    stretch
 * false   center
 * false   flex-start
 */

export default {
  title: 'Layouts（レイアウト）/Stack',
  component: Stack,
  render: () => {
    const gap: Gap[] = [
      0,
      0.25,
      0.5,
      0.75,
      1,
      1.25,
      1.5,
      2,
      2.5,
      3,
      3.5,
      4,
      8,
      'X3S',
      'XXS',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      'X3L',
    ]
    const pictList: Array<{
      inline: boolean
      align: 'center' | 'baseline' | 'stretch' | 'start' | 'flex-end' | 'end' | 'flex-start'
    }> = [
      { inline: true, align: 'center' },
      { inline: false, align: 'baseline' },
      { inline: false, align: 'stretch' },
      { inline: false, align: 'start' },
      { inline: true, align: 'baseline' },
      { inline: true, align: 'flex-end' },
      { inline: false, align: 'end' },
      { inline: true, align: 'start' },
      { inline: true, align: 'flex-start' },
      { inline: true, align: 'end' },
      { inline: false, align: 'flex-end' },
      { inline: true, align: 'stretch' },
      { inline: false, align: 'center' },
      { inline: false, align: 'flex-start' },
    ]
    return (
      <Wrapper>
        {gap.map((g) =>
          pictList.map((pict) => (
            <Stack key={g} gap={g} inline={pict.inline} align={pict.align}>
              <ColorBox />
              <ColorBox />
            </Stack>
          )),
        )}
      </Wrapper>
    )
  },
  parameters: {
    withTheming: true,
  },
} as Meta<typeof Stack>

export const VRTStackNarrow: StoryObj = {
  parameters: {
    viewport: {
      defaultViewport: 'vrtMobile',
    },
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
}

export const VRTStackForcedColors: StoryObj = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

const Wrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
`
