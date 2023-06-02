import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { DangerButton, DangerButtonAnchor } from './DangerButton';
import { PrimaryButton, PrimaryButtonAnchor } from './PrimaryButton';
import { SecondaryButton, SecondaryButtonAnchor } from './SecondaryButton';
import { SkeletonButton, SkeletonButtonAnchor } from './SkeletonButton';
import { TextButton, TextButtonAnchor } from './TextButton';
import { AnchorButton, Button } from '.';
export const useClassNames = () => {
    const generateButotn = useClassNameGenerator(Button.displayName || 'Button');
    const generateAnchorButotn = useClassNameGenerator(AnchorButton.displayName || 'AnchorButton');
    const generatePrimaryButton = useClassNameGenerator(PrimaryButton.displayName || 'PrimaryButton');
    const generatePrimaryButtonAnchor = useClassNameGenerator(PrimaryButtonAnchor.displayName || 'PrimaryButtonAnchor');
    const generateSecondaryButton = useClassNameGenerator(SecondaryButton.displayName || 'SecondaryButton');
    const generateSecondaryButtonAnchor = useClassNameGenerator(SecondaryButtonAnchor.displayName || 'SecondaryButtonAnchor');
    const generateDangerButton = useClassNameGenerator(DangerButton.displayName || 'DangerButton');
    const generateDangerButtonAnchor = useClassNameGenerator(DangerButtonAnchor.displayName || 'DangerButtonAnchor');
    const generateSkeletonButton = useClassNameGenerator(SkeletonButton.displayName || 'SkeletonButton');
    const generateSkeletonButtonAnchor = useClassNameGenerator(SkeletonButtonAnchor.displayName || 'SkeletonButtonAnchor');
    const generateTextButton = useClassNameGenerator(TextButton.displayName || 'TextButton');
    const generateTextButtonAnchor = useClassNameGenerator(TextButtonAnchor.displayName || 'TextButtonAnchor');
    return useMemo(() => ({
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
//# sourceMappingURL=useClassNames.js.map