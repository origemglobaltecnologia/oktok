// src/services/userService.js

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO REST
// =========================================================
const API_URL = 'http://localhost:8080/users';

/**
 * Busca a lista de usuários da API REST.
 * @returns {Promise<Array>} Lista de usuários.
 */
export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ERRO HTTP: ${response.status}. O servidor está rodando? Detalhes: ${errorText}`
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Retorno inválido: esperado um array de usuários.');
    }

  } catch (error) {
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      throw new Error('ERRO DE CONEXÃO: Servidor 8080 offline ou CORS bloqueado. (F12)');
    }
    throw error;
  }
};
