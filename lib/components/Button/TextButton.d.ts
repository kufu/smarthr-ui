import { VFC } from 'react';
import { AnchorProps as BaseAnchorProps, ButtonProps as BaseButtonProps } from './BaseButton';
type ButtonProps = Omit<BaseButtonProps, 'square'>;
type AnchorProps = Omit<BaseAnchorProps, 'square'>;
/**
 * @deprecated `TextButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
export declare const TextButton: VFC<ButtonProps>;
/**
 * @deprecated `TextButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
export declare const TextButtonAnchor: VFC<AnchorProps>;
export {};
