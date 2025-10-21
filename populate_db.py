import requests
import json

# URL do endpoint de importação de dados
url = "http://localhost:8000/import-data/"

# Dados a serem importados (extraídos de database.js)
data = {
    "professores": [
        {
            "nome": "Maria Silva",
            "email": "maria.silva@escola.com",
            "telefone": "(11) 99999-1111",
            "disciplina": "Matemática",
            "dataContratacao": "2020-03-15"
        },
        {
            "nome": "João Santos",
            "email": "joao.santos@escola.com",
            "telefone": "(11) 99999-2222",
            "disciplina": "Português",
            "dataContratacao": "2019-08-20"
        },
        {
            "nome": "Ana Costa",
            "email": "ana.costa@escola.com",
            "telefone": "(11) 99999-3333",
            "disciplina": "História",
            "dataContratacao": "2021-01-10"
        }
    ],
    "turmas": [
        {
            "nome": "9º Ano A",
            "ano": 2024,
            "semestre": 1,
            "professorId": 1,
            "capacidade": 30,
            "alunosMatriculados": 2
        },
        {
            "nome": "8º Ano B",
            "ano": 2024,
            "semestre": 1,
            "professorId": 2,
            "capacidade": 25,
            "alunosMatriculados": 1
        },
        {
            "nome": "7º Ano C",
            "ano": 2024,
            "semestre": 1,
            "professorId": 3,
            "capacidade": 28,
            "alunosMatriculados": 1
        }
    ],
    "alunos": [
        {
            "nome": "Pedro Oliveira",
            "email": "pedro.oliveira@email.com",
            "telefone": "(11) 98888-1111",
            "dataNascimento": "2008-05-15",
            "turmaId": 1,
            "responsavel": "Carlos Oliveira",
            "telefoneResponsavel": "(11) 97777-1111"
        },
        {
            "nome": "Lucia Ferreira",
            "email": "lucia.ferreira@email.com",
            "telefone": "(11) 98888-2222",
            "dataNascimento": "2009-03-22",
            "turmaId": 1,
            "responsavel": "Sandra Ferreira",
            "telefoneResponsavel": "(11) 97777-2222"
        },
        {
            "nome": "Rafael Lima",
            "email": "rafael.lima@email.com",
            "telefone": "(11) 98888-3333",
            "dataNascimento": "2009-11-08",
            "turmaId": 2,
            "responsavel": "Roberto Lima",
            "telefoneResponsavel": "(11) 97777-3333"
        },
        {
            "nome": "Camila Souza",
            "email": "camila.souza@email.com",
            "telefone": "(11) 98888-4444",
            "dataNascimento": "2010-07-12",
            "turmaId": 3,
            "responsavel": "Mariana Souza",
            "telefoneResponsavel": "(11) 97777-4444"
        }
    ],
    "aulas": [
        {
            "turmaId": 1,
            "professorId": 1,
            "disciplina": "Matemática",
            "data": "2024-09-25",
            "horarioInicio": "08:00",
            "horarioFim": "09:30",
            "sala": "Sala 101",
            "conteudo": "Equações do 2º grau"
        },
        {
            "turmaId": 2,
            "professorId": 2,
            "disciplina": "Português",
            "data": "2024-09-25",
            "horarioInicio": "10:00",
            "horarioFim": "11:30",
            "sala": "Sala 102",
            "conteudo": "Análise sintática"
        },
        {
            "turmaId": 3,
            "professorId": 3,
            "disciplina": "História",
            "data": "2024-09-25",
            "horarioInicio": "14:00",
            "horarioFim": "15:30",
            "sala": "Sala 103",
            "conteudo": "Brasil Colonial"
        }
    ]
}

# Enviar a requisição POST
response = requests.post(url, data=json.dumps(data), headers={"Content-Type": "application/json"})

# Imprimir a resposta
print(response.status_code)
print(response.json())

