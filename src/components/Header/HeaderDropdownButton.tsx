import styled, { css } from 'styled-components'

import { DropdownButton } from '../Dropdown'

export const HeaderDropdownButton = styled(DropdownButton)`
  > .smarthr-ui-DropdownButton-trigger {
    ${({ theme: { color, spacingByChar } }) => css`
      border-color: transparent;
      background-color: transparent;
      padding-inline: ${spacingByChar(0.25)};
      color: ${color.TEXT_WHITE};
      font-weight: normal;

      &:last-of-type {
        /* ボタンの余白分だけ微調整 */
        margin-inline-end: ${spacingByChar(-0.25)};
      }
    `}
  }
`
