import * as React from 'react';
export interface ExternalProps {
    className?: string;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onTouchStart?: (e: any) => void;
    onTouchEnd?: (e: any) => void;
}
export interface InjectedProps {
    className: string;
    onMouseEnter: (e: any) => void;
    onMouseLeave: (e: any) => void;
    onTouchStart: (e: any) => void;
    onTouchEnd: (e: any) => void;
}
interface Options {
    hoverClassName?: string;
}
export declare const hoverable: ({ hoverClassName }?: Options) => <OriginalProps extends Record<string, unknown>>(WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>) => {
    new (props: (OriginalProps & ExternalProps) | Readonly<OriginalProps & ExternalProps>): {
        state: {
            isHover: boolean;
        };
        render(): React.JSX.Element;
        onMouseEnter: (e: any) => void;
        onMouseLeave: (e: any) => void;
        onTouchStart: (e: any) => void;
        onTouchEnd: (e: any) => void;
        context: unknown;
        setState<K extends "isHover">(state: {
            isHover: boolean;
        } | ((prevState: Readonly<{
            isHover: boolean;
        }>, props: Readonly<OriginalProps & ExternalProps>) => {
            isHover: boolean;
        } | Pick<{
            isHover: boolean;
        }, K> | null) | Pick<{
            isHover: boolean;
        }, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<OriginalProps & ExternalProps>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<OriginalProps & ExternalProps>, nextState: Readonly<{
            isHover: boolean;
        }>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<OriginalProps & ExternalProps>, prevState: Readonly<{
            isHover: boolean;
        }>): any;
        componentDidUpdate?(prevProps: Readonly<OriginalProps & ExternalProps>, prevState: Readonly<{
            isHover: boolean;
        }>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<OriginalProps & ExternalProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<OriginalProps & ExternalProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<OriginalProps & ExternalProps>, nextState: Readonly<{
            isHover: boolean;
        }>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<OriginalProps & ExternalProps>, nextState: Readonly<{
            isHover: boolean;
        }>, nextContext: any): void;
    };
    new (props: OriginalProps & ExternalProps, context: any): {
        state: {
            isHover: boolean;
        };
        render(): React.JSX.Element;
        onMouseEnter: (e: any) => void;
        onMouseLeave: (e: any) => void;
        onTouchStart: (e: any) => void;
        onTouchEnd: (e: any) => void;
        context: unknown;
        setState<K extends "isHover">(state: {
            isHover: boolean;
        } | ((prevState: Readonly<{
            isHover: boolean;
        }>, props: Readonly<OriginalProps & ExternalProps>) => {
            isHover: boolean;
        } | Pick<{
            isHover: boolean;
        }, K> | null) | Pick<{
            isHover: boolean;
        }, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<OriginalProps & ExternalProps>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<OriginalProps & ExternalProps>, nextState: Readonly<{
            isHover: boolean;
        }>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<OriginalProps & ExternalProps>, prevState: Readonly<{
            isHover: boolean;
        }>): any;
        componentDidUpdate?(prevProps: Readonly<OriginalProps & ExternalProps>, prevState: Readonly<{
            isHover: boolean;
        }>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<OriginalProps & ExternalProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<OriginalProps & ExternalProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<OriginalProps & ExternalProps>, nextState: Readonly<{
            isHover: boolean;
        }>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<OriginalProps & ExternalProps>, nextState: Readonly<{
            isHover: boolean;
        }>, nextContext: any): void;
    };
    displayName: string;
    contextType?: React.Context<any> | undefined;
};
export {};
