// SIGEA - Sistema de Gestão de Aulas
// JavaScript principal com funcionalidades completas

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginBtn = document.querySelector('.login-btn');
    const ctaButton = document.querySelector('.cta-button');
    const navLinks = document.querySelectorAll('.nav-link');
    const featureCards = document.querySelectorAll('.feature-card');

    // Estado da aplicação
    let currentPage = 'inicio';
    let currentModal = null;

    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }

    // Função para criar modal
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('show');
        currentModal = modal;

        // Event listeners para fechar modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        return modal;
    }

    // Função para fechar modal
    function closeModal() {
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
    }

    // Função para renderizar página de gestão
    async function renderGestaoPage(tipo) {
        let content = '';
        let dados = [];
        
        switch(tipo) {
            case 'professores':
                dados = await window.api.getProfessores();
                content = await renderProfessoresPage(dados);
                break;
            case 'alunos':
                dados = await window.api.getAlunos();
                content = await renderAlunosPage(dados);
                break;
            case 'turmas':
                dados = await window.api.getTurmas();
                content = await renderTurmasPage(dados);
                break;
            case 'relatorios':
                content = await renderRelatoriosPage();
                break;
        }

        const modal = createModal(`Gestão de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, content);
        
        // Adiciona event listeners específicos
        setupPageEventListeners(tipo, modal);
    }

    // Renderizar página de professores
    async function renderProfessoresPage(professores) {
        const stats = await window.api.getEstatisticas();
        
        return `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalProfessores}</div>
                    <div class="stat-label">Total de Professores</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-primary" onclick="abrirFormProfessor()">
                    <i class="fas fa-plus"></i> Novo Professor
                </button>
                <button class="btn btn-secondary" onclick="exportarDados('professores')">
                    <i class="fas fa-download"></i> Exportar
                </button>
            </div>

            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Disciplina</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${professores.map(professor => `
                            <tr>
                                <td>${professor.nome}</td>
                                <td>${professor.email}</td>
                                <td>${professor.disciplina}</td>
                                <td>${professor.telefone}</td>
                                <td class="table-actions">
                                    <button class="btn btn-sm btn-primary" onclick="editarProfessor(${professor.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="excluirProfessor(${professor.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Renderizar página de alunos
    async function renderAlunosPage(alunos) {
        const stats = await window.api.getEstatisticas();
        const turmas = await window.api.getTurmas();
        
        return `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalAlunos}</div>
                    <div class="stat-label">Total de Alunos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.mediaAlunosPorTurma}</div>
                    <div class="stat-label">Média por Turma</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-primary" onclick="abrirFormAluno()">
                    <i class="fas fa-plus"></i> Novo Aluno
                </button>
                <button class="btn btn-secondary" onclick="exportarDados('alunos')">
                    <i class="fas fa-download"></i> Exportar
                </button>
            </div>

            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Turma</th>
                            <th>Responsável</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${alunos.map(aluno => {
                            const turma = turmas.find(t => t.id === aluno.turmaId);
                            return `
                                <tr>
                                    <td>${aluno.nome}</td>
                                    <td>${aluno.email}</td>
                                    <td>${turma ? turma.nome : 'N/A'}</td>
                                    <td>${aluno.responsavel}</td>
                                    <td class="table-actions">
                                        <button class="btn btn-sm btn-primary" onclick="editarAluno(${aluno.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="excluirAluno(${aluno.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Renderizar página de turmas
    async function renderTurmasPage(turmas) {
        const stats = await window.api.getEstatisticas();
        const professores = await window.api.getProfessores();
        
        return `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalTurmas}</div>
                    <div class="stat-label">Total de Turmas</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-primary" onclick="abrirFormTurma()">
                    <i class="fas fa-plus"></i> Nova Turma
                </button>
                <button class="btn btn-secondary" onclick="exportarDados('turmas')">
                    <i class="fas fa-download"></i> Exportar
                </button>
            </div>

            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Professor</th>
                            <th>Alunos</th>
                            <th>Capacidade</th>
                            <th>Ano/Semestre</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${turmas.map(turma => {
                            const professor = professores.find(p => p.id === turma.professorId);
                            return `
                                <tr>
                                    <td>${turma.nome}</td>
                                    <td>${professor ? professor.nome : 'N/A'}</td>
                                    <td>${turma.alunosMatriculados}</td>
                                    <td>${turma.capacidade}</td>
                                    <td>${turma.ano}/${turma.semestre}</td>
                                    <td class="table-actions">
                                        <button class="btn btn-sm btn-primary" onclick="editarTurma(${turma.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="excluirTurma(${turma.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Renderizar página de relatórios
    async function renderRelatoriosPage() {
        const stats = await window.api.getEstatisticas();
        
        return `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalProfessores}</div>
                    <div class="stat-label">Professores</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalAlunos}</div>
                    <div class="stat-label">Alunos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalTurmas}</div>
                    <div class="stat-label">Turmas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalAulas}</div>
                    <div class="stat-label">Aulas Registradas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.mediaAlunosPorTurma.toFixed(2)}</div>
                    <div class="stat-label">Média Alunos/Turma</div>
                </div>
            </div>

            <div class="chart-container">
                <canvas id="alunosPorTurmaChart"></canvas>
            </div>
        `;
    }

    // Configura event listeners para as páginas de gestão
    async function setupPageEventListeners(tipo, modal) {
        switch(tipo) {
            case 'professores':
                modal.querySelector('#formProfessor')?.addEventListener('submit', async function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const dados = Object.fromEntries(formData);
                    const professorId = event.target.dataset.id;

                    try {
                        if (professorId) {
                            await window.api.updateProfessor(parseInt(professorId), dados);
                            showNotification('Professor atualizado com sucesso!', 'success');
                        } else {
                            await window.api.addProfessor(dados);
                            showNotification('Professor cadastrado com sucesso!', 'success');
                        }
                        closeModal();
                        await renderGestaoPage('professores');
                    } catch (error) {
                        showNotification(`Erro ao salvar professor: ${error.message}`, 'error');
                    }
                });
                break;
            case 'alunos':
                modal.querySelector('#formAluno')?.addEventListener('submit', async function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const dados = Object.fromEntries(formData);
                    const alunoId = event.target.dataset.id;

                    try {
                        if (alunoId) {
                            await window.api.updateAluno(parseInt(alunoId), dados);
                            showNotification('Aluno atualizado com sucesso!', 'success');
                        } else {
                            await window.api.addAluno(dados);
                            showNotification('Aluno cadastrado com sucesso!', 'success');
                        }
                        closeModal();
                        await renderGestaoPage('alunos');
                    } catch (error) {
                        showNotification(`Erro ao salvar aluno: ${error.message}`, 'error');
                    }
                });
                break;
            case 'turmas':
                modal.querySelector('#formTurma')?.addEventListener('submit', async function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const dados = Object.fromEntries(formData);
                    const turmaId = event.target.dataset.id;

                    try {
                        if (turmaId) {
                            await window.api.updateTurma(parseInt(turmaId), dados);
                            showNotification('Turma atualizada com sucesso!', 'success');
                        } else {
                            await window.api.addTurma(dados);
                            showNotification('Turma cadastrada com sucesso!', 'success');
                        }
                        closeModal();
                        await renderGestaoPage('turmas');
                    } catch (error) {
                        showNotification(`Erro ao salvar turma: ${error.message}`, 'error');
                    }
                });
                break;
            case 'relatorios':
                // Renderiza o gráfico de alunos por turma
                await renderAlunosPorTurmaChart();
                break;
        }
    }

    // Renderiza o gráfico de alunos por turma
    async function renderAlunosPorTurmaChart() {
        const turmas = await window.api.getTurmas();
        const alunos = await window.api.getAlunos();
        const ctx = document.getElementById('alunosPorTurmaChart').getContext('2d');

        const labels = turmas.map(turma => turma.nome);
        const data = turmas.map(turma => alunos.filter(aluno => aluno.turmaId === turma.id).length);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Alunos',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Event Listeners para navegação
    navLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            const targetPage = this.textContent.toLowerCase().trim();
            
            if (targetPage === 'início') {
                // Fecha qualquer modal aberto e retorna à página inicial
                closeModal();
                currentPage = 'inicio';
            } else {
                currentPage = targetPage;
                await renderGestaoPage(targetPage);
            }
        });
    });

    featureCards.forEach(card => {
        card.addEventListener('click', async function() {
            const feature = this.dataset.feature;
            currentPage = feature;
            await renderGestaoPage(feature);
        });
    });

    // Toggle de tema
    window.toggleTheme = function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.querySelector('.theme-toggle i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    };

    // Aplica o tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle i').className = 'fas fa-sun';
    }

    // Funções globais para formulários e ações

    // Formulário de Professor
    window.abrirFormProfessor = async function(professorId = null) {
        const professores = await window.api.getProfessores();
        const professor = professorId ? professores.find(p => p.id === professorId) : null;
        const isEdit = !!professor;
        
        const formContent = `
            <form id="formProfessor" data-id="${professorId || ''}">
                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" value="${professor ? professor.nome : ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${professor ? professor.email : ''}" required>
                </div>
                <div class="form-group">
                    <label for="telefone">Telefone:</label>
                    <input type="text" id="telefone" name="telefone" value="${professor ? professor.telefone : ''}">
                </div>
                <div class="form-group">
                    <label for="disciplina">Disciplina:</label>
                    <input type="text" id="disciplina" name="disciplina" value="${professor ? professor.disciplina : ''}" required>
                </div>
                <div class="form-group">
                    <label for="dataContratacao">Data de Contratação:</label>
                    <input type="date" id="dataContratacao" name="dataContratacao" value="${professor ? professor.dataContratacao : ''}">
                </div>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Cadastrar'}</button>
            </form>
        `;
        createModal(`${isEdit ? 'Editar' : 'Novo'} Professor`, formContent);
    };

    window.editarProfessor = function(id) {
        window.abrirFormProfessor(id);
    };

    window.excluirProfessor = async function(id) {
        if (confirm('Tem certeza que deseja excluir este professor?')) {
            try {
                await window.api.deleteProfessor(id);
                showNotification('Professor excluído com sucesso!', 'success');
                await renderGestaoPage('professores');
            } catch (error) {
                showNotification(`Erro ao excluir professor: ${error.message}`, 'error');
            }
        }
    };

    // Formulário de Aluno
    window.abrirFormAluno = async function(alunoId = null) {
        const alunos = await window.api.getAlunos();
        const aluno = alunoId ? alunos.find(a => a.id === alunoId) : null;
        const turmas = await window.api.getTurmas();
        const isEdit = !!aluno;

        let turmasOptions = turmas.map(turma => 
            `<option value="${turma.id}" ${aluno && aluno.turmaId === turma.id ? 'selected' : ''}>
                ${turma.nome}
            </option>`
        ).join('');
        
        const formContent = `
            <form id="formAluno" data-id="${alunoId || ''}">
                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" value="${aluno ? aluno.nome : ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${aluno ? aluno.email : ''}" required>
                </div>
                <div class="form-group">
                    <label for="telefone">Telefone:</label>
                    <input type="text" id="telefone" name="telefone" value="${aluno ? aluno.telefone : ''}">
                </div>
                <div class="form-group">
                    <label for="dataNascimento">Data de Nascimento:</label>
                    <input type="date" id="dataNascimento" name="dataNascimento" value="${aluno ? aluno.dataNascimento : ''}">
                </div>
                <div class="form-group">
                    <label for="turmaId">Turma:</label>
                    <select id="turmaId" name="turmaId">
                        <option value="">Selecione uma Turma</option>
                        ${turmasOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="responsavel">Responsável:</label>
                    <input type="text" id="responsavel" name="responsavel" value="${aluno ? aluno.responsavel : ''}">
                </div>
                <div class="form-group">
                    <label for="telefoneResponsavel">Telefone do Responsável:</label>
                    <input type="text" id="telefoneResponsavel" name="telefoneResponsavel" value="${aluno ? aluno.telefoneResponsavel : ''}">
                </div>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Cadastrar'}</button>
            </form>
        `;
        createModal(`${isEdit ? 'Editar' : 'Novo'} Aluno`, formContent);
    };

    window.editarAluno = function(id) {
        window.abrirFormAluno(id);
    };

    window.excluirAluno = async function(id) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            try {
                await window.api.deleteAluno(id);
                showNotification('Aluno excluído com sucesso!', 'success');
                await renderGestaoPage('alunos');
            } catch (error) {
                showNotification(`Erro ao excluir aluno: ${error.message}`, 'error');
            }
        }
    };

    // Formulário de Turma
    window.abrirFormTurma = async function(turmaId = null) {
        const turmas = await window.api.getTurmas();
        const turma = turmaId ? turmas.find(t => t.id === turmaId) : null;
        const professores = await window.api.getProfessores();
        const isEdit = !!turma;

        let professoresOptions = professores.map(professor => 
            `<option value="${professor.id}" ${turma && turma.professorId === professor.id ? 'selected' : ''}>
                ${professor.nome}
            </option>`
        ).join('');

        const formContent = `
            <form id="formTurma" data-id="${turmaId || ''}">
                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" value="${turma ? turma.nome : ''}" required>
                </div>
                <div class="form-group">
                    <label for="ano">Ano:</label>
                    <input type="number" id="ano" name="ano" value="${turma ? turma.ano : ''}" required>
                </div>
                <div class="form-group">
                    <label for="semestre">Semestre:</label>
                    <input type="number" id="semestre" name="semestre" value="${turma ? turma.semestre : ''}" required>
                </div>
                <div class="form-group">
                    <label for="professorId">Professor:</label>
                    <select id="professorId" name="professorId">
                        <option value="">Selecione um Professor</option>
                        ${professoresOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="capacidade">Capacidade:</label>
                    <input type="number" id="capacidade" name="capacidade" value="${turma ? turma.capacidade : ''}" required>
                </div>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Cadastrar'}</button>
            </form>
        `;
        createModal(`${isEdit ? 'Editar' : 'Nova'} Turma`, formContent);
    };

    window.editarTurma = function(id) {
        window.abrirFormTurma(id);
    };

    window.excluirTurma = async function(id) {
        if (confirm('Tem certeza que deseja excluir esta turma?')) {
            try {
                await window.api.deleteTurma(id);
                showNotification('Turma excluída com sucesso!', 'success');
                await renderGestaoPage('turmas');
            } catch (error) {
                showNotification(`Erro ao excluir turma: ${error.message}`, 'error');
            }
        }
    };

    // Função para exportar dados (ainda não implementada no backend, mas mantida para consistência)
    window.exportarDados = async function(tipo) {
        showNotification(`Funcionalidade de exportar ${tipo} ainda não implementada no backend.`, 'info');
        // const dados = await window.api.exportarDados(tipo);
        // if (dados) {
        //     // Lógica para download dos dados
        //     showNotification(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} exportados com sucesso!`, 'success');
        // }
    };

    // Inicialização da página
    async function initializePage() {
        // Atualiza estatísticas nos cartões
        const stats = await window.api.getEstatisticas();
        
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = `${stats.totalTurmas}+`;
            statNumbers[1].textContent = `${stats.totalAlunos}+`;
            statNumbers[2].textContent = `${stats.totalProfessores}+`;
        }
    }

    // Animação dos cards ao carregar
    function animateOnLoad() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    initializePage();
    animateOnLoad();
});
