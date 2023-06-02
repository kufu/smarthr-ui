import * as React from 'react';
import { CreatedTheme } from '../themes/createTheme';
export declare const ThemeContext: React.Context<CreatedTheme>;
interface Props {
    theme: CreatedTheme;
    children?: React.ReactNode;
}
export declare const ThemeProvider: React.VFC<Props>;
export {};
