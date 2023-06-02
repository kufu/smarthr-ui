import { useEffect, useRef, useState } from 'react';
export const useReelCells = () => {
    const tableWrapperRef = useRef(null);
    const [showShadow, setShowShadow] = useState(false);
    useEffect(() => {
        const currentRef = tableWrapperRef.current;
        const handleScroll = () => {
            if (currentRef) {
                const stickyCells = currentRef.querySelectorAll('.fixedElement') || [];
                const scrollLeft = currentRef.scrollLeft;
                const maxScrollLeft = currentRef.scrollWidth - currentRef.clientWidth || 0;
                stickyCells.forEach((cell) => {
                    const shouldFix = maxScrollLeft > 0 && scrollLeft < maxScrollLeft;
                    if (shouldFix) {
                        cell.classList.add('fixed');
                        setShowShadow(scrollLeft > 0);
                    }
                    else {
                        cell.classList.remove('fixed');
                        setShowShadow(maxScrollLeft === 0 && scrollLeft === 0 ? false : true);
                    }
                });
            }
        };
        handleScroll();
        window.addEventListener('resize', handleScroll);
        currentRef?.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleScroll);
            currentRef?.removeEventListener('scroll', handleScroll);
        };
    }, [tableWrapperRef, setShowShadow]);
    return { tableWrapperRef, showShadow };
};
//# sourceMappingURL=useReelCells.js.map