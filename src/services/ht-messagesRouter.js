// src/services/ht-messagesRouter.js
import { playRecordedAudio } from './ht-audioOutputService';

/**
 * 🎤 Roteia o áudio gravado (Blob) para o serviço de output (playback local).
 * * NOTA: Em uma aplicação real, este router também seria responsável
 * por enviar o áudio para o backend para processamento (e.g., Speech-to-Text).
 * * @param {Blob} audioBlob O objeto Blob contendo os dados de áudio gravado.
 */
export const routeAudioMessage = (audioBlob) => {
    console.log('➡️ Roteando mensagem de áudio...');

    // 1. Simulação de processamento/envio (Placeholder)
    // Aqui seria onde você adicionaria a lógica para enviar o áudio
    // para um servidor para transcrição ou processamento.
    // e.g., sendAudioToServer(audioBlob);

    // 2. Encaminha para o serviço de output para playback local
    playRecordedAudio(audioBlob);
    console.log('✅ Áudio enviado para playback local.');
};

