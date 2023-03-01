import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useId } from '../../../hooks/useId'
import { includeDisabledTrigger } from '../../../libs/util'
import { ActionDialog } from '../ActionDialog'

type ToggleModalActionType = () => void

export const ActionDialogWithTrigger: React.FC<
  Omit<React.ComponentProps<typeof ActionDialog>, 'isOpen' | 'onClickClose'> & {
    trigger: React.ReactNode
    onClickTrigger?: (open: ToggleModalActionType) => void
    onClickClose?: (close: ToggleModalActionType) => void
  }
> = ({ id, trigger, onClickTrigger, onClickClose, ...props }) => {
  const generatedId = useId()
  const actualId = id || generatedId
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const onClickOpen = useCallback(() => {
    // 引き金となる要素が disabled な場合は発火させない
    if (includeDisabledTrigger(trigger)) {
      return
    }

    if (onClickTrigger) {
      return onClickTrigger(open)
    }

    open()
  }, [trigger, onClickTrigger, open])
  const actualOnClickClose = useCallback(() => {
    if (onClickClose) {
      return onClickClose(close)
    }

    close()
  }, [onClickClose, close])

  return (
    <>
      <TriggerWrapper onClick={onClickOpen} aria-haspopup="true" aria-controls={actualId}>
        {trigger}
      </TriggerWrapper>
      <ActionDialog {...props} isOpen={isOpen} onClickClose={actualOnClickClose} id={actualId} />
    </>
  )
}

const TriggerWrapper = styled.div`
  display: inline;
`
