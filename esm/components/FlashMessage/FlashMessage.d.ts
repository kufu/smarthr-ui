import { HTMLAttributes, ReactNode, VFC } from 'react';
export declare const messageTypes: readonly ["success", "info", "warning", "error"];
export declare const animationTypes: readonly ["bounce", "fade", "none"];
export declare const roles: readonly ["alert", "status"];
export type Props = {
    /** true のときに FlashMessage を表示する */
    visible: boolean;
    /** 表示するアイコンのタイプ */
    type: (typeof messageTypes)[number];
    /** メッセージの内容 */
    text: ReactNode;
    /** アニメーションのタイプ */
    animation?: (typeof animationTypes)[number];
    /** コンポーネントに適用する role 属性 */
    role?: (typeof roles)[number];
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** 閉じるボタンを押下、または表示してから8秒後に発火するコールバック関数 */
    onClose: () => void;
    /** FlashMessage が表示されてから一定時間後に自動で閉じるかどうか */
    autoClose?: boolean;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
export declare const FlashMessage: VFC<Props & ElementProps>;
export {};
