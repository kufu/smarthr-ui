"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateElement = void 0;
exports.validateElement = function (primary, secondary) {
    if (primary) {
        var displayName = primary.type.displayName;
        if (displayName !== 'PrimaryButton' && displayName !== 'PrimaryButtonAnchor') {
            console.error('SmartHR UI: the primaryButton props accepts PrimaryButton or PrimaryButtonAnchor component');
        }
    }
    if (secondary) {
        var displayName = secondary.type.displayName;
        if (displayName !== 'SecondaryButton' && displayName !== 'SecondaryButtonAnchor') {
            console.error('SmartHR UI: the secondaryButton props accepts SecondaryButton or SecondaryButtonAnchor component');
        }
    }
};
//# sourceMappingURL=bottomFixedAreaHelper.js.map