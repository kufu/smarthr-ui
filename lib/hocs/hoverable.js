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
exports.hoverable = void 0;
const React = __importStar(require("react"));
const ua_1 = require("../libs/ua");
const hoverable = ({ hoverClassName = 'hover' } = {}) => (WrappedComponent) => {
    var _a;
    return _a = class HoverableComponent extends React.PureComponent {
            constructor() {
                super(...arguments);
                this.state = {
                    isHover: false,
                };
                this.onMouseEnter = (e) => {
                    const { onMouseEnter } = this.props;
                    if (onMouseEnter)
                        onMouseEnter(e);
                    if (ua_1.isTouchDevice)
                        return;
                    this.setState({ isHover: true });
                };
                this.onMouseLeave = (e) => {
                    const { onMouseLeave } = this.props;
                    if (onMouseLeave)
                        onMouseLeave(e);
                    if (ua_1.isTouchDevice)
                        return;
                    this.setState({ isHover: false });
                };
                this.onTouchStart = (e) => {
                    const { onTouchStart } = this.props;
                    if (onTouchStart)
                        onTouchStart(e);
                    if (ua_1.isMouseDevice)
                        return;
                    this.setState({ isHover: true });
                };
                this.onTouchEnd = (e) => {
                    const { onTouchEnd } = this.props;
                    if (onTouchEnd)
                        onTouchEnd(e);
                    if (ua_1.isMouseDevice)
                        return;
                    this.setState({ isHover: false });
                };
            }
            render() {
                const { isHover } = this.state;
                return (React.createElement(WrappedComponent, { ...this.props, className: `${isHover ? hoverClassName : ''} ${this.props.className || ''}`, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, onTouchStart: this.onTouchStart, onTouchEnd: this.onTouchEnd }));
            }
        },
        _a.displayName = `HoverableComponent(${WrappedComponent.displayName})`,
        _a;
};
exports.hoverable = hoverable;
//# sourceMappingURL=hoverable.js.map