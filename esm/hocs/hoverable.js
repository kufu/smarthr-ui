import * as React from 'react';
import { isMouseDevice, isTouchDevice } from '../libs/ua';
export const hoverable = ({ hoverClassName = 'hover' } = {}) => (WrappedComponent) => {
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
                    if (isTouchDevice)
                        return;
                    this.setState({ isHover: true });
                };
                this.onMouseLeave = (e) => {
                    const { onMouseLeave } = this.props;
                    if (onMouseLeave)
                        onMouseLeave(e);
                    if (isTouchDevice)
                        return;
                    this.setState({ isHover: false });
                };
                this.onTouchStart = (e) => {
                    const { onTouchStart } = this.props;
                    if (onTouchStart)
                        onTouchStart(e);
                    if (isMouseDevice)
                        return;
                    this.setState({ isHover: true });
                };
                this.onTouchEnd = (e) => {
                    const { onTouchEnd } = this.props;
                    if (onTouchEnd)
                        onTouchEnd(e);
                    if (isMouseDevice)
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
//# sourceMappingURL=hoverable.js.map