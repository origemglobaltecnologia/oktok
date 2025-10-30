// src/services/ht-audioOutputService.js

// =========================================================
// SAÍDA E NOTIFICAÇÕES DE ÁUDIO
// =========================================================
export const playRecordedAudio = (audioBlob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};
