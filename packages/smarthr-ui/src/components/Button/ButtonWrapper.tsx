import {
  type FilteredAnchorProps,
  type FilteredButtonProps,
  type Props,
  useButtonWrapper,
} from './useButtonWrapper'

import type { FC, MouseEvent } from 'react'

const EVENT_CANCELLER = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const ButtonWrapper: FC<Props> = (props: Props) => {
  const { classNames, children, filteredProps } = useButtonWrapper(props)

  if (props.isAnchor) {
    const { anchorRef, elementAs, ...rest } = filteredProps as FilteredAnchorProps
    const Component = elementAs || 'a'

    return (
      <Component {...rest} ref={anchorRef} className={classNames.wrapper}>
        {children}
      </Component>
    )
  }

  const { buttonRef, disabled, $loading, onClick, ...rest } = filteredProps as FilteredButtonProps
  const disabledOnLoading = $loading || disabled

  return (
    // eslint-disable-next-line smarthr/best-practice-for-button-element
    <button
      {...rest}
      ref={buttonRef}
      className={classNames.wrapper}
      aria-disabled={disabledOnLoading}
      onClick={disabledOnLoading ? EVENT_CANCELLER : onClick}
    >
      {children}
    </button>
  )
}
