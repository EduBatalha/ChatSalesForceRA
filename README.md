# Novos chats para suporte RA

Este projeto implementa um chat integrado com o Salesforce e o Einstein Bot, permitindo que os clientes interajam com um bot para obter suporte e, se necessário, sejam transferidos para um agente humano.

## Arquitetura
O projeto utiliza a arquitetura padrão do Salesforce com Lightning Web Components (LWC) para construir a interface do usuário e Apex para interagir com as APIs do Salesforce e do Einstein Bot.

### Estrutura do Projeto (force-app)

- lwc-chat-app: Componente principal que gerencia a interface do chat, incluindo a tela inicial, o pré-formulário e a integração com o bot e o Live Agent.

- lwc-message-components: Componentes para exibir as mensagens do chat, a entrada de texto do usuário e as respostas do bot.

- lwc-salesforce-services: Componente para encapsular a comunicação com as APIs do Salesforce, incluindo o Einstein Bot e o Live Agent.

- lwc-utils: Funções utilitárias para auxiliar no desenvolvimento, como formatação de mensagens, manipulação de dados, etc.

Fluxo de Atendimento
1. Tela Inicial: Exibe a tela inicial com opções para iniciar o atendimento ou conhecer produtos.

2. Pré-formulário: Coleta informações básicas do cliente antes de iniciar o chat.

3. Chat com Bot: Inicia a conversa com o Einstein Bot.

4. Transferência para Agente: Se o bot não conseguir resolver o problema, transfere a conversa para um agente humano através do Live Agent.

## How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
