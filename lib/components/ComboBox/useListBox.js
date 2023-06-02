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
exports.useListBox = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useEnhancedEffect_1 = require("../../hooks/useEnhancedEffect");
const useId_1 = require("../../hooks/useId");
const usePortal_1 = require("../../hooks/usePortal");
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const Loader_1 = require("../Loader");
const ComboBoxContext_1 = require("./ComboBoxContext");
const ListBoxItem_1 = require("./ListBoxItem");
const useActiveOption_1 = require("./useActiveOption");
const usePartialRendering_1 = require("./usePartialRendering");
const NO_RESULT_TEXT = '一致する選択肢がありません';
function useListBox({ options, dropdownHelpMessage, dropdownWidth, onAdd, onSelect, isExpanded, isLoading, triggerRef, decorators, }) {
    const [navigationType, setNavigationType] = (0, react_1.useState)('pointer');
    const { activeOption, setActiveOption, moveActivePositionDown, moveActivePositionUp } = (0, useActiveOption_1.useActiveOption)({ options });
    (0, react_1.useEffect)(() => {
        // 閉じたときに activeOption を初期化
        if (!isExpanded) {
            setActiveOption(null);
        }
    }, [isExpanded, setActiveOption]);
    const listBoxRef = (0, react_1.useRef)(null);
    const [listBoxRect, setListBoxRect] = (0, react_1.useState)({
        top: 0,
        left: 0,
        width: 0,
    });
    const calculateRect = (0, react_1.useCallback)(() => {
        if (!listBoxRef.current || !triggerRef.current) {
            return;
        }
        const rect = triggerRef.current.getBoundingClientRect();
        const bottomSpace = window.innerHeight - rect.bottom;
        const topSpace = rect.top;
        const listBoxHeight = Math.min(listBoxRef.current.scrollHeight, parseInt(getComputedStyle(listBoxRef.current).maxHeight, 10));
        const offset = 2;
        let top = 0;
        let height = undefined;
        if (bottomSpace >= listBoxHeight) {
            // 下側に十分なスペースがある場合は下側に通常表示
            top = rect.top + rect.height - offset + window.pageYOffset;
        }
        else if (topSpace >= listBoxHeight) {
            // 上側に十分なスペースがある場合は上側に通常表示
            top = rect.top - listBoxHeight + offset + window.pageYOffset;
        }
        else if (topSpace > bottomSpace) {
            // 上下に十分なスペースがなく、上側の方がスペースが大きい場合は上側に縮めて表示
            top = rect.top - topSpace + offset + window.pageYOffset;
            height = topSpace;
        }
        else {
            // 下側に縮めて表示
            top = rect.top + rect.height - offset + window.pageYOffset;
            height = bottomSpace;
        }
        setListBoxRect({
            top,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height,
        });
    }, [listBoxRef, triggerRef]);
    const activeRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // actionOption の要素が表示される位置までリストボックス内をスクロールさせる
        if (navigationType !== 'key' ||
            activeOption === null ||
            !activeRef.current ||
            !listBoxRef.current) {
            return;
        }
        const activeRect = activeRef.current.getBoundingClientRect();
        const containerRect = listBoxRef.current.getBoundingClientRect();
        const isActiveTopOutside = activeRect.top < containerRect.top;
        const isActiveBottomOutside = activeRect.bottom > containerRect.bottom;
        if (isActiveTopOutside) {
            listBoxRef.current.scrollTop -= containerRect.top - activeRect.top;
        }
        else if (isActiveBottomOutside) {
            listBoxRef.current.scrollTop += activeRect.bottom - containerRect.bottom;
        }
    }, [activeOption, listBoxRef, navigationType]);
    (0, useEnhancedEffect_1.useEnhancedEffect)(() => {
        if (isExpanded) {
            // options の更新毎に座標を再計算する
            calculateRect();
        }
    }, [calculateRect, isExpanded, options]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        setNavigationType('key');
        if (e.key === 'Down' || e.key === 'ArrowDown') {
            e.stopPropagation();
            moveActivePositionDown();
        }
        else if (e.key === 'Up' || e.key === 'ArrowUp') {
            e.stopPropagation();
            moveActivePositionUp();
        }
        else if (e.key === 'Enter') {
            if (activeOption === null) {
                return;
            }
            e.stopPropagation();
            if (activeOption.isNew) {
                onAdd && onAdd(activeOption.item.value);
            }
            else {
                onSelect(activeOption.item);
            }
        }
        else {
            setActiveOption(null);
        }
    }, [activeOption, moveActivePositionDown, moveActivePositionUp, onAdd, onSelect, setActiveOption]);
    const theme = (0, useTheme_1.useTheme)();
    const { createPortal } = (0, usePortal_1.usePortal)();
    const listBoxId = (0, useId_1.useId)();
    const { items: partialOptions, renderIntersection } = (0, usePartialRendering_1.usePartialRendering)({
        items: options,
        minLength: (0, react_1.useMemo)(() => (activeOption === null ? 0 : options.indexOf(activeOption)) + 1, [activeOption, options]),
    });
    const { listBoxClassNames: classNames } = (0, react_1.useContext)(ComboBoxContext_1.ComboBoxContext);
    const handleAdd = (0, react_1.useCallback)((option) => {
        // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        requestAnimationFrame(() => {
            onAdd && onAdd(option.item.value);
        });
    }, [onAdd]);
    const handleSelect = (0, react_1.useCallback)((option) => {
        onSelect(option.item);
    }, [onSelect]);
    const handleHoverOption = (0, react_1.useCallback)((option) => {
        setNavigationType('pointer');
        setActiveOption(option);
    }, [setActiveOption]);
    const renderListBox = (0, react_1.useCallback)(() => createPortal(react_1.default.createElement(Wrapper, { ...listBoxRect },
        react_1.default.createElement(Container, { ...listBoxRect, themes: theme, "$width": dropdownWidth || listBoxRect.width, id: listBoxId, ref: listBoxRef, role: "listbox", "aria-hidden": !isExpanded, className: classNames.dropdownList },
            dropdownHelpMessage && (react_1.default.createElement(HelpMessage, { themes: theme },
                react_1.default.createElement(Icon_1.FaInfoCircleIcon, { color: theme.color.TEXT_GREY, text: dropdownHelpMessage, iconGap: 0.25 }))),
            !isExpanded ? null : isLoading ? (react_1.default.createElement(LoaderWrapper, { themes: theme },
                react_1.default.createElement(Loader_1.Loader, null))) : options.length === 0 ? (react_1.default.createElement(NoItems, { themes: theme, role: "alert", "aria-live": "polite", className: classNames.noItems }, decorators?.noResultText
                ? decorators.noResultText(NO_RESULT_TEXT)
                : NO_RESULT_TEXT)) : (partialOptions.map((option) => (react_1.default.createElement(ListBoxItem_1.ListBoxItem, { key: option.id, option: option, isActive: option.id === activeOption?.id, onAdd: handleAdd, onSelect: handleSelect, onMouseOver: handleHoverOption, activeRef: activeRef })))),
            renderIntersection()))), [
        activeOption?.id,
        classNames.dropdownList,
        classNames.noItems,
        createPortal,
        handleAdd,
        handleHoverOption,
        handleSelect,
        isExpanded,
        isLoading,
        listBoxId,
        listBoxRect,
        options.length,
        partialOptions,
        renderIntersection,
        dropdownHelpMessage,
        dropdownWidth,
        theme,
        decorators,
    ]);
    return {
        renderListBox,
        activeOption,
        handleKeyDown,
        listBoxId,
        listBoxRef,
    };
}
exports.useListBox = useListBox;
const Wrapper = styled_components_1.default.div(({ top, left, width }) => {
    return (0, styled_components_1.css) `
    /*
    ドロップダウンリストをInputの幅に対する相対値で指定できるように、Inputの幅のdivを親要素にする
    */
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    width: ${width}px;
  `;
});
const Container = styled_components_1.default.div(({ left, $width, height, themes }) => {
    const { color, fontSize, spacingByChar, radius, shadow, zIndex } = themes;
    return (0, styled_components_1.css) `
    position: absolute;
    overflow-y: auto;

    /*
     縦スクロールに気づきやすくするために8個目のアイテムが半分見切れるように max-height を算出
     = (アイテムのフォントサイズ + アイテムの上下padding) * 7.5 + コンテナの上padding
    */
    max-height: calc((${fontSize.M} + ${spacingByChar(0.5)} * 2) * 7.5 + ${spacingByChar(0.5)});
    ${height !== undefined &&
        (0, styled_components_1.css) `
      height: ${height}px;
    `}

    /*
    dropdownWidthの指定があれば、ドロップダウンリストの幅として設定する。
    ドロップダウンリストは、viewportの幅を超えないように、かつInputの幅より小さくならないようにする。
    */
    width: ${typeof $width === 'string' ? $width : `${$width}px`};
    max-width: calc(100vw - ${left}px - ${spacingByChar(0.5)});
    min-width: 100%;

    padding: ${spacingByChar(0.5)} 0;
    border-radius: ${radius.m};
    box-shadow: ${shadow.LAYER3};
    background-color: ${color.WHITE};
    box-sizing: border-box;
    &[aria-hidden='true'] {
      display: none;
    }
    z-index: ${zIndex.OVERLAP};
  `;
});
const HelpMessage = styled_components_1.default.p `
  ${({ themes }) => {
    const { border, fontSize, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      margin: 0 ${spacingByChar(0.5)} ${spacingByChar(0.5)};
      padding: 0 ${spacingByChar(0.5)} ${spacingByChar(0.5)};
      border-bottom: ${border.shorthand};
      font-size: ${fontSize.S};
      white-space: initial;
    `;
}}
`;
const NoItems = styled_components_1.default.p `
  ${({ themes }) => {
    const { color, fontSize, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      margin: 0;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: ${color.WHITE};
      font-size: ${fontSize.M};
    `;
}}
`;
const LoaderWrapper = styled_components_1.default.div `
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${spacingByChar(1)};
    `;
}}
`;
//# sourceMappingURL=useListBox.js.map