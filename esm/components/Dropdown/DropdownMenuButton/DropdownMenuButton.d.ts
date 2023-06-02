import { ButtonHTMLAttributes, ComponentProps, FC, ReactElement, ReactNode } from 'react';
import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button';
import { RemoteDialogTrigger } from '../../Dialog';
type Actions = ActionItem | ActionItem[];
type ActionItemTruthyType = ReactElement<ComponentProps<typeof Button>> | ReactElement<ComponentProps<typeof AnchorButton>> | ReactElement<ComponentProps<typeof RemoteDialogTrigger>>;
type ActionItemFalsyType = null | undefined | boolean | 0 | '';
type ActionItem = ActionItemTruthyType | ActionItemFalsyType;
type Props = {
    /** 引き金となるボタンラベル */
    label: ReactNode;
    /** 操作群 */
    children: Actions;
    /** 引き金となるボタンの大きさ */
    triggerSize?: ButtonProps['size'];
    /** 引き金となるボタンをアイコンのみとするかどうか */
    onlyIconTrigger?: boolean;
};
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>;
export declare const DropdownMenuButton: FC<Props & ElementProps>;
export {};
