// ht-messagesService.js

/**
 * Simula o recebimento de mensagens.
 * @returns {Promise<Array<Object>>} Uma promessa que resolve para um array de mensagens.
 */
export const fetchMessages = async () => {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500)); 

    return [
        { 
            id: 101, 
            senderId: 2, // Destinatário (recebida por MY_USER_ID=1)
            recipientId: 1, 
            type: 'audio', 
            content: 'Audio Blob Simulado - 1 (3s)', 
            timestamp: new Date(Date.now() - 300000).toLocaleTimeString() 
        },
        { 
            id: 102, 
            senderId: 1, // Eu (enviada por MY_USER_ID=1)
            recipientId: 2, 
            type: 'audio', 
            content: 'Audio Blob Simulado - 2 (5s)', 
            timestamp: new Date(Date.now() - 120000).toLocaleTimeString() 
        },
        { 
            id: 103, 
            senderId: 2, 
            recipientId: 1, 
            type: 'text', 
            content: 'Olá, me ouve? Aqui só aparecem as mensagens estáticas.', 
            timestamp: new Date(Date.now() - 60000).toLocaleTimeString() 
        },
    ];
};

/**
 * Simula o playback de uma mensagem PTT.
 * @param {Object} message O objeto da mensagem a ser "tocada".
 */
export const playPttMessage = (message) => {
    if (message.type === 'audio') {
        // Em uma aplicação real, você usaria o 'content' (se fosse um Blob real)
        // ou buscar o áudio do servidor para tocar.
        console.log(`▶️ Mensagem PTT ID ${message.id} (de ID ${message.senderId}) está sendo tocada.`);
        
        // Simulação de playback
        const duration = message.content.includes('(3s)') ? 3000 : 5000;
        
        // Você pode adicionar uma simulação de atraso aqui
        setTimeout(() => {
            console.log(`⏹️ Playback da Mensagem ID ${message.id} finalizado.`);
        }, duration);

    } else {
        console.warn(`Mensagem ID ${message.id} não é de áudio. Ignorando playback.`);
    }
};


