import React, { HTMLAttributes } from 'react';
export declare const messageTypes: readonly ["info", "success", "error", "warning"];
type Props = {
    /** メッセージの種類 */
    type: (typeof messageTypes)[number];
    /** 強調するかどうか */
    bold?: boolean;
    /** スライドインするかどうか */
    animate?: boolean;
    /** メッセージ */
    message: React.ReactNode;
    /** 閉じるボタン押下時に発火させる関数 */
    onClose?: () => void;
    /** アクション群 */
    children?: React.ReactNode;
    /** role 属性 */
    role?: 'alert' | 'status';
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const NotificationBar: React.FC<Props & ElementProps>;
export {};
