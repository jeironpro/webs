# Tema 4: Intel·ligència Artificial

> **RA4:** Identifica aplicacions de la IA en entorns del sector on està emmarcat el títol descrivint les millores implícites en la seva implementació.

---

## 4.1 IA en automatització i optimització

### Automatització intel·ligent

La IA permet automatitzar tasques que abans requerien judici humà:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│     AUTOMATITZACIÓ TRADICIONAL    vs    AUTOMATITZACIÓ IA      │
│                                                                 │
│     ┌─────────────────────┐          ┌─────────────────────┐   │
│     │  Regles fixes       │          │  Aprenentatge       │   │
│     │  Si X → fer Y       │          │  Adaptació          │   │
│     │  Determinista       │          │  Predicció          │   │
│     │  Programat          │          │  Millora contínua   │   │
│     └─────────────────────┘          └─────────────────────┘   │
│                                                                 │
│     Exemple: RPA                     Exemple: ML + RPA          │
│     - Copiar dades                   - Entendre documents      │
│     - Omplir formularis              - Decidir accions         │
│     - Processos repetitius           - Gestionar excepcions    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tipus d'automatització amb IA

| Nivell | Descripció | Exemples |
|--------|------------|----------|
| **Assistida** | IA ajuda l'humà | Suggeriments, autocomplete |
| **Augmentada** | IA i humà treballen junts | Diagnòstic mèdic + metge |
| **Autònoma** | IA actua sola | Conducció autònoma, robots |

### Optimització amb IA

| Àrea | Problema | Solució IA |
|------|----------|------------|
| **Producció** | Planificació de producció | Algoritmes d'optimització |
| **Logística** | Rutes de transport | Vehicle Routing Problem |
| **Energia** | Consum eficient | Predicció de demanda |
| **Inventari** | Stock òptim | Previsió de demanda |
| **Recursos** | Assignació de personal | Scheduling amb ML |

### Exemples d'optimització

```
ABANS (Manual/Heurístic)              DESPRÉS (IA)

┌─────────────────────┐              ┌─────────────────────┐
│ Planificació:       │              │ Planificació:       │
│ - Experiència       │              │ - Dades històriques │
│ - Intuïció          │     ──►      │ - Model predictiu   │
│ - Trial & error     │              │ - Optimització      │
│                     │              │ - Temps real        │
│ Resultat: subòptim  │              │ Resultat: òptim     │
└─────────────────────┘              └─────────────────────┘
```

---

## 4.2 Relació IA i Big Data

### El cercle virtuós

```
            ┌─────────────────────────────────────────────┐
            │                                             │
            ▼                                             │
     ┌─────────────┐                              ┌───────┴───────┐
     │   BIG DATA  │                              │    DECISIONS  │
     │             │                              │    ACCIONS    │
     │  • Volum    │                              └───────────────┘
     │  • Velocitat│                                     ▲
     │  • Varietat │                                     │
     └──────┬──────┘                              ┌──────┴──────┐
            │                                     │   INSIGHT   │
            ▼                                     │             │
     ┌─────────────┐                              │  Prediccions│
     │   ML / IA   │─────────────────────────────►│  Patrons    │
     │             │                              │  Anomalies  │
     │  Aprenentatge                              └─────────────┘
     │  automàtic  │
     └─────────────┘
```

### Big Data alimenta la IA

| Aspecte | Com ajuda |
|---------|-----------|
| **Volum** | Més dades = millors models |
| **Varietat** | Dades diverses = models robustos |
| **Velocitat** | Dades en temps real = prediccions actuals |

### IA processa Big Data

| Tasca | Tecnologia |
|-------|------------|
| **Classificació** | Categoritzar milions de registres |
| **Clustering** | Segmentar clients automàticament |
| **Predicció** | Preveure comportaments futurs |
| **Detecció anomalies** | Trobar fraus en temps real |
| **NLP** | Processar milions de textos |

### Impacte empresarial

| Sector | Big Data + IA | ROI |
|--------|---------------|-----|
| **Retail** | Recomanacions personalitzades | +10-30% vendes |
| **Finances** | Detecció de frau | -50% pèrdues |
| **Manufactura** | Manteniment predictiu | -20% downtime |
| **Màrqueting** | Segmentació avançada | +15-25% conversió |
| **Salut** | Diagnòstic assistit | +30% precisió |

