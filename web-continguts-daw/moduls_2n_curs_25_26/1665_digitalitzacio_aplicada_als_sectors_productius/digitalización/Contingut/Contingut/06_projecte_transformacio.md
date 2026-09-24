# Tema 6: Metodologia de Transformació Digital

> **RA6:** Desenvolupa un projecte de transformació digital d'una empresa d'un sector relacionat amb el títol, tenint en compte els canvis que s'han de produir en funció dels objectius de l'empresa.

---

## 6.1 Objectius estratègics de l'empresa

### Alineació amb l'estratègia

La transformació digital ha d'estar **alineada amb els objectius de negoci**, no ser un fi en si mateixa.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ESTRATÈGIA EMPRESARIAL                       │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Visió • Missió • Valors • Objectius estratègics        │  │
│   └───────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │            ESTRATÈGIA DE TRANSFORMACIÓ DIGITAL          │  │
│   │                                                         │  │
│   │  • Com la tecnologia ajuda a assolir els objectius?    │  │
│   │  • Quins processos digitalitzar?                        │  │
│   │  • Quines tecnologies adoptar?                          │  │
│   └───────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│           ┌───────────────────┼───────────────────┐            │
│           ▼                   ▼                   ▼            │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   │
│   │   PROCESSOS   │   │  TECNOLOGIA   │   │    PERSONES   │   │
│   │               │   │               │   │               │   │
│   │ Automatització│   │ THD: IoT, IA  │   │ Capacitació   │   │
│   │ Optimització  │   │ Cloud, Big Data│  │ Cultura       │   │
│   │ Integració    │   │               │   │ Lideratge     │   │
│   └───────────────┘   └───────────────┘   └───────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Definició d'objectius SMART

| Criteri | Significat | Exemple |
|---------|------------|---------|
| **S**pecific | Concret i clar | Reduir temps de producció |
| **M**easurable | Quantificable | En un 20% |
| **A**chievable | Assolible | Amb la tecnologia disponible |
| **R**elevant | Alineat amb estratègia | Millora competitivitat |
| **T**ime-bound | Amb termini | En 12 mesos |

**Exemple complet:** "Reduir el temps de producció un 20% en 12 mesos mitjançant la implementació de sensors IoT i manteniment predictiu."

---

## 6.2 Identificació d'àrees a digitalitzar

### Matriu d'oportunitats

```
                    IMPACTE EN EL NEGOCI
                    Baix                Alt
                    │                    │
        ┌───────────┼────────────────────┼───────────┐
        │           │                    │           │
  Baix  │  IGNORAR  │     CONSIDERAR     │           │
        │           │                    │           │
        │           │                    │           │
DIFICULTAT──────────┼────────────────────┼───────────│
        │           │                    │           │
        │           │                    │           │
  Alta  │  EVITAR   │     PRIORITZAR     │           │
        │           │       ★★★          │           │
        └───────────┼────────────────────┼───────────┘
                    │                    │
```

### Àrees típiques a digitalitzar

| Àrea | Oportunitats de digitalització | THD rellevants |
|------|-------------------------------|----------------|
| **Producció** | Automatització, IoT, predictiu | IoT, IA |
| **Logística** | Tracking, optimització rutes | IoT, Big Data |
| **Vendes** | E-commerce, CRM intel·ligent | Cloud, IA |
| **Atenció client** | Chatbots, autoservei | IA (LLMs) |
| **RRHH** | Automatització processos | Cloud, RPA |
| **Finances** | Automatització, reporting | Big Data, RPA |
| **Qualitat** | Visió artificial, SPC | IA, IoT |
| **Manteniment** | Predictiu, gestió actius | IoT, ML |

### Metodologia per identificar àrees

1. **Mapejar processos actuals** (As-Is)
2. **Identificar pain points** (problemes, ineficiències)
3. **Avaluar impacte i viabilitat**
4. **Prioritzar** segons matriu impacte/dificultat
5. **Definir estat futur** (To-Be)

---

## 6.3 Integració de THD

### Estratègia d'integració

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   INTEGRACIÓ DE THD                             │
│                                                                 │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│   │   IoT   │──►│Big Data │──►│   IA    │──►│ Acció   │        │
│   │         │   │         │   │   ML    │   │         │        │
│   │ Sensors │   │ Ingestió│   │ Models  │   │Automati-│        │
│   │ Dades   │   │ Storage │   │Predicció│   │ zació   │        │
│   └─────────┘   └─────────┘   └─────────┘   └─────────┘        │
│        │             │             │             │              │
│        └─────────────┴─────────────┴─────────────┘              │
│                            │                                    │
│                     ┌──────▼──────┐                             │
│                     │    CLOUD    │                             │
│                     │             │                             │
│                     │ Plataforma  │                             │
│                     │ Serveis     │                             │
│                     │ Escalabilitat│                            │
│                     └─────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Exemple: Manteniment predictiu

