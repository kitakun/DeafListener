export default class StorageService {

    public load<T>(key: string): T | null {
        const existingItem = localStorage.getItem(key)
        if (existingItem) {
            return JSON.parse(existingItem) as T;
        }
        return null;
    }

    public save<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }
}