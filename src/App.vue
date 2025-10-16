<script setup>
import { ref, onMounted } from 'vue';

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO (URI CORRIGIDA: /users)
// =========================================================
// Mantendo a URI de listagem de usuários na porta 8080
const API_URL = 'http://localhost:8080/users'; 
const fetchStatus = ref('Aguardando busca...');
const users = ref([]);

// =========================================================
// FUNÇÃO DE BUSCA (FETCH)
// =========================================================
const fetchUsers = async () => {
    fetchStatus.value = `Buscando usuários em ${API_URL}...`;
    users.value = []; 

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            fetchStatus.value = `ERRO HTTP: ${response.status}. Servidor 8080.`;
            console.error("Erro da API (Status não-OK):", await response.text());
            return;
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
            users.value = data;
            fetchStatus.value = `Sucesso! ${data.length} usuários carregados.`;
        } else {
            fetchStatus.value = `Sucesso (200 OK), mas o retorno não é uma lista válida.`;
        }

    } catch (error) {
        // Erro de rede (net::ERR_CONNECTION_REFUSED) ou CORS
        fetchStatus.value = 'ERRO DE CONEXÃO: Servidor 8080 offline ou CORS bloqueado. (F12)';
        console.error('Erro de Fetch (Rede/CORS):', error);
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
      <h1 class="logo">HT MESSAGES</h1>
      <div :class="['status-indicator', {'status-success': users.length > 0, 'status-error': fetchStatus.startsWith('ERRO')}]">
        {{ users.length > 0 ? 'ONLINE' : fetchStatus.startsWith('ERRO') ? 'ERRO' : 'BUSCANDO...' }}
      </div>
    </header>

    <main class="main-content">
      
      <div class="status-box" :class="{'status-box-error': fetchStatus.startsWith('ERRO')}">
        <p v-if="users.length > 0" class="status-message">
            Conexão REST OK! {{ users.length }} Contatos Carregados.
        </p>
        <p v-else class="status-message-error">
            {{ fetchStatus }}
        </p>
      </div>

      <div class="user-list-container">
        <h3 class="list-title">Contatos Disponíveis ({{ users.length }})</h3>
        
        <div v-if="users.length > 0" class="user-list">
          <ul class="user-ul">
            <li v-for="user in users" :key="user.id" class="user-item">
              <span class="user-name">{{ user.username || user.name || 'Usuário Desconhecido' }}</span>
              <span class="user-status">ID: {{ user.id }}</span>
            </li>
          </ul>
        </div>
        <div v-else class="empty-list">
            <p>Nenhum contato encontrado ou erro de conexão. Tente novamente.</p>
        </div>
      </div>
      
      <button @click="fetchUsers" class="reload-button">
          Recarregar Contatos
      </button>
      
    </main>
    
    <footer class="app-footer">
      <p>Desenvolvido para PTT Streaming</p>
    </footer>
  </div>
</template>

<style scoped>
/* Variáveis de Cores AZUIS/OKTOK */
:root {
    --color-primary-blue: #007bff; /* Azul vibrante (Primário) */
    --color-secondary-dark: #1e3a8a; /* Azul escuro (Cabeçalho/Rodapé) */
    --color-success: #10b981; /* Verde (Sucesso) */
    --color-danger: #ef4444; /* Vermelho (Erro) */
    --color-background: #f0f2f5;
    --color-card: #ffffff;
    --color-text-light: #ffffff;
    --color-text-dark: #333333;
}

.ht-app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--color-background);
    color: var(--color-text-dark);
    max-width: 400px; /* Largura típica de aplicativo móvel */
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
}

.status-success {
    background-color: var(--color-success);
    color: var(--color-text-light);
}

.status-error {
    background-color: var(--color-danger);
    color: var(--color-text-light);
}

.main-content {
    flex-grow: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* --- Status Box --- */
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

.status-message, .status-message-error {
    margin: 0;
    font-size: 0.9em;
}
.status-message-error {
    color: var(--color-danger);
    font-weight: bold;
}


/* --- Lista de Usuários --- */
.user-list-container {
    background-color: var(--color-card);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    flex-grow: 1;
    padding: 15px;
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
    padding: 12px 0;
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

.user-status {
    font-size: 0.8em;
    color: #6c757d;
    background-color: #f8f9fa;
    padding: 4px 8px;
    border-radius: 15px;
}

.empty-list {
    text-align: center;
    padding: 40px 0;
    color: #999;
}

/* --- Botão Recarregar --- */
.reload-button {
    width: 100%;
    padding: 10px;
    background-color: var(--color-primary-blue);
    color: var(--color-text-light);
    border: none;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.reload-button:hover {
    background-color: #0056b3;
}

.app-footer {
    text-align: center;
    background-color: #e9ecef;
    padding: 10px;
    font-size: 0.8em;
    color: #6c757d;
}
</style>

