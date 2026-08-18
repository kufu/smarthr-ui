import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  createContext,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

type ListDivider = 'full' | 'content' | false

type AbstractProps = {
  divider?: ListDivider
}

type Props = PropsWithChildren<
  AbstractProps &
    VariantProps<typeof classNameGenerator> &
    Omit<ComponentPropsWithoutRef<'ul'>, keyof AbstractProps>
>

export const ListDividerContext = createContext<ListDivider>('full')

const classNameGenerator = tv({
  base: ['smarthr-ui-List', 'shr-flex shr-flex-col'],
})

export const List: FC<Props> = ({ className, divider = 'full', children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  return (
    <ListDividerContext.Provider value={divider}>
      <ul {...rest} className={actualClassName}>
        {children}
      </ul>
    </ListDividerContext.Provider>
  )
}
