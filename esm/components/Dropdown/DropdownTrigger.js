import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { tabbable } from '../../libs/tabbable';
import { includeDisabledTrigger } from '../../libs/util';
import { DropdownContext } from './Dropdown';
import { useClassNames } from './useClassNames';
export const DropdownTrigger = ({ children, className = '' }) => {
    const { active, onClickTrigger, contentId, triggerElementRef } = useContext(DropdownContext);
    const classNames = useClassNames();
    useEffect(() => {
        if (!triggerElementRef.current) {
            return;
        }
        // apply ARIA to all focusable elements in trigger
        const triggers = tabbable(triggerElementRef.current, { shouldIgnoreVisibility: true });
        triggers.forEach((trigger) => {
            trigger.setAttribute('aria-expanded', String(active));
            trigger.setAttribute('aria-controls', contentId);
        });
    }, [triggerElementRef, active, contentId]);
    return (React.createElement(Wrapper, { ref: triggerElementRef, onClick: (e) => {
            // 引き金となる要素が disabled な場合は発火させない
            if (includeDisabledTrigger(children)) {
                return;
            }
            const rect = e.currentTarget.getBoundingClientRect();
            onClickTrigger({
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
            });
        }, className: `${className} ${classNames.wrapper}` }, React.Children.map(children, (child) => {
        const props = child.props ? child.props : {};
        const { className: classNameProps = '' } = props;
        switch (typeof child) {
            case 'string':
                return child;
            case 'object':
                return React.cloneElement(child, {
                    className: `${active ? 'active' : ''} ${classNameProps}`,
                });
            default:
                return null;
        }
    })));
};
const Wrapper = styled.div `
  display: inline-block;
`;
//# sourceMappingURL=DropdownTrigger.js.map