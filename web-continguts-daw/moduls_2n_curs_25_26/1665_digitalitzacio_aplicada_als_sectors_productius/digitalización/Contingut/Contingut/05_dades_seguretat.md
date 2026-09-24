# Tema 5: Dades, Seguretat i Ciberseguretat

> **RA5:** Avalua la importància de les dades, així com la seva protecció en una economia digital globalitzada, definint sistemes de seguretat i ciberseguretat tant a nivell d'equip/sistema, com globals.

---

## 5.1 Dada vs Informació

### Definicions

| Concepte | Definició | Exemple |
|----------|-----------|---------|
| **Dada** | Fet en brut, sense context | "23", "BCN", "14:32" |
| **Informació** | Dades processades amb significat | "Temperatura: 23°C a Barcelona a les 14:32" |
| **Coneixement** | Informació aplicada amb experiència | "Fa calor, millor activar l'aire condicionat" |
| **Saviesa** | Coneixement amb judici | "Amb aquest patró, demà farà més calor encara" |

### Piràmide DIKW

```
                    ▲
                   ╱ ╲
                  ╱   ╲
                 ╱SAVIE╲
                ╱  SA   ╲
               ╱─────────╲
              ╱CONEIXEMENT╲
             ╱             ╲
            ╱───────────────╲
           ╱   INFORMACIÓ    ╲
          ╱                   ╲
         ╱─────────────────────╲
        ╱        DADES          ╲
       ╱                         ╲
      ───────────────────────────

      ▲ Valor
      │
      │ Context + Processament
      │
      ▼ Volum
```

### Tipus de dades

| Tipus | Característiques | Exemples |
|-------|------------------|----------|
| **Estructurades** | Format fix, taules | Bases de dades SQL |
| **Semi-estructurades** | Format flexible | JSON, XML, logs |
| **No estructurades** | Sense format | Imatges, vídeos, text |

---

## 5.2 Cicle de vida de la dada

### Fases

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐           │
│   │CREACIÓ │──►│EMMA-   │──►│UTILIT- │──►│ARXIU/  │           │
│   │RECOLLIDA│   │GATZEM. │   │ZACIÓ   │   │ELIMIN. │           │
│   └────────┘   └────────┘   └────────┘   └────────┘           │
│       │            │            │            │                  │
│       ▼            ▼            ▼            ▼                  │
│   • Sensors    • Data Lake  • Anàlisi   • Retenció             │
│   • Formularis • Data WH    • Reports   • Compliment           │
│   • APIs       • Bases de   • ML/IA     • Destrucció           │
│   • IoT          dades      • Dashboard   segura               │
│   • Transaccions           • APIs                              │
│                                                                 │
│   ◄──────────────── GOVERNANÇA ────────────────────────────►   │
│   • Qualitat • Seguretat • Privacitat • Compliment              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detall de cada fase

| Fase | Activitats | Consideracions |
|------|------------|----------------|
| **Creació/Recollida** | Captura de dades | Consentiment, qualitat, format |
| **Emmagatzematge** | Persistència | Seguretat, escalabilitat, cost |
| **Processament** | ETL, transformació | Integritat, traçabilitat |
| **Utilització** | Anàlisi, ML, reporting | Accés autoritzat, auditoria |
| **Compartició** | APIs, exports | Privacitat, acords |
| **Arxiu** | Retenció a llarg termini | Compliment legal |
| **Eliminació** | Destrucció segura | Dret a l'oblit, certificat |

---

## 5.3 Big Data, ML/DL i IA

