import {
  type KeyboardEvent,
  type PropsWithChildren,
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

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { UnstyledButton } from '../../Button'
import { Chip } from '../../Chip'
import { FaTimesCircleIcon } from '../../Icon'
import { Tooltip } from '../../Tooltip'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import type { ComboboxItem } from '../types'

export type Props<T> = {
  item: ComboboxItem<T> & { deletable?: boolean }
  disabled: boolean
  onDelete: (item: ComboboxItem<T>) => void
  enableEllipsis?: boolean
  buttonRef: RefObject<HTMLButtonElement>
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

const DECORATOR_DEFAULT_TEXTS = {
  destroyButtonIconAltSuffix: 'を削除',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

const classNameGenerator = tv({
  slots: {
    wrapper:
      'smarthr-ui-MultiCombobox-selectedItem shr-flex shr-items-center shr-gap-0.75 shr-leading-normal [&]:shr-rounded-em',
    itemLabel: 'smarthr-ui-MultiCombobox-selectedItemLabel',
    deleteButton: [
      'smarthr-ui-MultiCombobox-deleteButton',
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
  const [needsTooltip, setNeedsTooltip] = useState(false)
  const { deletable = true } = item
  const idPrefix = useId()
  const labelId = `${idPrefix}-item-label`
  const destroySuffixTextId = `${idPrefix}-item-destroy-button-suffix`

  const classNames = useMemo(() => {
    const { wrapper, itemLabel, deleteButton, deleteButtonIcon } = classNameGenerator()

    return {
      wrapper: wrapper(),
      itemLabel: itemLabel({ enableEllipsis }),
      deleteButton: deleteButton({ disabled }),
      deleteButtonIcon: deleteButtonIcon(),
    }
  }, [disabled, enableEllipsis])

  const body = (
    <Chip disabled={disabled} className={classNames.wrapper}>
      <ItemLabel id={labelId} className={classNames.itemLabel} setNeedsTooltip={setNeedsTooltip}>
        {item.label}
      </ItemLabel>

      {deletable && (
        <DestroyButton
          labelId={labelId}
          suffixTextId={destroySuffixTextId}
          item={item}
          onDelete={onDelete}
          disabled={disabled}
          buttonRef={buttonRef}
          decorators={decorators}
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

const ItemLabel = memo<
  PropsWithChildren<{
    id: string
    enableEllipsis?: boolean
    setNeedsTooltip: (flg: boolean) => void
    className: string
  }>
>(({ children, id, enableEllipsis, setNeedsTooltip, className }) => {
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (enableEllipsis && labelRef.current) {
      const elem = labelRef.current

      setNeedsTooltip(elem.offsetWidth < elem.scrollWidth)
    }
  }, [enableEllipsis, setNeedsTooltip])

  return (
    <span ref={labelRef} id={id} className={className}>
      {children}
    </span>
  )
})

const typedMemo: <T>(c: T) => T = memo
const EXEC_DESTROY_KEY = /^(Enter|Backspace| )$/

const BaseDestroyButton = <T,>({
  labelId,
  suffixTextId,
  item,
  onDelete,
  disabled,
  buttonRef,
  decorators,
  className,
  iconStyle,
}: Pick<Props<T>, 'item' | 'onDelete' | 'disabled' | 'buttonRef' | 'decorators'> & {
  labelId: string
  suffixTextId: string
  className: string
  iconStyle: string
}) => {
  const onClick = useCallback(() => {
    onDelete(item)
  }, [item, onDelete])
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (EXEC_DESTROY_KEY.test(e.key)) {
        e.stopPropagation()

        // HINT: イベントの伝播が止まる関係でonClickに設定したonDeleteは実行されない
        // このタイミングで明示的に削除処理を実行する
        onClick()
      }
    },
    [onClick],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

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
        {decorated.destroyButtonIconAltSuffix}
      </VisuallyHiddenText>
      <FaTimesCircleIcon color={disabled ? 'TEXT_DISABLED' : 'inherit'} className={iconStyle} />
    </UnstyledButton>
  )
}
const DestroyButton = typedMemo(BaseDestroyButton)
