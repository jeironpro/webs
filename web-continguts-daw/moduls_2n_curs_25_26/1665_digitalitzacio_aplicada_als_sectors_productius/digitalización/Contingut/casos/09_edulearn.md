# Cas 9: EduLearn Academy

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | EduLearn Academy |
| **Sector** | Educació / Formació |
| **Ubicació** | Barcelona (centre + online) |
| **Empleats** | 45 |
| **Alumnes** | 1.200/any |
| **Cursos** | 85 programes formatius |

---

## Descripció del negoci

EduLearn és una acadèmia de formació professional i contínua que ofereix:
- Certificats de professionalitat
- Formació per a empreses (bonificada)
- Cursos de especialització
- Preparació d'oposicions

**Modalitats:** Presencial, online i híbrid.

---

## Situació actual

### Tecnologia existent
- **LMS**: Moodle (instal·lació antiga)
- **Gestió acadèmica**: Base de dades Access
- **Videoconferència**: Zoom (comptes individuals)
- **Comunicació**: Email + WhatsApp
- **Facturació**: Programa comptable separat

### Entorns IT/OT
```
IT: LMS, web, email, comptabilitat
OT: Aules (projectors, PCs) - no integrat
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| LMS obsolet i poc usable | Queixes alumnes, abandonament | Alta |
| Gestió manual de matrícules | Errors, temps | Alta |
| No analítica d'aprenentatge | No es detecta risc d'abandó | Mitjana |
| Continguts no interactius | Engagement baix | Mitjana |
| Atenció alumne lenta | Queixes per resposta | Mitjana |
| Certificacions en paper | Procés lent, falsificacions | Baixa |

---

## Oportunitats de digitalització

### 1. Plataforma d'aprenentatge moderna
- LMS actualitzat (UX moderna)
- Continguts interactius
- Gamificació
- App mòbil

### 2. IA en l'aprenentatge
- Tutor virtual (chatbot)
- Recomanacions personalitzades
- Detecció de risc d'abandó
- Correcció automàtica

### 3. Analytics educatiu
- Dashboard de progrés
- Mètriques d'engagement
- Predicció de resultats

### 4. Automatització de gestió
- Matrícula online
- Comunicacions automatitzades
- Generació de certificats

### 5. Aules intel·ligents
- Reserva d'espais
- Control de presència
- Gravació de classes

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD                                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   LMS    │  │  Gestió  │  │   IA     │  │Analytics │        │
│  │ Modern   │  │Acadèmica │  │  Tutor   │  │ Learning │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴───────┐   ┌───────┴───────┐   ┌───────┴───────┐
│    ALUMNE     │   │   PROFESSOR   │   │     AULA      │
│               │   │               │   │               │
│ ┌───────────┐ │   │ ┌───────────┐ │   │ ┌───────────┐ │
│ │  Web/App  │ │   │ │  Plataform│ │   │ │ Sistema   │ │
│ │           │ │   │ │  Docent   │ │   │ │ Presència │ │
│ │ • Cursos  │ │   │ │           │ │   │ │           │ │
│ │ • Fòrums  │ │   │ │ • Crear   │ │   │ │ • QR      │ │
│ │ • Tutor IA│ │   │ │ • Avaluar │ │   │ │ • Càmera  │ │
│ └───────────┘ │   │ └───────────┘ │   │ └───────────┘ │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **Cloud** | LMS, gestió, escalabilitat |
| **IA** | Tutor virtual, recomanacions, correcció |
| **Big Data** | Analytics d'aprenentatge |
| **IoT** | Aules intel·ligents, presència |

---

## Prototip suggerit

### Opció A: Tutor virtual amb IA
- Chatbot per dubtes dels alumnes
- Basat en contingut del curs
- LLM (GPT, Claude, Gemini)

### Opció B: Dashboard d'alumne
- Progrés en cursos
- Predicció de risc d'abandó
- Recomanacions

### Opció C: Sistema de matrícula online
- Formulari web
- Pagament integrat
- Generació de credencials

---

## Dades disponibles (simulades)

- Històric d'alumnes (matrícules, notes)
- Activitat en LMS (logins, temps, activitats)
- Resultats d'avaluacions
- Enquestes de satisfacció

---

## Recursos gratuïts recomanats

- **LMS**: Moodle, Canvas (free), Open edX
- **Tutor IA**: OpenAI API, Claude API, RAG amb LangChain
- **Analytics**: Metabase, Learning Locker (xAPI)
- **Video**: Loom, OBS (gravació)
- **Pagaments**: Stripe, PayPal
- **Certificats**: Accredible, blockchain (Ethereum testnet)

---

## Preguntes guia

1. Com milloraries l'engagement dels alumnes online?
2. Quines mètriques utilitzaries per detectar risc d'abandó?
3. Com implementaries un tutor IA efectiu?
4. Quines dades xAPI recolliries per analytics?
5. Com garantiries la validesa dels certificats digitals?
