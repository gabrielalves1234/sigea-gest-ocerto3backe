// SIGEA - Sistema de Gestão de Aulas
// Banco de Dados Local usando localStorage

class SigeaDatabase {
    constructor() {
        this.initializeDatabase();
    }

    // Inicializa o banco de dados com dados de exemplo
    initializeDatabase() {
        if (!localStorage.getItem('sigea_initialized')) {
            this.createSampleData();
            localStorage.setItem('sigea_initialized', 'true');
        }
    }

    // Cria dados de exemplo
    createSampleData() {
        // Professores de exemplo
        const professores = [
            {
                id: 1,
                nome: 'Maria Silva',
                email: 'maria.silva@escola.com',
                telefone: '(11) 99999-1111',
                disciplina: 'Matemática',
                dataContratacao: '2020-03-15'
            },
            {
                id: 2,
                nome: 'João Santos',
                email: 'joao.santos@escola.com',
                telefone: '(11) 99999-2222',
                disciplina: 'Português',
                dataContratacao: '2019-08-20'
            },
            {
                id: 3,
                nome: 'Ana Costa',
                email: 'ana.costa@escola.com',
                telefone: '(11) 99999-3333',
                disciplina: 'História',
                dataContratacao: '2021-01-10'
            }
        ];

        // Turmas de exemplo
        const turmas = [
            {
                id: 1,
                nome: '9º Ano A',
                ano: 2024,
                semestre: 1,
                professorId: 1,
                capacidade: 30,
                alunosMatriculados: 28
            },
            {
                id: 2,
                nome: '8º Ano B',
                ano: 2024,
                semestre: 1,
                professorId: 2,
                capacidade: 25,
                alunosMatriculados: 23
            },
            {
                id: 3,
                nome: '7º Ano C',
                ano: 2024,
                semestre: 1,
                professorId: 3,
                capacidade: 28,
                alunosMatriculados: 26
            }
        ];

        // Alunos de exemplo
        const alunos = [
            {
                id: 1,
                nome: 'Pedro Oliveira',
                email: 'pedro.oliveira@email.com',
                telefone: '(11) 98888-1111',
                dataNascimento: '2008-05-15',
                turmaId: 1,
                responsavel: 'Carlos Oliveira',
                telefoneResponsavel: '(11) 97777-1111'
            },
            {
                id: 2,
                nome: 'Lucia Ferreira',
                email: 'lucia.ferreira@email.com',
                telefone: '(11) 98888-2222',
                dataNascimento: '2009-03-22',
                turmaId: 1,
                responsavel: 'Sandra Ferreira',
                telefoneResponsavel: '(11) 97777-2222'
            },
            {
                id: 3,
                nome: 'Rafael Lima',
                email: 'rafael.lima@email.com',
                telefone: '(11) 98888-3333',
                dataNascimento: '2009-11-08',
                turmaId: 2,
                responsavel: 'Roberto Lima',
                telefoneResponsavel: '(11) 97777-3333'
            },
            {
                id: 4,
                nome: 'Camila Souza',
                email: 'camila.souza@email.com',
                telefone: '(11) 98888-4444',
                dataNascimento: '2010-07-12',
                turmaId: 3,
                responsavel: 'Mariana Souza',
                telefoneResponsavel: '(11) 97777-4444'
            }
        ];

        // Aulas de exemplo
        const aulas = [
            {
                id: 1,
                turmaId: 1,
                professorId: 1,
                disciplina: 'Matemática',
                data: '2024-09-25',
                horarioInicio: '08:00',
                horarioFim: '09:30',
                sala: 'Sala 101',
                conteudo: 'Equações do 2º grau'
            },
            {
                id: 2,
                turmaId: 2,
                professorId: 2,
                disciplina: 'Português',
                data: '2024-09-25',
                horarioInicio: '10:00',
                horarioFim: '11:30',
                sala: 'Sala 102',
                conteudo: 'Análise sintática'
            },
            {
                id: 3,
                turmaId: 3,
                professorId: 3,
                disciplina: 'História',
                data: '2024-09-25',
                horarioInicio: '14:00',
                horarioFim: '15:30',
                sala: 'Sala 103',
                conteudo: 'Brasil Colonial'
            }
        ];

        // Salva os dados no localStorage
        localStorage.setItem('sigea_professores', JSON.stringify(professores));
        localStorage.setItem('sigea_turmas', JSON.stringify(turmas));
        localStorage.setItem('sigea_alunos', JSON.stringify(alunos));
        localStorage.setItem('sigea_aulas', JSON.stringify(aulas));
    }

