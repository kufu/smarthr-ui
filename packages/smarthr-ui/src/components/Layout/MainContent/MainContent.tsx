'use client'

import {
  type ComponentPropsWithRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
} from 'react'

import { useSectionWrapper } from '../../SectioningContent'

type AbstractProps = PropsWithChildren<{
  as?: string | ComponentType<any>
  minWidth?: string | number
  maxWidth?: string | number
}>

type Props = AbstractProps & Omit<ComponentPropsWithRef<'div'>, keyof AbstractProps>

export const MainContent = forwardRef<HTMLDivElement, Props>(
  ({ as: Component = 'div', minWidth, maxWidth, className, style, ...rest }, ref) => {
    const actualStyle = {
      ...style,
      ...(minWidth && { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }),
      ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
    }

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component
        {...rest}
        ref={ref}
        className={`smarthr-ui-Cluster-layout-MainContent ${className || ''}`}
        style={actualStyle}
      />
    )

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
