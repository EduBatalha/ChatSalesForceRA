import { LightningElement, api } from 'lwc';

export default class LwcMessageList extends LightningElement {
    @api messages = []; // Array de objetos { text, isUserMessage }

    get reversedMessages() {
        return [...this.messages].reverse(); 
    }
}