"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOffsetHeight = void 0;
var react_1 = require("react");
var DialogPositionProvider_1 = require("./DialogPositionProvider");
var useTheme_1 = require("../../hooks/useTheme");
exports.useOffsetHeight = function () {
    var theme = useTheme_1.useTheme();
    var baseSpace = theme.size.space.L;
    var _a = react_1.useContext(DialogPositionProvider_1.PositionContext), top = _a.top, bottom = _a.bottom;
    var titleRef = react_1.useRef(null);
    var bottomRef = react_1.useRef(null);
    var _b = react_1.useState(0), offsetHeight = _b[0], setOffsetHeight = _b[1];
    react_1.useEffect(function () {
        var topSpace = top ? top : baseSpace;
        var bottomSpace = bottom ? bottom : baseSpace;
        // delay scheduling to get the element's height
        setTimeout(function () {
            var titleHeight = titleRef.current ? titleRef.current.offsetHeight : 0;
            var bottomHeight = bottomRef.current ? bottomRef.current.offsetHeight : 0;
            setOffsetHeight(topSpace + bottomSpace + titleHeight + bottomHeight);
        }, 0);
    }, [top, bottom, baseSpace]);
    return {
        offsetHeight: offsetHeight,
        titleRef: titleRef,
        bottomRef: bottomRef,
    };
};
//# sourceMappingURL=dialogHelper.js.map