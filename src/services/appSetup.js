// src/services/appSetup.js
import { ref } from 'vue';
import { fetchUsers } from './userService';

// =========================================================
// VARIÁVEIS GLOBAIS REATIVAS
// =========================================================
export const fetchStatus = ref('Aguardando busca de contatos...');
export const users = ref([]);
export const isUsersLoading = ref(true);

export const MY_USER_ID = ref(1);
export const RECIPIENT_ID = ref(2);

// =========================================================
// FUNÇÃO PRINCIPAL DE BUSCA DE USUÁRIOS
// =========================================================
export const loadUsers = async () => {
  isUsersLoading.value = true;
  fetchStatus.value = 'Buscando usuários...';
  users.value = [];

  try {
    const data = await fetchUsers();
    users.value = data;
    fetchStatus.value = `Sucesso REST! ${data.length} contatos carregados.`;
  } catch (error) {
    fetchStatus.value = `ERRO de Fetch: ${error.message}`;
    console.error('Erro de Fetch (Tratado no service):', error.message);
  } finally {
    isUsersLoading.value = false;
  }
};
