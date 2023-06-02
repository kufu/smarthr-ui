import React, { useCallback, useEffect, useRef } from 'react';
import { tabbable } from '../../libs/tabbable';
export const FocusTrap = ({ firstFocusTarget, children }) => {
    const ref = useRef(null);
    const dummyFocusRef = useRef(null);
    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Tab' || ref.current === null) {
            return;
        }
        const tabbables = tabbable(ref.current).filter((elm) => elm.tabIndex >= 0);
        if (tabbables.length === 0) {
            return;
        }
        const firstTabbale = tabbables[0];
        const lastTabbale = tabbables[tabbables.length - 1];
        const currentFocused = Array.from(tabbables).find((elm) => elm === e.target);
        if (e.shiftKey &&
            (currentFocused === firstTabbale || document.activeElement === dummyFocusRef.current)) {
            lastTabbale.focus();
            e.preventDefault();
        }
        else if (!e.shiftKey && currentFocused === lastTabbale) {
            firstTabbale.focus();
            e.preventDefault();
        }
    }, []);
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    useEffect(() => {
        const triggerElement = document.activeElement;
        if (firstFocusTarget?.current) {
            firstFocusTarget.current.focus();
        }
        else {
            dummyFocusRef.current?.focus();
        }
        return () => {
            // フォーカストラップ終了時にトリガにフォーカスを戻す
            if (triggerElement instanceof HTMLElement) {
                triggerElement.focus();
            }
        };
    }, [firstFocusTarget]);
    return (React.createElement("div", { ref: ref },
        React.createElement("div", { ref: dummyFocusRef, tabIndex: -1 }),
        children));
};
//# sourceMappingURL=FocusTrap.js.map