import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { DropdownButton } from '../Dropdown'

export const HeaderDropdownButton = styled(DropdownButton)<{ isPrefixOnly?: boolean }>(
  ({ isPrefixOnly }) => css`
    > .smarthr-ui-DropdownButton-trigger {
      ${() => {
        const { color, spacingByChar } = useTheme()
        return css`
          border-color: transparent;
          background-color: transparent;
          padding-inline: ${spacingByChar(0.25)};
          color: ${color.TEXT_WHITE};
          font-weight: normal;

          &:last-of-type {
            /* ボタンの余白分だけ微調整 */
            margin-inline-end: ${spacingByChar(-0.25)};
          }
        `
      }}
    }

    /* アプリボタンで例外的にsuffixを取る */
    ${isPrefixOnly &&
    css`
      span + .smarthr-ui-Icon {
        display: none;
      }
    `}
  `,
)
