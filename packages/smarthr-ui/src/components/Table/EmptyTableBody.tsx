'use client'

import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Td } from './Td'
import { useTableHeadCellCount } from './useTableHeadCellCount'

import type { Gap } from '../../types'

type Padding = Gap | { vertical?: Gap; horizontal?: Gap }

type Props = PropsWithChildren<{
  /** 境界とコンテンツの間の余白 */
  padding?: Padding
}>
type ElementProps = Omit<ComponentPropsWithRef<'tbody'>, keyof Props>

const tdClassNameGenerator = tv({
  base: 'shr-text-center',
  variants: {
    vertical: {
      0: 'shr-py-0',
      0.25: 'shr-py-0.25',
      0.5: 'shr-py-0.5',
      0.75: 'shr-py-0.75',
      1: 'shr-py-1',
      1.25: 'shr-py-1.25',
      1.5: 'shr-py-1.5',
      2: 'shr-py-2',
      2.5: 'shr-py-2.5',
      3: 'shr-py-3',
      3.5: 'shr-py-3.5',
      4: 'shr-py-4',
      8: 'shr-py-8',
      X3S: 'shr-py-0.25',
      XXS: 'shr-py-0.5',
      XS: 'shr-py-1',
      S: 'shr-py-1.5',
      M: 'shr-py-2',
      L: 'shr-py-2.5',
      XL: 'shr-py-3',
      XXL: 'shr-py-3.5',
      X3L: 'shr-py-4',
    } as { [key in Gap]: string },
    horizontal: {
      0: 'shr-px-0',
      0.25: 'shr-px-0.25',
      0.5: 'shr-px-0.5',
      0.75: 'shr-px-0.75',
      1: 'shr-px-1',
      1.25: 'shr-px-1.25',
      1.5: 'shr-px-1.5',
      2: 'shr-px-2',
      2.5: 'shr-px-2.5',
      3: 'shr-px-3',
      3.5: 'shr-px-3.5',
      4: 'shr-px-4',
      8: 'shr-px-8',
      X3S: 'shr-px-0.25',
      XXS: 'shr-px-0.5',
      XS: 'shr-px-1',
      S: 'shr-px-1.5',
      M: 'shr-px-2',
      L: 'shr-px-2.5',
      XL: 'shr-px-3',
      XXL: 'shr-px-3.5',
      X3L: 'shr-px-4',
    } as { [key in Gap]: string },
  },
  defaultVariants: {
    vertical: 4,
    horizontal: 4,
  },
})

export const EmptyTableBody: FC<Props & ElementProps> = ({ children, padding, ...props }) => {
  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableSectionElement>()

  const tdClassName = useMemo(() => {
    const actualPadding =
      padding instanceof Object ? padding : { vertical: padding, horizontal: padding }

    return tdClassNameGenerator(actualPadding)
  }, [padding])

  return (
    <tbody {...props} ref={countHeadCellRef}>
      <tr>
        <Td colSpan={count} className={tdClassName}>
          {children}
        </Td>
      </tr>
    </tbody>
  )
}
