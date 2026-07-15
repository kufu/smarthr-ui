import { IntercomWidget } from '../IntercomWidget'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/IntercomWidget',
  component: IntercomWidget,
  render: () => (
    <div style={{ width: '100%', height: '800px', backgroundColor: 'grey' }}>
      {/* @ts-ignore */}
      <IntercomWidget appId={import.meta.env.STORYBOOK_INTERCOM_APP_ID!} />
    </div>
  ),
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof IntercomWidget>

export const Playground: StoryObj<typeof IntercomWidget> = {}
