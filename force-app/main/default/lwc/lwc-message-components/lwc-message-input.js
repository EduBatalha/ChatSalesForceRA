import { LightningElement, api } from 'lwc';

export default class LwcMessageInput extends LightningElement {
    @api value = '';
    @api disabled = false;

    handleChange(event) {
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('inputchange', { detail: { value } }));
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !this.disabled) {
            this.dispatchEvent(new CustomEvent('sendmessage'));
        }
    }
}