import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { Text } from '../Text'

import { ItemWrapper } from './client'

type ObjectTermType = {
  text: ReactNode
  styleType?: 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle'
}
type BaseProps = PropsWithChildren<{
  term: ReactNode | ObjectTermType
  fullWidth?: boolean
  maxColumns?: number
}>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

const termObjectConverter = (term: ReactNode): ObjectTermType => ({ text: term })

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DefinitionListItem shr-border-b-shorthand shr-min-w-[12em] shr-grow shr-border-dotted',
      'contrast-more:shr-border-b-high-contrast',
    ],
    term: 'smarthr-ui-DefinitionListItem-term',
    description:
      'smarthr-ui-DefinitionListItem-description shr-ms-[initial] shr-min-h-[calc(1em*theme(lineHeight.normal))] shr-pb-0.25',
  },
  variants: {
    fullWidth: {
      true: {
        wrapper: 'shr-basis-full',
      },
    },
  },
})

export const DefinitionListItem: FC<Props> = ({
  term: orgTerm,
  children,
  maxColumns,
  fullWidth,
  className,
}) => {
  const term = useObjectAttributes<ReactNode | ObjectTermType, ObjectTermType>(
    orgTerm,
    termObjectConverter,
  )

  const classNames = useMemo(() => {
    const cs = classNameGenerator()

    return {
      wrapper: cs.wrapper({ fullWidth, className }),
      term: cs.term(),
      description: cs.description(),
    }
  }, [fullWidth, className])

  return (
    <ItemWrapper maxColumns={maxColumns} fullWidth={fullWidth} className={classNames.wrapper}>
      <DefinitionTerm styleType={term.styleType} className={classNames.term}>
        {term.text}
      </DefinitionTerm>
      <Text as="dd" size="M" color="TEXT_BLACK" leading="NORMAL" className={classNames.description}>
        {children}
      </Text>
    </ItemWrapper>
  )
}

const DefinitionTerm = memo<
  PropsWithChildren<{ styleType: ObjectTermType['styleType']; className: string }>
>(({ styleType = 'subBlockTitle', className, children }) => (
  <Text as="dt" styleType={styleType} leading="TIGHT" className={className}>
    {children}
  </Text>
))
