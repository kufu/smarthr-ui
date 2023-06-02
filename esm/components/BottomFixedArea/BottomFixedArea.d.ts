import React, { ComponentProps, FunctionComponentElement, HTMLAttributes, ReactNode, VFC } from 'react';
import { AnchorButton, Button, PrimaryButton, PrimaryButtonAnchor, SecondaryButton, SecondaryButtonAnchor } from '../Button';
import { TertiaryLink } from './TertiaryLink';
export type Primary = FunctionComponentElement<ComponentProps<typeof Button>> | FunctionComponentElement<ComponentProps<typeof AnchorButton>> | FunctionComponentElement<ComponentProps<typeof PrimaryButton>> | FunctionComponentElement<ComponentProps<typeof PrimaryButtonAnchor>>;
export type Secondary = FunctionComponentElement<ComponentProps<typeof Button>> | FunctionComponentElement<ComponentProps<typeof AnchorButton>> | FunctionComponentElement<ComponentProps<typeof SecondaryButton>> | FunctionComponentElement<ComponentProps<typeof SecondaryButtonAnchor>>;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
type Props = {
    /** この領域の説明 */
    description?: ReactNode;
    /** 表示する `Button` または `AnchorButton` （`variant="primary"` である必要がある） */
    primaryButton?: Primary;
    /** 表示する `Button` または `AnchorButton` （`variant="secondary"` である必要がある）*/
    secondaryButton?: Secondary;
    /** 表示する tertialy link のプロパティの配列 */
    tertiaryLinks?: Array<React.ComponentProps<typeof TertiaryLink>>;
    /** コンポーネントに適用する z-index 値 */
    zIndex?: number;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
export declare const BottomFixedArea: VFC<Props & ElementProps>;
export {};