    // Métodos para Professores
    getProfessores() {
        return JSON.parse(localStorage.getItem('sigea_professores') || '[]');
    }

    addProfessor(professor) {
        const professores = this.getProfessores();
        professor.id = Date.now();
        professores.push(professor);
        localStorage.setItem('sigea_professores', JSON.stringify(professores));
        return professor;
    }

    updateProfessor(id, dadosAtualizados) {
        const professores = this.getProfessores();
        const index = professores.findIndex(p => p.id === id);
        if (index !== -1) {
            professores[index] = { ...professores[index], ...dadosAtualizados };
            localStorage.setItem('sigea_professores', JSON.stringify(professores));
            return professores[index];
        }
        return null;
    }

    deleteProfessor(id) {
        const professores = this.getProfessores();
        const filtered = professores.filter(p => p.id !== id);
        localStorage.setItem('sigea_professores', JSON.stringify(filtered));
        return true;
    }

    // Métodos para Turmas
    getTurmas() {
        return JSON.parse(localStorage.getItem('sigea_turmas') || '[]');
    }

    addTurma(turma) {
        const turmas = this.getTurmas();
        turma.id = Date.now();
        turma.alunosMatriculados = 0;
        turmas.push(turma);
        localStorage.setItem('sigea_turmas', JSON.stringify(turmas));
        return turma;
    }

    updateTurma(id, dadosAtualizados) {
        const turmas = this.getTurmas();
        const index = turmas.findIndex(t => t.id === id);
        if (index !== -1) {
            turmas[index] = { ...turmas[index], ...dadosAtualizados };
            localStorage.setItem('sigea_turmas', JSON.stringify(turmas));
            return turmas[index];
        }
        return null;
    }

    deleteTurma(id) {
        const turmas = this.getTurmas();
        const filtered = turmas.filter(t => t.id !== id);
        localStorage.setItem('sigea_turmas', JSON.stringify(filtered));
        return true;
    }

    // Métodos para Alunos
    getAlunos() {
        return JSON.parse(localStorage.getItem('sigea_alunos') || '[]');
    }

    addAluno(aluno) {
        const alunos = this.getAlunos();
        aluno.id = Date.now();
        alunos.push(aluno);
        localStorage.setItem('sigea_alunos', JSON.stringify(alunos));
        
        // Atualiza contador de alunos na turma
        this.updateAlunosCount(aluno.turmaId);
        return aluno;
    }

    updateAluno(id, dadosAtualizados) {
        const alunos = this.getAlunos();
        const index = alunos.findIndex(a => a.id === id);
        if (index !== -1) {
            const alunoAntigo = alunos[index];
            alunos[index] = { ...alunos[index], ...dadosAtualizados };
            localStorage.setItem('sigea_alunos', JSON.stringify(alunos));
            
            // Atualiza contadores se mudou de turma
            if (alunoAntigo.turmaId !== dadosAtualizados.turmaId) {
                this.updateAlunosCount(alunoAntigo.turmaId);
                this.updateAlunosCount(dadosAtualizados.turmaId);
            }
            
            return alunos[index];
        }
        return null;
    }

    deleteAluno(id) {
        const alunos = this.getAlunos();
        const aluno = alunos.find(a => a.id === id);
        const filtered = alunos.filter(a => a.id !== id);
        localStorage.setItem('sigea_alunos', JSON.stringify(filtered));
        
        // Atualiza contador de alunos na turma
        if (aluno) {
            this.updateAlunosCount(aluno.turmaId);
        }
        return true;
    }

