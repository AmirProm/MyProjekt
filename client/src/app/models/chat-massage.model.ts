export interface ChatMessage {
    user: string;
    message: string;
    TimeStamp: string|Date;
    isMine?: boolean;
}