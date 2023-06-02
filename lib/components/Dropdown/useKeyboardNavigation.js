"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardNavigation = void 0;
const react_1 = require("react");
const tabbable_1 = require("../../libs/tabbable");
const Dropdown_1 = require("./Dropdown");
const dropdownHelper_1 = require("./dropdownHelper");
function useKeyboardNavigation(wrapperRef, dummyFocusRef) {
    const { triggerElementRef, rootTriggerRef, onClickCloser } = (0, react_1.useContext)(Dropdown_1.DropdownContext);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Tab') {
            if (!wrapperRef.current ||
                !triggerElementRef.current ||
                !rootTriggerRef ||
                !rootTriggerRef.current) {
                return;
            }
            const tabbablesInContent = (0, tabbable_1.tabbable)(wrapperRef.current);
            if (tabbablesInContent.length === 0) {
                return;
            }
            const triggers = (0, tabbable_1.tabbable)(triggerElementRef.current);
            const trigger = triggers[triggers.length - 1];
            const firstTabbable = tabbablesInContent[0];
            const lastTabbable = tabbablesInContent[tabbablesInContent.length - 1];
            if (e.target === trigger) {
                if (e.shiftKey) {
                    // move focus previous of the Trigger
                    return;
                }
                // focus a first tabbable element in the dropdown content
                e.preventDefault();
                firstTabbable.focus();
                return;
            }
            else if (e.shiftKey &&
                (e.target === firstTabbable || e.target === dummyFocusRef.current)) {
                // focus the Trigger
                e.preventDefault();
                trigger.focus();
            }
            else if (!e.shiftKey && e.target === lastTabbable) {
                // move focus next of the Trigger
                const rootTriggers = (0, tabbable_1.tabbable)(rootTriggerRef.current);
                const rootTrigger = rootTriggers[rootTriggers.length - 1];
                if (rootTrigger) {
                    rootTrigger.focus();
                }
            }
        }
        else if (e.key === 'Escape' || e.key === 'Esc') {
            if (triggerElementRef.current) {
                const trigger = (0, dropdownHelper_1.getFirstTabbable)(triggerElementRef);
                if (trigger && e.target === trigger) {
                    // close the dropdown when the Trigger is focused and Esc key is pressed
                    onClickCloser();
                    return;
                }
            }
            if (e.target && e.target === dummyFocusRef.current) {
                onClickCloser();
                return;
            }
            if (wrapperRef.current) {
                const tabbablesInContent = (0, tabbable_1.tabbable)(wrapperRef.current);
                tabbablesInContent.some((inner) => {
                    if (inner === e.target) {
                        // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
                        onClickCloser();
                        return true;
                    }
                    return false;
                });
            }
        }
    }, [wrapperRef, triggerElementRef, rootTriggerRef, dummyFocusRef, onClickCloser]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
}
exports.useKeyboardNavigation = useKeyboardNavigation;
//# sourceMappingURL=useKeyboardNavigation.js.map