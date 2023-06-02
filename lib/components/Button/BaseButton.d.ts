import React, { VFC } from 'react';
type Tag = 'button' | 'a';
export type ButtonProps = BaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;
export type AnchorProps = BaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;
export type BaseProps = {
    /**
     * ボタンの大きさ
     * @default 'default'
     */
    size?: 'default' | 's';
    /**
     * ボタン内に表示する内容
     */
    children?: React.ReactNode;
    /**
     * コンポーネントに適用するクラス名
     */
    className?: string;
    /**
     * ボタン内の先頭に表示する内容。
     * 通常は、アイコンを表示するために用いる。
     */
    prefix?: React.ReactNode;
    /**
     * ボタン内の末尾に表示する内容。
     * 通常は、アイコンを表示するために用いる。
     */
    suffix?: React.ReactNode;
    /**
     * `true` のとき、ボタンを正方形にする。
     * @default false
     */
    square?: boolean;
    /**
     * `true` のとき、ボタンの `width` を 100% にする。
     */
    wide?: boolean;
};
export declare const buttonFactory: <Props extends BaseProps>(tag: Tag) => React.VFC<Props>;
export declare const BaseButton: VFC<ButtonProps>;
export declare const BaseButtonAnchor: import("styled-components").StyledComponent<React.VFC<AnchorProps>, any, {}, never>;
export {};
