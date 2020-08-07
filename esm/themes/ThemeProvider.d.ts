import * as React from 'react';
import { CreatedTheme } from '../themes/createTheme';
export declare const ThemeContext: React.Context<CreatedTheme>;
interface Props extends React.Props<Record<string, unknown>> {
    theme: CreatedTheme;
}
export declare const ThemeProvider: React.FC<Props>;
export {};
