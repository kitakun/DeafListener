export function isDebug():boolean{
    return !!(window as any).webpackHotUpdate;
}

export const APP_VARS = {
    serverUrl: 'https://78.81.147.40',
    protoPort: '6001',
    signalPort: '6002',
    signalLogHub: 'logHub'
}