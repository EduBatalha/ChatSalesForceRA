import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOT_STARTED_CHANNEL from '@salesforce/messageChannel/BotStarted__c';
import BOT_RESPONSE_CHANNEL from '@salesforce/messageChannel/BotResponse__c';
import { createRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

// Campos do objeto Case para exibir no chat
const CASE_FIELDS = [
    'Case.CaseNumber',
    'Case.Subject',
    'Case.Description',
    'Case.Status'
];

export default class LwcChatApp extends NavigationMixin(LightningElement) {
    @track caseId; 
    @track messages = []; 
    @track userInput = ''; 
    @track isChattingWithBot = false; 
    @track isAgentConnected = false;

    subscription = null;

    @wire(CurrentPageReference) pageRef;
    @wire(MessageContext) messageContext;
    @wire(getRecord, { recordId: '$caseId', fields: CASE_FIELDS })
    caseRecord;

    // Variáveis para gerenciar a sessão do chat
    sessionId;
    affinityToken;
    key;
    sequence;

    connectedCallback() {
        this.subscribeToBotStartedChannel();
        this.subscribeToBotResponseChannel();

        // Lógica para verificar se o chat já está em andamento ou iniciado
        // ... (implementação depende da sua lógica de gerenciamento de sessão)
    }

    disconnectedCallback() {
        this.unsubscribeFromBotStartedChannel();
        this.unsubscribeFromBotResponseChannel();
    }

    subscribeToBotStartedChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                BOT_STARTED_CHANNEL,
                (message) => this.handleBotStarted(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeFromBotStartedChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleBotStarted(message) {
        this.caseId = message.caseId;
        this.isChattingWithBot = true;
    }

    // ... (métodos similares para BOT_RESPONSE_CHANNEL)

    handleUserInputChange(event) {
        this.userInput = event.target.value;
    }

    handleSendMessage() {
        if (this.userInput.trim() !== '') {
            this.messages.push({ 
                text: this.userInput, 
                isUserMessage: true 
            });

            if (this.isChattingWithBot) {
                this.sendMessageToBot(this.userInput);
            } else if (this.isAgentConnected) {
                this.sendMessageToAgent(this.userInput); 
            }

            this.userInput = ''; 
        }
    }

    sendMessageToBot(message) {
        // Lógica para enviar mensagem ao Einstein Bot (implementação depende da API específica)
        // ... 

        // Exemplo usando Live Agent REST API para enviar mensagem ao bot
        // Certifique-se de ter a configuração correta do Live Agent e do Einstein Bot
        /*
        const endpoint = '/chat/rest/System/Messages'; 
        const body = {
            "text": message,
            "context": { ... } // Contexto adicional, se necessário
        };

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionId // Substitua 'sessionId' pelo ID da sessão do chat
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem ao bot');
            }
            return response.json();
        })
        .then(data => {
            // ... (lógica para lidar com a resposta do bot)
        })
        .catch(error => {
            this.showErrorToast('Erro ao enviar mensagem ao bot');
            console.error(error);
        });
        */
    }

    sendMessageToAgent(message) {
        const endpoint = `/chat/rest/Chasitor/ChatMessage`;
        const body = {
            "text": message
        };

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-LIVEAGENT-API-VERSION': '43',
                'X-LIVEAGENT-AFFINITY': this.affinityToken,
                'X-LIVEAGENT-SESSION-KEY': this.key,
                'X-LIVEAGENT-SEQUENCE': this.sequence
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar mensagem ao agente');
                }
                this.sequence++; 
                return response.json();
            })
            .then(data => {
                // ... (opcional: lógica para lidar com a resposta da API, se necessário)
            })
            .catch(error => {
                this.showErrorToast('Erro ao enviar mensagem ao agente');
                console.error(error);
            });
    }

    handleTransferToAgent() {
        // Lógica para solicitar a transferência, se necessário)

        // Inicia a sessão do chat com o Live Agent após a transferência ser concluída
        this.startChatSession(); 
    }

    startChatSession() {
        const endpoint = '/chat/rest/System/SessionId';

        fetch(endpoint, {
            method: 'GET',
            headers: {
                'X-LIVEAGENT-API-VERSION': '43',
                'X-LIVEAGENT-AFFINITY': this.affinityToken || null 
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao iniciar a sessão do chat');
                }
                return response.json();
            })
            .then(data => {
                this.sessionId = data.id;
                this.affinityToken = data.affinityToken;
                this.key = data.key;
                this.sequence = 1; 

                this.isChattingWithBot = false;
                this.isAgentConnected = true; 
                this.showSuccessToast('Conectado a um agente');

                // Inicia o polling para receber mensagens do agente
                this.startPollingForAgentMessages();
            })
            .catch(error => {
                this.showErrorToast('Erro ao iniciar a sessão do chat');
                console.error(error);
            });
    }

    startPollingForAgentMessages() {
        setInterval(() => {
            if (this.isAgentConnected) {
                this.checkForNewAgentMessages();
            }
        }, 3000); // Verifica a cada 3 segundos (ajuste conforme necessário)
    }

    checkForNewAgentMessages() {
        const endpoint = `/chat/rest/System/Messages?ack=${this.sequence - 1}`;

        fetch(endpoint, {
            method: 'GET',
            headers: {
                'X-LIVEAGENT-API-VERSION': '43',
                'X-LIVEAGENT-AFFINITY': this.affinityToken,
                'X-LIVEAGENT-SESSION-KEY': this.key
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar mensagens do agente');
                }
                return response.json();
            })
            .then(data => {
                // Processa as novas mensagens recebidas do agente
                const newMessages = data.messages;
                for (const message of newMessages) {
                    if (message.type === 'ChatMessage' && message.origin === 'Agent') {
                        this.messages.push({
                            text: message.text,
                            isUserMessage: false 
                        });
                        this.sequence = message.sequence + 1; 
                    }
                    // ... (lógica para lidar com outros tipos de mensagens, se necessário)
                }
            }
        )}
    }