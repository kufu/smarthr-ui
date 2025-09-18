'use client'

import { type PropsWithChildren, type ReactNode, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { UnstyledButton } from '../Button'
import { FaSortDownIcon, FaSortUpIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

const sortButtonClassNameGenerator = tv({
  base: '-shr-mx-1 -shr-my-0.75 shr-inline-flex shr-w-full shr-items-center shr-justify-between shr-gap-x-0.5 shr-px-1 shr-py-0.75 shr-font-bold',
  variants: {
    align: {
      left: '',
      right: 'shr-justify-end',
    },
  },
})

type sortTypes = 'asc' | 'desc' | 'none'

type Props = PropsWithChildren<{
  align?: VariantProps<typeof sortButtonClassNameGenerator>['align']
  onSort?: () => void
  sort?: sortTypes
  decorators?: {
    sortDirectionIconAlt: (text: string, { sort }: { sort: sortTypes }) => ReactNode
  }
}>

export const ThSortButton = memo<Props>(({ align, sort, decorators, onSort, children }) => {
  const { localize } = useIntl()

  const decoratorDefaultTexts = useMemo(
    () => ({
      asc: localize({
        id: 'smarthr-ui/Th/sortDirectionAsc',
        defaultText: '昇順',
      }),
      desc: localize({
        id: 'smarthr-ui/Th/sortDirectionDesc',
        defaultText: '降順',
      }),
      none: localize({
        id: 'smarthr-ui/Th/sortDirectionNone',
        defaultText: '並び替えなし',
      }),
    }),
    [localize],
  )

  const sortLabel = useMemo(() => {
    if (!sort) return undefined

    return (
      decorators?.sortDirectionIconAlt?.(decoratorDefaultTexts[sort], { sort }) ??
      decoratorDefaultTexts[sort]
    )
  }, [decorators, sort, decoratorDefaultTexts])

  const className = useMemo(() => sortButtonClassNameGenerator({ align }), [align])

  return (
    <UnstyledButton onClick={onSort} className={className}>
      {children}
      <SortIcon />
      <VisuallyHiddenText>{sortLabel}</VisuallyHiddenText>
    </UnstyledButton>
  )
})

const sortIconClassNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Icon-extended shr-relative shr-h-1 shr-w-1',
    upIcon: [
      'shr-absolute shr-left-0 shr-top-0',
      'shr-text-base',
      '[[aria-sort="none"]_&]:shr-text-disabled',
      '[[aria-sort="ascending"]_&]:shr-text-black',
      '[[aria-sort="descending"]_&]:shr-text-disabled',
    ],
    downIcon: [
      'shr-absolute shr-left-0 shr-top-0',
      'shr-text-base',
      '[[aria-sort="none"]_&]:shr-text-disabled',
      '[[aria-sort="ascending"]_&]:shr-text-disabled',
      '[[aria-sort="descending"]_&]:shr-text-black',
    ],
  },
})

const SortIcon = memo(() => {
  const classNames = useMemo(() => {
    const { wrapper, upIcon, downIcon } = sortIconClassNameGenerator()

    return {
      wrapper: wrapper(),
      upIcon: upIcon(),
      downIcon: downIcon(),
    }
  }, [])

  return (
    <span className={classNames.wrapper}>
      <FaSortUpIcon aria-hidden={true} className={classNames.upIcon} />
      <FaSortDownIcon aria-hidden={true} className={classNames.downIcon} />
    </span>
  )
})
