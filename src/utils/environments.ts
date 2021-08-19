export function isDebug():boolean{
    return !!(window as any).webpackHotUpdate;
}

export const APP_VARS = {
    serverUrl: 'http://78.37.233.82',
    protoPort: '6001',
    signalPort: '6002',
    signalLogHub: 'logHub'
}