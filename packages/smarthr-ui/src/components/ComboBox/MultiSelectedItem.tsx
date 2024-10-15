import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Chip } from '../Chip'
import { FaTimesCircleIcon } from '../Icon'

import { MultiSelectedItemTooltip } from './MultiSelectedItemTooltip'
import { ComboBoxItem } from './types'

export type Props<T> = {
  item: ComboBoxItem<T> & { deletable?: boolean }
  disabled: boolean
  onDelete: (item: ComboBoxItem<T>) => void
  enableEllipsis?: boolean
  buttonRef: RefObject<HTMLButtonElement>
  decorators?: {
    destroyButtonIconAlt?: (text: string) => string
  }
}

const DESTROY_BUTTON_TEXT = '削除'

const multiSelectedItem = tv({
  slots: {
    wrapper:
      'smarthr-ui-MultiComboBox-selectedItem shr-flex shr-items-center shr-gap-0.75 shr-leading-normal [&]:shr-rounded-em',
    itemLabel: 'smarthr-ui-MultiComboBox-selectedItemLabel',
    deleteButton: [
      'smarthr-ui-MultiComboBox-deleteButton',
      'shr-group/deleteButton',
      'shr-shrink shr-rounded-full shr-leading-[0] shr-text-black',
      'focus-visible:shr-shadow-[unset]',
    ],
    deleteButtonIcon:
      'group-focus-visible/deleteButton:shr-focus-indicator group-focus-visible/deleteButton:shr-rounded-full',
  },
  variants: {
    enableEllipsis: {
      true: {
        itemLabel: 'shr-overflow-hidden shr-overflow-ellipsis shr-whitespace-nowrap',
      },
    },
    disabled: {
      true: {
        deleteButton: 'shr-cursor-not-allowed',
      },
      false: {},
    },
  },
})

export function MultiSelectedItem<T>({
  item,
  disabled,
  onDelete,
  enableEllipsis,
  buttonRef,
  decorators,
}: Props<T>) {
  const labelRef = useRef<HTMLDivElement>(null)
  const [needsTooltip, setNeedsTooltip] = useState(false)
  const { deletable = true } = item

  const actualOnDelete = useCallback(() => {
    if (onDelete) {
      onDelete(item)
    }
  }, [item, onDelete])

  useEffect(() => {
    const elem = labelRef.current
    if (!elem || !enableEllipsis) {
      return
    }
    if (elem.offsetWidth < elem.scrollWidth) {
      setNeedsTooltip(true)
    }
  }, [enableEllipsis])

  const { wrapper, itemLabel, deleteButton, deleteButtonIcon } = multiSelectedItem()
  const { wrapperStyle, itemLabelStyle, deleteButtonStyle, deleteButtonIconStyle } = useMemo(
    () => ({
      wrapperStyle: wrapper(),
      itemLabelStyle: itemLabel({ enableEllipsis }),
      deleteButtonStyle: deleteButton({ disabled }),
      deleteButtonIconStyle: deleteButtonIcon(),
    }),
    [deleteButton, deleteButtonIcon, disabled, enableEllipsis, itemLabel, wrapper],
  )

  return (
    <MultiSelectedItemTooltip needsTooltip={needsTooltip} text={item.label}>
      <Chip disabled={disabled} className={wrapperStyle}>
        <span className={itemLabelStyle} ref={labelRef}>
          {item.label}
        </span>

        {deletable && (
          <UnstyledButton
            className={deleteButtonStyle}
            disabled={disabled}
            onClick={actualOnDelete}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Backspace' || e.key === ' ') {
                e.stopPropagation()

                // HINT: イベントの伝播が止まる関係でonClickに設定したonDeleteは実行されない
                // このタイミングで明示的に削除処理を実行する
                actualOnDelete()
              }
            }}
            ref={buttonRef}
            tabIndex={-1}
          >
            <FaTimesCircleIcon
              color={disabled ? 'TEXT_DISABLED' : 'inherit'}
              alt={decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT}
              className={deleteButtonIconStyle}
            />
          </UnstyledButton>
        )}
      </Chip>
    </MultiSelectedItemTooltip>
  )
}
