export default interface LoadingAction {
    id: symbol;
    isFinished: boolean;
    isCancelled: boolean;
    finish(): void;
    cancel(): void;
}