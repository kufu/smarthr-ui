import React, { type FC } from 'react'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { DialogBody, Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

import type { DecoratorsType } from '../../../types'

export type BaseProps = DialogHeaderProps &
  DialogBodyProps & {
    /** ダイアログの説明 */
    description: React.ReactNode
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'closeButtonLabel'>
  }

export type MessageDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
}

const CLOSE_BUTTON_LABEL = '閉じる'

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
  titleTag,
  titleId,
  contentBgColor,
  contentPadding,
  description,
  onClickClose,
  decorators,
}) => {
  const { wrapper, actionArea } = dialogContentInner()

  return (
    // eslint-disable-next-line smarthr/best-practice-for-layouts, smarthr/a11y-heading-in-sectioning-content
    <Stack gap={0} as="section" className={wrapper()}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {description}
      </DialogBody>
      {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
      <Cluster as="footer" justify="flex-end" className={actionArea()}>
        <Button onClick={onClickClose} className="smarthr-ui-Dialog-closeButton">
          {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
        </Button>
      </Cluster>
    </Stack>
  )
}
