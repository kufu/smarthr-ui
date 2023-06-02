import React, { forwardRef } from 'react';
import { ButtonInner } from './ButtonInner';
import { ButtonWrapper } from './ButtonWrapper';
import { useClassNames } from './useClassNames';
export const AnchorButton = forwardRef(({ size = 'default', square = false, prefix, suffix, wide = false, variant = 'secondary', className = '', children, ...props }, ref) => {
    const classNames = useClassNames().anchorButton;
    return (React.createElement(ButtonWrapper, { ...props, size: size, square: square, wide: wide, variant: variant, className: `${className} ${classNames.wrapper}`, isAnchor: true, anchorRef: ref },
        React.createElement(ButtonInner, { prefix: prefix, suffix: suffix }, children)));
});
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
AnchorButton.displayName = 'AnchorButton';
//# sourceMappingURL=AnchorButton.js.map