'use client'

import {
  type ComponentPropsWithRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

import type { Gap } from '../../../types'

type AbstractProps = PropsWithChildren<{
  /** コンテンツの最小高さ */
  minHeight?: number | string
  /** コンテンツの最大幅 */
  maxWidth?: number | string
  /** 境界とコンテンツの間の余白 */
  padding?: Gap
  /** 天地中央揃えも有効化するかどうか */
  verticalCentering?: boolean
  as?: string | ComponentType<any>
}>
type Props = AbstractProps & Omit<ComponentPropsWithRef<'div'>, keyof AbstractProps>

export const centerClassNameGenerator = tv({
  base: 'shr-mx-auto shr-box-content shr-flex shr-flex-col shr-items-center',
  variants: {
    padding: {
      0: 'shr-p-0',
      0.25: 'shr-p-0.25',
      0.5: 'shr-p-0.5',
      0.75: 'shr-p-0.75',
      1: 'shr-p-1',
      1.25: 'shr-p-1.25',
      1.5: 'shr-p-1.5',
      2: 'shr-p-2',
      2.5: 'shr-p-2.5',
      3: 'shr-p-3',
      3.5: 'shr-p-3.5',
      4: 'shr-p-4',
      8: 'shr-p-8',
      X3S: 'shr-p-0.25',
      XXS: 'shr-p-0.5',
      XS: 'shr-p-1',
      S: 'shr-p-1.5',
      M: 'shr-p-2',
      L: 'shr-p-2.5',
      XL: 'shr-p-3',
      XXL: 'shr-p-3.5',
      X3L: 'shr-p-4',
    } as { [key in Gap]: string },
    verticalCentering: {
      true: 'shr-justify-center',
    },
  },
})

export const Center = forwardRef<HTMLDivElement, Props>(
  (
    { minHeight, maxWidth, padding, verticalCentering, as: Component = 'div', className, ...rest },
    ref,
  ) => {
    const style = useMemo(
      () => ({
        minHeight: minHeight ?? undefined,
        maxWidth: maxWidth ?? undefined,
      }),
      [minHeight, maxWidth],
    )
    const actualClassName = useMemo(
      () => centerClassNameGenerator({ padding, verticalCentering, className }),
      [padding, verticalCentering, className],
    )

    const Wrapper = useSectionWrapper(Component)
    const body = <Component {...rest} ref={ref} className={actualClassName} style={style} />

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
