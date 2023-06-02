import React from 'react';
import { ElementProps as InnerElementProps } from './DropdownContentInner';
export declare const DropdownContentContext: React.Context<{
    onClickCloser: () => void;
    controllable: boolean;
    scrollable: boolean;
}>;
type Props = {
    /**
     * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
     *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
     */
    controllable?: boolean;
    /** `true` のとき、ウィンドウサイズに応じてドロップダウン内が自動的にスクロール可能になる */
    scrollable?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    children?: React.ReactNode;
};
type ElementProps = Omit<InnerElementProps, keyof Props>;
export declare const DropdownContent: React.VFC<Props & ElementProps>;
export {};
