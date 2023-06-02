"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstTabbable = exports.getContentBoxStyle = exports.isEventFromChild = void 0;
const tabbable_1 = require("../../libs/tabbable");
function isEventFromChild(e, parent) {
    const path = e.composedPath();
    if (path.length === 0 || !parent)
        return false;
    return path.includes(parent);
}
exports.isEventFromChild = isEventFromChild;
function getContentBoxStyle(triggerRect, contentSize, windowSize, scroll) {
    const contentBox = {
        top: 'auto',
        maxHeight: '',
    };
    if (triggerRect.bottom + contentSize.height <= windowSize.height) {
        // ドロップダウンのサイズがトリガの下側の領域に収まる場合
        contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`;
    }
    else if (triggerRect.top - contentSize.height >= 0) {
        // ドロップダウンのサイズがトリガの上川の領域に収まる場合
        contentBox.top = `${scroll.top + triggerRect.top - contentSize.height + 5}px`;
    }
    else {
        const padding = 10;
        const triggerHeight = triggerRect.bottom - triggerRect.top;
        if (triggerRect.top + triggerHeight / 2 < windowSize.height / 2) {
            // 下側の領域のほうが広い場合
            contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`;
            contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - padding}px`;
        }
        else {
            // 上側の領域のほうが広い場合
            contentBox.top = `${scroll.top + padding + 5}px`;
            contentBox.maxHeight = `${triggerRect.top - padding}px`;
        }
    }
    const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2;
    if (triggerAlignCenter <= windowSize.width / 2) {
        // トリガが画面左寄りの場合
        contentBox.left = `${scroll.left + triggerRect.left - 5}px`;
    }
    else {
        // トリガが画面右寄りの場合
        contentBox.right = `${windowSize.width - triggerRect.right - scroll.left - 5}px`;
    }
    return contentBox;
}
exports.getContentBoxStyle = getContentBoxStyle;
function getFirstTabbable(ref) {
    if (ref.current) {
        const tabbables = (0, tabbable_1.tabbable)(ref.current);
        const firstTabbable = tabbables[0];
        return firstTabbable;
    }
    return null;
}
exports.getFirstTabbable = getFirstTabbable;
//# sourceMappingURL=dropdownHelper.js.map