// src/services/ht-messagesService.js
import { ref } from 'vue';
import { initializeAudioRecording, startRecording, stopRecording } from './ht-audioInputService';
import { playRecordedAudio } from './ht-audioOutputService';

// =========================================================
// VARIÁVEIS DE ESTADO DO ÁUDIO
// =========================================================
export const mediaRecorder = ref(null);
export const isRecording = ref(false);
export const hasMicPermission = ref(false);

// =========================================================
// EXPORTAÇÕES COMPOSTAS
// =========================================================
export {
  initializeAudioRecording,
  startRecording,
  stopRecording,
  playRecordedAudio
};
