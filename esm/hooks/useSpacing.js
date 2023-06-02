import { useTheme } from '../hooks/useTheme';
export const useSpacing = (size) => {
    const { spacing, spacingByChar } = useTheme();
    if (typeof size === 'number') {
        return spacingByChar(size);
    }
    else if (typeof size === 'string') {
        return spacing[size];
    }
    else {
        // not going through
        return '0';
    }
};
//# sourceMappingURL=useSpacing.js.map