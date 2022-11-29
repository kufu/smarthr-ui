import React, { HTMLAttributes, ReactNode, VFC, useMemo } from 'react'
import styled from 'styled-components'

import { Text, TextProps } from '../Text'

import { useClassNames } from './useClassNames'

export type Props = {
  /** 表示するテキスト */
  children: ReactNode
  /** テキストのスタイル */
  type?: HeadingTypes
  /** コンポーネントの HTML タグ */
  tag?: HeadingTagTypes
  /** コンポーネントに適用するクラス名 */
  className?: string
}

export type HeadingTypes =
  | 'screenTitle'
  | 'sectionTitle'
  | 'blockTitle'
  | 'subBlockTitle'
  | 'subSubBlockTitle'

export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'legend'

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props | keyof TextProps>

export const Heading: VFC<Props & ElementProps> = ({
  tag = 'h1',
  type = 'screenTitle',
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  const textProps = useMemo<TextProps>(() => {
    switch (type) {
      case 'screenTitle':
        return {
          size: 'XL',
          weight: 'normal',
        }
      case 'sectionTitle':
        return {
          size: 'L',
          weight: 'normal',
        }
      case 'blockTitle':
        return {
          size: 'M',
          weight: 'bold',
        }
      case 'subBlockTitle':
        return {
          size: 'M',
          weight: 'bold',
          color: 'TEXT_GREY',
        }
      case 'subSubBlockTitle':
        return {
          size: 'S',
          weight: 'bold',
          color: 'TEXT_GREY',
        }
    }
  }, [type])

  return (
    <ResetText
      {...props}
      {...textProps}
      forwardedAs={tag}
      leading="TIGHT"
      className={`${type} ${className} ${classNames.wrapper}`}
    />
  )
}

const ResetText = styled(Text)`
  margin: unset;
`
