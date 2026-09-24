# Guia del Prototip

## Què és el prototip?

El prototip és una **demostració funcional bàsica** que mostra la viabilitat tècnica de la solució proposada. No ha de ser un producte acabat, sinó una prova de concepte que demostri que les tecnologies escollides poden resoldre el problema plantejat.

---

## Objectius del Prototip

1. **Demostrar viabilitat** - Que la tecnologia proposada funciona
2. **Validar l'arquitectura** - Que els components es poden integrar
3. **Mostrar competència tècnica** - Que l'equip té capacitat d'implementació
4. **Tangibilitzar la proposta** - Fer la solució "real" per al client

---

## Requisits Mínims

### Obligatoris

- [ ] Utilitzar **recursos gratuïts** (free tiers, plans gratuïts, versions community)
- [ ] Estar **alineat amb l'arquitectura** proposada al document
- [ ] Ser **reproduïble** (documentació per desplegar-lo)
- [ ] Incloure almenys **una THD** de les proposades

### Recomanats

- [ ] Demostrar integració entre components
- [ ] Incloure visualització de dades o interfície
- [ ] Simular un flux de dades real
- [ ] Tenir codi net i comentat

---

## Exemples de Prototips Vàlids

### Per a projectes IoT
- Dashboard amb dades simulades de sensors (Node-RED + InfluxDB + Grafana)
- Prototip amb ESP32/Arduino enviant dades a cloud
- Simulació de dispositius amb Python publicant a MQTT

### Per a projectes Big Data
- Pipeline de dades amb Apache Spark (local o Databricks Community)
- ETL bàsic amb Python + Pandas + visualització
- Dashboard amb dades de mostra (Power BI, Tableau Public, Metabase)

### Per a projectes IA/ML
- Model entrenat amb dataset públic relacionat amb el cas
- API de predicció desplegada (Hugging Face Spaces, Streamlit Cloud)
- Chatbot amb LLM (OpenAI free tier, Ollama local)
- Notebook Jupyter amb anàlisi i model

### Per a projectes Cloud
- Arquitectura desplegada en free tier (AWS, Azure, GCP)
- Contenidors amb Docker Compose
- Serverless functions (AWS Lambda, Azure Functions, Vercel)

### Per a projectes mixtos
- Combinació de diverses THD
- Pipeline complet: recollida → processament → anàlisi → visualització

---

## Recursos Gratuïts Recomanats

### Cloud Providers (Free Tier)

| Proveïdor | Recursos gratuïts |
|-----------|-------------------|
| **AWS** | EC2 (750h/mes), Lambda (1M req/mes), S3 (5GB), DynamoDB |
| **Azure** | 200$ crèdit inicial, serveis gratuïts permanents |
| **Google Cloud** | 300$ crèdit inicial, Cloud Functions, BigQuery (1TB/mes) |
| **Oracle Cloud** | Always Free: 2 VMs, Autonomous DB |
| **Render** | Web services gratuïts, PostgreSQL |
| **Railway** | 500h/mes gratuïtes |
| **Vercel** | Hosting gratuït per a frontends i serverless |
| **Netlify** | Hosting gratuït + functions |

### IoT i Edge

| Servei | Ús |
|--------|-----|
| **ThingSpeak** | Plataforma IoT gratuïta |
| **Adafruit IO** | Dashboard IoT gratuït |
| **HiveMQ Cloud** | Broker MQTT gratuït |
| **Node-RED** | Programació visual de fluxos (local) |
| **Wokwi** | Simulador online d'ESP32/Arduino |

### Big Data i Anàlisi

| Servei | Ús |
|--------|-----|
| **Databricks Community** | Spark gratuït al cloud |
| **Google Colab** | Notebooks amb GPU gratuïta |
| **Kaggle Kernels** | Notebooks + datasets |
| **Metabase** | BI open source |
| **Apache Superset** | Visualització open source |
| **Tableau Public** | Dashboards gratuïts (públics) |

### IA i Machine Learning

| Servei | Ús |
|--------|-----|
| **Hugging Face** | Models + Spaces per desplegar |
| **Streamlit Cloud** | Apps de dades gratuïtes |
| **Google AI Studio** | API Gemini gratuïta |
| **Groq** | Inferència LLM ràpida i gratuïta |
| **Ollama** | LLMs locals |
| **Replicate** | Models amb crèdits gratuïts |
| **OpenAI** | Crèdits inicials gratuïts |

### Bases de Dades

| Servei | Ús |
|--------|-----|
| **MongoDB Atlas** | 512MB gratuïts |
| **PlanetScale** | MySQL serverless (free tier) |
| **Supabase** | PostgreSQL + Auth + Storage |
| **Firebase** | Realtime DB + Auth + Hosting |
| **Neon** | PostgreSQL serverless |
| **CockroachDB** | SQL distribuït (free tier) |
| **InfluxDB Cloud** | Time series (free tier) |

### Altres Eines

| Eina | Ús |
|------|-----|
| **GitHub** | Repositori + Actions (CI/CD) |
| **Docker Hub** | Registre de contenidors |
| **draw.io** | Diagrames d'arquitectura |
| **Excalidraw** | Diagrames a mà alçada |
| **Postman** | Testing d'APIs |
| **ngrok** | Exposar serveis locals |

---

## Estructura de Lliurament del Prototip

```
prototip/
├── README.md           # Instruccions de desplegament
├── docs/
│   ├── arquitectura.png
│   └── captures/
├── src/                # Codi font
├── config/             # Fitxers de configuració
├── data/               # Dades de mostra (si aplica)
└── docker-compose.yml  # (si aplica)
```

### README.md mínim

```markdown
# Prototip: [Nom del Projecte]

## Descripció
[Què fa el prototip]

## Tecnologies
- [Llista de tecnologies]

## Requisits
- [Requisits per executar-lo]

## Instruccions de Desplegament

### Opció 1: Local
1. Clonar repositori
2. ...

### Opció 2: Cloud
1. Accedir a [URL]
2. ...

## Demo
[Captures o vídeo]

## Autors
- [Noms]
```

---

## Criteris d'Avaluació del Prototip (30%)

| Criteri | Pes | Descripció |
|---------|-----|------------|
| **Funcionalitat** | 25% | El prototip funciona i demostra la tecnologia |
| **Alineació** | 25% | Reflecteix l'arquitectura proposada al document |
| **Recursos gratuïts** | 15% | Ús correcte de free tiers i eines gratuïtes |
| **Documentació** | 20% | Instruccions clares i reproduïbles |
| **Innovació** | 15% | Creativitat i esforç més enllà del mínim |

---

## Què NO és acceptable

- Prototips que requereixin pagament per funcionar
- Codi copiat sense comprensió ni adaptació
- Prototips sense cap relació amb l'arquitectura proposada
- Documentació absent o insuficient per reproduir-lo
- Captures falses o mockups estàtics sense funcionalitat

---

## Consells Finals

1. **Comenceu aviat** - Les configuracions cloud poden ser complexes
2. **Documenteu mentre feu** - No deixeu la documentació pel final
3. **Simplifiqueu** - Millor poc i funcional que molt i trencat
4. **Proveu la reproducció** - Feu que algú altre segueixi les vostres instruccions
5. **Prepareu una demo** - Tingueu un pla B si la demo en viu falla
