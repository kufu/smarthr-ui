import React, { HTMLAttributes, ReactElement, ReactNode } from 'react';
type Tenant = {
    id: string;
    name: ReactNode;
};
type Props = {
    /** ロゴ */
    logo?: ReactElement;
    /** ロゴリンク */
    logoHref?: string;
    /** テナント一覧 */
    tenants?: Tenant[];
    /** 現在のテナント ID */
    currentTenantId?: string;
    /** テナントが選択された時に発火するコールバック関数 */
    onTenantSelect?: (id: string) => void;
    /** 操作領域 */
    children?: React.ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>;
export declare const Header: React.VFC<Props & ElementProps>;
export {};
