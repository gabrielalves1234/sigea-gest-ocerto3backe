
const API_BASE_URL = "https://8000-irwa81k4kirbsz18run4h-45829b2a.manusvm.computer"; // Substitua pela URL exposta do seu backend

const api = {
    // Professores
    getProfessores: async () => {
        const response = await fetch(`${API_BASE_URL}/professores/`);
        return response.json();
    },
    addProfessor: async (professor) => {
        const response = await fetch(`${API_BASE_URL}/professores/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(professor),
        });
        return response.json();
    },
    updateProfessor: async (id, professor) => {
        const response = await fetch(`${API_BASE_URL}/professores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(professor),
        });
        return response.json();
    },
    deleteProfessor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/professores/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Turmas
    getTurmas: async () => {
        const response = await fetch(`${API_BASE_URL}/turmas/`);
        return response.json();
    },
    addTurma: async (turma) => {
        const response = await fetch(`${API_BASE_URL}/turmas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(turma),
        });
        return response.json();
    },
    updateTurma: async (id, turma) => {
        const response = await fetch(`${API_BASE_URL}/turmas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(turma),
        });
        return response.json();
    },
    deleteTurma: async (id) => {
        const response = await fetch(`${API_BASE_URL}/turmas/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Alunos
    getAlunos: async () => {
        const response = await fetch(`${API_BASE_URL}/alunos/`);
        return response.json();
    },
    addAluno: async (aluno) => {
        const response = await fetch(`${API_BASE_URL}/alunos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aluno),
        });
        return response.json();
    },
    updateAluno: async (id, aluno) => {
        const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aluno),
        });
        return response.json();
    },
    deleteAluno: async (id) => {
        const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Aulas
    getAulas: async () => {
        const response = await fetch(`${API_BASE_URL}/aulas/`);
        return response.json();
    },
    addAula: async (aula) => {
        const response = await fetch(`${API_BASE_URL}/aulas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aula),
        });
        return response.json();
    },
    updateAula: async (id, aula) => {
        const response = await fetch(`${API_BASE_URL}/aulas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aula),
        });
        return response.json();
    },
    deleteAula: async (id) => {
        const response = await fetch(`${API_BASE_URL}/aulas/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Estatísticas
    getEstatisticas: async () => {
        const response = await fetch(`${API_BASE_URL}/estatisticas/`);
        return response.json();
    },

    // Busca
    buscarAlunos: async (term) => {
        const response = await fetch(`${API_BASE_URL}/alunos/search/?term=${term}`);
        return response.json();
    },
    buscarProfessores: async (term) => {
        const response = await fetch(`${API_BASE_URL}/professores/search/?term=${term}`);
        return response.json();
    },

    // Import/Export
    exportarDados: async () => {
        const response = await fetch(`${API_BASE_URL}/export-data/`);
        return response.json();
    },
    importarDados: async (data) => {
        const response = await fetch(`${API_BASE_URL}/import-data/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    limparDados: async () => {
        const response = await fetch(`${API_BASE_URL}/clear-data/`, {
            method: 'DELETE',
        });
        return response.json();
    }
};

window.api = api;

