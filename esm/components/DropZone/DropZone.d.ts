import React, { ChangeEvent, DragEvent } from 'react';
declare type DropZoneProps = {
    onSelectFiles: (e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>, files: FileList | null) => void;
    accept?: string;
};
export declare const DropZone: React.FC<DropZoneProps>;
export {};
