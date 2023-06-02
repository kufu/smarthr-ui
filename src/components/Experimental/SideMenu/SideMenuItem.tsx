import React, { AnchorHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'

import { useClassNames } from './useClassNames'

type Props = PropsWithChildren<{
  /** 現在地かどうか */
  current?: boolean
}>
type ElementProps = Omit<HTMLAttributes<HTMLLIElement>, keyof Props>
type InnerLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof Props & keyof ElementProps
>

export const SideMenuItem: React.FC<Props & ElementProps & InnerLinkProps> = ({
  href,
  children,
  current,
  className,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Item
      {...props}
      current={current}
      className={`${className || ''} ${classNames.item}`}
      themes={theme}
    >
      <a href={href} aria-current={current && 'page'}>
        {children}
      </a>
    </Item>
  )
}

const Item = styled.li<{ current: Props['current']; themes: Theme }>`
  ${({ current, themes: { color, radius, shadow, space } }) => css`
    position: relative;
    padding-inline-start: ${space(0.75)};

    ${current &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        display: block;
        width: 3px;
        background-color: ${color.MAIN};
      }
    `}

    a {
      /* 親要素ではなくリンクにスタイリングするため block でいっぱいに広げている */
      display: block;
      border-radius: ${radius.m};
      padding: ${space(0.75)} ${space(1)};
      text-decoration: unset;

      &[aria-current='page'] {
        background-color: ${color.GREY_9};
        font-weight: bold;
      }

      &:hover {
        background-color: ${color.hoverColor(color.GREY_9)};
      }

      &:focus-visible {
        /* フォーカスリングを前に出したいので、スタッキングコンテキストを発生させている */
        position: relative;
        z-index: 1;
        ${shadow.focusIndicatorStyles}
      }
    }
  `}
`
