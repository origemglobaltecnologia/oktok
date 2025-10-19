// src/services/userService.js

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO REST
// =========================================================
const API_URL = 'http://localhost:8080/users'; 

/**
 * Busca a lista de usuários da API REST.
 * * @returns {Promise<Array|null>} Uma promessa que resolve para a lista de usuários ou
 * lança um erro com a mensagem para o App.vue tratar.
 */
export const fetchUsers = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            // Lança um erro HTTP para ser capturado no App.vue
            const errorText = await response.text();
            throw new Error(`ERRO HTTP: ${response.status}. O servidor Spring está rodando? Detalhes: ${errorText}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
            return data; // Retorna a lista de usuários em caso de sucesso
        } else {
            console.error("Sucesso (200 OK), mas o retorno não é uma lista válida.");
            return []; // Retorna lista vazia se o formato estiver errado
        }

    } catch (error) {
        // Lança um erro de rede/conexão para ser capturado no App.vue
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('ERRO DE CONEXÃO: Servidor 8080 offline ou CORS bloqueado. (F12)');
        }
        throw error; // Relança outros erros
    }
};

