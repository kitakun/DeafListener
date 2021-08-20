/**
 * Sort by Date DESC
 * @param a Date A
 * @param b Date B
 * @returns sorted result of these two
 */
export function sortByDate(a: Date, b: Date): number {
    return b.getTime() - a.getTime();
};

/**
 * Sort by created Date DESC
 * @param a Date A
 * @param b Date B
 * @returns sorted result of these two
 */
export function sortByCreatedDate(a: { createdAt: Date }, b: { createdAt: Date }): number {
    return sortByDate(a.createdAt, b.createdAt);
};

/**
 * Sort by string of Date DESC
 * @param a Date A
 * @param b Date B
 * @returns sorted result of these two
 */
export function sortByStringDate(a: { createdAt: string }, b: { createdAt: string }): number {
    return sortByDate(new Date(a.createdAt), new Date(b.createdAt));
};