### Relació entre conceptes

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    INTEL·LIGÈNCIA ARTIFICIAL                    │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │                   MACHINE LEARNING                      │  │
│   │   ┌─────────────────────────────────────────────────┐  │  │
│   │   │                                                 │  │  │
│   │   │              DEEP LEARNING                      │  │  │
│   │   │                                                 │  │  │
│   │   │   • Xarxes neuronals profundes                 │  │  │
│   │   │   • CNN, RNN, Transformers                     │  │  │
│   │   │                                                 │  │  │
│   │   └─────────────────────────────────────────────────┘  │  │
│   │                                                         │  │
│   │   • Supervisat • No supervisat • Reforç                │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   • Sistemes experts • Lògica difusa • Algorismes genètics     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ necessita
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BIG DATA                                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  VOLUM        VELOCITAT      VARIETAT      VERACITAT    │  │
│   │                                                         │  │
│   │  TB/PB        Streaming      Estructurada   Qualitat    │  │
│   │  de dades     Temps real     No estructurada Fiabilitat │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ genera
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ANÀLISI DE DADES                              │
│                                                                 │
│   Descriptiva → Diagnòstica → Predictiva → Prescriptiva        │
│   (Què passà?)  (Per què?)    (Què passarà?) (Què fer?)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de treball

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  DADES   │───►│   ETL    │───►│ FEATURE  │───►│  MODEL   │
│  EN BRUT │    │          │    │ENGINEERING│   │  ML/DL   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                                                     ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ DECISIÓ  │◄───│INTERPRE- │◄───│PREDICCIÓ │◄───│ENTRENAMENT│
│ / ACCIÓ  │    │ TACIÓ    │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## 5.4 Característiques del Big Data (5V)

### Les 5 V

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────────┐                         ┌─────────────┐      │
│   │   VOLUM     │                         │  VELOCITAT  │      │
│   │             │                         │             │      │
│   │  Terabytes  │                         │  Streaming  │      │
│   │  Petabytes  │                         │  Real-time  │      │
│   │  Exabytes   │                         │  Batch      │      │
│   └─────────────┘                         └─────────────┘      │
│           │                                       │             │
│           └───────────────┬───────────────────────┘             │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  BIG DATA   │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│           ┌───────────────┼───────────────┐                     │
│           │               │               │                     │
│   ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐            │
│   │   VARIETAT    │ │ VERACITAT │ │    VALOR      │            │
│   │               │ │           │ │               │            │
│   │ Estructurades │ │ Qualitat  │ │ Insights      │            │
│   │ Semi-estr.    │ │ Fiabilitat│ │ ROI           │            │
│   │ No estr.      │ │ Neteja    │ │ Decisions     │            │
│   └───────────────┘ └───────────┘ └───────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detall

| V | Descripció | Repte | Solució |
|---|------------|-------|---------|
| **Volum** | Quantitat massiva de dades | Emmagatzematge, processament | Data Lakes, Spark |
| **Velocitat** | Dades en temps real | Latència, processament | Streaming, Kafka |
| **Varietat** | Formats diversos | Integració, normalització | ETL, Data Quality |
| **Veracitat** | Qualitat i fiabilitat | Errors, inconsistències | Data Governance |
| **Valor** | Extracció d'insights | ROI, utilitat | Analytics, ML |

---

## 5.5 Ciència de Dades

### Etapes del procés

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROCÉS DE CIÈNCIA DE DADES                    │
│                                                                 │
│  1. DEFINICIÓ      2. RECOLLIDA       3. NETEJA                │
│  DEL PROBLEMA      DE DADES           DE DADES                  │
│  ┌─────────┐       ┌─────────┐        ┌─────────┐              │
│  │ Què     │  ──►  │ D'on    │  ──►   │ Qualitat│              │
│  │ volem   │       │ obtenim │        │ Valors  │              │
│  │ saber?  │       │ les     │        │ nuls    │              │
│  │         │       │ dades?  │        │ Outliers│              │
│  └─────────┘       └─────────┘        └─────────┘              │
│                                             │                   │
│                                             ▼                   │
│  6. COMUNICACIÓ   5. AVALUACIÓ       4. ANÀLISI               │
│  I DESPLEGAMENT   I VALIDACIÓ        I MODELATGE               │
│  ┌─────────┐       ┌─────────┐        ┌─────────┐              │
│  │Dashboard│  ◄──  │ Mètriques│  ◄──  │ EDA     │              │
│  │ API     │       │ Test    │        │ ML/DL   │              │
│  │ Report  │       │ Validació│       │ Models  │              │
│  └─────────┘       └─────────┘        └─────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Rols en Ciència de Dades

