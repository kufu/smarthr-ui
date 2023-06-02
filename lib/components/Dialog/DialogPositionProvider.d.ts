import React from 'react';
type PositionContextType = {
    top?: number;
    bottom?: number;
};
export declare const PositionContext: React.Context<PositionContextType>;
export declare const DialogPositionProvider: React.VFC<PositionContextType & {
    children?: React.ReactNode;
}>;
export {};
