import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Tooltip } from '../Tooltip';
import { useClassNames } from './useClassNames';
export const LineClamp = ({ maxLines = 3, withTooltip = false, children, className = '', ...props }) => {
    const classNames = useClassNames();
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const ref = useRef(null);
    const isMultiLineOverflow = () => {
        const el = ref.current;
        return el ? el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight : false;
    };
    useEffect(() => {
        setTooltipVisible(withTooltip && isMultiLineOverflow());
    }, [maxLines, withTooltip, children]);
    if (maxLines < 1) {
        throw new Error('"maxLines" cannot be less than 0.');
    }
    const LineClampPart = () => (React.createElement(Wrapper, { ...props, ref: ref, maxLines: maxLines, className: `${className} ${classNames.wrapper}` }, children));
    return isTooltipVisible ? (React.createElement(Tooltip, { message: children, multiLine: true, vertical: "auto" },
        React.createElement(LineClampPart, null))) : (React.createElement(LineClampPart, null));
};
const Wrapper = styled.span `
  word-break: break-word;
  ${({ maxLines }) => maxLines === 1
    ? css `
          display: inline-block;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        `
    : css `
          /* stylelint-disable */
          display: box;
          display: -webkit-box;
          display: -moz-box;
          box-orient: vertical;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          line-clamp: ${maxLines};
          -webkit-line-clamp: ${maxLines};
          /* stylelint-enable */
          overflow-y: hidden;

          /* inline-block に overflow: visible 以外を指定すると、vertical-align が bottom margin edge に揃ってしまう
           * https://ja.stackoverflow.com/questions/2603/ */
          vertical-align: bottom;
        `}
`;
//# sourceMappingURL=LineClamp.js.map