| Rol | Funcions | Habilitats |
|-----|----------|------------|
| **Data Engineer** | Pipelines, ETL, infraestructura | SQL, Spark, Airflow |
| **Data Analyst** | Anàlisi, visualització, reports | SQL, Power BI, Excel |
| **Data Scientist** | Models ML, experiments, insights | Python, ML, estadística |
| **ML Engineer** | Desplegament, MLOps, producció | Python, Docker, K8s |

---

## 5.6 Emmagatzematge al Cloud

### Opcions d'emmagatzematge

| Tipus | Característiques | Serveis cloud |
|-------|------------------|---------------|
| **Object Storage** | Objectes, escalable, econòmic | S3, Blob, GCS |
| **Block Storage** | Discs, alt rendiment | EBS, Managed Disks |
| **File Storage** | Sistema de fitxers compartit | EFS, Azure Files |
| **Data Lake** | Dades en brut, qualsevol format | S3 + Glue, ADLS |
| **Data Warehouse** | Dades estructurades, analítiques | Redshift, BigQuery, Synapse |

### Arquitectura Data Lakehouse

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAKEHOUSE                             │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                    CAPA DE GESTIÓ                        │  │
│   │   Governança, Seguretat, Catàleg, Llinatge              │  │
│   └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                   CAPA DE CONSUM                         │  │
│   │   BI, SQL Analytics, ML, Data Science                   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                CAPA DE PROCESSAMENT                      │  │
│   │   ETL, Spark, Delta Lake, Iceberg                       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              CAPA D'EMMAGATZEMATGE                       │  │
│   │   Object Storage (S3, ADLS, GCS)                        │  │
│   │   Dades en brut + processades + curades                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.7 Seguretat i Ciberseguretat

### Pilars de la seguretat (CIA)

```
                         SEGURETAT
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │CONFIDENCIA- │   │ INTEGRITAT  │   │DISPONIBILI- │
    │   LITAT     │   │             │   │    TAT      │
    │             │   │             │   │             │
    │ Només       │   │ Dades no    │   │ Accés quan  │
    │ autoritzats │   │ alterades   │   │ es necessita│
    └─────────────┘   └─────────────┘   └─────────────┘
```

### Amenaces principals

| Amenaça | Descripció | Impacte |
|---------|------------|---------|
| **Ransomware** | Xifratge de dades amb rescat | Pèrdua de dades, diners |
| **Phishing** | Engany per obtenir credencials | Accés no autoritzat |
| **DDoS** | Atac de denegació de servei | Caiguda de sistemes |
| **Insider threat** | Amenaces internes | Fuita de dades |
| **Supply chain** | Atac via proveïdors | Compromís de sistemes |
| **Zero-day** | Vulnerabilitats desconegudes | Explotació sense defensa |

### Mesures de seguretat

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEFENSA EN PROFUNDITAT                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PERÍMETRE                             │   │
│  │   Firewall, WAF, DDoS protection, VPN                   │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │                   XARXA                          │    │   │
│  │  │   Segmentació, IDS/IPS, Zero Trust Network      │    │   │
│  │  │  ┌─────────────────────────────────────────┐    │    │   │
│  │  │  │              ENDPOINT                    │    │    │   │
│  │  │  │   EDR, Antimalware, Patching            │    │    │   │
│  │  │  │  ┌─────────────────────────────────┐    │    │    │   │
│  │  │  │  │           APLICACIÓ              │    │    │    │   │
│  │  │  │  │   SAST, DAST, WAF, Secrets      │    │    │    │   │
│  │  │  │  │  ┌─────────────────────────┐    │    │    │    │   │
│  │  │  │  │  │         DADES           │    │    │    │    │   │
│  │  │  │  │  │  Encriptació, DLP, IAM  │    │    │    │    │   │
│  │  │  │  │  └─────────────────────────┘    │    │    │    │   │
│  │  │  │  └─────────────────────────────────┘    │    │    │   │
│  │  │  └─────────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.8 Zero Trust

