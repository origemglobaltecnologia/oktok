<script setup>
import { ref, onMounted } from 'vue';

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO REST
// =========================================================
const API_URL = 'http://localhost:8080/users'; 
const fetchStatus = ref('Aguardando busca de contatos...');
const users = ref([]);
const isUsersLoading = ref(true);

// Mocks de ID mantidos, mas a lista de contatos será dinâmica
const MY_USER_ID = ref(1); 
const RECIPIENT_ID = ref(2); 

// =========================================================
// FUNÇÃO DE BUSCA (FETCH)
// =========================================================
const fetchUsers = async () => {
    isUsersLoading.value = true;
    fetchStatus.value = `Buscando usuários em ${API_URL}...`;
    users.value = []; 

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            fetchStatus.value = `ERRO HTTP: ${response.status}. O servidor Spring está rodando?`;
            console.error("Erro da API (Status não-OK):", await response.text());
            return;
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
            users.value = data;
            fetchStatus.value = `Sucesso REST! ${data.length} contatos carregados.`;
        } else {
            fetchStatus.value = `Sucesso (200 OK), mas o retorno não é uma lista válida.`;
        }

    } catch (error) {
        // Erro de rede (net::ERR_CONNECTION_REFUSED) ou CORS
        fetchStatus.value = 'ERRO DE CONEXÃO: Servidor 8080 offline ou CORS bloqueado. (F12)';
        console.error('Erro de Fetch (Rede/CORS):', error);
    } finally {
        isUsersLoading.value = false;
    }
};

// =========================================================
// GANCHO DE INICIALIZAÇÃO
// =========================================================
onMounted(fetchUsers);
</script>

<template>
  <div class="ht-app-container">
    <header class="app-header">
      <h1 class="logo">HT PTT Messenger</h1>
      <div :class="['status-indicator', {'status-success': users.length > 0, 'status-error': fetchStatus.startsWith('ERRO')}]">
        {{ users.length > 0 ? 'ONLINE' : fetchStatus.startsWith('ERRO') ? 'ERRO' : 'BUSCANDO...' }}
      </div>
    </header>

    <main class="main-content">
      
      <div class="status-box" :class="{'status-box-error': fetchStatus.startsWith('ERRO')}">
        <p class="status-message">
            <strong>Usuário Logado:</strong> {{ users.find(u => u.id === MY_USER_ID)?.username || `ID ${MY_USER_ID}` }}
        </p>
        <p class="status-message">
            <strong>Destinatário (1-1):</strong> {{ users.find(u => u.id === RECIPIENT_ID)?.username || `ID ${RECIPIENT_ID}` }}
        </p>
        <p class="status-message-current">{{ fetchStatus }}</p>
      </div>

      <div class="ptt-container">
        <button 
            disabled
            class="ptt-button"
        >
            <span>SEGURE PARA FALAR</span>
        </button>
      </div>

      <div class="user-list-container">
        <h3 class="list-title">Contatos REST ({{ users.length }})</h3>
        
        <div v-if="isUsersLoading" class="loading-list">
             <p>Carregando contatos...</p>
        </div>
        
        <ul v-else-if="users.length > 0" class="user-ul">
            <li v-for="user in users" :key="user.id" class="user-item">
              <span class="user-name" :class="{'my-user': user.id === MY_USER_ID, 'recipient-user': user.id === RECIPIENT_ID}">
                {{ user.username || 'Usuário Desconhecido' }}
              </span>
              <span class="user-status">ID: {{ user.id }}</span>
            </li>
        </ul>
        
        <div v-else class="empty-list">
             <p>Nenhum contato encontrado ou erro de conexão. Verifique o status.</p>
             <button @click="fetchUsers" class="reload-button-inline">
                 Recarregar
             </button>
        </div>
      </div>
      
    </main>
    
    <footer class="app-footer">
      <p>Desenvolvido para PTT Streaming</p>
    </footer>
  </div>
</template>

<style scoped>
/* Variáveis de Cores AZUIS/OKTOK */
:root {
    --color-primary-blue: #007bff;
    --color-secondary-dark: #1e3a8a;
    --color-success: #10b981;
    --color-danger: #ef4444;
    --color-background: #f0f2f5;
    --color-card: #ffffff;
    --color-text-light: #ffffff;
    --color-text-dark: #333333;
    --color-warning: #f59e0b; /* Laranja para Gravação */
}

.ht-app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--color-background);
    color: var(--color-text-dark);
    max-width: 400px;
    margin: 0 auto;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
}

.app-header {
    background-color: var(--color-secondary-dark);
    color: var(--color-text-light);
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    margin: 0;
    font-size: 1.5em;
    font-weight: 600;
    letter-spacing: 1px;
}

.status-indicator {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: bold;
    text-transform: uppercase;
    background-color: #999; /* Cor base para carregando/desconectado */
    color: var(--color-text-light);
}

.status-success {
    background-color: var(--color-success);
}

.status-error {
    background-color: var(--color-danger);
}

.main-content {
    flex-grow: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.status-box {
    background-color: #e6f0ff; 
    border-left: 5px solid var(--color-primary-blue);
    padding: 10px 15px;
    border-radius: 5px;
}
.status-box-error {
    background-color: #ffe6e6; 
    border-left: 5px solid var(--color-danger);
}
.status-message {
    margin: 0;
    font-size: 0.9em;
}
.status-message-current {
    margin-top: 5px;
    font-size: 0.9em;
    font-weight: bold;
    color: var(--color-secondary-dark);
    padding-top: 5px;
    border-top: 1px dashed #c0d8ff;
}

.ptt-container {
    text-align: center;
    padding: 10px 0;
}

.ptt-button {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #999; 
    color: white;
    font-size: 1.1em;
    font-weight: 700;
    border: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
    transition: all 0.2s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 10px auto;
    text-transform: uppercase;
}

.user-list-container {
    background-color: var(--color-card);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 15px;
    flex-grow: 1; 
}
.list-title {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--color-secondary-dark);
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}
.user-ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}
.user-item:last-child {
    border-bottom: none;
}
.user-name {
    font-weight: 500;
    color: var(--color-text-dark);
    font-size: 1em;
}
.my-user {
    font-weight: 700;
    color: var(--color-primary-blue);
}
.recipient-user {
    font-weight: 700;
    color: var(--color-warning);
}
.user-status {
    font-size: 0.8em;
    color: #6c757d;
    background-color: #f8f9fa;
    padding: 4px 8px;
    border-radius: 15px;
}

.loading-list, .empty-list {
    text-align: center;
    padding: 20px 0;
    color: #999;
    font-size: 0.9em;
}

.reload-button-inline {
    background: none;
    border: 1px solid var(--color-primary-blue);
    color: var(--color-primary-blue);
    padding: 5px 10px;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
}

.reload-button-inline:hover {
    background-color: #e6f0ff;
}

.app-footer {
    text-align: center;
    background-color: #e9ecef;
    padding: 10px;
    font-size: 0.8em;
    color: #6c757d;
}
</style>

