import { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { PositionContext } from './DialogPositionProvider';
export const useOffsetHeight = () => {
    const theme = useTheme();
    const baseSpace = theme.size.space.L;
    const { top, bottom } = useContext(PositionContext);
    const titleRef = useRef(null);
    const bottomRef = useRef(null);
    const [offsetHeight, setOffsetHeight] = useState(0);
    useEffect(() => {
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
//# sourceMappingURL=dialogHelper.js.map