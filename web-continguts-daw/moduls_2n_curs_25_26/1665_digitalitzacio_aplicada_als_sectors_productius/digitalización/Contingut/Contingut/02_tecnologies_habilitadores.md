# Tema 2: Tecnologies Habilitadores Digitals (THD)

> **RA2:** Caracteritza les tecnologies habilitadores digitals necessàries per a l'adequació/transformació de les empreses a entorns digitals descrivint les seves característiques i aplicacions.

---

## 2.1 Què són les THD?

Les **Tecnologies Habilitadores Digitals** són el conjunt de tecnologies que permeten i impulsen la transformació digital de les organitzacions.

### Les 4 THD principals

```
                    ┌─────────────────────────────────────┐
                    │    TRANSFORMACIÓ DIGITAL            │
                    └─────────────────────────────────────┘
                                    │
            ┌───────────┬───────────┼───────────┬───────────┐
            │           │           │           │           │
            ▼           ▼           ▼           ▼           │
     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
     │   IoT    │ │ Big Data │ │    IA    │ │  Cloud   │   │
     │          │ │          │ │          │ │          │   │
     │ Sensors  │ │ Volum    │ │ ML / DL  │ │ IaaS     │   │
     │ Actuadors│ │ Velocitat│ │ NLP      │ │ PaaS     │   │
     │ Gateway  │ │ Varietat │ │ Visió    │ │ SaaS     │   │
     └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
            │           │           │           │           │
            └───────────┴───────────┴───────────┴───────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │    Altres THD emergents       │
                    │  Blockchain, AR/VR, 5G, RPA   │
                    └───────────────────────────────┘
```

---

## 2.2 Internet of Things (IoT)

### Definició
L'**IoT** és la xarxa de dispositius físics connectats a Internet que recullen i comparteixen dades.

### Components

| Component | Funció | Exemples |
|-----------|--------|----------|
| **Sensors** | Captura de dades | Temperatura, humitat, vibració |
| **Actuadors** | Execució d'accions | Motors, vàlvules, relés |
| **Gateways** | Connexió i protocol | Raspberry Pi, ESP32 |
| **Plataforma** | Gestió i visualització | AWS IoT, Azure IoT Hub |

### Arquitectura IoT

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  DISPOSITIUS          CONNECTIVITAT        PLATAFORMA           │
│                                                                 │
│  ┌─────────┐         ┌───────────┐        ┌───────────────┐    │
│  │ Sensors │─────────│  Gateway  │────────│    Cloud      │    │
│  └─────────┘         └───────────┘        │   IoT Hub     │    │
│                           │               │               │    │
│  ┌─────────┐              │               │  ┌─────────┐  │    │
│  │Actuadors│──────────────┘               │  │Analytics│  │    │
│  └─────────┘                              │  └─────────┘  │    │
│                                           │               │    │
│                                           │  ┌─────────┐  │    │
│                                           │  │Dashboard│  │    │
│                                           │  └─────────┘  │    │
│                                           └───────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Protocols IoT

| Protocol | Característiques | Ús típic |
|----------|------------------|----------|
| **MQTT** | Lleuger, pub/sub | Sensors, telemetria |
| **CoAP** | REST per IoT | Dispositius limitats |
| **HTTP/REST** | Estàndard web | APIs, integracions |
| **Modbus** | Industrial | PLCs, SCADA |
| **OPC-UA** | Interoperabilitat | Indústria 4.0 |

### IIoT: IoT Industrial

L'**IIoT** és l'aplicació de l'IoT en entorns industrials:
- Monitorització de maquinària
- Manteniment predictiu
- Control de qualitat
- Gestió d'energia
- Traçabilitat de producció

### Exemples d'aplicació

| Sector | Aplicació IoT |
|--------|---------------|
| **Manufactura** | Sensors de vibració per manteniment predictiu |
| **Logística** | Tracking GPS de flota |
| **Agricultura** | Sensors d'humitat per reg intel·ligent |
| **Energia** | Smart meters i smart grid |
| **Salut** | Wearables i monitorització remota |

---

## 2.3 Big Data

### Definició
**Big Data** és el conjunt de dades de gran volum, velocitat i varietat que requereixen tecnologies especials per ser processades.

### Les 5 V del Big Data

```
                        ┌─────────────────┐
                        │    BIG DATA     │
                        └────────┬────────┘
                                 │
     ┌───────────┬───────────┬───┴───┬───────────┬───────────┐
     │           │           │       │           │           │
     ▼           ▼           ▼       ▼           ▼           │
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│ VOLUM   │ │VELOCITAT│ │VARIETAT │ │VERACITAT│ │  VALOR  │  │
│         │ │         │ │         │ │         │ │         │  │
│Terabytes│ │Streaming│ │Estructu-│ │Qualitat │ │Insights │  │
│Petabytes│ │Real-time│ │rades i  │ │i fiabi- │ │Decisions│  │
│         │ │         │ │no estruc│ │litat    │ │         │  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
```

### Tipus de dades

