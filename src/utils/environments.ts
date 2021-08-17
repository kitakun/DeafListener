export function isDebug():boolean{
    return !!(window as any).webpackHotUpdate;
}

export const APP_VARS = {
    serverUrl: 'http://78.37.233.82',
    protoPort: '5000',
    signalPort: '5002',
    signalLogHub: 'logHub'
}