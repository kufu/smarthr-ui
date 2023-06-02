import React, { useCallback, useMemo } from 'react';
import innerText from 'react-innertext';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Textarea } from '../Textarea';
import { RightFixedNoteItem } from './RightFixedNoteItem';
import { useClassNames } from './useClassNames';
const TEXT_AREA_NAME = 'admin_memo_new_text';
const SUBMIT_LABEL = '送信';
export const RightFixedNote = ({ title, items, width = 270, textareaLabel, onClickEdit, onSubmit, className = '', decorators, ...props }) => {
    const theme = useTheme();
    const submitLabel = useMemo(() => decorators?.submitLabel?.(SUBMIT_LABEL) || SUBMIT_LABEL, [decorators]);
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newText = (formData.get(TEXT_AREA_NAME) || '');
        onSubmit(e, newText);
    }, [onSubmit]);
    const textareaId = useId();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, themes: theme, "$width": width, onSubmit: handleSubmit, className: `${className} ${classNames.wrapper}` },
        React.createElement(Title, { type: "sectionTitle", themes: theme, className: classNames.title }, title),
        items &&
            items.map((item) => (React.createElement(RightFixedNoteItem, { ...item, key: item.id, onClickEdit: onClickEdit }))),
        textareaLabel && (React.createElement("label", { htmlFor: textareaId },
            React.createElement(TextareaLabel, { tag: "span", type: "subBlockTitle", themes: theme }, textareaLabel))),
        React.createElement(StyledTextarea, { id: textareaId, name: TEXT_AREA_NAME, themes: theme, "aria-label": innerText(textareaLabel || title), className: classNames.textarea }),
        React.createElement(SubmitButton, { type: "submit", className: classNames.submitButton }, submitLabel)));
};
const Wrapper = styled.form `
  ${({ themes, $width }) => {
    const { spacingByChar, color, shadow } = themes;
    return css `
      width: ${$width}px;
      padding: ${spacingByChar(1)};
      background-color: ${color.COLUMN};
      box-shadow: ${shadow.LAYER2};
      overflow: hidden scroll;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
    `;
}}
`;
const Title = styled(Heading) `
  ${({ themes: { spacingByChar } }) => {
    return css `
      display: block;
      margin-bottom: ${spacingByChar(1)};
    `;
}}
`;
const TextareaLabel = styled(Heading) `
  display: inline-block;
  margin-bottom: ${({ themes }) => themes.spacingByChar(1)};
`;
const StyledTextarea = styled(Textarea) `
  ${({ themes: { spacingByChar } }) => {
    return css `
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      box-sizing: border-box;
      margin-bottom: ${spacingByChar(1)};
    `;
}}
`;
const SubmitButton = styled(Button) `
  display: block;
  float: right;
`;
//# sourceMappingURL=RightFixedNote.js.map