<script setup>
import { ref, onMounted } from 'vue';

// =========================================================
// IMPORTAÇÃO DO SERVIÇO DE USUÁRIOS
// =========================================================
import { fetchUsers } from './services/userService'; // Importado

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO E ESTADO
// =========================================================
const fetchStatus = ref('Aguardando busca de contatos...');
const users = ref([]);
const isUsersLoading = ref(true);

const MY_USER_ID = ref(1); 
const RECIPIENT_ID = ref(2); 

// =========================================================
// FUNÇÃO DE BUSCA (FETCH) - UTILIZANDO O SERVIÇO
// =========================================================
const loadUsers = async () => { 
    isUsersLoading.value = true;
    fetchStatus.value = `Buscando usuários...`;
    users.value = []; 

    try {
        const data = await fetchUsers(); 
        
        users.value = data;
        fetchStatus.value = `Sucesso REST! ${data.length} contatos carregados.`;

    } catch (error) {
        fetchStatus.value = `ERRO de Fetch: ${error.message}`;
        console.error('Erro de Fetch (Tratado no App.vue):', error.message);
    } finally {
        isUsersLoading.value = false;
    }
};

// =========================================================
// ÁUDIO (PTT) - Gravação local via microfone
// =========================================================
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const isRecording = ref(false);
const hasMicPermission = ref(false);

onMounted(async () => {
    loadUsers(); 

    // Solicita permissão ao microfone
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        hasMicPermission.value = true;
        mediaRecorder.value = new MediaRecorder(stream);

        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.value.push(event.data);
            }
        };

        mediaRecorder.value.onstop = () => {
            const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            console.log("🎙️ Áudio gravado (Playback local):", audioBlob);
            audio.play();
            audioChunks.value = [];
        };
    } catch (err) {
        console.error("🚫 Erro ao acessar microfone:", err);
        hasMicPermission.value = false;
    }
});

// Inicia a gravação
const startRecording = () => {
    if (mediaRecorder.value && hasMicPermission.value) {
        audioChunks.value = [];
        mediaRecorder.value.start();
        isRecording.value = true;
        console.log("🔴 Gravando...");
    }
};

// Para a gravação
const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;
        console.log("🟢 Gravação finalizada.");
    }
};
</script>

<template>
  <div class="ht-app-container">
    <header class="app-header">
      <h1 class="logo">Oktok Messenger</h1>
      <div :class="['status-indicator', {'status-success': users.length > 0, 'status-error': fetchStatus.startsWith('ERRO')}]">
        {{ users.length > 0 ? 'ONLINE' : fetchStatus.startsWith('ERRO') ? 'ERRO' : 'BUSCANDO...' }}
      </div>
    </header>

    <main class="main-content">
      
      <div class="status-box" :class="{'status-box-error': fetchStatus.startsWith('ERRO')}">
        <p class="status-message">
            <strong>Usuário Logado:</strong> {{ users.find(u => u.id === MY_USER_ID.value)?.username || `ID ${MY_USER_ID.value}` }}
        </p>
        <p class="status-message-current">{{ fetchStatus }}</p>
      </div>

      <div class="ptt-container">
        <button 
            class="ptt-button"
            :class="{ 'ptt-recording': isRecording }"
            @mousedown="startRecording"
            @mouseup="stopRecording"
            @touchstart.prevent="startRecording"
            @touchend.prevent="stopRecording"
            :disabled="!hasMicPermission"
        >
            <span>{{ isRecording ? 'GRAVANDO...' : 'SEGURE PARA FALAR' }}</span>
        </button>

        <p v-if="!hasMicPermission" style="color:red; font-size:0.8em; margin-top:5px;">
          ⚠️ Permita o acesso ao microfone no navegador.
        </p>
      </div>

      <div class="user-list-container">
        <h3 class="list-title">Contatos REST ({{ users.length }})</h3>
        
        <div v-if="isUsersLoading" class="loading-list">
             <p>Carregando contatos...</p>
        </div>
        
        <ul v-else-if="users.length > 0" class="user-ul">
            <li v-for="user in users" :key="user.id" class="user-item">
              <span class="user-name" :class="{'my-user': user.id === MY_USER_ID.value, 'recipient-user': user.id === RECIPIENT_ID.value}">
                {{ user.username || 'Usuário Desconhecido' }}
              </span>
              <span class="user-status">ID: {{ user.id }}</span>
            </li>
        </ul>
        
        <div v-else class="empty-list">
             <p>Nenhum contato encontrado ou erro de conexão. Verifique o status.</p>
             <button @click="loadUsers" class="reload-button-inline">
                 Recarregar
             </button>
        </div>
      </div>
      
    </main>
    
    <footer class="app-footer">
      <p>Desenvolvido para Oktok Streaming</p>
    </footer>
  </div>
</template>

<style scoped src="./assets/appStyles.css"></style>

