"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActiveOption = void 0;
const react_1 = require("react");
function useActiveOption({ options }) {
    const [activeOption, setActiveOption] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // props の変更によって activeOption の状態が変わりうるので、実態を反映する
        setActiveOption((current) => {
            if (current === null) {
                return null;
            }
            return options.find((option) => current.id === option.id) ?? null;
        });
    }, [options]);
    const moveActiveOptionIndex = (0, react_1.useCallback)((currentActive, delta) => {
        if (options.every((option) => option.item.disabled)) {
            return;
        }
        const currentActiveIndex = currentActive === null ? -1 : options.findIndex((option) => option.id === currentActive.id);
        const nextIndex = (() => {
            if (currentActiveIndex === -1) {
                if (delta === 1) {
                    return 0;
                }
                else {
                    return options.length - 1;
                }
            }
            return (currentActiveIndex + delta + options.length) % options.length;
        })();
        const nextActive = options[nextIndex];
        if (nextActive) {
            if (nextActive.item.disabled) {
                // skip disabled item
                moveActiveOptionIndex(nextActive, delta);
            }
            else {
                setActiveOption(nextActive);
            }
        }
    }, [options]);
    const moveActivePositionDown = (0, react_1.useCallback)(() => {
        moveActiveOptionIndex(activeOption, 1);
    }, [activeOption, moveActiveOptionIndex]);
    const moveActivePositionUp = (0, react_1.useCallback)(() => {
        moveActiveOptionIndex(activeOption, -1);
    }, [activeOption, moveActiveOptionIndex]);
    return {
        activeOption,
        setActiveOption,
        moveActivePositionDown,
        moveActivePositionUp,
    };
}
exports.useActiveOption = useActiveOption;
//# sourceMappingURL=useActiveOption.js.map