"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const DangerButton_1 = require("./DangerButton");
const PrimaryButton_1 = require("./PrimaryButton");
const SecondaryButton_1 = require("./SecondaryButton");
const SkeletonButton_1 = require("./SkeletonButton");
const TextButton_1 = require("./TextButton");
const _1 = require(".");
const useClassNames = () => {
    const generateButotn = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Button.displayName || 'Button');
    const generateAnchorButotn = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.AnchorButton.displayName || 'AnchorButton');
    const generatePrimaryButton = (0, useClassNameGenerator_1.useClassNameGenerator)(PrimaryButton_1.PrimaryButton.displayName || 'PrimaryButton');
    const generatePrimaryButtonAnchor = (0, useClassNameGenerator_1.useClassNameGenerator)(PrimaryButton_1.PrimaryButtonAnchor.displayName || 'PrimaryButtonAnchor');
    const generateSecondaryButton = (0, useClassNameGenerator_1.useClassNameGenerator)(SecondaryButton_1.SecondaryButton.displayName || 'SecondaryButton');
    const generateSecondaryButtonAnchor = (0, useClassNameGenerator_1.useClassNameGenerator)(SecondaryButton_1.SecondaryButtonAnchor.displayName || 'SecondaryButtonAnchor');
    const generateDangerButton = (0, useClassNameGenerator_1.useClassNameGenerator)(DangerButton_1.DangerButton.displayName || 'DangerButton');
    const generateDangerButtonAnchor = (0, useClassNameGenerator_1.useClassNameGenerator)(DangerButton_1.DangerButtonAnchor.displayName || 'DangerButtonAnchor');
    const generateSkeletonButton = (0, useClassNameGenerator_1.useClassNameGenerator)(SkeletonButton_1.SkeletonButton.displayName || 'SkeletonButton');
    const generateSkeletonButtonAnchor = (0, useClassNameGenerator_1.useClassNameGenerator)(SkeletonButton_1.SkeletonButtonAnchor.displayName || 'SkeletonButtonAnchor');
    const generateTextButton = (0, useClassNameGenerator_1.useClassNameGenerator)(TextButton_1.TextButton.displayName || 'TextButton');
    const generateTextButtonAnchor = (0, useClassNameGenerator_1.useClassNameGenerator)(TextButton_1.TextButtonAnchor.displayName || 'TextButtonAnchor');
    return (0, react_1.useMemo)(() => ({
        button: {
            wrapper: generateButotn(),
            disabledWrapper: generateButotn('disabledWrapper'),
        },
        anchorButton: {
            wrapper: generateAnchorButotn(),
        },
        primaryButton: {
            wrapper: generatePrimaryButton(),
        },
        primaryButtonAnchor: {
            wrapper: generatePrimaryButtonAnchor(),
        },
        secondaryButton: {
            wrapper: generateSecondaryButton(),
        },
        secondaryButtonAnchor: {
            wrapper: generateSecondaryButtonAnchor(),
        },
        dangerButton: {
            wrapper: generateDangerButton(),
        },
        dangerButtonAnchor: {
            wrapper: generateDangerButtonAnchor(),
        },
        skeletonButton: {
            wrapper: generateSkeletonButton(),
        },
        skeletonButtonAnchor: {
            wrapper: generateSkeletonButtonAnchor(),
        },
        textButton: {
            wrapper: generateTextButton(),
        },
        textButtonAnchor: {
            wrapper: generateTextButtonAnchor(),
        },
    }), [
        generateAnchorButotn,
        generateButotn,
        generateDangerButton,
        generateDangerButtonAnchor,
        generatePrimaryButton,
        generatePrimaryButtonAnchor,
        generateSecondaryButton,
        generateSecondaryButtonAnchor,
        generateSkeletonButton,
        generateSkeletonButtonAnchor,
        generateTextButton,
        generateTextButtonAnchor,
    ]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map