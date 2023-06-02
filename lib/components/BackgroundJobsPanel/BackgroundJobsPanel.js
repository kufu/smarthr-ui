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
exports.BackgroundJobsPanel = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const JobIcon_1 = require("./JobIcon");
const OmittableJobText_1 = require("./OmittableJobText");
const useClassNames_1 = require("./useClassNames");
const BackgroundJobsPanel = ({ title, jobs, onClickCancelJob, onClickExpansion, onClickClose, className = '', ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const { backgroundJobsPanel: classNames } = (0, useClassNames_1.useClassNames)();
    const isExpansionControlled = props.isExpanded !== undefined;
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(isExpansionControlled ? !!props.isExpanded : true);
    (0, react_1.useEffect)(() => {
        if (isExpansionControlled) {
            setIsExpanded(!!props.isExpanded);
        }
    }, [isExpansionControlled, props.isExpanded]);
    const jobListId = (0, useId_1.useId)();
    return (react_1.default.createElement(Container, { themes: themes, className: `${className} ${classNames.wrapper}` },
        react_1.default.createElement(Header, null,
            react_1.default.createElement(Title, { themes: themes, className: classNames.title }, title),
            react_1.default.createElement(HeaderButtonLayout, { themes: themes },
                react_1.default.createElement(Button_1.Button, { type: "button", size: "s", square: true, onClick: () => {
                        onClickExpansion && onClickExpansion(!isExpanded);
                        if (!isExpansionControlled) {
                            setIsExpanded(!isExpanded);
                        }
                    }, "aria-expanded": isExpanded, "aria-controls": jobListId, className: classNames.toggleButton }, isExpanded ? (react_1.default.createElement(Icon_1.FaMinusIcon, { alt: "\u6298\u308A\u305F\u305F\u3080" })) : (react_1.default.createElement(Icon_1.FaWindowMaximizeIcon, { alt: "\u5C55\u958B\u3059\u308B" }))),
                react_1.default.createElement(Button_1.Button, { type: "button", size: "s", square: true, onClick: onClickClose, className: classNames.closeButton },
                    react_1.default.createElement(Icon_1.FaTimesIcon, { alt: "\u9589\u3058\u308B" })))),
        react_1.default.createElement(JobList, { themes: themes, isExpanded: isExpanded, id: jobListId, className: classNames.list }, jobs.map((job) => {
            const handleClickCancelJob = onClickCancelJob ? () => onClickCancelJob(job.id) : undefined;
            return (react_1.default.createElement(Job, { key: job.id, themes: themes, className: classNames.listItem },
                react_1.default.createElement(JobIconWrapper, null,
                    react_1.default.createElement(JobIcon_1.JobIcon, { status: job.status })),
                react_1.default.createElement(JobName, { themes: themes }, job.name),
                react_1.default.createElement(JobDesc, { themes: themes }, job.description),
                job.isCancelable && (react_1.default.createElement(CancelButton, { type: "button", onClick: handleClickCancelJob, themes: themes }, "\u30AD\u30E3\u30F3\u30BB\u30EB"))));
        }))));
};
exports.BackgroundJobsPanel = BackgroundJobsPanel;
const Container = (0, styled_components_1.default)(Base_1.Base)(({ themes }) => {
    return (0, styled_components_1.css) `
    display: inline-flex;
    flex-direction: column;
    min-width: 420px;
    max-width: 600px;
    color: ${themes.color.TEXT_BLACK};
  `;
});
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const Title = styled_components_1.default.div(({ themes: { fontSize, spacingByChar } }) => {
    return (0, styled_components_1.css) `
    font-size: ${fontSize.M};
    padding: ${spacingByChar(1)};
  `;
});
const HeaderButtonLayout = styled_components_1.default.div(({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
    flex-shrink: 0;
    margin-left: auto;
    padding-right: ${spacingByChar(1)};
    button:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `;
});
const JobList = styled_components_1.default.ul(({ isExpanded, themes: { border, spacingByChar } }) => {
    return (0, styled_components_1.css) `
      margin: 0;
      list-style: none;
      padding: ${spacingByChar(1)};
      border-top: ${border.shorthand};
      ${!isExpanded &&
        (0, styled_components_1.css) `
        height: 0;
        visibility: hidden;
        overflow: hidden;
        padding-top: 0;
        padding-bottom: 0;
        border: none;
      `}
    `;
});
const Job = styled_components_1.default.li(({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    line-height: normal;
    :not(:first-child) {
      margin-top: ${spacingByChar(1)};
    }
  `;
});
const JobIconWrapper = styled_components_1.default.div `
  flex-shrink: 0;
  line-height: 0;
`;
const JobName = (0, styled_components_1.default)(OmittableJobText_1.OmittableJobText)(({ themes: { fontSize, spacingByChar } }) => {
    return (0, styled_components_1.css) `
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
    `;
});
const JobDesc = (0, styled_components_1.default)(OmittableJobText_1.OmittableJobText)(({ themes: { fontSize, spacingByChar } }) => {
    return (0, styled_components_1.css) `
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    `;
});
const CancelButton = (0, styled_components_1.default)(Button_1.UnstyledButton)(({ themes: { color, fontSize, spacingByChar } }) => {
    return (0, styled_components_1.css) `
      flex-shrink: 0;
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
      color: ${color.TEXT_LINK};
      cursor: pointer;
      :hover {
        text-decoration: underline;
      }
    `;
});
//# sourceMappingURL=BackgroundJobsPanel.js.map