```
┌─────────────────────────────────────────────────────────────────┐
│                 MANTENIMENT PREDICTIU                           │
│                                                                 │
│  1. IoT                2. Big Data           3. IA              │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│  │ Sensors     │ ──►  │ Data Lake   │ ──►  │ Model ML    │     │
│  │ vibració    │      │ històric    │      │ classificació│    │
│  │ temperatura │      │ temps real  │      │ regressió   │     │
│  │ corrent     │      │             │      │             │     │
│  └─────────────┘      └─────────────┘      └─────────────┘     │
│                                                   │             │
│                                                   ▼             │
│  5. Acció              4. Predicció                             │
│  ┌─────────────┐      ┌─────────────┐                          │
│  │ Ordre de    │ ◄──  │ Fallada en  │                          │
│  │ treball     │      │ 7 dies      │                          │
│  │ automàtica  │      │ 85% prob.   │                          │
│  └─────────────┘      └─────────────┘                          │
│                                                                 │
│  RESULTAT: -30% temps d'aturada, -25% costos manteniment       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Consideracions d'integració

| Aspecte | Consideracions |
|---------|----------------|
| **Interoperabilitat** | APIs, estàndards oberts (OPC-UA, MQTT) |
| **Escalabilitat** | Creixement previst, cloud native |
| **Latència** | Edge vs Cloud segons requisits |
| **Seguretat** | Encriptació, autenticació, Zero Trust |
| **Costos** | CAPEX vs OPEX, TCO |

---

## 6.4 Encaix entre àrees

### Integració de sistemes

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ARQUITECTURA INTEGRADA                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                   CAPA DE PRESENTACIÓ                    │  │
│   │   Dashboards │ Apps mòbils │ Portals │ APIs externes    │  │
│   └───────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│   ┌───────────────────────────┴─────────────────────────────┐  │
│   │                   CAPA D'INTEGRACIÓ                      │  │
│   │   API Gateway │ ESB │ Event Bus │ Middleware            │  │
│   └───────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│   ┌───────────┬───────────┬───┴───┬───────────┬───────────┐   │
│   │           │           │       │           │           │   │
│   ▼           ▼           ▼       ▼           ▼           │   │
│ ┌─────┐   ┌─────┐     ┌─────┐ ┌─────┐     ┌─────┐        │   │
│ │ ERP │   │ CRM │     │ MES │ │ WMS │     │ IoT │        │   │
│ │     │   │     │     │     │ │     │     │Plat.│        │   │
│ └─────┘   └─────┘     └─────┘ └─────┘     └─────┘        │   │
│                                                             │   │
│   ┌─────────────────────────────────────────────────────┐  │   │
│   │                   CAPA DE DADES                      │  │   │
│   │   Data Lake │ Data Warehouse │ Master Data          │  │   │
│   └─────────────────────────────────────────────────────┘  │   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Patrons d'integració

| Patró | Descripció | Quan usar |
|-------|------------|-----------|
| **API REST** | Comunicació síncron punt a punt | Integracions senzilles |
| **Event-Driven** | Missatgeria asíncrona | Sistemes desacoblats |
| **ETL/ELT** | Càrrega periòdica de dades | Data Warehouse, reporting |
| **CDC** | Captura de canvis en temps real | Sincronització de dades |
| **iPaaS** | Integració com a servei | Multi-cloud, SaaS |

---

## 6.5 Necessitats presents i futures

### Anàlisi temporal

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   PRESENT                   TRANSICIÓ              FUTUR        │
│   (0-6 mesos)              (6-18 mesos)          (18-36 mesos) │
│                                                                 │
│   ┌───────────┐           ┌───────────┐          ┌───────────┐ │
│   │ Quick wins│           │ Projectes │          │Transformac│ │
│   │           │   ───►    │ estructur.│   ───►   │ió completa│ │
│   │• Processos│           │• Nous     │          │• Nous     │ │
│   │  manuals  │           │  sistemes │          │  models   │ │
│   │• Ineficièn│           │• Integrac.│          │  negoci   │ │
│   │  cies     │           │           │          │• Innovació│ │
│   └───────────┘           └───────────┘          └───────────┘ │
│                                                                 │
│   TECNOLOGIA:                                                   │
│   RPA, Cloud    ───►      IoT, ML     ───►       IA avançada   │
│   SaaS                    Analytics              Digital Twin  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Roadmap tecnològic

| Horitzó | Focus | Tecnologies |
|---------|-------|-------------|
| **Curt termini** | Eficiència operativa | Cloud, RPA, automatització bàsica |
| **Mig termini** | Intel·ligència | IoT, Big Data, ML, analytics |
| **Llarg termini** | Innovació | IA avançada, nous models de negoci |

---

## 6.6 Anàlisi de riscos de seguretat

### Metodologia d'anàlisi

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. IDENTIFICAR        2. AVALUAR          3. MITIGAR         │
│   ┌─────────────┐      ┌─────────────┐     ┌─────────────┐     │
│   │ Actius      │ ──►  │ Probabilitat│ ──► │ Controls    │     │
│   │ Amenaces    │      │ Impacte     │     │ Mesures     │     │
│   │ Vulnerabil. │      │ Risc = P×I  │     │ Monitoratge │     │
│   └─────────────┘      └─────────────┘     └─────────────┘     │
│                                                   │             │
│                                                   ▼             │
│                                           4. MONITORITZAR      │
│                                           ┌─────────────┐      │
│                                           │ Seguiment   │      │
│                                           │ Revisió     │      │
│                                           │ Millora     │      │
│                                           └─────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Matriu de riscos

| Risc | Probabilitat | Impacte | Nivell | Mitigació |
|------|--------------|---------|--------|-----------|
| Ransomware | Alta | Crític | 🔴 | Backups, segmentació, EDR |
| Fuita de dades | Mitjana | Alt | 🟠 | DLP, encriptació, IAM |
| Caiguda de sistemes | Baixa | Alt | 🟡 | HA, DR, cloud multi-zona |
| Accés no autoritzat | Mitjana | Mitjà | 🟡 | MFA, Zero Trust |

### Zero Trust per àrees

| Àrea | Mesures Zero Trust |
|------|-------------------|
| **Identitat** | MFA, SSO, gestió privilegis |
| **Dispositius** | MDM, compliance, EDR |
| **Xarxa** | Microsegmentació, ZTNA |
| **Aplicacions** | Autenticació contínua, WAF |
| **Dades** | Classificació, encriptació, DLP |

---

## 6.7 Tractament de dades

### Flux de dades

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  FONTS           INGESTA         PROCÉS          CONSUM        │
│                                                                 │
│  ┌─────┐       ┌─────────┐     ┌─────────┐     ┌─────────┐    │
│  │ IoT │──────►│         │     │         │     │BI/Report│    │
│  └─────┘       │         │     │  ETL    │     └─────────┘    │
│  ┌─────┐       │ Message │     │  /ELT   │     ┌─────────┐    │
│  │ Apps│──────►│ Queue   │────►│         │────►│   ML    │    │
│  └─────┘       │         │     │  Spark  │     └─────────┘    │
│  ┌─────┐       │ Kafka   │     │  DBT    │     ┌─────────┐    │
│  │ APIs│──────►│         │     │         │     │   API   │    │
│  └─────┘       └─────────┘     └─────────┘     └─────────┘    │
│                     │               │               │          │
│                     └───────────────┴───────────────┘          │
│                                     │                          │
│                              ┌──────▼──────┐                   │
│                              │  DATA LAKE  │                   │
│                              │     /       │                   │
│                              │  WAREHOUSE  │                   │
│                              └─────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Governança de dades

| Aspecte | Pràctiques |
|---------|------------|
| **Qualitat** | Validació, neteja, monitoratge |
| **Catàleg** | Metadata, diccionari de dades |
| **Llinatge** | Traçabilitat origen-destí |
| **Seguretat** | Encriptació, masking, accés |
| **Compliment** | RGPD, retenció, auditoria |

---

## 6.8 Documentació i gestió del canvi

### Documentació del projecte

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   DOCUMENTACIÓ DEL PROJECTE                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    RESUM EXECUTIU                        │   │
│  │   Visió general per a direcció (1-2 pàgines)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   ANÀLISI   │  │ARQUITECTURA │  │    PLA      │            │
│  │             │  │             │  │             │            │
│  │• Situació   │  │• Diagrames  │  │• Cronograma │            │
│  │  actual     │  │• Components │  │• Recursos   │            │
│  │• Requisits  │  │• Integracions│ │• Pressupost │            │
│  │• Gap        │  │• Seguretat  │  │• Riscos     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    ANNEXOS TÈCNICS                       │   │
│  │   Especificacions, configuracions, codi                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Gestió del canvi

| Fase | Activitats |
|------|------------|
| **Preparació** | Comunicació, sponsorship, visió |
| **Gestió** | Formació, suport, feedback |
| **Reforç** | Celebració, reconeixement, millora |

---

## 6.9 Idoneïtat dels recursos humans

### Anàlisi de competències

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            COMPETÈNCIES NECESSÀRIES vs DISPONIBLES              │
│                                                                 │
│                      Necessàries                                │
│              ┌───────────────────────┐                          │
│              │  Cloud   ██████████░░ │ 80%                     │
│              │  IoT     ████████░░░░ │ 65%                     │
│              │  Data    ██████░░░░░░ │ 50%   ← GAP             │
│              │  IA/ML   ████░░░░░░░░ │ 35%   ← GAP             │
│              │  Agile   ████████████ │ 95%                     │
│              └───────────────────────┘                          │
│                         │                                       │
│              ┌──────────┴──────────┐                            │
│              ▼                     ▼                            │
│        ┌──────────┐          ┌──────────┐                       │
│        │  FORMAR  │          │CONTRACTAR│                       │
│        │          │          │   /      │                       │
│        │ Upskilling│         │EXTERNALITZ│                      │
│        │ Reskilling│         │          │                       │
│        └──────────┘          └──────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Estratègies

| Estratègia | Quan usar | Avantatges |
|------------|-----------|------------|
| **Formar** | Competències properes, temps disponible | Retenció, cultura |
| **Contractar** | Competències noves, urgència | Ràpid, expertise |
| **Externalitzar** | Projectes puntuals, especialització | Flexibilitat |

---

## 6.10 Metodologia de projecte

### Fases del projecte

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  FASE 1         FASE 2         FASE 3         FASE 4           │
│  DESCOBRIMENT   DISSENY        IMPLEMENTACIÓ  OPERACIÓ         │
│                                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│  │         │   │         │   │         │   │         │        │
│  │Anàlisi  │──►│Arquitect│──►│Desenvolup│──►│Monitora │        │
│  │Requisits│   │ura      │   │Test     │   │ment     │        │
│  │Casos d'ús│   │POC/Pilot│   │Desplegam│   │Millora  │        │
│  │         │   │         │   │         │   │         │        │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘        │
│      │             │             │             │               │
│      ▼             ▼             ▼             ▼               │
│   Business      Technical      Working      Production        │
│   Case          Design         System       System            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Entregables per fase

| Fase | Entregables |
|------|-------------|
| **Descobriment** | Business case, requisits, roadmap |
| **Disseny** | Arquitectura, POC, pla de projecte |
| **Implementació** | Codi, configuracions, documentació |
| **Operació** | Runbooks, dashboards, SLAs |

---

## Resum del Tema

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              PROJECTE DE TRANSFORMACIÓ DIGITAL                  │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │              ESTRATÈGIA I OBJECTIUS                    │    │
│   │   Alineació amb negoci • Objectius SMART              │    │
│   └───────────────────────────────────────────────────────┘    │
│                           │                                     │
│   ┌───────────────────────┼───────────────────────┐            │
│   ▼                       ▼                       ▼            │
│ ┌──────────┐        ┌──────────┐           ┌──────────┐       │
│ │ ÀREES    │        │   THD    │           │ INTEGRACIÓ│       │
│ │          │        │          │           │          │       │
│ │Identificar│◄─────►│IoT,IA,BD │◄─────────►│ Sistemes │       │
│ │Prioritzar│        │Cloud     │           │ Dades    │       │
│ └──────────┘        └──────────┘           └──────────┘       │
│                           │                                     │
│   ┌───────────────────────┼───────────────────────┐            │
│   ▼                       ▼                       ▼            │
│ ┌──────────┐        ┌──────────┐           ┌──────────┐       │
│ │SEGURETAT │        │  RRHH    │           │  GESTIÓ  │       │
│ │          │        │          │           │          │       │
│ │Zero Trust│        │Competèn- │           │Document. │       │
│ │Riscos    │        │cies      │           │Canvi     │       │
│ └──────────┘        └──────────┘           └──────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## El vostre projecte

### Què heu de lliurar

1. **Document** (50%)
   - Anàlisi del cas empresarial
   - Arquitectura tecnològica
   - Pla d'implementació

2. **Prototip** (30%)
   - Implementació bàsica funcional
   - Recursos gratuïts
   - Documentació tècnica

3. **Defensa** (20%)
   - Presentació oral
   - Demo del prototip
   - Respostes a preguntes

### Consells finals

- Comenceu pel cas i els objectius, no per la tecnologia
- Justifiqueu cada decisió tecnològica
- Sigueu realistes amb l'abast
- Documenteu mentre treballeu
- Proveu el prototip abans de la defensa