    // Métodos para Aulas
    getAulas() {
        return JSON.parse(localStorage.getItem('sigea_aulas') || '[]');
    }

    addAula(aula) {
        const aulas = this.getAulas();
        aula.id = Date.now();
        aulas.push(aula);
        localStorage.setItem('sigea_aulas', JSON.stringify(aulas));
        return aula;
    }

    updateAula(id, dadosAtualizados) {
        const aulas = this.getAulas();
        const index = aulas.findIndex(a => a.id === id);
        if (index !== -1) {
            aulas[index] = { ...aulas[index], ...dadosAtualizados };
            localStorage.setItem('sigea_aulas', JSON.stringify(aulas));
            return aulas[index];
        }
        return null;
    }

    deleteAula(id) {
        const aulas = this.getAulas();
        const filtered = aulas.filter(a => a.id !== id);
        localStorage.setItem('sigea_aulas', JSON.stringify(filtered));
        return true;
    }

    // Métodos auxiliares
    updateAlunosCount(turmaId) {
        const alunos = this.getAlunos();
        const count = alunos.filter(a => a.turmaId === parseInt(turmaId)).length;
        
        const turmas = this.getTurmas();
        const turmaIndex = turmas.findIndex(t => t.id === parseInt(turmaId));
        if (turmaIndex !== -1) {
            turmas[turmaIndex].alunosMatriculados = count;
            localStorage.setItem('sigea_turmas', JSON.stringify(turmas));
        }
    }

    // Métodos para relatórios e estatísticas
    getEstatisticas() {
        const professores = this.getProfessores();
        const turmas = this.getTurmas();
        const alunos = this.getAlunos();
        const aulas = this.getAulas();

        return {
            totalProfessores: professores.length,
            totalTurmas: turmas.length,
            totalAlunos: alunos.length,
            totalAulas: aulas.length,
            mediaAlunosPorTurma: turmas.length > 0 ? Math.round(alunos.length / turmas.length) : 0,
            turmasComMaisAlunos: turmas.sort((a, b) => b.alunosMatriculados - a.alunosMatriculados).slice(0, 3)
        };
    }

    // Busca avançada
    buscarAlunos(termo) {
        const alunos = this.getAlunos();
        return alunos.filter(aluno => 
            aluno.nome.toLowerCase().includes(termo.toLowerCase()) ||
            aluno.email.toLowerCase().includes(termo.toLowerCase())
        );
    }

    buscarProfessores(termo) {
        const professores = this.getProfessores();
        return professores.filter(professor => 
            professor.nome.toLowerCase().includes(termo.toLowerCase()) ||
            professor.disciplina.toLowerCase().includes(termo.toLowerCase())
        );
    }

    // Exportar dados
    exportarDados() {
        return {
            professores: this.getProfessores(),
            turmas: this.getTurmas(),
            alunos: this.getAlunos(),
            aulas: this.getAulas(),
            exportadoEm: new Date().toISOString()
        };
    }

    // Importar dados
    importarDados(dados) {
        if (dados.professores) localStorage.setItem('sigea_professores', JSON.stringify(dados.professores));
        if (dados.turmas) localStorage.setItem('sigea_turmas', JSON.stringify(dados.turmas));
        if (dados.alunos) localStorage.setItem('sigea_alunos', JSON.stringify(dados.alunos));
        if (dados.aulas) localStorage.setItem('sigea_aulas', JSON.stringify(dados.aulas));
        return true;
    }

    // Limpar todos os dados
    limparDados() {
        localStorage.removeItem('sigea_professores');
        localStorage.removeItem('sigea_turmas');
        localStorage.removeItem('sigea_alunos');
        localStorage.removeItem('sigea_aulas');
        localStorage.removeItem('sigea_initialized');
        this.initializeDatabase();
        return true;
    }
}

// Instância global do banco de dados
window.sigeaDB = new SigeaDatabase();

