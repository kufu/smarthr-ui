import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { DropdownMenuButton } from '../Dropdown';
export const HeaderDropdownMenuButton = styled(DropdownMenuButton)(() => {
    const { color, space } = useTheme();
    return css `
    > .smarthr-ui-DropdownMenuButton-trigger {
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
  `;
});
//# sourceMappingURL=HeaderDropdownMenuButton.js.map