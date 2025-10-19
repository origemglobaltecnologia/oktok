<script setup>
import { ref, onMounted } from 'vue';

// =========================================================
// IMPORTAÇÃO DOS SERVIÇOS
// =========================================================
import { fetchUsers } from './services/userService'; // Lógica REST de Usuários

// Lógica de PTT (Gravação de Áudio)
import { 
    isRecording, 
    hasMicPermission, 
    initializeAudioRecording, 
    startRecording, 
    stopRecording 
} from './services/ht-messagesService'; 

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO E ESTADO (MÍNIMO)
// =========================================================
const fetchStatus = ref('Aguardando busca de contatos...');
const users = ref([]);
const isUsersLoading = ref(true);

const MY_USER_ID = ref(1); 
const RECIPIENT_ID = ref(2); 

// =========================================================
// FUNÇÃO DE BUSCA DE USUÁRIOS
// =========================================================
const loadUsers = async () => { 
    isUsersLoading.value = true;
    fetchStatus.value = `Buscando usuários...`;
    users.value = []; 

    try {
        const data = await fetchUsers(); // Chama o serviço
        
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
// LIFECYCLE
// =========================================================
onMounted(async () => {
    loadUsers(); 
    
    // Inicializa a gravação de áudio (Pede permissão, configura)
    initializeAudioRecording(); 
    // As variáveis isRecording e hasMicPermission são reativas e importadas!
});
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

