import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { Stack } from '../../Layout';
import { Text } from '../../Text';
type Props = PropsWithChildren<{
    /** 分類ラベル */
    name: ReactNode;
    /** 分類ラベルの HTML タグ */
    nameTag?: ComponentProps<typeof Text>['as'];
}>;
type ElementProps = ComponentProps<typeof Stack>;
export declare const SideMenuGroup: React.FC<Props & ElementProps>;
export {};
