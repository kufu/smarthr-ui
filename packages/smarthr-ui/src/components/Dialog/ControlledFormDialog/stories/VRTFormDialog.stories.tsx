import { expect, within } from 'storybook/test'

import { Button } from '../../../Button'
import { Fieldset, FormControl } from '../../../FormGroup'
import { Input } from '../../../Input'
import { Cluster } from '../../../Layout'
import { ControlledFormDialog } from '../ControlledFormDialog'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Dialog/ControlledFormDialog/VRT',
  component: ControlledFormDialog,
  args: {
    width: '40em',
    size: 'M',
    isOpen: true,
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログのサブタイトル',
    },
    actionButton: '送信',
    subActionArea: <Button>サブアクション</Button>,
    contentBgColor: 'BACKGROUND',
    responseStatus: {
      status: 'success',
      text: '送信しました。',
    },
    children: (
      <FormControl label="名前">
        <Input name="name" />
      </FormControl>
    ),
    onSubmit: () => {},
    onClickClose: () => {},
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledFormDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof ControlledFormDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

export const VRTNestedScroll: StoryObj<typeof ControlledFormDialog> = {
  args: {
    width: undefined,
    size: 'XXL',
    contentPadding: 0,
    heading: '補足情報を固定し、フォームだけをスクロールするダイアログ',
    subActionArea: undefined,
    responseStatus: undefined,
    children: (
      <Cluster gap={0} align="stretch">
        <div
          role="region"
          style={{ flex: 1, maxHeight: '60svh', overflowY: 'auto' }}
          aria-label="フォーム"
        >
          <div style={{ height: 950 }}>フォームの先頭</div>
          <Fieldset legend="基本情報">
            <Input name="basicInfo" width="100%" aria-label="基本情報の入力" />
          </Fieldset>
          <div style={{ height: 200 }} />
          <Fieldset legend="詳細情報">
            <Input name="detailInfo" width="100%" aria-label="詳細情報の入力" />
          </Fieldset>
        </div>
        <div style={{ width: '20em' }}>補足情報</div>
      </Cluster>
    ),
  },
  parameters: {
    chromatic: { viewports: [1440] },
  },
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body)
    const form = await screen.findByRole('region', { name: 'フォーム' })
    const dialogBody = form.closest<HTMLElement>('.smarthr-ui-Dialog-body')

    await expect(dialogBody).not.toBeNull()

    if (dialogBody) {
      form.scrollTop = form.scrollHeight
      dialogBody.scrollTop = dialogBody.scrollHeight

      await expect(form.scrollTop).toBeGreaterThan(0)
      await expect(dialogBody.scrollTop).toBe(0)
    }
  },
}
