import { Browser } from '../Browser'

import type { Meta, StoryObj } from '@storybook/react'

import { Stack } from '../../../'

export default {
  title: 'Components/Browser/VRT',
  render: () => (
    <Stack>
      {[undefined, 'hover', 'focus-visible'].map((state) => (
        <div key={state} id={state}>
          {['parent1', 'parent2', 'child1', 'child2', 'grandchild1'].map((value) => (
            <Browser
              value={value}
              items={[
                {
                  label: '親項目',
                  value: 'parent1',
                  children: [
                    {
                      value: 'child1',
                      label: '子項目1',
                      children: [{ value: 'grandchild1', label: '孫項目1' }],
                    },
                    { value: 'child2', label: '子項目2' },
                  ],
                },
                { label: '親項目2', value: 'parent2' },
              ]}
            />
          ))}
        </div>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Browser>

export const VRT = {
  parameters: {
    pseudo: {
      hover: ['#hover label'],
      focusVisible: ['#focus-visible input'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
