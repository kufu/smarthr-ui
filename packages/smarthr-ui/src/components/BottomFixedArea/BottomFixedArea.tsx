'use client'

import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type ComponentType,
  type FC,
  type FunctionComponentElement,
  type MouseEventHandler,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { BottomPanel } from '../BottomPanel'
import { type AnchorButton, Button } from '../Button'
import { Cluster, Stack } from '../Layout'

import { validateElement } from './helper'

import type { ComponentProps as IconProps } from '../Icon'

export type ButtonType =
  | FunctionComponentElement<ComponentProps<typeof Button>>
  | FunctionComponentElement<ComponentProps<typeof AnchorButton>>

type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof Props>

type Props = {
  /** この領域の説明 */
  description?: ReactNode
  /** 表示する `Button` または `AnchorButton` （`variant="primary"` である必要がある） */
  primaryButton?: ButtonType
  /** 表示する `Button` または `AnchorButton` （`variant="secondary"` である必要がある）*/
  secondaryButton?: ButtonType
  /** 表示する tertialy link のプロパティの配列 */
  tertiaryLinks?: Array<
    ComponentPropsWithRef<'button'> & {
      text: ReactNode
      icon?: ComponentType<IconProps>
      type?: 'button' | 'reset'
      onClick?: MouseEventHandler<HTMLButtonElement>
    }
  >
  /** コンポーネントに適用する z-index 値 */
  zIndex?: number
}

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-BottomFixedArea', 'shr-text-center', '[&_ul]:shr-list-none'],
    tertiaryButton: [
      'smarthr-ui-BottomFixedArea-tertiaryLink',
      '-shr-mb-0.5 shr-font-normal shr-text-main',
    ],
  },
})

/**
 * @deprecated BottomFixedArea は非推奨です。FloatArea を使ってください。 https://smarthr.design/products/components/float-area/
 */
export const BottomFixedArea: FC<Props & ElementProps> = ({
  description,
  primaryButton,
  secondaryButton,
  tertiaryLinks,
  className,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { wrapper, tertiaryButton } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      tertiaryButton: tertiaryButton(),
    }
  }, [className])

  useEffect(() => {
    validateElement(primaryButton, secondaryButton)
  }, [primaryButton, secondaryButton])

  return (
    <BottomPanel {...props} className={classNames.wrapper}>
      <Stack>
        <Description>{description}</Description>
        <Stack gap={0.25}>
          {(secondaryButton || primaryButton) && (
            <Cluster as="ul" justify="center" gap={{ row: 0.5, column: 1 }}>
              {secondaryButton && (
                <li className="smarthr-ui-BottomFixedArea-secondaryButton">{secondaryButton}</li>
              )}
              {primaryButton && (
                <li className="smarthr-ui-BottomFixedArea-primaryButton">{primaryButton}</li>
              )}
            </Cluster>
          )}
          {tertiaryLinks && tertiaryLinks.length > 0 && (
            <Cluster as="ul" justify="center" gap={{ row: 0.5, column: 0 }}>
              {tertiaryLinks.map(({ text, icon: Icon, ...tertiaryRest }, index) => (
                <li key={index} className="smarthr-ui-BottomFixedArea-tertiaryListItem">
                  <Button
                    {...tertiaryRest}
                    variant="text"
                    prefix={Icon && <Icon />}
                    className={classNames.tertiaryButton}
                  >
                    {text}
                  </Button>
                </li>
              ))}
            </Cluster>
          )}
        </Stack>
      </Stack>
    </BottomPanel>
  )
}

const Description = memo<PropsWithChildren>(
  ({ children }) =>
    children && <p className="smarthr-ui-BottomFixedArea-description">{children}</p>,
)
