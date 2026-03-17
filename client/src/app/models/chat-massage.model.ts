export interface ChatMessage {
    id: any;
    user: string;
    message: string;
    TimeStamp: string|Date;
    isMine?: boolean;
}