import {
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  forwardRef,
  memo,
  useId,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { FaCheckIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Text } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      // Switch 本体
      'shr-border-shorthand shr-relative shr-inline-flex shr-h-fit shr-w-[calc(theme(fontSize.base)*2)] shr-items-center shr-rounded-full shr-bg-white',
      // 理想的には padding: 2px; だが、box-shadow を outline で使用しているため、border と padding で2pxの疑似余白を作っている。
      'shr-p-px',
      // :focus-visible-within の代替, なぜかhasが機能しないので以下の書き方で代用している
      'has-[:focus-visible]:shr-focus-indicator [&:has(:focus-visible)]:shr-focus-indicator',
      'has-[:checked]:shr-border-[theme(colors.main)] has-[:checked]:shr-bg-main',
      'has-[:disabled]:shr-border-[theme(borderColor.default)] has-[:disabled]:shr-bg-border',
      'forced-colors:has-[:disabled]:shr-border-[GrayText]',
      'supports-[not_selector(:has(+_*))]:shr-border-[revert] supports-[not_selector(:has(+_*))]:shr-bg-[revert]',

      // Switch ツマミ
      'before:shr-box-border before:shr-inline-block before:shr-size-[theme(fontSize.base)] before:shr-scale-[calc(2/3)] before:shr-rounded-full before:shr-border before:shr-border-solid before:shr-border-[theme(textColor.grey)] before:shr-bg-[theme(textColor.grey)] before:shr-transition-[transform,margin] before:shr-duration-150 before:shr-ease-out before:shr-content-[""]',
      'has-[input:disabled:not(:checked)]:before:shr-border-[theme(textColor.disabled)] has-[input:disabled:not(:checked)]:before:shr-bg-[theme(textColor.disabled)]',
      'has-[:checked]:before:shr-border-shorthand has-[:checked]:before:shr-ms-[theme(fontSize.base)] has-[:checked]:before:shr-scale-100 has-[:checked]:before:shr-bg-white',
      'forced-colors:has-[input:not(:disabled)]:before:shr-bg-[ButtonBorder]',
      'forced-colors:has-[:disabled:not(:checked)]:before:shr-border-solid forced-colors:has-[:disabled:not(:checked)]:before:shr-border-[GrayText]',
      'forced-colors:has-[:disabled:checked]:before:shr-border-[GrayText]',
      'supports-[not_selector(:has(+_*))]:before:hidden',
    ],
    input: [
      'shr-absolute shr-inset-0 shr-m-0 shr-h-full shr-w-full shr-cursor-pointer shr-appearance-none shr-rounded-full shr-opacity-0',
      'disabled:shr-cursor-[revert]',
      'supports-[not_selector(:has(+_*))]:shr-static supports-[not_selector(:has(+_*))]:shr-appearance-auto supports-[not_selector(:has(+_*))]:shr-opacity-100 supports-[not_selector(:has(+_*))]:shr-outline-[revert]',
    ],
    iconWrapper: [
      'smarthr-ui-Switch-iconWrapper',
      'shr-pointer-events-none shr-absolute shr-hidden shr-size-[theme(fontSize.base)] shr-items-center shr-justify-center',
      '[:checked~&]:shr-flex',
    ],
    icon: [
      'shr-fill-white',
      'forced-colors:shr-fill-[ButtonText]',
      'forced-colors:[:disabled~.smarthr-ui-Switch-iconWrapper_&]:shr-fill-[GrayText]',
    ],
  },
})

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children: ReactNode
  /** ラベルを視覚的に隠すかどうか */
  dangerouslyLabelHidden?: boolean
}

export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ children, dangerouslyLabelHidden, className, id, ...props }, ref) => {
    const defaultId = useId()
    const inputId = id || defaultId

    const classNames = useMemo(() => {
      const { wrapper, input, icon, iconWrapper } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        input: input(),
        icon: icon(),
        iconWrapper: iconWrapper(),
      }
    }, [className])

    return (
      <Cluster align="center">
        <MemoizedLabel htmlFor={inputId} dangerouslyLabelHidden={dangerouslyLabelHidden}>
          {children}
        </MemoizedLabel>
        <span className={classNames.wrapper}>
          <input
            {...props}
            type="checkbox"
            role="switch"
            id={inputId}
            className={classNames.input}
            ref={ref}
          />
          <MemoizedSuffixIcon className={classNames.iconWrapper} iconClassName={classNames.icon} />
        </span>
      </Cluster>
    )
  },
)

const MemoizedLabel = memo<
  Pick<Props, 'dangerouslyLabelHidden'> & PropsWithChildren<{ htmlFor: string }>
>(({ dangerouslyLabelHidden, htmlFor, children }) => {
  const Component = dangerouslyLabelHidden ? VisuallyHiddenText : Text

  return (
    <Component as="label" htmlFor={htmlFor}>
      {children}
    </Component>
  )
})

const MemoizedSuffixIcon = memo<{ className: string; iconClassName: string }>(
  ({ className, iconClassName }) => (
    <span className={className}>
      <FaCheckIcon className={iconClassName} size="XXS" />
    </span>
  ),
)
