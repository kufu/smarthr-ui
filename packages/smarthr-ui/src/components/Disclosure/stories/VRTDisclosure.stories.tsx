import { Stack, Cluster } from '../../Layout'
import { Button } from '../../Button/'
import { Disclosure, DisclosureTrigger, DisclosureContent } from '../Disclosure'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure/VRT',
  render: () => (
    <Stack>
      {[{}, { visuallyHidden: true }, { open: true }].map((args, index) => (
        <Stack>
          <Disclosure {...args} trigger={<Button>Disclosure</Button>}>
            Diclosure Content.
          </Disclosure>
          <Stack>
            <Cluster>
              <DisclosureTrigger targetId={`disclosure_${index}`}>
                <Button>Disclosure</Button>
              </DisclosureTrigger>
              <Button>other button</Button>
            </Cluster>
            <DisclosureContent {...args} id={`disclosure_${index}`}>
              Disclosure Content.
            </DisclosureContent>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Disclosure>

export const VRT = {
  parameters: {},
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
