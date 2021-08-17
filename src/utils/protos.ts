export function toDate(timestamp: { seconds: number, nanos: number }): Date {
    const secs = timestamp.seconds * 1000;
    const nans = timestamp.nanos / 1e6;
    const resultTime = new Date(secs + nans);
    return resultTime;
}