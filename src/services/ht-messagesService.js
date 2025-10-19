// src/services/ht-messagesService.js
import { ref } from 'vue';

// =========================================================
// VARIÁVEIS DE ESTADO DO ÁUDIO (Expostas)
// =========================================================
export const mediaRecorder = ref(null);
const audioChunks = [];
export const isRecording = ref(false);
export const hasMicPermission = ref(false);

// =========================================================
// FUNÇÃO DE INICIALIZAÇÃO E PERMISSÃO DO MICROFONE
// =========================================================
/**
 * Solicita permissão ao microfone e inicializa o MediaRecorder.
 */
export const initializeAudioRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        hasMicPermission.value = true;
        mediaRecorder.value = new MediaRecorder(stream);

        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.value.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            // Você pode retornar o Blob para o App.vue ou fazer o upload aqui.
            console.log("🎙️ Áudio gravado (Playback local):", audioBlob);
            
            // Exemplo: Playback local imediato
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();

            audioChunks.length = 0; // Limpa o array
        };
        
        return true; // Sucesso na inicialização

    } catch (err) {
        console.error("🚫 Erro ao acessar microfone:", err);
        hasMicPermission.value = false;
        return false; // Falha na inicialização
    }
};


// =========================================================
// FUNÇÕES DE CONTROLE DE GRAVAÇÃO (Expostas)
// =========================================================

/**
 * Inicia a gravação de áudio.
 */
export const startRecording = () => {
    if (mediaRecorder.value && hasMicPermission.value) {
        audioChunks.length = 0; // Garante que o array está limpo
        mediaRecorder.value.start();
        isRecording.value = true;
        console.log("🔴 Gravando...");
    }
};

/**
 * Para a gravação de áudio.
 */
export const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;
        console.log("🟢 Gravação finalizada.");
    }
};

