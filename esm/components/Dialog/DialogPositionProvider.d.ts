import React from 'react';
declare type PositionContextType = {
    top?: number;
    bottom?: number;
};
export declare const PositionContext: React.Context<PositionContextType>;
export declare const DialogPositionProvider: React.FC<PositionContextType>;
export {};
