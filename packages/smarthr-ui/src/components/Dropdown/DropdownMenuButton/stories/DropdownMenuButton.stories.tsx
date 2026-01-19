import { action } from 'storybook/actions'

import { AnchorButton, Button } from '../../../Button'
import { RemoteDialogTrigger } from '../../../Dialog'
import { FaGearIcon } from '../../../Icon'
import { DropdownMenuButton } from '../DropdownMenuButton'
import { DropdownMenuGroup } from '../DropdownMenuGroup'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _sampleTriggerIcons = {
  undefined,
  'FaGearIcon（onlyIconTrigger の時のみ動作）': FaGearIcon,
}

export default {
  title: 'Components/Dropdown/DropdownMenuButton',
  component: DropdownMenuButton,
  subcomponents: { DropdownMenuGroup },
  render: (args) => (
    <DropdownMenuButton {...args}>
      <Button>操作1</Button>
      <AnchorButton href="#">操作2</AnchorButton>
      <RemoteDialogTrigger targetId="remoteDialog" onClick={action('open-remote-dialog')}>
        <Button>操作3</Button>
      </RemoteDialogTrigger>
      <Button onClick={action('action4')} disabled={true} disabledReason={{ message: 'disabled.' }}>
        操作4
      </Button>
    </DropdownMenuButton>
  ),
  args: {
    trigger: 'その他の操作',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownMenuButton>

export const Playground: StoryObj<typeof DropdownMenuButton> = {
  args: {
    trigger: {
      children: 'その他の操作',
      size: 'default',
    },
  },
}

export const Trigger: StoryObj<typeof DropdownMenuButton> = {
  name: 'trigger',
  args: {
    trigger: 'ドロップダウンメニューボタンラベル',
  },
}

export const TriggerSize: StoryObj<typeof DropdownMenuButton> = {
  name: 'trigger.size',
  args: {
    trigger: {
      children: 'ドロップダウンメニューボタンラベル',
      size: 's',
    },
  },
}

export const TriggerOnlyIcon: StoryObj<typeof DropdownMenuButton> = {
  name: 'trigger.onlyIcon',
  args: {
    trigger: {
      children: 'ドロップダウンメニューボタンラベル',
      // onlyIcon が falsy の時は、開閉を示唆する FaCaretDownIcon が表示されます
      onlyIcon: true,
    },
  },
}

export const TriggerOnlyIconComponent: StoryObj<typeof DropdownMenuButton> = {
  name: 'trigger.onlyIcon.component',
  args: {
    trigger: {
      children: 'ドロップダウンメニューボタンラベル',
      onlyIcon: {
        component: FaGearIcon,
      },
    },
  },
}
