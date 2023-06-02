"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFocusControl = void 0;
const react_1 = require("react");
function useFocusControl(selectedItemLength) {
    const deletionButtonRefs = (0, react_1.useMemo)(() => Array.from({ length: selectedItemLength }).map(() => (0, react_1.createRef)()), [selectedItemLength]);
    const inputRef = (0, react_1.useRef)(null);
    const [focusedIndex, setFocusedIndex] = (0, react_1.useState)(null);
    const focusPrevDeletionButton = (0, react_1.useCallback)(() => {
        if (selectedItemLength === 0) {
            return;
        }
        if (focusedIndex === null) {
            if (inputRef.current?.selectionStart === 0) {
                const nextIndex = deletionButtonRefs.length - 1;
                deletionButtonRefs[nextIndex].current?.focus();
                setFocusedIndex(nextIndex);
            }
        }
        else {
            const nextIndex = Math.max(focusedIndex - 1, 0);
            deletionButtonRefs[nextIndex].current?.focus();
            setFocusedIndex(nextIndex);
        }
    }, [deletionButtonRefs, focusedIndex, selectedItemLength]);
    const focusNextDeletionButton = (0, react_1.useCallback)(() => {
        if (deletionButtonRefs.length === 0) {
            return;
        }
        if (focusedIndex !== null) {
            const nextIndex = focusedIndex + 1;
            if (nextIndex < deletionButtonRefs.length) {
                deletionButtonRefs[nextIndex].current?.focus();
                setFocusedIndex(nextIndex);
            }
            else {
                setFocusedIndex(null);
                // キー入力が input に影響しないようにフォーカスタイミングを遅らせる
                setTimeout(() => {
                    inputRef.current?.focus();
                });
            }
        }
    }, [deletionButtonRefs, focusedIndex]);
    const resetDeletionButtonFocus = (0, react_1.useCallback)(() => {
        setFocusedIndex(null);
    }, []);
    return {
        deletionButtonRefs,
        inputRef,
        focusPrevDeletionButton,
        focusNextDeletionButton,
        resetDeletionButtonFocus,
    };
}
exports.useFocusControl = useFocusControl;
//# sourceMappingURL=useFocusControl.js.map