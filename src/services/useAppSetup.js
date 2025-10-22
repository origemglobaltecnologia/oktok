// useAppSetup.js

import { ref, onMounted } from 'vue';
// Serviços importados aqui, pois a lógica do App.vue precisa deles
import { fetchUsers } from './services/userService'; 
import { 
    isRecording, hasMicPermission, initializeAudioRecording, 
    startRecording, stopRecording 
} from './services/ht-messagesService'; 

// Variáveis de Estado
const fetchStatus = ref('Aguardando busca de contatos...');
const users = ref([]);
const isUsersLoading = ref(true);

// Constantes de Configuração
const MY_USER_ID = ref(1); 
const RECIPIENT_ID = ref(2); 

const loadUsers = async () => { /* ... (mesma lógica) ... */ };

export function useAppSetup() {
    onMounted(async () => {
        loadUsers(); 
        initializeAudioRecording(); 
    });

    return {
        // Estado e Configurações (expostos para o template)
        fetchStatus, users, isUsersLoading, MY_USER_ID, RECIPIENT_ID,

        // PTT (expostos para o template)
        isRecording, hasMicPermission, startRecording, stopRecording,

        // Ações (expostas para o template)
        loadUsers,
    };
}

