var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { isMouseDevice, isTouchDevice } from '../libs/ua';
export var hoverable = function (_a) {
    var _b = (_a === void 0 ? {} : _a).hoverClassName, hoverClassName = _b === void 0 ? 'hover' : _b;
    return function (WrappedComponent) {
        var _a;
        return _a = /** @class */ (function (_super) {
                __extends(HoverableComponent, _super);
                function HoverableComponent() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.state = {
                        isHover: false,
                    };
                    _this.onMouseEnter = function (e) {
                        var onMouseEnter = _this.props.onMouseEnter;
                        if (onMouseEnter)
                            onMouseEnter(e);
                        if (isTouchDevice)
                            return;
                        _this.setState({ isHover: true });
                    };
                    _this.onMouseLeave = function (e) {
                        var onMouseLeave = _this.props.onMouseLeave;
                        if (onMouseLeave)
                            onMouseLeave(e);
                        if (isTouchDevice)
                            return;
                        _this.setState({ isHover: false });
                    };
                    _this.onTouchStart = function (e) {
                        var onTouchStart = _this.props.onTouchStart;
                        if (onTouchStart)
                            onTouchStart(e);
                        if (isMouseDevice)
                            return;
                        _this.setState({ isHover: true });
                    };
                    _this.onTouchEnd = function (e) {
                        var onTouchEnd = _this.props.onTouchEnd;
                        if (onTouchEnd)
                            onTouchEnd(e);
                        if (isMouseDevice)
                            return;
                        _this.setState({ isHover: false });
                    };
                    return _this;
                }
                HoverableComponent.prototype.render = function () {
                    var isHover = this.state.isHover;
                    return (React.createElement(WrappedComponent, __assign({}, this.props, { className: (isHover ? hoverClassName : '') + " " + (this.props.className || ''), onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, onTouchStart: this.onTouchStart, onTouchEnd: this.onTouchEnd })));
                };
                return HoverableComponent;
            }(React.PureComponent)),
            _a.displayName = "HoverableComponent(" + WrappedComponent.displayName + ")",
            _a;
    };
};
//# sourceMappingURL=hoverable.js.map