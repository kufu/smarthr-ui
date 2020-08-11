import { FC } from 'react';
declare type Props = {
    isAdmin: boolean;
    isCrew: boolean;
    displayName: string;
    currentTenantName: string;
    avatar: string;
    onClickAccount: () => void;
    onClickLogout: () => void;
    onClickProfile?: () => void;
    onClickCompany?: () => void;
    onClickSchool?: () => void;
};
export declare const HeaderUserDropdown: FC<Props>;
export {};
