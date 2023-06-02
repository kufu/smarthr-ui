import { ComponentProps, ReactNode, VFC } from 'react';
import { Base } from '../Base';
type JobId = string | number;
export type Status = 'processing' | 'downloading' | 'warning' | 'error' | 'done';
export type JobProps = {
    /** ジョブの ID */
    id: JobId;
    /** ジョブのステータス */
    status: Status;
    /** ジョブ名 */
    name: ReactNode;
    /** ジョブの説明 */
    description: ReactNode;
    /** ジョブがキャンセル可能かどうか */
    isCancelable?: boolean;
};
type Props = {
    /** パネルのタイトル */
    title: string;
    /** バックグラウンドジョブデータの配列 */
    jobs: JobProps[];
    /** パネルを広げるかどうか */
    isExpanded?: boolean;
    /** ジョブのキャンセルボタンクリックのハンドラ */
    onClickCancelJob?: (jobId: JobId) => void;
    /** パネルの開閉ボタンクリックのハンドラ */
    onClickExpansion?: (isExpanded: boolean) => void;
    /** パネルの閉じるボタンクリックのハンドラ */
    onClickClose?: () => void;
};
type ElementProps = Omit<ComponentProps<typeof Base>, keyof Props | 'children'>;
export declare const BackgroundJobsPanel: VFC<Props & ElementProps>;
export {};
