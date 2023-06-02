import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
import { FaFolderOpenIcon } from '../Icon';
import { useClassNames } from './useClassNames';
const SELECT_BUTTON_LABEL = 'ファイルを選択';
const overrideEventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
};
export const DropZone = forwardRef(({ children, onSelectFiles, accept, multiple = true, name, decorators }, ref) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const fileRef = useRef(null);
    const [filesDraggedOver, setFilesDraggedOver] = useState(false);
    useImperativeHandle(ref, () => fileRef.current);
    const selectButtonLabel = useMemo(() => decorators?.selectButtonLabel?.(SELECT_BUTTON_LABEL) || SELECT_BUTTON_LABEL, [decorators]);
    const onDrop = useCallback((e) => {
        overrideEventDefault(e);
        setFilesDraggedOver(false);
        onSelectFiles(e, e.dataTransfer.files);
    }, [setFilesDraggedOver, onSelectFiles]);
    const onDragOver = useCallback((e) => {
        overrideEventDefault(e);
        setFilesDraggedOver(true);
    }, [setFilesDraggedOver]);
    const onDragLeave = useCallback(() => {
        setFilesDraggedOver(false);
    }, [setFilesDraggedOver]);
    const onChange = useCallback((e) => {
        onSelectFiles(e, e.target.files);
    }, [onSelectFiles]);
    const onClickButton = () => {
        fileRef.current.click();
    };
    return (React.createElement(Wrapper, { theme: theme, filesDraggedOver: filesDraggedOver, onDrop: onDrop, onDragOver: onDragOver, onDragLeave: onDragLeave, className: classNames.wrapper },
        children,
        React.createElement(Button, { prefix: React.createElement(FaFolderOpenIcon, null), onClick: onClickButton }, selectButtonLabel),
        React.createElement("input", { ref: fileRef, name: name, type: "file", multiple: multiple, accept: accept, onChange: onChange })));
});
const Wrapper = styled.div `
  ${({ theme, filesDraggedOver }) => {
    const { palette, frame, spacingByChar } = theme;
    const border = filesDraggedOver
        ? `solid ${frame.border.lineWidth} ${palette.MAIN}`
        : `dashed ${frame.border.lineWidth} ${palette.BORDER}`;
    return css `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: ${spacingByChar(2.5)};
      border: ${border};
      background-color: ${palette.COLUMN};
      > input {
        display: none;
      }
    `;
}}
`;
//# sourceMappingURL=DropZone.js.map