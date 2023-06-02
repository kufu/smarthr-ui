import React from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../Heading';
import { FaExclamationCircleIcon } from '../Icon';
import { Input } from '../Input';
import { StatusLabel } from '../StatusLabel';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `Fieldset` コンポーネントは非推奨です。代わりに `FormControl` を使ってください。
 */
export const FieldSet = ({ label, labelType = 'subBlockTitle', labelTagType = 'span', errorMessage, helpMessage, className = '', labelSuffix, children, ...props }) => {
    const theme = useTheme();
    const helpId = useId();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { "$width": props.width || 'auto', className: `${className} ${classNames.wrapper}`, "aria-describedby": helpMessage ? helpId : undefined },
        React.createElement(Title, { themes: theme, className: classNames.title },
            React.createElement(TitleText, { type: labelType, tag: labelTagType, className: classNames.titleText }, label),
            props.required && (React.createElement(StatusLabel, { type: "red", className: classNames.label }, "\u5FC5\u9808")),
            labelSuffix && labelSuffix),
        children ? (children) : (
        // eslint-disable-next-line smarthr/a11y-input-has-name-attribute
        React.createElement(Input, { ...props, error: !!errorMessage, className: classNames.input })),
        errorMessage &&
            (Array.isArray(errorMessage) ? errorMessage : [errorMessage]).map((message, index) => (React.createElement(Error, { themes: theme, key: index, className: classNames.error },
                React.createElement(ErrorIcon, { color: theme.color.DANGER, className: classNames.errorIcon }),
                React.createElement(ErrorText, { className: classNames.errorText }, message)))),
        helpMessage && (React.createElement(Help, { id: helpId, themes: theme, className: classNames.help }, helpMessage))));
};
const Wrapper = styled.div `
  ${({ $width }) => css `
    display: inline-block;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
  `}
`;
const Title = styled.div `
  ${({ themes: { spacingByChar } }) => css `
    display: flex;
    align-items: center;
    margin: 0 0 ${spacingByChar(0.5)};

    > *:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `}
`;
const TitleText = styled(Heading) `
  display: inline-block;
`;
const Help = styled.div `
  ${({ themes: { color, fontSize, spacingByChar } }) => css `
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${fontSize.S};
    line-height: 1;
    color: ${color.TEXT_GREY};
  `}
`;
const Error = styled.div `
  ${({ themes: { fontSize, spacingByChar } }) => css `
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${fontSize.S};
    line-height: 1;
  `}
`;
const ErrorIcon = styled(FaExclamationCircleIcon) `
  margin-right: 0.4rem;
  vertical-align: middle;
`;
const ErrorText = styled.span `
  vertical-align: middle;
`;
//# sourceMappingURL=FieldSet.js.map