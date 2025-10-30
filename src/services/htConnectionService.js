// src/services/htConnectionService.js

const API_HT_URL = 'http://localhost:8084/ws';

/**
 * Testa a conexão com a API HT Messages.
 * Faz um POST simples e verifica se retorna "welcome".
 */
export const testHtConnection = async () => {
  try {
    const response = await fetch(API_HT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: falha ao conectar.`);
    }

    const text = await response.text();
    return text.trim().toLowerCase() === 'welcome'
      ? 'Conectado ao HT Messages ✅'
      : `Resposta inesperada: ${text}`;
  } catch (err) {
    return `Erro de conexão HT ❌ (${err.message})`;
  }
};
