import { FC, HTMLAttributes, ReactNode } from 'react';
type Props = {
    /** ロゴ */
    logo?: ReactNode;
    /** コンテンツの上に表示されるタイトル */
    title?: ReactNode;
    /** コンテンツの下に表示されるアンカー要素のリスト */
    links?: Array<{
        /** アンカー要素のテキスト */
        label: ReactNode;
        /** アンカー要素の href */
        url: string;
        /** アンカー要素の target。`_blank` を設定すると外部リンクアイコンが表示されます。*/
        target?: string;
    }>;
    /** 表示するコンテンツ */
    children?: ReactNode;
    /** フッター */
    footer?: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const MessageScreen: FC<Props & ElementProps>;
export {};
