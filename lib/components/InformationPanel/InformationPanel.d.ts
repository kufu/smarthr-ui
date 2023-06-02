import React, { VFC } from 'react';
import { DecoratorsType } from '../../types/props';
import { BaseElementProps } from '../Base';
import { HeadingTagTypes } from '../Heading';
type Props = {
    /** パネルのタイトル */
    title: React.ReactNode;
    /** タイトル部分の HTML タグ */
    titleTag?: HeadingTagTypes;
    /** 表示する情報のタイプ */
    type?: 'success' | 'info' | 'warning' | 'error' | 'sync';
    /** `true` のとき、開閉ボタンを表示する */
    togglable?: boolean;
    /** パネルの開閉の状態 */
    active?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** パネル内に表示する内容 */
    children: React.ReactNode;
    /** 開閉ボタン押下時に発火するコールバック関数 */
    onClickTrigger?: (active: boolean) => void;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'openButtonLabel' | 'closeButtonLabel'>;
};
export declare const InformationPanel: VFC<Props & Omit<BaseElementProps, keyof Props>>;
export {};
