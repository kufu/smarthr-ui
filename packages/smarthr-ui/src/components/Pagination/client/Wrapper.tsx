'use client'

import {
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
  useMemo,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useLocalize } from '../../../intl'
import { Nav } from '../../SectioningContent'

import type { ClickableProps } from '../type'

type BaseProps = PropsWithChildren<ClickableProps>
type Props = BaseProps & Omit<HTMLAttributes<HTMLElement>, keyof BaseProps>

const BUTTON_REGEX = /^button$/i
const ANCHOR_REGEX = /^a/i

const getTargetDelegateElement = (e: MouseEvent<HTMLElement>, regex: RegExp) =>
  (e.nativeEvent.composedPath() as HTMLElement[]).find((elm) => regex.test(elm.tagName))

export const Wrapper: FC<Props> = ({ onDelegateClick, hrefTemplate, children, ...rest }) => {
  const latest = useLatest({ onDelegateClick, hrefTemplate })

  const functions = useMemo(
    () => ({
      handleDelegateClick: (e: MouseEvent<HTMLElement>) => {
        if (!latest.onDelegateClick) {
          return
        }

        if (latest.hrefTemplate) {
          const anchor = getTargetDelegateElement(e, ANCHOR_REGEX)

          if (!anchor) {
            return
          }

          const href = (anchor as HTMLAnchorElement).href

          if (href) {
            ;(latest.onDelegateClick as (href: string, e: MouseEvent<HTMLElement>) => void)(href, e)
          }
        } else {
          const button = getTargetDelegateElement(e, BUTTON_REGEX)

          if (button) {
            ;(latest.onDelegateClick as (pageNumber: number, e: MouseEvent<HTMLElement>) => void)(
              parseInt((button as HTMLButtonElement).value, 10),
              e,
            )
          }
        }
      },
    }),
    [latest],
  )

  const { navigationLabel } = useLocalize({
    navigationLabel: {
      id: 'smarthr-ui/Pagination/navigationLabel',
      defaultText: 'ページネーション',
    },
  })

  return (
    <Nav {...rest} aria-label={navigationLabel} onClick={functions.handleDelegateClick}>
      {children}
    </Nav>
  )
}
