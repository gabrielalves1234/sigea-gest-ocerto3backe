
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import datetime

# Configuração do Banco de Dados
SQLALCHEMY_DATABASE_URL = "sqlite:///./sigea.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelos SQLAlchemy
class ProfessorDB(Base):
    __tablename__ = "professores"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    telefone = Column(String)
    disciplina = Column(String)
    dataContratacao = Column(Date)

class TurmaDB(Base):
    __tablename__ = "turmas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    ano = Column(Integer)
    semestre = Column(Integer)
    professorId = Column(Integer)
    capacidade = Column(Integer)
    alunosMatriculados = Column(Integer, default=0)

class AlunoDB(Base):
    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    telefone = Column(String)
    dataNascimento = Column(Date)
    turmaId = Column(Integer)
    responsavel = Column(String)
    telefoneResponsavel = Column(String)

class AulaDB(Base):
    __tablename__ = "aulas"

    id = Column(Integer, primary_key=True, index=True)
    turmaId = Column(Integer)
    professorId = Column(Integer)
    disciplina = Column(String)
    data = Column(Date)
    horarioInicio = Column(String)
    horarioFim = Column(String)
    sala = Column(String)
    conteudo = Column(String)

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Modelos Pydantic para validação de dados (Request/Response)
class ProfessorBase(BaseModel):
    nome: str
    email: str
    telefone: str
    disciplina: str
    dataContratacao: datetime.date

class ProfessorCreate(ProfessorBase):
    pass

class Professor(ProfessorBase):
    id: int

    class Config:
        from_attributes = True

class TurmaBase(BaseModel):
    nome: str
    ano: int
    semestre: int
    professorId: int
    capacidade: int
    alunosMatriculados: Optional[int] = 0

class TurmaCreate(TurmaBase):
    pass

class Turma(TurmaBase):
    id: int

    class Config:
        from_attributes = True

class AlunoBase(BaseModel):
    nome: str
    email: str
    telefone: str
    dataNascimento: datetime.date
    turmaId: int
    responsavel: str
    telefoneResponsavel: str

class AlunoCreate(AlunoBase):
    pass

class Aluno(AlunoBase):
    id: int

    class Config:
        from_attributes = True

class AulaBase(BaseModel):
    turmaId: int
    professorId: int
    disciplina: str
    data: datetime.date
    horarioInicio: str
    horarioFim: str
    sala: str
    conteudo: str

class AulaCreate(AulaBase):
    pass

class Aula(AulaBase):
    id: int

    class Config:
        from_attributes = True

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

