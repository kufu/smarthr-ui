import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { Button, UnstyledButton } from '../Button';
import { FaMinusIcon, FaTimesIcon, FaWindowMaximizeIcon } from '../Icon';
import { JobIcon } from './JobIcon';
import { OmittableJobText } from './OmittableJobText';
import { useClassNames } from './useClassNames';
export const BackgroundJobsPanel = ({ title, jobs, onClickCancelJob, onClickExpansion, onClickClose, className = '', ...props }) => {
    const themes = useTheme();
    const { backgroundJobsPanel: classNames } = useClassNames();
    const isExpansionControlled = props.isExpanded !== undefined;
    const [isExpanded, setIsExpanded] = useState(isExpansionControlled ? !!props.isExpanded : true);
    useEffect(() => {
        if (isExpansionControlled) {
            setIsExpanded(!!props.isExpanded);
        }
    }, [isExpansionControlled, props.isExpanded]);
    const jobListId = useId();
    return (React.createElement(Container, { themes: themes, className: `${className} ${classNames.wrapper}` },
        React.createElement(Header, null,
            React.createElement(Title, { themes: themes, className: classNames.title }, title),
            React.createElement(HeaderButtonLayout, { themes: themes },
                React.createElement(Button, { type: "button", size: "s", square: true, onClick: () => {
                        onClickExpansion && onClickExpansion(!isExpanded);
                        if (!isExpansionControlled) {
                            setIsExpanded(!isExpanded);
                        }
                    }, "aria-expanded": isExpanded, "aria-controls": jobListId, className: classNames.toggleButton }, isExpanded ? (React.createElement(FaMinusIcon, { alt: "\u6298\u308A\u305F\u305F\u3080" })) : (React.createElement(FaWindowMaximizeIcon, { alt: "\u5C55\u958B\u3059\u308B" }))),
                React.createElement(Button, { type: "button", size: "s", square: true, onClick: onClickClose, className: classNames.closeButton },
                    React.createElement(FaTimesIcon, { alt: "\u9589\u3058\u308B" })))),
        React.createElement(JobList, { themes: themes, isExpanded: isExpanded, id: jobListId, className: classNames.list }, jobs.map((job) => {
            const handleClickCancelJob = onClickCancelJob ? () => onClickCancelJob(job.id) : undefined;
            return (React.createElement(Job, { key: job.id, themes: themes, className: classNames.listItem },
                React.createElement(JobIconWrapper, null,
                    React.createElement(JobIcon, { status: job.status })),
                React.createElement(JobName, { themes: themes }, job.name),
                React.createElement(JobDesc, { themes: themes }, job.description),
                job.isCancelable && (React.createElement(CancelButton, { type: "button", onClick: handleClickCancelJob, themes: themes }, "\u30AD\u30E3\u30F3\u30BB\u30EB"))));
        }))));
};
const Container = styled(Base)(({ themes }) => {
    return css `
    display: inline-flex;
    flex-direction: column;
    min-width: 420px;
    max-width: 600px;
    color: ${themes.color.TEXT_BLACK};
  `;
});
const Header = styled.div `
  display: flex;
  align-items: center;
`;
const Title = styled.div(({ themes: { fontSize, spacingByChar } }) => {
    return css `
    font-size: ${fontSize.M};
    padding: ${spacingByChar(1)};
  `;
});
const HeaderButtonLayout = styled.div(({ themes: { spacingByChar } }) => {
    return css `
    flex-shrink: 0;
    margin-left: auto;
    padding-right: ${spacingByChar(1)};
    button:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `;
});
const JobList = styled.ul(({ isExpanded, themes: { border, spacingByChar } }) => {
    return css `
      margin: 0;
      list-style: none;
      padding: ${spacingByChar(1)};
      border-top: ${border.shorthand};
      ${!isExpanded &&
        css `
        height: 0;
        visibility: hidden;
        overflow: hidden;
        padding-top: 0;
        padding-bottom: 0;
        border: none;
      `}
    `;
});
const Job = styled.li(({ themes: { spacingByChar } }) => {
    return css `
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    line-height: normal;
    :not(:first-child) {
      margin-top: ${spacingByChar(1)};
    }
  `;
});
const JobIconWrapper = styled.div `
  flex-shrink: 0;
  line-height: 0;
`;
const JobName = styled(OmittableJobText)(({ themes: { fontSize, spacingByChar } }) => {
    return css `
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
    `;
});
const JobDesc = styled(OmittableJobText)(({ themes: { fontSize, spacingByChar } }) => {
    return css `
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    `;
});
const CancelButton = styled(UnstyledButton)(({ themes: { color, fontSize, spacingByChar } }) => {
    return css `
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