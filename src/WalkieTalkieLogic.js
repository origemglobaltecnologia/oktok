// src/WalkieTalkieLogic.js (Este arquivo conterá toda a lógica JS)

import { ref, onMounted } from 'vue';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws'; // Sua URL
const CHUNK_INTERVAL = 200; 

// Toda a lógica é exportada como funções e estados reativos (ref)
export function useWalkieTalkie(senderId, recipientId) {
    const connectionStatus = ref('Desconectado');
    const isConnected = ref(false);
    const stompClient = ref(null);
    const isRecording = ref(false);
    const audioQueue = ref([]);
    const isQueuePlaying = ref(false);
    
    // Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let mediaRecorder = null;
    let audioStream = null;

    // --- CONEXÃO ---
    const connectWebSocket = () => {
        const socket = new SockJS(WS_URL);
        stompClient.value = Stomp.over(socket);
        stompClient.value.debug = null;

        stompClient.value.connect({}, frame => {
            connectionStatus.value = `Conectado como ID: ${senderId.value}`;
            isConnected.value = true;
            
            stompClient.value.subscribe('/topic/public.messages', onAudioReceived);
            stompClient.value.subscribe(`/user/${senderId.value}/queue/messages`, onAudioReceived);
            
        }, error => {
            connectionStatus.value = 'Erro na Conexão. Tentando novamente...';
            console.error('Erro no STOMP: ' + error);
            setTimeout(connectWebSocket, 5000);
        });
    };

    // --- REPRODUÇÃO (playNextChunk) ---
    const playNextChunk = () => {
        if (audioQueue.value.length === 0) {
            isQueuePlaying.value = false;
            return;
        }

        isQueuePlaying.value = true;
        const audioChunk = audioQueue.value.shift(); 

        audioContext.decodeAudioData(audioChunk, buffer => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0); 

            source.onended = () => {
                playNextChunk(); 
            };
        }, error => {
            console.error("Erro ao decodificar áudio:", error);
            playNextChunk();
        });
    };
    
    // --- RECEBIMENTO ---
    const onAudioReceived = (stompMessage) => {
        const audioMessage = JSON.parse(stompMessage.body);
        
        if (audioMessage.senderId === senderId.value) return;
        
        const audioBytes = new Uint8Array(audioMessage.audioData);
        audioQueue.value.push(audioBytes.buffer);

        if (!isQueuePlaying.value) {
            playNextChunk();
        }
    };
    
    // --- ENVIO ---
    const handleAudioChunk = (event) => {
        if (event.data.size > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                const audioBytes = Array.from(new Uint8Array(reader.result)); 

                const audioMessage = {
                    senderId: senderId.value,
                    recipientIdentifier: String(recipientId.value),
                    audioData: audioBytes, 
                    timestamp: Date.now()
                };
                
                if (stompClient.value && stompClient.value.connected) {
                    stompClient.value.send("/app/sendAudio", {}, JSON.stringify(audioMessage));
                }
            };
            reader.readAsArrayBuffer(event.data);
        }
    };

    // --- PTT ---
    const startRecording = async () => {
        if (isRecording.value) return;
        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
            isRecording.value = true;
            
            mediaRecorder.ondataavailable = handleAudioChunk;
            mediaRecorder.start(CHUNK_INTERVAL); 
            
        } catch (err) {
            console.error('Erro ao acessar microfone:', err);
            alert('Permissão de microfone negada ou erro!');
            isRecording.value = false;
        }
    };

    const stopRecording = () => {
        if (!isRecording.value) return;
        mediaRecorder.stop();
        isRecording.value = false;
        audioStream.getTracks().forEach(track => track.stop());
    };
    
    // Conecta automaticamente quando o componente é montado
    onMounted(connectWebSocket);

    return {
        connectionStatus,
        isConnected,
        isRecording,
        audioQueue,
        startRecording,
        stopRecording
    };
}

