import { AxiosResponse, Method } from 'axios';
import { HttpApiErrorParser, UploadStateArgs } from './network.type';
export declare const axiosResponseToData: <T>(axiosRes: AxiosResponse<T>) => T;
export declare function axiosCreateHeader(headerProvider: () => Record<string, string>): {
    common: Record<string, string>;
};
export declare const throwNewErrorForLib: <T>(parserVisitor: HttpApiErrorParser<T, Error>) => (anyError: any) => never;
export declare const axiosUploadCommon: (baseUrl: string, parserVisitor: HttpApiErrorParser<AxiosResponse>, headerProvider: () => Record<string, string>, withCredentials?: boolean) => <T>(method: Method, url: string, data: FormData, progCallback?: (args: UploadStateArgs) => void, timeout?: number) => Promise<T>;
export declare function convertToFormData(data: Record<string, string | File | File[]>): FormData;
