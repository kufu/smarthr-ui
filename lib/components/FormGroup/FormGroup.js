"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGroup = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useSpacing_1 = require("../../hooks/useSpacing");
const useTheme_1 = require("../../hooks/useTheme");
const ComboBox_1 = require("../ComboBox");
const DatePicker_1 = require("../DatePicker");
const DropZone_1 = require("../DropZone");
const Heading_1 = require("../Heading");
const Icon_1 = require("../Icon");
const Input_1 = require("../Input");
const InputFile_1 = require("../InputFile");
const Layout_1 = require("../Layout");
const Select_1 = require("../Select");
const StatusLabel_1 = require("../StatusLabel");
const Text_1 = require("../Text");
const Textarea_1 = require("../Textarea");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated `FormGroup` コンポーネントは非推奨です。代わりに `FormControl` や `Fieldset` を使ってください。
 */
const FormGroup = ({ title, titleType = 'blockTitle', htmlFor, labelId, innerMargin, statusLabelProps = [], helpMessage, exampleMessage, errorMessages, supplementaryMessage, disabled, as = 'div', className = '', children, ...props }) => {
    const disabledClass = disabled ? 'disabled' : '';
    const managedHtmlFor = (0, useId_1.useId)(htmlFor);
    const managedLabelId = (0, useId_1.useId)(labelId);
    const isRoleGroup = as === 'fieldset';
    const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps];
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const describedbyIds = `${managedHtmlFor}_helpMessage ${managedHtmlFor}_exampleMessage ${managedHtmlFor}_supplementaryMessage ${managedHtmlFor}_errorMessage`;
    return (react_1.default.createElement(Wrapper, { ...props, disabled: disabled, "aria-labelledby": isRoleGroup ? managedLabelId : undefined, "aria-describedby": isRoleGroup ? describedbyIds : undefined, themes: theme, className: `${className} ${disabledClass} ${classNames.wrapper}`, as: as },
        react_1.default.createElement(FormLabel, { htmlFor: managedHtmlFor, id: managedLabelId, className: `${classNames.label}`, as: isRoleGroup ? 'legend' : 'label' },
            react_1.default.createElement(GroupLabel, { type: titleType }, title),
            statusLabelList.length > 0 && (react_1.default.createElement(Layout_1.Cluster, { gap: 0.25, as: "span" }, statusLabelList.map((statusLabelProp, index) => (react_1.default.createElement(StatusLabel_1.StatusLabel, { ...statusLabelProp, key: index })))))),
        helpMessage && (react_1.default.createElement("p", { className: classNames.helpMessage, id: `${managedHtmlFor}_helpMessage` }, helpMessage)),
        exampleMessage && (react_1.default.createElement(Text_1.Text, { as: "p", color: "TEXT_GREY", italic: true, id: `${managedHtmlFor}_exampleMessage`, className: classNames.exampleMessage }, exampleMessage)),
        errorMessages && (react_1.default.createElement(Layout_1.Stack, { gap: 0, id: `${managedHtmlFor}_errorMessage` }, (Array.isArray(errorMessages) ? errorMessages : [errorMessages]).map((message, index) => (react_1.default.createElement(ErrorMessage, { themes: theme, key: index },
            react_1.default.createElement(Icon_1.FaExclamationCircleIcon, { text: message, className: classNames.errorMessage })))))),
        react_1.default.createElement(ChildrenWrapper, { innerMargin: innerMargin, isRoleGroup: isRoleGroup }, addIdToFirstInput(children, managedHtmlFor, describedbyIds)),
        supplementaryMessage && (react_1.default.createElement(Text_1.Text, { as: "p", size: "S", color: "TEXT_GREY", id: `${managedHtmlFor}_supplementaryMessage`, className: classNames.supplementaryMessage }, supplementaryMessage))));
};
exports.FormGroup = FormGroup;
const addIdToFirstInput = (children, managedHtmlFor, describedbyIds) => {
    let foundFirstInput = false;
    const addId = (targets) => {
        return react_1.default.Children.map(targets, (child) => {
            if (foundFirstInput || !react_1.default.isValidElement(child)) {
                return child;
            }
            const { type } = child;
            if (isInputElement(type)) {
                foundFirstInput = true;
                return react_1.default.cloneElement(child, {
                    id: managedHtmlFor,
                    'aria-describedby': describedbyIds,
                });
            }
            return react_1.default.cloneElement(child, {}, addId(child.props.children));
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
const isInputElement = (type) => type === Input_1.Input ||
    type === Input_1.CurrencyInput ||
    type === Textarea_1.Textarea ||
    type === DatePicker_1.DatePicker ||
    type === Select_1.Select ||
    type === ComboBox_1.SingleComboBox ||
    type === ComboBox_1.MultiComboBox ||
    type === InputFile_1.InputFile ||
    type === DropZone_1.DropZone;
const Wrapper = (0, styled_components_1.default)(Layout_1.Stack).attrs({
    // 基本的にはすべて 0.5 幅、グルーピングしたフォームコントロール群との余白は ChildrenWrapper で調整する
    gap: 0.5,
}) `
  ${({ themes: { color } }) => (0, styled_components_1.css) `
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
const FormLabel = (0, styled_components_1.default)(Layout_1.Cluster).attrs({ align: 'center' }) `
  // flex-item が stretch してクリッカブル領域が広がりすぎないようにする
  align-self: start;
`;
const GroupLabel = (0, styled_components_1.default)(Heading_1.Heading).attrs({ tag: 'span' }) ``;
const ErrorMessage = styled_components_1.default.p `
  ${({ themes: { color } }) => (0, styled_components_1.css) `
    .smarthr-ui-FormGroup-errorMessage {
      color: ${color.DANGER};
    }
  `}
`;
const ChildrenWrapper = styled_components_1.default.div `
  ${({ innerMargin, isRoleGroup }) => (0, styled_components_1.css) `
    ${(innerMargin || isRoleGroup) &&
    (0, styled_components_1.css) `
      &&& {
        margin-block-start: ${(0, useSpacing_1.useSpacing)(innerMargin || (isRoleGroup ? 1 : 0.5))};
      }
    `}
  `}
`;
//# sourceMappingURL=FormGroup.js.map