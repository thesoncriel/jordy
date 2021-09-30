import { ComponentType, FC } from 'react';
interface AsyncGuardProps {
    redirect?: string;
    failComponent?: ComponentType<any>;
    guard?: () => boolean | Promise<boolean>;
}
export declare const AsyncGuard: FC<AsyncGuardProps>;
export {};
