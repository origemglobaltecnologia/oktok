<script setup>
import { ref, onMounted } from 'vue';

// =========================================================
// IMPORTAÇÃO DOS SERVIÇOS
// =========================================================
import {
  loadUsers,
  users,
  fetchStatus,
  isUsersLoading,
  MY_USER_ID,
  RECIPIENT_ID
} from './services/appSetup';

import {
  isRecording,
  hasMicPermission,
  initializeAudioRecording,
  startRecording,
  stopRecording
} from './services/ht-messagesService';

import { testHtConnection } from './services/htConnectionService'; // ✅ NOVO SERVIÇO

// =========================================================
// VARIÁVEIS DE ESTADO
// =========================================================
const htStatus = ref('Verificando conexão HT...');

// =========================================================
// CICLO DE VIDA
// =========================================================
onMounted(async () => {
  loadUsers();
  initializeAudioRecording();

  // ✅ Testar conexão com a API HT Messages
  htStatus.value = await testHtConnection();
});
</script>

<template>
  <div class="ht-app-container">
    <!-- HEADER -->
    <header class="app-header">
      <h1 class="logo">Oktok Messenger</h1>
      <div
        :class="[
          'status-indicator',
          { 'status-success': users.length > 0, 'status-error': fetchStatus.startsWith('ERRO') }
        ]"
      >
        {{ users.length > 0 ? 'ONLINE' : fetchStatus.startsWith('ERRO') ? 'ERRO' : 'BUSCANDO...' }}
      </div>
    </header>

    <!-- MAIN -->
    <main class="main-content">

      <!-- STATUS BOX -->
      <div class="status-box" :class="{ 'status-box-error': fetchStatus.startsWith('ERRO') }">
        <p class="status-message">
          <strong>Usuário Logado:</strong>
          {{ users.find(u => u.id === MY_USER_ID.value)?.username || `ID ${MY_USER_ID.value}` }}
        </p>
        <p class="status-message-current">{{ fetchStatus }}</p>
      </div>

      <!-- ✅ STATUS HT MESSAGES -->
      <div class="status-box ht-status-box">
        <p><strong>Status HT Messages:</strong> {{ htStatus }}</p>
      </div>

      <!-- BOTÃO PTT -->
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
          <span>{{ isRecording ? '🎙️ Gravando...' : 'Segure para Falar' }}</span>
        </button>

        <p v-if="!hasMicPermission" class="mic-warning">
          ⚠️ Permita o acesso ao microfone no navegador.
        </p>
      </div>

      <!-- LISTA DE USUÁRIOS -->
      <div class="user-list-container">
        <h3 class="list-title">Contatos REST ({{ users.length }})</h3>

        <div v-if="isUsersLoading" class="loading-list">
          <p>Carregando contatos...</p>
        </div>

        <ul v-else-if="users.length > 0" class="user-ul">
          <li v-for="user in users" :key="user.id" class="user-item">
            <span
              class="user-name"
              :class="{
                'my-user': user.id === MY_USER_ID.value,
                'recipient-user': user.id === RECIPIENT_ID.value
              }"
            >
              {{ user.username || 'Usuário Desconhecido' }}
            </span>
            <span class="user-status">ID: {{ user.id }}</span>
          </li>
        </ul>

        <div v-else class="empty-list">
          <p>Nenhum contato encontrado ou erro de conexão. Verifique o status.</p>
          <button @click="loadUsers" class="reload-button-inline">Recarregar</button>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="app-footer">
      <p>Desenvolvido para Oktok Streaming</p>
    </footer>
  </div>
</template>

<style scoped src="./assets/appStyles.css"></style>

<style scoped>
.ht-status-box {
  margin-top: 12px;
  padding: 10px;
  border-radius: 10px;
  background: #eef3f7;
  font-size: 0.95rem;
}
</style>
