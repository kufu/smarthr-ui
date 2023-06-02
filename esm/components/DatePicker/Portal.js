import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useEnhancedEffect } from '../../hooks/useEnhancedEffect';
import { usePortal } from '../../hooks/usePortal';
import { useTheme } from '../../hooks/useTheme';
import { getPortalPosition } from './datePickerHelper';
import { useClassNames } from './useClassNames';
export const Portal = forwardRef(({ inputRect, children }, ref) => {
    const themes = useTheme();
    const { createPortal } = usePortal();
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const containerRef = useRef(null);
    useImperativeHandle(ref, () => containerRef.current);
    useEnhancedEffect(() => {
        if (!containerRef.current) {
            return;
        }
        setPosition(getPortalPosition(inputRect, containerRef.current.offsetHeight));
    }, [inputRect]);
    const classNames = useClassNames();
    return createPortal(React.createElement(Container, { ...position, themes: themes, className: classNames.calendarContainer, ref: containerRef }, children));
});
const Container = styled.div(({ top, left, themes }) => css `
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    z-index: ${themes.zIndex.OVERLAP};
    line-height: 1;
  `);
//# sourceMappingURL=Portal.js.map