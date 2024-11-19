'use client'

import React, { forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

import type { Gap } from '../../../types'
import type { ComponentPropsWithRef, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  /** コンテンツの最小高さ */
  minHeight?: number | string
  /** コンテンツの最大幅 */
  maxWidth?: number | string
  /** 境界とコンテンツの間の余白 */
  padding?: Gap
  /** 天地中央揃えも有効化するかどうか */
  verticalCentering?: boolean
  as?: string | React.ComponentType<any>
}>
type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof Props>

export const center = tv({
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

export const Center = forwardRef<HTMLDivElement, Props & ElementProps>(
  (
    { minHeight, maxWidth, padding, verticalCentering, as: Component = 'div', className, ...props },
    ref,
  ) => {
    const styleProps = useMemo(
      () => ({
        className: center({ padding, verticalCentering, className }),
        style: {
          minHeight: minHeight ?? undefined,
          maxWidth: maxWidth ?? undefined,
        },
      }),
      [padding, verticalCentering, className, minHeight, maxWidth],
    )

    const Wrapper = useSectionWrapper(Component)

    return (
      <Wrapper>
        <Component {...styleProps} {...props} ref={ref} />
      </Wrapper>
    )
  },
)
