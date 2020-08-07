import React, { FC } from 'react';
import { Theme } from '../../hooks/useTheme';
interface Props {
    page: number;
    currentPage: number;
    onClick: (pageNumber: number) => void;
}
export declare const PaginationItem: FC<Props>;
export declare const ItemButton: import("styled-components").StyledComponent<React.FC<import("../Button/BaseButton").ButtonProps>, any, {
    themes: Theme;
}, never>;
export {};
