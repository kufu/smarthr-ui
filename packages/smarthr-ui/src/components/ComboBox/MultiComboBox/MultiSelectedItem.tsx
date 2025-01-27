import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../../Button'
import { Chip } from '../../Chip'
import { FaTimesCircleIcon } from '../../Icon'
import { Tooltip } from '../../Tooltip'
import { ComboBoxItem } from '../types'

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
    if (enableEllipsis && labelRef.current) {
      const elem = labelRef.current

      setNeedsTooltip(elem.offsetWidth < elem.scrollWidth)
    }
  }, [enableEllipsis])

  const styles = useMemo(() => {
    const { wrapper, itemLabel, deleteButton, deleteButtonIcon } = multiSelectedItem()

    return {
      wrapper: wrapper(),
      itemLabel: itemLabel({ enableEllipsis }),
      deleteButton: deleteButton({ disabled }),
      deleteButtonIcon: deleteButtonIcon(),
    }
  }, [disabled, enableEllipsis])

  const body = (
    <Chip disabled={disabled} className={styles.wrapper}>
      <span className={styles.itemLabel} ref={labelRef}>
        {item.label}
      </span>

      {deletable && (
        <UnstyledButton
          className={styles.deleteButton}
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
            className={styles.deleteButtonIcon}
          />
        </UnstyledButton>
      )}
    </Chip>
  )

  if (needsTooltip) {
    return (
      <Tooltip message={item.label} multiLine={true}>
        {body}
      </Tooltip>
    )
  }

  return body
}