| Tipus | Descripció | Exemples |
|-------|------------|----------|
| **Estructurades** | Format definit (taules) | Bases de dades SQL |
| **Semi-estructurades** | Format flexible | JSON, XML, logs |
| **No estructurades** | Sense format fix | Imatges, vídeos, text lliure |

### Ecosistema Big Data

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECOSISTEMA BIG DATA                          │
│                                                                 │
│  INGESTA          EMMAGATZEMATGE      PROCESSAMENT   CONSUM    │
│                                                                 │
│  ┌─────────┐      ┌─────────────┐     ┌──────────┐  ┌───────┐  │
│  │ Kafka   │─────►│ Data Lake   │────►│  Spark   │─►│  BI   │  │
│  │ Flume   │      │ (HDFS/S3)   │     │  Flink   │  │  ML   │  │
│  │ NiFi    │      │             │     │          │  │  API  │  │
│  └─────────┘      │ Data        │     └──────────┘  └───────┘  │
│                   │ Warehouse   │                               │
│                   └─────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tecnologies Big Data

| Categoria | Tecnologies |
|-----------|-------------|
| **Emmagatzematge** | HDFS, S3, Azure Blob, Data Lakes |
| **Processament batch** | Spark, Hadoop MapReduce |
| **Processament streaming** | Kafka, Flink, Spark Streaming |
| **Bases de dades** | MongoDB, Cassandra, Elasticsearch |
| **Orquestració** | Airflow, Luigi, Dagster |
| **Visualització** | Tableau, Power BI, Grafana |

### Exemples d'aplicació

| Sector | Aplicació Big Data |
|--------|-------------------|
| **Retail** | Anàlisi de comportament de compra |
| **Finances** | Detecció de frau en temps real |
| **Telecomunicacions** | Optimització de xarxa |
| **Sanitat** | Investigació mèdica amb dades massives |
| **Indústria** | Anàlisi de dades de producció |

---

## 2.4 Intel·ligència Artificial (IA)

### Definició
La **Intel·ligència Artificial** és la capacitat de les màquines per realitzar tasques que tradicionalment requereixen intel·ligència humana.

### Subdominis de la IA

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTEL·LIGÈNCIA ARTIFICIAL                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  MACHINE LEARNING                       │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │               DEEP LEARNING                      │   │    │
│  │  │                                                  │   │    │
│  │  │  • Xarxes neuronals                             │   │    │
│  │  │  • CNN (Visió)                                  │   │    │
│  │  │  • RNN/LSTM (Seqüències)                        │   │    │
│  │  │  • Transformers (LLMs)                          │   │    │
│  │  │                                                  │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  │                                                         │    │
│  │  • Supervisat  • No supervisat  • Reforç              │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Altres: Sistemes experts, Lògica difusa, Algorismes genètics  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tipus d'aprenentatge

| Tipus | Descripció | Exemples |
|-------|------------|----------|
| **Supervisat** | Aprèn amb dades etiquetades | Classificació, regressió |
| **No supervisat** | Troba patrons sense etiquetes | Clustering, reducció dimensionalitat |
| **Reforç** | Aprèn per prova i error | Jocs, robòtica |

### Aplicacions de la IA

| Àrea | Aplicacions |
|------|-------------|
| **Visió artificial** | Reconeixement d'objectes, OCR, control qualitat |
| **NLP** | Chatbots, traducció, anàlisi de sentiment |
| **Predicció** | Manteniment predictiu, previsió de demanda |
| **Optimització** | Planificació de rutes, scheduling |
| **Generació** | Text (LLMs), imatges, codi |

### IA Generativa

Els **LLMs** (Large Language Models) com GPT, Claude, Gemini han revolucionat la IA:

- Generació de text
- Assistents virtuals intel·ligents
- Generació de codi
- Anàlisi de documents
- Automatització de tasques

---

## 2.5 Cloud Computing

### Definició
El **Cloud Computing** és el model de computació que ofereix recursos informàtics (servidors, emmagatzematge, aplicacions) com a servei a través d'Internet.

### Models de servei

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ON-PREMISE        IaaS          PaaS          SaaS          │
│                                                                 │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐ │
│  │Aplicacions│   │Aplicacions│   │Aplicacions│   │███████████│ │
│  ├───────────┤   ├───────────┤   │███████████│   │███████████│ │
│  │  Dades    │   │  Dades    │   │███████████│   │███████████│ │
│  ├───────────┤   ├───────────┤   │███████████│   │███████████│ │
│  │  Runtime  │   │  Runtime  │   │███████████│   │███████████│ │
│  ├───────────┤   ├───────────┤   │███████████│   │███████████│ │
│  │Middleware │   │Middleware │   │███████████│   │███████████│ │
│  ├───────────┤   ├───────────┤   │███████████│   │███████████│ │
│  │    OS     │   │    OS     │   │███████████│   │███████████│ │
│  ├───────────┤   │███████████│   │███████████│   │███████████│ │
│  │Virtualitz.│   │███████████│   │███████████│   │███████████│ │
│  ├───────────┤   │███████████│   │███████████│   │███████████│ │
│  │ Servidors │   │███████████│   │███████████│   │███████████│ │
│  ├───────────┤   │███████████│   │███████████│   │███████████│ │
│  │Emmagatze. │   │███████████│   │███████████│   │███████████│ │
│  ├───────────┤   │███████████│   │███████████│   │███████████│ │
│  │   Xarxa   │   │███████████│   │███████████│   │███████████│ │
│  └───────────┘   └───────────┘   └───────────┘   └───────────┘ │
│                                                                 │
│  █ = Gestionat pel proveïdor cloud                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Proveïdors principals