### Principis

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZERO TRUST                               │
│                                                                 │
│              "Never trust, always verify"                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  1. VERIFICACIÓ EXPLÍCITA                               │   │
│  │     Autenticar i autoritzar sempre                      │   │
│  │                                                         │   │
│  │  2. MÍNIM PRIVILEGI                                     │   │
│  │     Accés just-in-time, just-enough                     │   │
│  │                                                         │   │
│  │  3. ASSUMIR COMPROMÍS                                   │   │
│  │     Dissenyar com si ja estiguessis compromès           │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Pilars:                                                        │
│  • Identitat    • Dispositius   • Xarxa                        │
│  • Aplicacions  • Dades         • Infraestructura              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Model tradicional vs Zero Trust

| Aspecte | Model tradicional | Zero Trust |
|---------|-------------------|------------|
| Confiança | Dins del perímetre = confiat | Cap confiança implícita |
| Verificació | Una vegada (login) | Contínua |
| Accés | Ampli un cop dins | Mínim necessari |
| Segmentació | Perimetral | Microsegmentació |
| Visibilitat | Limitada | Completa |

---

## 5.9 Regulació i Compliment

### Normatives principals

| Normativa | Àmbit | Requisits clau |
|-----------|-------|----------------|
| **RGPD/GDPR** | UE, dades personals | Consentiment, drets, DPO, notificació bretxes |
| **LOPDGDD** | Espanya | Implementació RGPD + especificitats |
| **NIS2** | UE, ciberseguretat | Mesures de seguretat, notificació incidents |
| **PCI-DSS** | Pagaments amb targeta | Seguretat de dades de pagament |
| **ISO 27001** | Internacional | Sistema de gestió de seguretat |
| **ENS** | Espanya, sector públic | Esquema Nacional de Seguretat |

### RGPD: Principis

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRINCIPIS RGPD                              │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  LICITUD      │  │ LIMITACIÓ DE │  │ MINIMITZACIÓ  │       │
│  │  LLEIALTAT    │  │  FINALITAT   │  │   DE DADES    │       │
│  │  TRANSPARÈNCIA│  │              │  │               │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  EXACTITUD    │  │  LIMITACIÓ   │  │  INTEGRITAT I │       │
│  │               │  │ CONSERVACIÓ  │  │CONFIDENCIALITAT│       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              RESPONSABILITAT PROACTIVA                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Drets dels interessats (RGPD)

| Dret | Descripció |
|------|------------|
| **Accés** | Saber quines dades es tenen |
| **Rectificació** | Corregir dades incorrectes |
| **Supressió** | Dret a l'oblit |
| **Portabilitat** | Rebre les dades en format estàndard |
| **Oposició** | Negar-se al tractament |
| **Limitació** | Restringir el tractament |

---

## Resum del Tema

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                DADES I SEGURETAT                                │
│                                                                 │
│   DADES                          SEGURETAT                      │
│   ┌─────────────────┐            ┌─────────────────┐           │
│   │ Dada→Informació │            │      CIA        │           │
│   │ Cicle de vida   │            │ Confidencialitat│           │
│   │ Big Data (5V)   │◄──────────►│ Integritat      │           │
│   │ ML/DL/IA        │            │ Disponibilitat  │           │
│   │ Cloud Storage   │            │                 │           │
│   └─────────────────┘            └─────────────────┘           │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          │                                      │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │      ZERO TRUST       │                          │
│              │  Never trust, always  │                          │
│              │       verify          │                          │
│              └───────────────────────┘                          │
│                          │                                      │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │      REGULACIÓ        │                          │
│              │  RGPD, LOPDGDD, NIS2  │                          │
│              │  ISO 27001, ENS       │                          │
│              └───────────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Activitat pràctica

> Per al vostre projecte:
> 1. Defineix el cicle de vida de les dades en el teu cas
> 2. Identifica riscos de seguretat per cada àrea
> 3. Proposa mesures Zero Trust
> 4. Quines normatives apliquen al teu cas?