---

## 4.3 Importància present i futura de la IA

### Estat actual (2024-2025)

```
┌─────────────────────────────────────────────────────────────────┐
│                    MADURESA DE LA IA                            │
│                                                                 │
│  Producció ████████████████████░░░░░░░░░░░░░░░░ 50%            │
│  (Desplegat i funcionant)                                       │
│                                                                 │
│  Pilot     ██████████████████████████░░░░░░░░░░ 65%            │
│  (En proves)                                                    │
│                                                                 │
│  Explorant ████████████████████████████████████ 85%            │
│  (Investigant opcions)                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visió futura

| Horitzó | Desenvolupaments esperats |
|---------|---------------------------|
| **2025** | IA Generativa mainstream, agents autònoms |
| **2027** | IA multimodal avançada, raonament complex |
| **2030** | AGI (possiblement), automatització massiva |

### IA Generativa: La revolució actual

| Modalitat | Exemples | Aplicacions |
|-----------|----------|-------------|
| **Text** | GPT, Claude, Gemini | Assistents, contingut, codi |
| **Imatge** | DALL-E, Midjourney, Stable Diffusion | Disseny, màrqueting |
| **Àudio** | Whisper, ElevenLabs | Transcripció, veu sintètica |
| **Vídeo** | Sora, Runway | Producció audiovisual |
| **Codi** | Copilot, Claude | Desenvolupament software |

### Impacte econòmic projectat

```
Contribució de la IA al PIB global (trilions USD)

2024  ████████░░░░░░░░░░░░░░░░░░░░░░  $2T
2027  ████████████████░░░░░░░░░░░░░░  $5T
2030  ████████████████████████░░░░░░  $7T
2035  ████████████████████████████░░  $15T

Font: Estimacions de McKinsey, PwC
```

---

## 4.4 Sectors amb implantació rellevant

### Mapa d'adopció de IA

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ALTA ADOPCIÓ                                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  TECNOLOGIA │ │  FINANCES   │ │   RETAIL    │               │
│  │             │ │             │ │             │               │
│  │• Assistents │ │• Trading    │ │• Recomanac. │               │
│  │• Codi       │ │• Frau       │ │• Chatbots   │               │
│  │• Cloud IA   │ │• Risc       │ │• Pricing    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  ADOPCIÓ CREIXENT                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   SALUT     │ │MANUFACTURA  │ │  LOGÍSTICA  │               │
│  │             │ │             │ │             │               │
│  │• Diagnòstic │ │• Qualitat   │ │• Rutes      │               │
│  │• Descoberta │ │• Predicció  │ │• Demanda    │               │
│  │  fàrmacs    │ │• Robots     │ │• Inventari  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  ADOPCIÓ EMERGENT                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ AGRICULTURA │ │ CONSTRUCCIÓ │ │   EDUCACIÓ  │               │
│  │             │ │             │ │             │               │
│  │• Precisió   │ │• Disseny    │ │• Tutors IA  │               │
│  │• Drons      │ │• Seguretat  │ │• Avaluació  │               │
│  │• Predicció  │ │• BIM + IA   │ │• Contingut  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detall per sector

| Sector | Aplicacions IA | Beneficis |
|--------|----------------|-----------|
| **Tecnologia** | Assistents de codi, testing, DevOps | +40% productivitat |
| **Finances** | Algorismes trading, detecció frau, chatbots | -60% fraus |
| **Salut** | Diagnòstic imatges, descoberta fàrmacs | +30% precisió |
| **Manufactura** | Visió artificial, manteniment predictiu | -25% defectes |
| **Retail** | Recomanacions, pricing dinàmic | +15% vendes |
| **Logística** | Optimització rutes, predicció demanda | -20% costos |

---

## 4.5 Llenguatges de programació en IA

### Rànquing per ús en IA/ML

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Python     ████████████████████████████████████████  95%      │
│  R          ████████████████████░░░░░░░░░░░░░░░░░░░░  45%      │
│  Julia      ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%      │
│  Java       ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  20%      │
│  C++        ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  15%      │
│  JavaScript ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  10%      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Python: L'estàndard de facto

| Llibreria | Funció |
|-----------|--------|
| **NumPy** | Càlcul numèric |
| **Pandas** | Manipulació de dades |
| **Scikit-learn** | ML clàssic |
| **TensorFlow** | Deep Learning (Google) |
| **PyTorch** | Deep Learning (Meta) |
| **Keras** | API alt nivell per DL |
| **Hugging Face** | NLP i LLMs |
| **LangChain** | Aplicacions amb LLMs |

### Eines i plataformes

| Categoria | Eines |
|-----------|-------|
| **Notebooks** | Jupyter, Colab, Kaggle |
| **MLOps** | MLflow, Kubeflow, Weights & Biases |
| **AutoML** | H2O, Auto-sklearn, Google AutoML |
| **Cloud ML** | SageMaker, Vertex AI, Azure ML |
| **LLMs** | OpenAI API, Claude API, Ollama |

### Ecosistema IA

```
┌─────────────────────────────────────────────────────────────────┐
│                     STACK D'IA MODERN                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    APLICACIÓ                             │  │
│  │  Chatbots, Dashboards, APIs, Apps mòbils                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 FRAMEWORKS / APIS                        │  │
│  │  LangChain, OpenAI, Hugging Face, FastAPI               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   MODELS                                 │  │
│  │  GPT, Claude, LLaMA, BERT, ResNet, YOLO                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              LLIBRERIES ML/DL                            │  │
│  │  TensorFlow, PyTorch, Scikit-learn, XGBoost             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               INFRAESTRUCTURA                            │  │
│  │  GPUs (NVIDIA), TPUs, Cloud (AWS/GCP/Azure)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4.6 IA segons el sector del títol

