"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationControllerItem = void 0;
const react_1 = __importDefault(require("react"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const PaginationItem_1 = require("./PaginationItem");
const getIconProps = (direction, double) => {
    return direction === 'prev'
        ? double
            ? { Icon: Icon_1.FaAngleDoubleLeftIcon, alt: '最初へ' }
            : { Icon: Icon_1.FaChevronLeftIcon, alt: '前へ' }
        : double
            ? { Icon: Icon_1.FaAngleDoubleRightIcon, alt: '最後へ' }
            : { Icon: Icon_1.FaChevronRightIcon, alt: '次へ' };
};
const PaginationControllerItem = ({ direction, disabled, double = false, targetPage, onClick, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { Icon, ...iconProps } = getIconProps(direction, double);
    return (react_1.default.createElement(PaginationItem_1.ItemButton, { onClick: () => onClick(targetPage), disabled: disabled, themes: theme, "aria-label": iconProps.alt },
        react_1.default.createElement(Icon, { color: disabled ? theme.color.TEXT_DISABLED : theme.color.TEXT_BLACK, alt: iconProps.alt })));
};
exports.PaginationControllerItem = PaginationControllerItem;
//# sourceMappingURL=PaginationControllerItem.js.map