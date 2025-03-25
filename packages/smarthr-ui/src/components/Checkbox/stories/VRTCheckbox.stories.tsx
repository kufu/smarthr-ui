import { Heading } from '@storybook/blocks'

import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { Checkbox } from '../Checkbox'

import type { Meta, StoryObj } from '@storybook/react'

// ペアワイズ法は使わずに総当りする
const mixed = [true, false]
const error = [true, false]
const disabled = [true, false]
const checked = [true, false]
const Template = (
  <Cluster className="shr-p-1">
    {mixed.map((isMixed) =>
      error.map((isError) =>
        disabled.map((isDisabled) =>
          checked.map((isChecked) => (
            <Checkbox
              key={`${isMixed}-${isError}-${isDisabled}-${isChecked}`}
              name={`${isMixed}-${isError}-${isDisabled}-${isChecked}`}
              mixed={isMixed}
              error={isError}
              disabled={isDisabled}
              checked={isChecked}
            />
          )),
        ),
      ),
    )}
  </Cluster>
)

export default {
  title: 'Forms（フォーム）/Checkbox/VRT',
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Checkbox>

export const VRT = {
  render: () => (
    <Stack>
      <Section>
        <Heading>VRT</Heading>
        <div id="vrt">{Template}</div>
      </Section>
      <Section>
        <Heading>VRT Hover</Heading>
        <div id="vrt-hover">{Template}</div>
      </Section>
      <Section>
        <Heading>VRT Focus Visible</Heading>
        <div id="vrt-focus-visible">{Template}</div>
      </Section>
    </Stack>
  ),
  parameters: {
    pseudo: {
      hover: ['#vrt-hover .smarthr-ui-Checkbox-checkbox'],
      focusVisible: ['#vrt-focus-visible .smarthr-ui-Checkbox-checkbox'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    ...VRT.parameters,
    chromatic: { forcedColors: 'active' },
  },
}
