import {
  type KeyboardEvent,
  type RefObject,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

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
  onDelete: (item: ComboboxItem<T>) => void
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
}: Props<T>) {
  const [needsTooltip, setNeedsTooltip] = useState(false)
  const labelRef = useRef<HTMLDivElement>(null)
  const idPrefix = useId()
  const labelId = `${idPrefix}-item-label`
  const destroySuffixTextId = `${idPrefix}-item-destroy-button-suffix`

  const { deletable = true } = item

  const classNames = useMemo(() => {
    const { wrapper, itemLabel, deleteButton, deleteButtonIcon } = classNameGenerator()

    return {
      wrapper: wrapper(),
      itemLabel: itemLabel({ enableEllipsis }),
      deleteButton: deleteButton({ disabled }),
      deleteButtonIcon: deleteButtonIcon(),
    }
  }, [disabled, enableEllipsis])

  useEffect(() => {
    if (enableEllipsis && labelRef.current) {
      const elem = labelRef.current

      setNeedsTooltip(elem.offsetWidth < elem.scrollWidth)
    }
  }, [enableEllipsis])

  const body = (
    <Chip disabled={disabled} className={classNames.wrapper}>
      <span ref={labelRef} id={labelId} className={classNames.itemLabel}>
        {item.label}
      </span>

      {deletable && (
        <DestroyButton
          labelId={labelId}
          suffixTextId={destroySuffixTextId}
          item={item}
          onDelete={onDelete}
          disabled={disabled}
          buttonRef={buttonRef}
          className={classNames.deleteButton}
          iconStyle={classNames.deleteButtonIcon}
        />
      )}
    </Chip>
  )

  if (needsTooltip) {
    return <Tooltip message={item.label}>{body}</Tooltip>
  }

  return body
}

const typedMemo: <T>(c: T) => T = memo
const EXEC_DESTROY_KEY = /^(Enter|Backspace| )$/

const BaseDestroyButton = <T,>({
  labelId,
  suffixTextId,
  item,
  onDelete,
  disabled,
  buttonRef,
  className,
  iconStyle,
}: Pick<Props<T>, 'item' | 'onDelete' | 'disabled' | 'buttonRef'> & {
  labelId: string
  suffixTextId: string
  className: string
  iconStyle: string
}) => {
  const onDeleteRef = useRef(onDelete)
  onDeleteRef.current = onDelete
  const itemRef = useRef(item)
  itemRef.current = item

  const onClick = useCallback(() => {
    onDeleteRef.current(itemRef.current)
  }, [])

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    if (EXEC_DESTROY_KEY.test(e.key)) {
      e.stopPropagation()

      // HINT: イベントの伝播が止まる関係でonClickに設定したonDeleteは実行されない
      // このタイミングで明示的に削除処理を実行する
      onDeleteRef.current(itemRef.current)
    }
  }, [])

  return (
    <UnstyledButton
      ref={buttonRef}
      disabled={disabled}
      tabIndex={-1}
      aria-labelledby={`${labelId} ${suffixTextId}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={className}
    >
      <VisuallyHiddenText id={suffixTextId}>
        <Localizer id="smarthr-ui/MultiCombobox/destroyButtonIconAltSuffix" defaultText="を削除" />
      </VisuallyHiddenText>
      <FaCircleXmarkIcon color={disabled ? 'TEXT_DISABLED' : 'inherit'} className={iconStyle} />
    </UnstyledButton>
  )
}
const DestroyButton = typedMemo(BaseDestroyButton)
