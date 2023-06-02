import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { FaInfoCircleIcon } from '../Icon';
import { Cluster } from '../Layout';
import { Loader as shrLoader } from '../Loader';
import { Tooltip } from '../Tooltip';
import { ButtonInner } from './ButtonInner';
import { ButtonWrapper } from './ButtonWrapper';
import { useClassNames } from './useClassNames';
export const Button = forwardRef(({ type = 'button', size = 'default', square = false, prefix, suffix, wide = false, variant = 'secondary', disabled, disabledDetail, className = '', children, loading = false, ...props }, ref) => {
    const theme = useTheme();
    const classNames = useClassNames().button;
    const loader = React.createElement(Loader, { size: "s", type: "light", variant: variant, themes: theme });
    const actualPrefix = !loading && prefix;
    const actualSuffix = loading && !square ? loader : suffix;
    const disabledOnLoading = loading || disabled;
    const actualChildren = loading && square ? loader : children;
    const button = (React.createElement(ButtonWrapper, { ...props, type: type, size: size, square: square, wide: wide, variant: variant, className: `${className} ${classNames.wrapper}`, buttonRef: ref, disabled: disabledOnLoading, "$loading": loading },
        React.createElement(ButtonInner, { prefix: actualPrefix, suffix: actualSuffix }, actualChildren)));
    if (disabled && disabledDetail) {
        const DisabledDetailIcon = disabledDetail.icon || FaInfoCircleIcon;
        return (React.createElement(DisabledDetailWrapper, { themes: theme, className: classNames.disabledWrapper },
            button,
            React.createElement(Tooltip, { message: disabledDetail.message, triggerType: "icon", horizontal: "auto", vertical: "auto" },
                React.createElement(DisabledDetailIcon, null))));
    }
    return button;
});
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button';
const Loader = styled(shrLoader) `
  ${({ variant, themes: { color } }) => css `
    vertical-align: bottom;

    &&& {
      .s {
        width: 1em;
        height: 1em;
      }
    }

    .light {
      border-color: ${variant === 'secondary'
    ? color.TEXT_DISABLED
    : color.disableColor(color.TEXT_WHITE)};
    }
  `}
`;
const DisabledDetailWrapper = styled(Cluster).attrs({
    inline: true,
    align: 'center',
    gap: 0.25,
}) `
  ${({ themes: { color, space } }) => css `
    > .smarthr-ui-Tooltip {
      overflow-y: unset;

      .smarthr-ui-Icon {
        /* Tooltip との距離を変えずに反応範囲を広げるために negative space を使う */
        margin: ${space(-0.25)};
        padding: ${space(0.25)};

        /* global styleなどでborder-boxが適用されている場合表示崩れを起こす為、content-boxを指定する */
        box-sizing: content-box;
        color: ${color.TEXT_GREY};
      }
    }
  `}
`;
//# sourceMappingURL=Button.js.map