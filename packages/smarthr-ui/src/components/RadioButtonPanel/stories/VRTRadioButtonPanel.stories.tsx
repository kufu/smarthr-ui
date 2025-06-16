import { Cluster, Stack } from '../../Layout'
import { RadioButtonPanel } from '../RadioButtonPanel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/RadioButtonPanel/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'hover', 'focus-visible'].map((id) =>
        [false, true].map((checked) => (
          <Cluster gap={2} id={id} key={id}>
            {[false, true].map((disabled) => (
              <>
                <div>
                  <RadioButtonPanel
                    {...args}
                    checked={checked}
                    disabled={disabled}
                    key={`${id}-${checked}-${disabled}`}
                  />
                </div>
                <div>
                  <RadioButtonPanel
                    {...args}
                    checked={checked}
                    disabled={disabled}
                    key={`${id}-${checked}-${disabled}`}
                  >
                    説明テキスト
                  </RadioButtonPanel>
                </div>
              </>
            ))}
          </Cluster>
        )),
      )}
    </Stack>
  ),
  args: {
    label: 'ラジオボタンパネル',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof RadioButtonPanel>

export const VRT: StoryObj<typeof RadioButtonPanel> = {
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-RadioButton-radioButton'],
      focusVisible: ['#focus-visible .smarthr-ui-RadioButton-radioButton'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
