import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { DropdownButton } from '../Dropdown'

export const HeaderDropdownButton = styled(DropdownButton)(() => {
  const { color, space } = useTheme()
  return css`
    > .smarthr-ui-DropdownButton-trigger {
      border-color: transparent;
      background-color: transparent;
      padding-inline: ${space(0.25)};
      color: ${color.TEXT_WHITE};
      font-weight: normal;

      &:last-of-type {
        /* ボタンの余白分だけ微調整 */
        margin-inline-end: ${space(-0.25)};
      }
    }
  `
})
