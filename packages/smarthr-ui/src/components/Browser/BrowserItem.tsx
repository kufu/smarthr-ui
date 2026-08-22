import { type ChangeEvent, type FC, type KeyboardEventHandler, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaAngleRightIcon } from '../Icon'
import { Cluster } from '../Layout'

import { getElementIdFromNode } from './utils'

import type { ItemNode } from './models'

const classNameGenerator = tv({
  slots: {
    label: [
      'shr-block shr-rounded-m shr-px-1 shr-py-0.5',
      'hover:shr-bg-white-darken',
      'has-[:focus-visible]:shr-focus-indicator',
    ],
    input: 'shr-sr-only',
  },
  variants: {
    selected: {
      true: {
        label: ['shr-bg-white-darken shr-font-bold', 'hover:shr-bg-column-darken'],
      },
      false: {},
    },
    hasChildren: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: true,
      hasChildren: false,
      className: {
        label: [
          'shr-bg-main shr-text-white',
          'hover:shr-bg-main-darken',
          'forced-colors:shr-bg-[Highlight]',
          'has-[:focus-visible]:shr-focus-indicator',
        ],
      },
    },
  ],
})

type Props = {
  selected: boolean
  itemValue: ItemNode['value']
  itemLabel: ItemNode['label']
  itemHasChildren: boolean
  tabIndex: 0 | -1
  columnIndex: number
  handleChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
}

const KEYDOWN_REGEX = /^((Arrow(Right|Left|Up|Down))|Enter| )$/
const HANDLE_KEYDOWN: KeyboardEventHandler = (e) => {
  if (KEYDOWN_REGEX.test(e.key)) {
    e.preventDefault()
  }
}

export const BrowserItem: FC<Props> = ({
  selected,
  itemValue,
  itemLabel,
  itemHasChildren,
  tabIndex,
  columnIndex,
  handleChangeInput,
}) => {
  const inputId = useMemo(() => getElementIdFromNode(itemValue), [itemValue])
  const classNames = useMemo(() => {
    const { label, input } = classNameGenerator({ selected, hasChildren: itemHasChildren })
    return {
      label: label(),
      input: input(),
    }
  }, [selected, itemHasChildren])

  return (
    <label htmlFor={inputId} className={classNames.label}>
      <input
        type="radio"
        id={inputId}
        name={`column-${columnIndex}`}
        value={itemValue}
        checked={selected}
        tabIndex={tabIndex}
        className={classNames.input}
        onKeyDown={HANDLE_KEYDOWN}
        onChange={handleChangeInput}
      />
      <BodyCluster hasChildren={itemHasChildren} label={itemLabel} />
    </label>
  )
}

const BodyCluster = memo<{ label: string; hasChildren: boolean }>(({ label, hasChildren }) => (
  <Cluster as="span" align="center" justify="space-between">
    <span>{label}</span>
    {hasChildren && <FaAngleRightIcon />}
  </Cluster>
))