# Endpoints para Professores
@app.post("/professores/", response_model=Professor)
def create_professor(professor: ProfessorCreate, db: Session = Depends(get_db)):
    db_professor = ProfessorDB(**professor.dict())
    db.add(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor

@app.get("/professores/", response_model=List[Professor])
def read_professores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    professores = db.query(ProfessorDB).offset(skip).limit(limit).all()
    return professores

@app.get("/professores/{professor_id}", response_model=Professor)
def read_professor(professor_id: int, db: Session = Depends(get_db)):
    professor = db.query(ProfessorDB).filter(ProfessorDB.id == professor_id).first()
    if professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    return professor

@app.put("/professores/{professor_id}", response_model=Professor)
def update_professor(professor_id: int, professor: ProfessorCreate, db: Session = Depends(get_db)):
    db_professor = db.query(ProfessorDB).filter(ProfessorDB.id == professor_id).first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    for key, value in professor.dict().items():
        setattr(db_professor, key, value)
    db.commit()
    db.refresh(db_professor)
    return db_professor

@app.delete("/professores/{professor_id}")
def delete_professor(professor_id: int, db: Session = Depends(get_db)):
    db_professor = db.query(ProfessorDB).filter(ProfessorDB.id == professor_id).first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    db.delete(db_professor)
    db.commit()
    return {"message": "Professor deleted successfully"}

# Endpoints para Turmas
@app.post("/turmas/", response_model=Turma)
def create_turma(turma: TurmaCreate, db: Session = Depends(get_db)):
    db_turma = TurmaDB(**turma.dict())
    db.add(db_turma)
    db.commit()
    db.refresh(db_turma)
    return db_turma

@app.get("/turmas/", response_model=List[Turma])
def read_turmas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    turmas = db.query(TurmaDB).offset(skip).limit(limit).all()
    return turmas

@app.get("/turmas/{turma_id}", response_model=Turma)
def read_turma(turma_id: int, db: Session = Depends(get_db)):
    turma = db.query(TurmaDB).filter(TurmaDB.id == turma_id).first()
    if turma is None:
        raise HTTPException(status_code=404, detail="Turma not found")
    return turma

@app.put("/turmas/{turma_id}", response_model=Turma)
def update_turma(turma_id: int, turma: TurmaCreate, db: Session = Depends(get_db)):
    db_turma = db.query(TurmaDB).filter(TurmaDB.id == turma_id).first()
    if db_turma is None:
        raise HTTPException(status_code=404, detail="Turma not found")
    for key, value in turma.dict().items():
        setattr(db_turma, key, value)
    db.commit()
    db.refresh(db_turma)
    return db_turma

@app.delete("/turmas/{turma_id}")
def delete_turma(turma_id: int, db: Session = Depends(get_db)):
    db_turma = db.query(TurmaDB).filter(TurmaDB.id == turma_id).first()
    if db_turma is None:
        raise HTTPException(status_code=404, detail="Turma not found")
    db.delete(db_turma)
    db.commit()
    return {"message": "Turma deleted successfully"}

# Endpoints para Alunos
@app.post("/alunos/", response_model=Aluno)
def create_aluno(aluno: AlunoCreate, db: Session = Depends(get_db)):
    db_aluno = AlunoDB(**aluno.dict())
    db.add(db_aluno)
    db.commit()
    db.refresh(db_aluno)
    
    # Atualiza contador de alunos na turma
    db_turma = db.query(TurmaDB).filter(TurmaDB.id == aluno.turmaId).first()
    if db_turma:
        db_turma.alunosMatriculados += 1
        db.commit()

    return db_aluno

@app.get("/alunos/", response_model=List[Aluno])
def read_alunos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alunos = db.query(AlunoDB).offset(skip).limit(limit).all()
    return alunos

@app.get("/alunos/{aluno_id}", response_model=Aluno)
def read_aluno(aluno_id: int, db: Session = Depends(get_db)):
    aluno = db.query(AlunoDB).filter(AlunoDB.id == aluno_id).first()
    if aluno is None:
        raise HTTPException(status_code=404, detail="Aluno not found")
    return aluno

@app.put("/alunos/{aluno_id}", response_model=Aluno)
def update_aluno(aluno_id: int, aluno: AlunoCreate, db: Session = Depends(get_db)):
    db_aluno = db.query(AlunoDB).filter(AlunoDB.id == aluno_id).first()
    if db_aluno is None:
        raise HTTPException(status_code=404, detail="Aluno not found")
    
    old_turma_id = db_aluno.turmaId

    for key, value in aluno.dict().items():
        setattr(db_aluno, key, value)
    db.commit()
    db.refresh(db_aluno)

    # Atualiza contadores se mudou de turma
    if old_turma_id != aluno.turmaId:
        old_turma = db.query(TurmaDB).filter(TurmaDB.id == old_turma_id).first()
        if old_turma:
            old_turma.alunosMatriculados -= 1
            db.commit()

        new_turma = db.query(TurmaDB).filter(TurmaDB.id == aluno.turmaId).first()
        if new_turma:
            new_turma.alunosMatriculados += 1
            db.commit()

    return db_aluno

@app.delete("/alunos/{aluno_id}")
def delete_aluno(aluno_id: int, db: Session = Depends(get_db)):
    db_aluno = db.query(AlunoDB).filter(AlunoDB.id == aluno_id).first()
    if db_aluno is None:
        raise HTTPException(status_code=404, detail="Aluno not found")
    
    turma_id = db_aluno.turmaId
    db.delete(db_aluno)
    db.commit()

    # Atualiza contador de alunos na turma
    db_turma = db.query(TurmaDB).filter(TurmaDB.id == turma_id).first()
    if db_turma:
        db_turma.alunosMatriculados -= 1
        db.commit()

    return {"message": "Aluno deleted successfully"}

# Endpoints para Aulas
@app.post("/aulas/", response_model=Aula)
def create_aula(aula: AulaCreate, db: Session = Depends(get_db)):
    db_aula = AulaDB(**aula.dict())
    db.add(db_aula)
    db.commit()
    db.refresh(db_aula)
    return db_aula

@app.get("/aulas/", response_model=List[Aula])
def read_aulas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    aulas = db.query(AulaDB).offset(skip).limit(limit).all()
    return aulas

@app.get("/aulas/{aula_id}", response_model=Aula)
def read_aula(aula_id: int, db: Session = Depends(get_db)):
    aula = db.query(AulaDB).filter(AulaDB.id == aula_id).first()
    if aula is None:
        raise HTTPException(status_code=404, detail="Aula not found")
    return aula

@app.put("/aulas/{aula_id}", response_model=Aula)
def update_aula(aula_id: int, aula: AulaCreate, db: Session = Depends(get_db)):
    db_aula = db.query(AulaDB).filter(AulaDB.id == aula_id).first()
    if db_aula is None:
        raise HTTPException(status_code=404, detail="Aula not found")
    for key, value in aula.dict().items():
        setattr(db_aula, key, value)
    db.commit()
    db.refresh(db_aula)
    return db_aula

@app.delete("/aulas/{aula_id}")
def delete_aula(aula_id: int, db: Session = Depends(get_db)):
    db_aula = db.query(AulaDB).filter(AulaDB.id == aula_id).first()
    if db_aula is None:
        raise HTTPException(status_code=404, detail="Aula not found")
    db.delete(db_aula)
    db.commit()
    return {"message": "Aula deleted successfully"}

# Endpoint para estatísticas (baseado em getEstatisticas do frontend)
@app.get("/estatisticas/")
def get_estatisticas(db: Session = Depends(get_db)):
    total_professores = db.query(ProfessorDB).count()
    total_turmas = db.query(TurmaDB).count()
    total_alunos = db.query(AlunoDB).count()
    total_aulas = db.query(AulaDB).count()

    alunos = db.query(AlunoDB).all()
    turmas = db.query(TurmaDB).all()

    media_alunos_por_turma = 0
    if total_turmas > 0:
        media_alunos_por_turma = round(total_alunos / total_turmas)

    # Isso é um pouco mais complexo de replicar exatamente como no JS sem relações diretas, 
    # mas podemos ordenar as turmas existentes por alunosMatriculados
    turmas_com_mais_alunos = db.query(TurmaDB).order_by(TurmaDB.alunosMatriculados.desc()).limit(3).all()

    return {
        "totalProfessores": total_professores,
        "totalTurmas": total_turmas,
        "totalAlunos": total_alunos,
        "totalAulas": total_aulas,
        "mediaAlunosPorTurma": media_alunos_por_turma,
        "turmasComMaisAlunos": turmas_com_mais_alunos
    }

# Endpoints para busca (baseado em buscarAlunos e buscarProfessores do frontend)
@app.get("/alunos/search/", response_model=List[Aluno])
def search_alunos(term: str, db: Session = Depends(get_db)):
    alunos = db.query(AlunoDB).filter(
        (AlunoDB.nome.ilike(f"%{term}%")) | 
        (AlunoDB.email.ilike(f"%{term}%"))
    ).all()
    return alunos

@app.get("/professores/search/", response_model=List[Professor])
def search_professores(term: str, db: Session = Depends(get_db)):
    professores = db.query(ProfessorDB).filter(
        (ProfessorDB.nome.ilike(f"%{term}%")) | 
        (ProfessorDB.disciplina.ilike(f"%{term}%"))
    ).all()
    return professores

# Endpoint para importar dados (similar ao importarDados do frontend)
class ImportData(BaseModel):
    professores: Optional[List[ProfessorCreate]] = None
    turmas: Optional[List[TurmaCreate]] = None
    alunos: Optional[List[AlunoCreate]] = None
    aulas: Optional[List[AulaCreate]] = None

@app.post("/import-data/")
def import_data(data: ImportData, db: Session = Depends(get_db)):
    if data.professores:
        for p in data.professores:
            db_professor = ProfessorDB(**p.dict())
            db.add(db_professor)
    if data.turmas:
        for t in data.turmas:
            db_turma = TurmaDB(**t.dict())
            db.add(db_turma)
    if data.alunos:
        for a in data.alunos:
            db_aluno = AlunoDB(**a.dict())
            db.add(db_aluno)
    if data.aulas:
        for au in data.aulas:
            db_aula = AulaDB(**au.dict())
            db.add(db_aula)
    db.commit()
    return {"message": "Dados importados com sucesso!"}

# Endpoint para exportar dados (similar ao exportarDados do frontend)
@app.get("/export-data/")
def export_data(db: Session = Depends(get_db)):
    professores = db.query(ProfessorDB).all()
    turmas = db.query(TurmaDB).all()
    alunos = db.query(AlunoDB).all()
    aulas = db.query(AulaDB).all()

    return {
        "professores": professores,
        "turmas": turmas,
        "alunos": alunos,
        "aulas": aulas,
        "exportadoEm": datetime.datetime.now().isoformat()
    }

# Endpoint para limpar dados (similar ao limparDados do frontend)
@app.delete("/clear-data/")
def clear_data(db: Session = Depends(get_db)):
    db.query(ProfessorDB).delete()
    db.query(TurmaDB).delete()
    db.query(AlunoDB).delete()
    db.query(AulaDB).delete()
    db.commit()
    return {"message": "Todos os dados foram limpos com sucesso!"}


