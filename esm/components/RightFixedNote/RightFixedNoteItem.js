import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { Button } from '../Button';
import { FaPenIcon } from '../Icon';
import { useClassNames } from './useClassNames';
export const RightFixedNoteItem = ({ id, text, date, author, onClickEdit, editLabel = '編集', className = '', }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { themes: theme, className: `${className} ${classNames.item}` },
        React.createElement(TextBase, { themes: theme },
            React.createElement(EditButton, { size: "s", onClick: (e) => onClickEdit(e, id), square: true, "aria-label": editLabel, className: classNames.itemEditButton },
                React.createElement(FaPenIcon, null)),
            React.createElement(Text, { themes: theme, className: classNames.itemText }, text)),
        date && (React.createElement(Info, { themes: theme, className: classNames.itemDate }, date)),
        author && (React.createElement(Info, { themes: theme, className: classNames.itemAuthor }, author))));
};
const Wrapper = styled.div `
  ${({ themes: { spacingByChar } }) => {
    return css `
      margin-bottom: ${spacingByChar(1.5)};
    `;
}}
`;
const TextBase = styled(Base) `
  ${({ themes: { spacingByChar } }) => {
    return css `
      padding: ${spacingByChar(0.5)};
      margin-bottom: ${spacingByChar(0.5)};
      overflow: hidden;
    `;
}}
`;
const Text = styled.p `
  ${({ themes: { fontSize } }) => {
    return css `
      display: block;
      padding: 0;
      margin: 0;
      font-size: ${fontSize.M};
      line-height: 1.5;
    `;
}}
`;
const EditButton = styled(Button) `
  float: right;
`;
const Info = styled.div `
  ${({ themes: { fontSize, color } }) => {
    return css `
      color: ${color.TEXT_GREY};
      font-size: ${fontSize.S};
      text-align: right;
    `;
}}
`;
//# sourceMappingURL=RightFixedNoteItem.js.map