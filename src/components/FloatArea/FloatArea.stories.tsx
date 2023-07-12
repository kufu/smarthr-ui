import { StoryFn } from '@storybook/react'
import * as React from 'react'

import { Base } from '../Base'
import { Button } from '../Button'
import { PageHeading } from '../Heading'
import { Stack } from '../Layout'

import { FloatArea } from './FloatArea'

export default {
  title: 'Navigation（ナビゲーション）/FloatArea',
  component: FloatArea,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
  },
}

export const All: StoryFn = () => (
  <>
    <PageHeading>書類に記載する扶養家族</PageHeading>
    <FloatArea
      primaryButton={<Button variant="primary">Submit</Button>}
      secondaryButton={<Button>Cancel</Button>}
      tertiaryButton={<Button>preview</Button>}
      responseMessage={{ status: 'error', text: 'これはfixedのFloatAreaです。' }}
      top={2}
      width="80%"
      fixed
    />
    <Stack>
      {[...Array(15)].map((_, index) =>
        index === 13 ? (
          <FloatArea
            primaryButton={<Button variant="primary">Submit</Button>}
            secondaryButton={<Button>Cancel</Button>}
            tertiaryButton={<Button>preview</Button>}
            responseMessage={{ status: 'success', text: 'これはstickyのFloatAreaです。' }}
            bottom={1.5}
            key={index}
          />
        ) : (
          <Base key={index}>
            <p>複数の従業員項目を掛け合わせて（クロス集計）分析できる「レポート」を作成します。</p>
          </Base>
        ),
      )}
    </Stack>
  </>
)
All.storyName = 'all'

export const WithoutTertiary: StoryFn = () => (
  <FloatArea
    primaryButton={<Button variant="primary">Submit</Button>}
    secondaryButton={<Button>Cancel</Button>}
    responseMessage={{ status: 'error', text: 'これはエラーテキストです。' }}
    bottom={1.5}
  />
)
WithoutTertiary.storyName = 'withoutTertiary'

export const OnlyPrimary: StoryFn = () => (
  <FloatArea primaryButton={<Button variant="primary">Submit</Button>} top={2} />
)
OnlyPrimary.storyName = 'onlyPrimary'
