"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateElement = void 0;
const validateElement = (primary, secondary) => {
    if (primary) {
        const { displayName } = primary.type;
        if (((displayName !== 'Button' && displayName !== 'AnchorButton') ||
            !('variant' in primary.props) ||
            primary.props.variant !== 'primary') &&
            displayName !== 'PrimaryButton' &&
            displayName !== 'PrimaryButtonAnchor') {
            console.error('SmartHR UI: the primaryButton props accepts "primary" Button or AnchorButton component');
        }
    }
    if (secondary) {
        const { displayName } = secondary.type;
        if (((displayName !== 'Button' && displayName !== 'AnchorButton') ||
            ('variant' in secondary.props && secondary?.props.variant !== 'secondary')) &&
            displayName !== 'SecondaryButton' &&
            displayName !== 'SecondaryButtonAnchor') {
            console.error('SmartHR UI: the secondaryButton props accepts "secondary" Button or AnchorButton component');
        }
    }
};
exports.validateElement = validateElement;
//# sourceMappingURL=bottomFixedAreaHelper.js.map