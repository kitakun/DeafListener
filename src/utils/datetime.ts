export function formatLogTime(date: Date): string {

    const month = date.getMonth() + 1;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${date.getDate()}.${addZeroIfNeed(month)}.${date.getFullYear()} ${addZeroIfNeed(hours)}:${addZeroIfNeed(minutes)}`;
}

function addZeroIfNeed(val: number): string | number {
    if (val < 9)
        return `0${val}`;
    return val;
}