### DAW/DAM: Desenvolupament d'Aplicacions

| Aplicació IA | Descripció | Eines |
|--------------|------------|-------|
| **Assistents de codi** | Generació i autocompletat | GitHub Copilot, Claude |
| **Testing** | Generació de tests automàtica | Codium, TestPilot |
| **Debugging** | Detecció i correcció d'errors | SonarQube + IA |
| **Documentació** | Generació automàtica | Mintlify, Swimm |
| **UI/UX** | Generació d'interfícies | v0, Galileo AI |
| **DevOps** | Optimització de pipelines | Harness AI |

### ASIX: Sistemes i Xarxes

| Aplicació IA | Descripció | Eines |
|--------------|------------|-------|
| **Ciberseguretat** | Detecció d'amenaces | CrowdStrike, Darktrace |
| **Monitorització** | Detecció d'anomalies | Datadog, Dynatrace |
| **Automatització** | AIOps | IBM Watson AIOps |
| **Xarxa** | Optimització de trànsit | Cisco AI Network |
| **Helpdesk** | Chatbots de suport | Zendesk AI, Freshdesk |

### Tots els sectors

| Cas transversal | Descripció |
|-----------------|------------|
| **Chatbots empresarials** | Atenció al client amb LLMs |
| **Anàlisi de documents** | Extracció d'informació (OCR + NLP) |
| **BI augmentat** | Dashboards amb insights automàtics |
| **Automatització de processos** | RPA + IA per a tasques complexes |

---

## Resum del Tema

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    IA EN L'EMPRESA                              │
│                                                                 │
│     ┌─────────────────────────────────────────────────────┐    │
│     │                 AUTOMATITZACIÓ                       │    │
│     │   Tasques repetitives → Decisions complexes          │    │
│     └─────────────────────────────────────────────────────┘    │
│                            │                                    │
│     ┌──────────────────────┼──────────────────────┐            │
│     ▼                      ▼                      ▼            │
│  ┌─────────┐         ┌───────────┐         ┌───────────┐       │
│  │BIG DATA │◄───────►│    IA     │◄───────►│ DECISIONS │       │
│  │         │         │   ML/DL   │         │           │       │
│  │ Dades   │         │   LLMs    │         │ Accions   │       │
│  └─────────┘         └───────────┘         └───────────┘       │
│                            │                                    │
│     ┌──────────────────────┼──────────────────────┐            │
│     ▼                      ▼                      ▼            │
│  Python             Tots els sectors          Impacte          │
│  TensorFlow         Finances, Salut           econòmic         │
│  PyTorch            Manufactura...            trilionari       │
│  LLMs                                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Activitat pràctica

> Per al vostre projecte:
> 1. Identifica 2-3 aplicacions de IA rellevants per al cas
> 2. Descriu quines dades necessitaries (Big Data)
> 3. Quins models/eines utilitzaries?
> 4. Quin impacte esperaries en el negoci?
