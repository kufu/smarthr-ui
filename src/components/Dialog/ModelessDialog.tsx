import React, { MouseEvent, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import Draggable from 'react-draggable'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useHandleEscape } from '../../hooks/useHandleEscape'
import { BaseElementProps, DialogBase } from '../Base'
import { SecondaryButton } from '../Button'
import { FaTimesIcon } from '../Icon'
import { DialogTransition } from './DialogTransition'
import { useTriggerFocusControl } from './FocusTrap'

type Props = {
  header?: ReactNode
  children: ReactNode
  isOpen: boolean
  onClickClose?: (e: MouseEvent<HTMLButtonElement>) => void
  onPressEscape?: () => void
  top?: string
  left?: string
  right?: string
  bottom?: string
}

export const ModelessDialog: React.VFC<Props & BaseElementProps> = ({
  header,
  children,
  isOpen = false,
  onClickClose,
  onPressEscape,
  top,
  left,
  right,
  bottom,
  className = '',
  ...props
}) => {
  const portalParent = useRef(document.createElement('div')).current
  const wrapperRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()

  useEffect(() => {
    document.body.appendChild(portalParent)
    return () => {
      document.body.removeChild(portalParent)
    }
  }, [portalParent])

  useHandleEscape(
    useCallback(() => {
      if (isOpen) {
        onPressEscape && onPressEscape()
      }
    }, [isOpen, onPressEscape]),
  )

  const { moveFocusFromTrigger, returnFocusToTrigger } = useTriggerFocusControl(wrapperRef)
  useEffect(() => {
    if (isOpen) {
      moveFocusFromTrigger()
    } else {
      returnFocusToTrigger()
    }
  }, [isOpen, moveFocusFromTrigger, returnFocusToTrigger])

  const posStyles = useMemo(() => {
    const isXCenter = left === undefined && right === undefined
    const isYCenter = top === undefined && bottom === undefined
    return {
      top: isYCenter ? '50%' : top,
      left: isXCenter ? '50%' : left,
      right,
      bottom,
      transform: `translate(${isXCenter ? '-50%' : 0}, ${isYCenter ? '-50%' : 0}) `,
    }
  }, [bottom, left, right, top])

  return createPortal(
    <DialogTransition isOpen={isOpen}>
      <Fixed className={className} style={posStyles} ref={wrapperRef} themes={theme} {...props}>
        <Draggable handle=".handle">
          <DialogBase radius="m">
            <div tabIndex={-1}>{/* dummy element for focus management. */}</div>
            <Header themes={theme} className="handle">
              {header}
              <CloseButtonLayout themes={theme}>
                <SecondaryButton type="button" size="s" square onClick={onClickClose}>
                  <FaTimesIcon size={13} visuallyHiddenText="閉じる" />
                </SecondaryButton>
              </CloseButtonLayout>
            </Header>
            {children}
          </DialogBase>
        </Draggable>
      </Fixed>
    </DialogTransition>,
    portalParent,
  )
}

const Fixed = styled.div<{ themes: Theme }>`
  ${({ themes: { zIndex } }) => css`
    position: fixed;
    z-index: ${zIndex.OVERLAP};
  `}
`
const Header = styled.div<{ themes: Theme }>`
  ${({ themes: { border } }) => css`
    display: flex;
    align-items: center;
    border-bottom: ${border.shorthand};
    cursor: move;
    user-select: none;
  `}
`
const CloseButtonLayout = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    flex-shrink: 0;
    margin-left: auto;
    padding: ${spacingByChar(1)};
  `}
`