| Proveïdor | IaaS | PaaS | Punts forts |
|-----------|------|------|-------------|
| **AWS** | EC2, S3 | Lambda, RDS | Líder de mercat, més serveis |
| **Azure** | VMs, Blob | App Service | Integració Microsoft, híbrid |
| **GCP** | Compute Engine | Cloud Run | ML/IA, Kubernetes |
| **Oracle** | OCI | Autonomous DB | Bases de dades |

### Models de desplegament

| Model | Descripció | Ús |
|-------|------------|-----|
| **Public** | Recursos compartits | Startups, escalabilitat |
| **Privat** | Infraestructura dedicada | Regulació, seguretat |
| **Híbrid** | Combinació public/privat | Majoria d'empreses |
| **Multi-cloud** | Diversos proveïdors | Evitar vendor lock-in |

---

## 2.6 Altres THD emergents

### Blockchain
- Registre distribuït immutable
- Smart contracts
- Traçabilitat de cadena de subministrament
- Tokenització d'actius

### Realitat Augmentada/Virtual (AR/VR)
- Formació immersiva
- Manteniment assistit
- Disseny de producte
- Experiència de client

### 5G
- Baixa latència (<1ms)
- Alta velocitat (>1Gbps)
- Densitat de dispositius
- Habilitador de IoT massiu

### RPA (Robotic Process Automation)
- Automatització de tasques repetitives
- Integració de sistemes legacy
- Processos administratius
- Complement a la IA

---

## 2.7 Relació entre THD

### Com treballen juntes

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│     IoT ──────► Big Data ──────► IA ──────► Acció              │
│      │            │              │           │                  │
│      │            │              │           │                  │
│      └────────────┴──────────────┴───────────┘                  │
│                         │                                       │
│                         ▼                                       │
│                   ┌──────────┐                                  │
│                   │  CLOUD   │                                  │
│                   │          │                                  │
│                   │Infrastr. │                                  │
│                   │Plataforma│                                  │
│                   │Serveis   │                                  │
│                   └──────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Exemple integrat: Manteniment predictiu

1. **IoT**: Sensors de vibració i temperatura en maquinària
2. **Big Data**: Recollida i emmagatzematge de milions de lectures
3. **IA/ML**: Model predictiu que detecta anomalies
4. **Cloud**: Infraestructura que ho suporta tot
5. **Resultat**: Predicció de fallades abans que passin

---

## 2.8 Impacte en negoci i planta

### Àrea de Negoci

| THD | Impacte |
|-----|---------|
| **IoT** | Productes connectats, nous serveis |
| **Big Data** | Decisions basades en dades |
| **IA** | Automatització, personalització |
| **Cloud** | Agilitat, escalabilitat |

### Àrea de Planta (OT)

| THD | Impacte |
|-----|---------|
| **IoT** | Monitorització, IIoT |
| **Big Data** | Anàlisi de producció |
| **IA** | Control qualitat, manteniment predictiu |
| **Cloud** | Integració IT/OT |

---

## 2.9 Nous mercats generats per les THD

### Exemples de nous sectors

| Mercat | THD habilitadora | Descripció |
|--------|------------------|------------|
| **Smart Home** | IoT | Domòtica i assistents |
| **Vehicles autònoms** | IA, IoT | Conducció automatitzada |
| **Telemedicina** | Cloud, IoT | Salut remota |
| **FinTech** | IA, Blockchain | Serveis financers digitals |
| **Smart Cities** | IoT, Big Data | Ciutats intel·ligents |
| **Agricultura de precisió** | IoT, IA | Farming 4.0 |
| **IA Generativa** | IA (LLMs) | Assistents, contingut |

---

## Resum del Tema

| THD | Funció principal | Tecnologies clau |
|-----|------------------|------------------|
| **IoT** | Connectar el món físic | MQTT, sensors, gateways |
| **Big Data** | Processar grans volums | Spark, Kafka, Data Lakes |
| **IA** | Intel·ligència i automatització | ML, DL, LLMs |
| **Cloud** | Infraestructura com a servei | AWS, Azure, GCP |

---

## Activitat pràctica

> Per al cas empresarial que treballareu:
> 1. Identifica quines THD són més rellevants
> 2. Descriu com s'integrarien entre elles
> 3. Quins nous productes o serveis podrien generar?
