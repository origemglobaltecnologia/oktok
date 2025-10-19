<script setup>
import { ref, onMounted } from 'vue';
import { fetchAllUsers } from '@/services/userService'; // Importa o serviço
import { initializeMediaRecorder, startRecording, stopRecording } from '@/services/audioService'; // Importa o serviço de áudio
// ... (demais imports)

// VARIÁVEIS DE ESTADO
const fetchStatus = ref('Aguardando busca de contatos...');
const users = ref([]);
const isUsersLoading = ref(true);
const MY_USER_ID = ref(1); 
const RECIPIENT_ID = ref(2); 

// ESTADO DO ÁUDIO
const isRecording = ref(false);
const hasMicPermission = ref(false);

// FUNÇÃO DE BUSCA REFATORADA
const fetchUsers = async () => {
    isUsersLoading.value = true;
    fetchStatus.value = `Buscando usuários em ${API_URL}...`; // URL deve ser importada ou definida
    users.value = []; 

    const result = await fetchAllUsers(); // Chama a função do serviço
    
    users.value = result.data || [];
    fetchStatus.value = result.statusMessage;

    isUsersLoading.value = false;
};

// FUNÇÕES DE ÁUDIO NO COMPONENTE
const handleStartRecording = () => {
    if (startRecording()) { // Chama a função do serviço
        isRecording.value = true;
    }
};

const handleStopRecording = () => {
    if (stopRecording()) { // Chama a função do serviço
        isRecording.value = false;
    }
};

onMounted(async () => {
    fetchUsers();

    const { hasPermission } = await initializeMediaRecorder(); // Inicializa o serviço de áudio
    hasMicPermission.value = hasPermission;
});
</script>

<template>
    </template>

