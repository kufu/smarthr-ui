import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { useIntl } from '../../intl'
import { UnstyledButton } from '../Button'
import { FaCircleXmarkIcon } from '../Icon'

type AbstractProps = {
  onDelete?: () => void
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

type Props = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & ComponentPropsWithoutRef<'span'> & AbstractProps
>

type DecoratorKeyTypes = 'delete'

export const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-Chip',
      'shr-inline-flex shr-items-center shr-gap-x-0.25',
      'shr-border-shorthand shr-rounded-full shr-bg-white shr-leading-none shr-text-black',
      'contrast-more:shr-border-high-contrast',
    ],
    deleteButton: [
      'shr-relative shr-leading-[0] focus-visible:shr-focus-indicator--outer',
      // 2.5.8 を達成するためにクリック領域を広げる
      // c.f. https://ishadeed.com/article/clickable-area/
      'after:shr-absolute after:shr--inset-0.5 after:shr-content-[""]',
    ],
  },
  variants: {
    color: {
      grey: { wrapper: 'shr-border-grey-20' },
      blue: { wrapper: 'shr-border-main' },
      green: { wrapper: 'shr-border-green' },
      orange: { wrapper: 'shr-border-orange' },
      red: { wrapper: 'shr-border-danger' },
    },
    size: {
      s: { wrapper: 'shr-px-0.5 shr-py-0.25 shr-text-sm' },
    },
    disabled: {
      true: { wrapper: 'shr-bg-white/50 shr-text-disabled' },
    },
  },
  defaultVariants: {
    size: 's',
    color: 'grey',
  },
})

export const Chip: FC<Props> = ({
  size,
  color,
  disabled,
  className,
  children,
  decorators,
  onDelete,
  ...rest
}) => {
  const { localize } = useIntl()

  const actualClassName = useMemo(() => {
    const { wrapper, deleteButton } = classNameGenerator({ size, color, disabled, className })

    return { wrapper: wrapper(), deleteButton: deleteButton() }
  }, [size, color, disabled, className])

  const decoratorDefaultTexts = useMemo(
    () => ({
      delete: localize({
        id: 'smarthr-ui/Chip/delete',
        defaultText: '削除',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  return (
    <div {...rest} className={actualClassName.wrapper}>
      {children}

      {onDelete && (
        <UnstyledButton className={actualClassName.deleteButton} onClick={onDelete}>
          <FaCircleXmarkIcon alt={decorated.delete} />
        </UnstyledButton>
      )}
    </div>
  )
}
