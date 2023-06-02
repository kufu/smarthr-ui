import { Story } from '@storybook/react'
import * as React from 'react'

import { Base } from '../Base'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
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

export const All: Story = () => (
  <>
    <Heading>書類に記載する扶養家族</Heading>
    <FloatArea
      primaryButton={<Button variant="primary">Submit</Button>}
      secondaryButton={<Button>Cancel</Button>}
      tertiaryButton={<Button>preview</Button>}
      errorIcon={<FaExclamationCircleIcon color="DANGER" />}
      errorText="これはfixedのFloatAreaです。"
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
            errorIcon={<FaExclamationCircleIcon color="DANGER" />}
            errorText="これはstickyのFloatAreaです。"
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

export const WithoutTertiary: Story = () => (
  <FloatArea
    primaryButton={<Button variant="primary">Submit</Button>}
    secondaryButton={<Button>Cancel</Button>}
    errorIcon={<FaExclamationCircleIcon color="DANGER" />}
    errorText="This is the error text."
    bottom={1.5}
  />
)
WithoutTertiary.storyName = 'withoutTertiary'

export const OnlyPrimary: Story = () => (
  <FloatArea primaryButton={<Button variant="primary">Submit</Button>} top={2} />
)
OnlyPrimary.storyName = 'onlyPrimary'
