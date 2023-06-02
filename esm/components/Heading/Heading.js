import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Text } from '../Text';
import { useClassNames } from './useClassNames';
export const Heading = ({ tag = 'h1', type = 'screenTitle', className = '', ...props }) => {
    const classNames = useClassNames();
    const textProps = useMemo(() => {
        switch (type) {
            case 'screenTitle':
                return {
                    size: 'XL',
                    weight: 'normal',
                };
            case 'sectionTitle':
                return {
                    size: 'L',
                    weight: 'normal',
                };
            case 'blockTitle':
                return {
                    size: 'M',
                    weight: 'bold',
                };
            case 'subBlockTitle':
                return {
                    size: 'M',
                    weight: 'bold',
                    color: 'TEXT_GREY',
                };
            case 'subSubBlockTitle':
                return {
                    size: 'S',
                    weight: 'bold',
                    color: 'TEXT_GREY',
                };
        }
    }, [type]);
    return (React.createElement(ResetText, { ...props, ...textProps, forwardedAs: tag, leading: "TIGHT", className: `${type} ${className} ${classNames.wrapper}` }));
};
const ResetText = styled(Text) `
  margin: unset;
`;
//# sourceMappingURL=Heading.js.map