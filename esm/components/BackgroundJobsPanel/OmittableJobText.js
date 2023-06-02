import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../Tooltip';
export const OmittableJobText = ({ children, className }) => {
    const [needsOmitting, setNeedsOmitting] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        setNeedsOmitting(false);
    }, [children]);
    useEffect(() => {
        if (!ref.current || needsOmitting) {
            return;
        }
        const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } = ref.current;
        setNeedsOmitting(offsetWidth < scrollWidth || offsetHeight < scrollHeight);
    }, [needsOmitting, children]);
    return (React.createElement(Wrapper, { ref: ref, className: className }, needsOmitting ? React.createElement(StyledTooltip, { message: children }, children) : children));
};
const Wrapper = styled.div `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const StyledTooltip = styled(Tooltip) `
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
`;
//# sourceMappingURL=OmittableJobText.js.map