import { ErrorType, Methods, Operator, Environment } from './enum';

interface IUser {
    name: string;
    email: string;
}
interface ICallback {
    callback: Function;
}
export interface IConfigs {
    apikey: string;
    appversion?: string;
    env?: Environment;
    user?: IUser;
    metaData?: object;
    callback?: ICallback;
    setHttpBody?: boolean;
    httpTimeout?: number;
    filters?: object[];
    isDev?: boolean;
    isResource?: boolean;
    isHttp?: boolean;
    isWebsocket?: boolean;
    isConsole?: boolean;
    isPerformance?: boolean;
    sampleRate?: number;
    domain?: string;
    sensitive?: Array<string>;
}
export interface IIPInfo {
    IP: string;
    address: string;
    operator: Operator;
}
export interface IBaseInfo {
    createTime: string;
    errorType: ErrorType;
}
export interface IRequestInfo {
    request: {
        url: string;
        method: Methods;
    },
    response: {
        status: number;
        errMsg: string;
        elapsedTime: string;
    }
}
export interface IOtherInfo {
    plugInVersion: string;
    eventId: string;
}
export interface IErrorInfo {
    noticeVersion: string;
    userAgent: string;
    url: string;
    title: string;
    name: string;
    time: string;
    type: ErrorType;
    jsError: {
        message: string;
        fileName: string;
        function: string;
        lineNumber: number;
        stacktrace: string;
    }
}
export type IResourceInfo = Omit<IErrorInfo, 'jsError'> & {
    target: {
        outerHTML: string;
        src: string;
        tagName: string;
        id: string;
        className: string;
        name: string;
        XPath: string;
        selector: string;
        status: number;
        statusText: string;
    }
}

export type IHTTPInfo = Omit<IErrorInfo, 'jsError'> & {
    req: IRequestInfo['request'];
    res: IRequestInfo['response'];
}
export type IPromiseInfo = Omit<IErrorInfo, 'jsError'> & {
    message: string;
}
export type IWebSockectInfo = Omit<IErrorInfo, 'jsError'> & {
    target: {
        type: ErrorType;
        url: string;
        timeStamp: string;
    }
}
