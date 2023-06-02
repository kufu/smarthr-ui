"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOffsetHeight = void 0;
const react_1 = require("react");
const useTheme_1 = require("../../hooks/useTheme");
const DialogPositionProvider_1 = require("./DialogPositionProvider");
const useOffsetHeight = () => {
    const theme = (0, useTheme_1.useTheme)();
    const baseSpace = theme.size.space.L;
    const { top, bottom } = (0, react_1.useContext)(DialogPositionProvider_1.PositionContext);
    const titleRef = (0, react_1.useRef)(null);
    const bottomRef = (0, react_1.useRef)(null);
    const [offsetHeight, setOffsetHeight] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const topSpace = top ? top : baseSpace;
        const bottomSpace = bottom ? bottom : baseSpace;
        // delay scheduling to get the element's height
        setTimeout(() => {
            const titleHeight = titleRef.current ? titleRef.current.offsetHeight : 0;
            const bottomHeight = bottomRef.current ? bottomRef.current.offsetHeight : 0;
            setOffsetHeight(topSpace + bottomSpace + titleHeight + bottomHeight);
        }, 0);
    }, [top, bottom, baseSpace]);
    return {
        offsetHeight,
        titleRef,
        bottomRef,
    };
};
exports.useOffsetHeight = useOffsetHeight;
//# sourceMappingURL=dialogHelper.js.map