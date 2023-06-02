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
exports.AppLauncher = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const Button_1 = require("../../Button");
const Dropdown_1 = require("../../Dropdown");
const Heading_1 = require("../../Heading");
const Icon_1 = require("../../Icon");
const Layout_1 = require("../../Layout");
const TextLink_1 = require("../../TextLink");
const useClassNames_1 = require("./useClassNames");
const TRIGGER_LABEL = 'アプリ';
const AppLauncher = ({ apps, urlToShowAll, decorators, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const triggerLabel = (0, react_1.useMemo)(() => decorators?.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL, [decorators]);
    const baseApps = apps.find(({ type }) => type === 'base');
    const others = apps.filter((category) => category !== baseApps);
    return (react_1.default.createElement(Dropdown_1.Dropdown, { ...props },
        react_1.default.createElement(Dropdown_1.DropdownTrigger, null,
            react_1.default.createElement(AppsButton, { themes: theme, prefix: react_1.default.createElement(Icon_1.FaToolboxIcon, null) }, triggerLabel)),
        react_1.default.createElement(Dropdown_1.DropdownContent, { controllable: true },
            react_1.default.createElement(Wrapper, { themes: theme, className: classNames.wrapper },
                react_1.default.createElement(Dropdown_1.DropdownScrollArea, null,
                    react_1.default.createElement(Layout_1.Stack, { gap: 1.5 },
                        baseApps && (react_1.default.createElement(Layout_1.Stack, { gap: 0.5, className: classNames.category },
                            react_1.default.createElement(Heading_1.Heading, { type: "subSubBlockTitle", tag: "h3" }, baseApps.heading),
                            react_1.default.createElement(Layout_1.Cluster, { as: "ul", gap: 1 }, baseApps.items.map((item, index) => (react_1.default.createElement("li", { key: index },
                                react_1.default.createElement(TextLink_1.TextLink, { href: item.url, target: item.target, className: classNames.link }, item.label))))))),
                        react_1.default.createElement(Layout_1.Cluster, { gap: 1.5 }, others.map(({ heading, items }, i) => (react_1.default.createElement(Layout_1.Stack, { gap: 0.5, className: classNames.category, key: i, recursive: true },
                            react_1.default.createElement(Heading_1.Heading, { type: "subSubBlockTitle", tag: "h3" }, heading),
                            react_1.default.createElement("ul", null, items.map((item, index) => (react_1.default.createElement("li", { key: index },
                                react_1.default.createElement(TextLink_1.TextLink, { href: item.url, target: item.target, className: classNames.link }, item.label))))))))))),
                urlToShowAll && (react_1.default.createElement(Footer, { themes: theme, className: classNames.footer },
                    react_1.default.createElement(TextLink_1.TextLink, { href: urlToShowAll, style: { width: 'fit-content' } }, "\u3059\u3079\u3066\u898B\u308B")))))));
};
exports.AppLauncher = AppLauncher;
const AppsButton = (0, styled_components_1.default)(Button_1.Button) `
  ${({ themes: { color, space } }) => (0, styled_components_1.css) `
    border-color: transparent;
    background-color: transparent;
    padding-inline: ${space(0.25)};
    color: ${color.TEXT_WHITE};
    font-weight: normal;

    &:hover,
    &:focus-visible {
      border-color: transparent;
      background-color: transparent;
    }
  `}
`;
const Wrapper = (0, styled_components_1.default)(Layout_1.Stack).attrs({ as: 'nav', gap: 1.5 }) `
  ${({ themes: { space, leading } }) => (0, styled_components_1.css) `
    padding: ${space(1.5)};
    line-height: ${leading.NORMAL};
  `}
`;
const Footer = (0, styled_components_1.default)(Layout_1.Stack) `
  ${({ themes: { border, space } }) => (0, styled_components_1.css) `
    &&& {
      margin-block-end: ${space(-0.25)};
    }
    margin-inline: ${space(-0.75)};
    border-top: ${border.shorthand};
    padding-block-start: ${space(1)};
    padding-inline: ${space(0.75)};
  `}
`;
//# sourceMappingURL=AppLauncher.js.map