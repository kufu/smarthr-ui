import React from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useSpacing } from '../../hooks/useSpacing';
import { useTheme } from '../../hooks/useTheme';
import { MultiComboBox, SingleComboBox } from '../ComboBox';
import { DatePicker } from '../DatePicker';
import { DropZone } from '../DropZone';
import { Heading } from '../Heading';
import { FaExclamationCircleIcon } from '../Icon';
import { CurrencyInput, Input } from '../Input';
import { InputFile } from '../InputFile';
import { Cluster, Stack } from '../Layout';
import { Select } from '../Select';
import { StatusLabel } from '../StatusLabel';
import { Text } from '../Text';
import { Textarea } from '../Textarea';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `FormGroup` コンポーネントは非推奨です。代わりに `FormControl` や `Fieldset` を使ってください。
 */
export const FormGroup = ({ title, titleType = 'blockTitle', htmlFor, labelId, innerMargin, statusLabelProps = [], helpMessage, exampleMessage, errorMessages, supplementaryMessage, disabled, as = 'div', className = '', children, ...props }) => {
    const disabledClass = disabled ? 'disabled' : '';
    const managedHtmlFor = useId(htmlFor);
    const managedLabelId = useId(labelId);
    const isRoleGroup = as === 'fieldset';
    const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps];
    const theme = useTheme();
    const classNames = useClassNames();
    const describedbyIds = `${managedHtmlFor}_helpMessage ${managedHtmlFor}_exampleMessage ${managedHtmlFor}_supplementaryMessage ${managedHtmlFor}_errorMessage`;
    return (React.createElement(Wrapper, { ...props, disabled: disabled, "aria-labelledby": isRoleGroup ? managedLabelId : undefined, "aria-describedby": isRoleGroup ? describedbyIds : undefined, themes: theme, className: `${className} ${disabledClass} ${classNames.wrapper}`, as: as },
        React.createElement(FormLabel, { htmlFor: managedHtmlFor, id: managedLabelId, className: `${classNames.label}`, as: isRoleGroup ? 'legend' : 'label' },
            React.createElement(GroupLabel, { type: titleType }, title),
            statusLabelList.length > 0 && (React.createElement(Cluster, { gap: 0.25, as: "span" }, statusLabelList.map((statusLabelProp, index) => (React.createElement(StatusLabel, { ...statusLabelProp, key: index })))))),
        helpMessage && (React.createElement("p", { className: classNames.helpMessage, id: `${managedHtmlFor}_helpMessage` }, helpMessage)),
        exampleMessage && (React.createElement(Text, { as: "p", color: "TEXT_GREY", italic: true, id: `${managedHtmlFor}_exampleMessage`, className: classNames.exampleMessage }, exampleMessage)),
        errorMessages && (React.createElement(Stack, { gap: 0, id: `${managedHtmlFor}_errorMessage` }, (Array.isArray(errorMessages) ? errorMessages : [errorMessages]).map((message, index) => (React.createElement(ErrorMessage, { themes: theme, key: index },
            React.createElement(FaExclamationCircleIcon, { text: message, className: classNames.errorMessage })))))),
        React.createElement(ChildrenWrapper, { innerMargin: innerMargin, isRoleGroup: isRoleGroup }, addIdToFirstInput(children, managedHtmlFor, describedbyIds)),
        supplementaryMessage && (React.createElement(Text, { as: "p", size: "S", color: "TEXT_GREY", id: `${managedHtmlFor}_supplementaryMessage`, className: classNames.supplementaryMessage }, supplementaryMessage))));
};
const addIdToFirstInput = (children, managedHtmlFor, describedbyIds) => {
    let foundFirstInput = false;
    const addId = (targets) => {
        return React.Children.map(targets, (child) => {
            if (foundFirstInput || !React.isValidElement(child)) {
                return child;
            }
            const { type } = child;
            if (isInputElement(type)) {
                foundFirstInput = true;
                return React.cloneElement(child, {
                    id: managedHtmlFor,
                    'aria-describedby': describedbyIds,
                });
            }
            return React.cloneElement(child, {}, addId(child.props.children));
        });
    };
    return addId(children);
};
/**
 * - CheckBox / RadioButton は内部に label を含むため対象外
 * - SearchInput は label を含むため対象外
 * - InputWithTooltip は領域が狭く FormControl を置けない場所での私用を想定しているため対象外
 *
 * @param type
 * @returns
 */
const isInputElement = (type) => type === Input ||
    type === CurrencyInput ||
    type === Textarea ||
    type === DatePicker ||
    type === Select ||
    type === SingleComboBox ||
    type === MultiComboBox ||
    type === InputFile ||
    type === DropZone;
const Wrapper = styled(Stack).attrs({
    // 基本的にはすべて 0.5 幅、グルーピングしたフォームコントロール群との余白は ChildrenWrapper で調整する
    gap: 0.5,
}) `
  ${({ themes: { color } }) => css `
    &[disabled] {
      color: ${color.TEXT_DISABLED};

      /* 個別指定されている色を上書く */
      .smarthr-ui-Heading,
      .smarthr-ui-FormGroup-exampleMessage,
      .smarthr-ui-FormGroup-errorMessage,
      .smarthr-ui-FormGroup-supplementaryMessage,
      .smarthr-ui-RadioButton-label,
      .smarthr-ui-CheckBox-label {
        cursor: revert;
        color: inherit;
      }

      .smarthr-ui-Input {
        border-color: ${color.disableColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
      }

      .smarthr-ui-RadioButton-radioButton,
      .smarthr-ui-CheckBox-checkBox {
        cursor: revert;

        &[checked] + span,
        & + span {
          border-color: ${color.disableColor(color.BORDER)};
          background-color: ${color.disableColor(color.BORDER)};
        }

        &:hover + span {
          box-shadow: none;
        }
      }
    }
  `}
`;
const FormLabel = styled(Cluster).attrs({ align: 'center' }) `
  // flex-item が stretch してクリッカブル領域が広がりすぎないようにする
  align-self: start;
`;
const GroupLabel = styled(Heading).attrs({ tag: 'span' }) ``;
const ErrorMessage = styled.p `
  ${({ themes: { color } }) => css `
    .smarthr-ui-FormGroup-errorMessage {
      color: ${color.DANGER};
    }
  `}
`;
const ChildrenWrapper = styled.div `
  ${({ innerMargin, isRoleGroup }) => css `
    ${(innerMargin || isRoleGroup) &&
    css `
      &&& {
        margin-block-start: ${useSpacing(innerMargin || (isRoleGroup ? 1 : 0.5))};
      }
    `}
  `}
`;
//# sourceMappingURL=FormGroup.js.map