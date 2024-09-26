import { LightningElement, api } from 'lwc';

export default class MessageList extends LightningElement {
    @api reversedMessages;

    get formattedMessages() {
        return this.reversedMessages.map(message => ({
            ...message,
            className: message.isUserMessage ? 'user-message' : 'bot-message'
        }));
    }
}
