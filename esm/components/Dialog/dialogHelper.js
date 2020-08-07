import { useContext, useEffect, useRef, useState } from 'react';
import { PositionContext } from './DialogPositionProvider';
import { useTheme } from '../../hooks/useTheme';
export var useOffsetHeight = function () {
    var theme = useTheme();
    var baseSpace = theme.size.space.L;
    var _a = useContext(PositionContext), top = _a.top, bottom = _a.bottom;
    var titleRef = useRef(null);
    var bottomRef = useRef(null);
    var _b = useState(0), offsetHeight = _b[0], setOffsetHeight = _b[1];
    useEffect(function () {
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