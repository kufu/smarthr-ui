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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationPanel = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Button_1 = require("../Button");
const Heading_1 = require("../Heading");
const Icon_1 = require("../Icon");
const Layout_1 = require("../Layout");
const useClassNames_1 = require("./useClassNames");
const OPEN_BUTTON_LABEL = '開く';
const CLOSE_BUTTON_LABEL = '閉じる';
const InformationPanel = ({ title, titleTag = 'h3', type, togglable = true, active: activeProps = true, className = '', children, onClickTrigger, decorators, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { Icon, iconColor } = (0, react_1.useMemo)(() => {
        switch (type) {
            case 'success':
                return {
                    Icon: SuccessTitleIcon,
                    iconColor: theme.color.MAIN,
                };
            case 'info':
            default:
                return {
                    Icon: InfoTitleIcon,
                    iconColor: theme.color.TEXT_GREY,
                };
            case 'warning':
                return {
                    Icon: WarningTitleIcon,
                    iconColor: theme.color.WARNING,
                };
            case 'error':
                return {
                    Icon: ErrorTitleIcon,
                    iconColor: theme.color.DANGER,
                };
            case 'sync':
                return {
                    Icon: SyncIcon,
                    iconColor: theme.color.MAIN,
                };
        }
    }, [type, theme.color.DANGER, theme.color.MAIN, theme.color.TEXT_GREY, theme.color.WARNING]);
    const [active, setActive] = (0, react_1.useState)(activeProps);
    const titleId = (0, useId_1.useId)();
    const contentId = (0, useId_1.useId)();
    const handleClickTrigger = (0, react_1.useCallback)(() => {
        if (onClickTrigger) {
            onClickTrigger(active);
        }
        else {
            setActive(!active);
        }
    }, [active, onClickTrigger]);
    (0, react_1.useEffect)(() => {
        setActive(activeProps);
    }, [activeProps]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, themes: theme, role: "region", "aria-labelledby": titleId },
        react_1.default.createElement(Layout_1.Stack, { gap: 1.25 },
            react_1.default.createElement(Header, { themes: theme, togglable: togglable },
                react_1.default.createElement(Heading_1.Heading, { type: "blockTitle", tag: titleTag, id: titleId, className: classNames.title },
                    react_1.default.createElement(Icon, { color: iconColor, text: title, iconGap: 0.5 })),
                togglable && (react_1.default.createElement(TogglableButton, { suffix: active ? react_1.default.createElement(Icon_1.FaCaretUpIcon, null) : react_1.default.createElement(Icon_1.FaCaretDownIcon, null), size: "s", onClick: handleClickTrigger, "aria-expanded": togglable ? active : undefined, "aria-controls": contentId, className: classNames.closeButton }, active
                    ? decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL
                    : decorators?.openButtonLabel?.(OPEN_BUTTON_LABEL) || OPEN_BUTTON_LABEL))),
            react_1.default.createElement(Content, { themes: theme, id: contentId, "aria-hidden": !active, className: classNames.content }, children))));
};
exports.InformationPanel = InformationPanel;
const Wrapper = (0, styled_components_1.default)(Base_1.Base) `
  ${({ themes: { spacingByChar, shadow } }) => (0, styled_components_1.css) `
    padding: ${spacingByChar(1.5)};
    box-shadow: ${shadow.LAYER3};
  `}
`;
const Header = (0, styled_components_1.default)(Layout_1.Cluster).attrs({
    align: 'center',
    justify: 'space-between',
}) `
  ${({ themes: { border, fontSize, leading, space }, togglable }) => {
    // (Button(1rem + padding-block + border) - Heading(1rem * 1.25) / 2)
    const adjust = `calc((
        (${fontSize.S} + ${space(1)} + ${border.lineWidth} * 2)
        - (${fontSize.M} * ${leading.TIGHT})
      ) / -2)
    `;
    return (0, styled_components_1.css) `
      ${togglable &&
        (0, styled_components_1.css) `
        &&& {
          margin-block: ${adjust};
        }
      `}
    `;
}}
`;
const TogglableButton = (0, styled_components_1.default)(Button_1.Button) `
  margin-inline-start: auto;
`;
const createTitleIcon = (Icon) => (0, styled_components_1.default)(Icon) `
  flex-shrink: 0;
`;
const SuccessTitleIcon = createTitleIcon(Icon_1.FaCheckCircleIcon);
const InfoTitleIcon = createTitleIcon(Icon_1.FaInfoCircleIcon);
const WarningTitleIcon = createTitleIcon(Icon_1.WarningIcon);
const ErrorTitleIcon = createTitleIcon(Icon_1.FaExclamationCircleIcon);
const SyncIcon = createTitleIcon(Icon_1.FaSyncAltIcon);
const Content = styled_components_1.default.div `
  ${({ themes: { fontSize } }) => (0, styled_components_1.css) `
    font-size: ${fontSize.M};

    &[aria-hidden='true'] {
      display: none;
    }
  `}
`;
//# sourceMappingURL=InformationPanel.js.map