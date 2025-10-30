// src/services/ht-audioInputService.js
                         
import { mediaRecorder, isRecording, hasMicPermission } from './ht-messagesService';            
import { routeAudioMessage } from './ht-messagesRouter'; // <-- NOVO IMPORTADO
                                    
const audioChunks = [];

// =========================================================
// INICIALIZAÇÃO DO MICROFONE
// =========================================================
export const initializeAudioRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    hasMicPermission.value = true;
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
      // CHAMADA ATUALIZADA: Envia o Blob para o router, que fará o playback
      routeAudioMessage(audioBlob); 

      audioChunks.length = 0;
      console.log('🎙️ Áudio gravado (Blob criado, enviado para Router):', audioBlob); // Log ajustado
    };

    return true;
  } catch (err) {
    console.error('🚫 Erro ao acessar microfone:', err);
    hasMicPermission.value = false;
    return false;
  }
};

// =========================================================
// CONTROLE DE GRAVAÇÃO
// =========================================================
export const startRecording = () => {
  if (mediaRecorder.value && hasMicPermission.value) {
    audioChunks.length = 0;
    mediaRecorder.value.start();
    isRecording.value = true;
    console.log('🔴 Gravando...');
  }
};

export const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    console.log('🟢 Gravação finalizada.');
  }
};

