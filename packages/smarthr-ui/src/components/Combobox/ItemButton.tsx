import { type RefObject, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCirclePlusIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboboxOption } from './types'

type Props = Omit<ComboboxOption<unknown>, 'item'> &
  Omit<ComboboxOption<unknown>['item'], 'data' | 'value'> & {
    activeRef: RefObject<HTMLButtonElement> | undefined
  }

const classNameGenerator = tv({
  base: [
    'shr-relative shr-block shr-min-w-full shr-cursor-pointer shr-border-none shr-px-1 shr-py-0.5 shr-text-left shr-text-base shr-leading-tight',
    'aria-selected:shr-text-white',
    'disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
    'data-[active=true]:shr-focus-indicator data-[active=true]:aria-selected:shr-bg-main',
    'data-[active=false]:shr-bg-white data-[active=false]:aria-selected:shr-bg-main',
    '[&[data-active=true]]:shr-z-1', // pseudoエレメントがliの::afterと衝突しないために子要素に適用しますが、次のエレメントに被られるからz-indexを一時的に変更します

    // ::before: フォーカスリングと上のアイテムの下端の間の隙間を埋めるために、上端から1px外側に1pxの横線を描画する。
    // 非選択かつ先頭以外のボタンにフォーカスが当たったときのみ表示する
    'before:shr-absolute before:-shr-top-[1px] before:shr-left-0 before:shr-hidden before:shr-h-px before:shr-w-full before:shr-bg-border before:shr-content-[""]',
    '[&[data-active=true]:not(:first-child):not([aria-selected=true])]:before:shr-block',

    // ::after: フォーカスリングと下のアイテムの上端の間の隙間を埋めるために、下端から1px外側に1pxの横線を描画する。
    // 非選択かつ末尾以外のボタンにフォーカスが当たったときのみ表示する
    'after:shr-absolute after:-shr-bottom-[1px] after:shr-left-0 after:shr-hidden after:shr-h-px after:shr-w-full after:shr-bg-border after:shr-content-[""]',
    '[&[data-active=true]:not(:last-child):not([aria-selected=true])]:after:shr-block',
  ],
  variants: {
    new: {
      true: 'smarthr-ui-Combobox-addButton shr-flex shr-items-center',
      false: 'smarthr-ui-Combobox-selectButton',
    },
  },
})

const CLASS_NAMES = {
  new: classNameGenerator({ new: true }),
  select: classNameGenerator({ new: false }),
}

export const ItemButton = memo<Props>(({ id, label, disabled, selected, isNew, activeRef }) => (
  <button
    ref={activeRef}
    type="button"
    role="option"
    id={id}
    data-active={!!activeRef}
    aria-selected={isNew ? false : selected}
    disabled={isNew ? undefined : disabled}
    className={isNew ? CLASS_NAMES.new : CLASS_NAMES.select}
  >
    {isNew ? (
      <Text color="TEXT_LINK" icon={<FaCirclePlusIcon color="TEXT_LINK" />}>
        <Localizer
          id="smarthr-ui/Combobox/addItemButtonLabel"
          defaultText="「{name}」を追加"
          values={{ name: label }}
        />
      </Text>
    ) : (
      label
    )}
  </button>
))
