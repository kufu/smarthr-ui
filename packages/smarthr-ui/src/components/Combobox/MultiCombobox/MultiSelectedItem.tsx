import {
  type KeyboardEvent,
  type RefObject,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../../hooks/useLatest'
import { Localizer } from '../../../intl'
import { UnstyledButton } from '../../Button'
import { Chip } from '../../Chip'
import { FaCircleXmarkIcon } from '../../Icon'
import { Tooltip } from '../../Tooltip'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import type { ComboboxItem } from '../types'

export type Props<T> = {
  item: ComboboxItem<T> & { deletable?: boolean }
  disabled: boolean
  handleDelete: (item: ComboboxItem<T>) => void
  enableEllipsis?: boolean
  buttonRef: RefObject<HTMLButtonElement>
}

const classNameGenerator = tv({
  slots: {
    wrapper:
      'smarthr-ui-MultiCombobox-selectedItem shr-flex shr-items-center shr-gap-0.75 shr-leading-normal [&]:shr-rounded-em',
    itemLabel: 'smarthr-ui-MultiCombobox-selectedItemLabel',
    deleteButton: [
      'smarthr-ui-MultiCombobox-deleteButton',
      'shr-relative',
      'shr-group/deleteButton',
      'shr-shrink shr-rounded-full shr-leading-[0] shr-text-black',
      'focus-visible:shr-outline-none',
      'disabled:shr-cursor-not-allowed',
    ],
    deleteButtonIcon:
      'group-focus-visible/deleteButton:shr-focus-indicator--outer group-focus-visible/deleteButton:shr-rounded-full',
  },
  variants: {
    enableEllipsis: {
      true: {
        itemLabel: 'shr-overflow-hidden shr-overflow-ellipsis shr-whitespace-nowrap',
      },
    },
  },
})

const EXEC_DESTROY_KEY = /^(Enter|Backspace| )$/

export function MultiSelectedItem<T>({
  item,
  enableEllipsis,
  disabled,
  handleDelete,
  ...rest
}: Props<T>) {
  const itemDeletable = item.deletable ?? true
  const latest = useLatest({ handleDelete, item })

  const functions = useMemo(
    () =>
      itemDeletable
        ? {
            handleDestroyClick: () => {
              latest.handleDelete(latest.item)
            },
            handleDestroyKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
              if (EXEC_DESTROY_KEY.test(e.key)) {
                e.stopPropagation()

                // HINT: イベントの伝播が止まる関係でonClickに設定したhandleDeleteは実行されない
                // このタイミングで明示的に削除処理を実行する
                latest.handleDelete(latest.item)
              }
            },
          }
        : {
            handleDestroyClick: undefined,
            handleDestroyKeyDown: undefined,
          },
    [itemDeletable, latest],
  )

  const classNames = useMemo(() => {
    const { wrapper, itemLabel, deleteButton, deleteButtonIcon } = classNameGenerator()

    return {
      wrapper: wrapper(),
      itemLabel: itemLabel({ enableEllipsis }),
      deleteButton: deleteButton(),
      deleteButtonIcon: deleteButtonIcon(),
    }
  }, [enableEllipsis])

  const Component = enableEllipsis ? EllipsisMultiSelectedItem : ActualMultiSelectedItem

  return (
    <Component
      {...rest}
      itemLabel={item.label}
      itemDeletable={itemDeletable}
      disabled={disabled}
      functions={functions}
      classNames={classNames}
    />
  )
}

type LowerMultiSelectedItemProps<T> = Omit<Props<T>, 'item' | 'enableEllipsis' | 'handleDelete'> & {
  labelRef?: RefObject<HTMLSpanElement>
  itemLabel: ComboboxItem<T>['label']
  itemDeletable: boolean
  functions: {
    handleDestroyClick?: () => void
    handleDestroyKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  }
  classNames: {
    wrapper: string
    itemLabel: string
    deleteButton: string
    deleteButtonIcon: string
  }
}

const typedMemo: <T>(c: T) => T = memo

const BaseEllipsisMultiSelectedItem = <T,>({
  itemLabel,
  ...rest
}: LowerMultiSelectedItemProps<T>) => {
  const [needsTooltip, setNeedsTooltip] = useState(false)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const elem = labelRef.current

    if (elem) {
      setNeedsTooltip(elem.offsetWidth < elem.scrollWidth)
    }
  }, [])

  const body = <ActualMultiSelectedItem {...rest} labelRef={labelRef} itemLabel={itemLabel} />

  if (needsTooltip) {
    return <Tooltip message={itemLabel}>{body}</Tooltip>
  }

  return body
}
const EllipsisMultiSelectedItem = typedMemo(BaseEllipsisMultiSelectedItem)

const BaseActualMultiSelectedItem = <T,>({
  buttonRef,
  labelRef,
  itemLabel,
  itemDeletable,
  disabled,
  functions,
  classNames,
}: LowerMultiSelectedItemProps<T>) => {
  const idPrefix = useId()
  const labelId = `${idPrefix}-item-label`

  return (
    <Chip disabled={disabled} className={classNames.wrapper}>
      <span ref={labelRef} id={labelId} className={classNames.itemLabel}>
        {itemLabel}
      </span>

      {itemDeletable && (
        <DestroyButton
          buttonRef={buttonRef}
          labelId={labelId}
          suffixTextId={`${idPrefix}-item-destroy-button-suffix`}
          functions={functions}
          disabled={disabled}
          classNames={classNames}
        />
      )}
    </Chip>
  )
}
const ActualMultiSelectedItem = typedMemo(BaseActualMultiSelectedItem)

const DestroyButton = <T,>({
  buttonRef,
  labelId,
  suffixTextId,
  disabled,
  functions,
  classNames,
}: Pick<LowerMultiSelectedItemProps<T>, 'disabled' | 'functions' | 'buttonRef' | 'classNames'> & {
  labelId: string
  suffixTextId: string
}) => (
  <UnstyledButton
    ref={buttonRef}
    disabled={disabled}
    tabIndex={-1}
    aria-labelledby={`${labelId} ${suffixTextId}`}
    onClick={functions.handleDestroyClick}
    onKeyDown={functions.handleDestroyKeyDown}
    className={classNames.deleteButton}
  >
    <VisuallyHiddenText id={suffixTextId}>
      <Localizer id="smarthr-ui/MultiCombobox/destroyButtonIconAltSuffix" defaultText="を削除" />
    </VisuallyHiddenText>
    <FaCircleXmarkIcon
      color={disabled ? 'TEXT_DISABLED' : 'inherit'}
      className={classNames.deleteButtonIcon}
    />
  </UnstyledButton>
)
