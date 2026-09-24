# Cas 1: TechnoGym Fitness

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | TechnoGym Fitness |
| **Sector** | Fitness i Salut |
| **Ubicació** | Barcelona (3 centres) |
| **Empleats** | 45 |
| **Facturació** | 2.5M€/any |
| **Clients** | 4.500 socis actius |

---

## Descripció del negoci

TechnoGym Fitness és una cadena de gimnasos urbans amb 3 centres a Barcelona. Ofereixen:
- Sala de musculació i cardio
- Classes dirigides (spinning, yoga, crossfit)
- Entrenadors personals
- Zona de spa (2 centres)

---

## Situació actual

### Tecnologia existent
- **Gestió de socis**: Software local antic (Access + Excel)
- **Control d'accés**: Torniquets amb targeta magnètica
- **Reserves de classes**: Telèfon i presencial
- **Màquines fitness**: No connectades
- **Facturació**: Software comptable separat

### Entorns IT/OT
```
IT: Gestió de socis, comptabilitat, web (bàsica)
OT: Control d'accés (aïllat), climatització manual
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| No hi ha visibilitat d'ocupació en temps real | Queixes de socis per saturació | Alta |
| Reserves de classes per telèfon | 2 recepcionistes dedicades | Alta |
| Màquines sense monitorització | Avaries imprevistes | Mitjana |
| No es coneix l'ús real de cada àrea | Decisions "a cegues" | Mitjana |
| Experiència de soci poc personalitzada | Baixes de socis (churn 18%) | Alta |
| Consum energètic alt | 45.000€/any en llum i clima | Mitjana |

---

## Oportunitats de digitalització

### 1. App mòbil per a socis
- Reserves de classes online
- Visualització d'ocupació en temps real
- Plans d'entrenament personalitzats
- Gamificació i reptes

### 2. IoT al gimnàs
- Sensors d'ocupació per zones
- Màquines connectades (ús, manteniment)
- Control de clima intel·ligent
- Comptadors d'energia

### 3. Analítica i IA
- Predicció d'ocupació
- Recomanacions personalitzades
- Detecció de risc d'abandó
- Optimització d'horaris de classes

### 4. Plataforma cloud
- Gestió centralitzada dels 3 centres
- Dades en temps real
- Escalabilitat per a nous centres

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────┐
│                         CLOUD                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   App API   │  │  Analytics  │  │   ML/IA     │         │
│  │   Backend   │  │  Dashboard  │  │  Predicció  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│      CENTRE 1          │           CENTRE 2/3              │
│  ┌─────────────┐       │       ┌─────────────┐             │
│  │   Gateway   │───────┼───────│   Gateway   │             │
│  │    IoT      │       │       │    IoT      │             │
│  └──────┬──────┘       │       └──────┬──────┘             │
│         │              │              │                     │
│    ┌────┴────┐         │         ┌────┴────┐               │
│    │Sensors  │         │         │Sensors  │               │
│    │Màquines │         │         │Màquines │               │
│    │Clima    │         │         │Clima    │               │
│    └─────────┘         │         └─────────┘               │
└────────────────────────┴────────────────────────────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IoT** | Sensors d'ocupació, màquines connectades, clima |
| **Cloud** | Backend, app, gestió multi-centre |
| **Big Data** | Històric d'ús, patrons de comportament |
| **IA** | Predicció ocupació, churn, recomanacions |

---

## Prototip suggerit

### Opció A: Dashboard d'ocupació
- Sensors simulats (o reals amb ESP32)
- Backend amb dades en temps real
- Visualització web/mòbil

### Opció B: Predictor d'ocupació
- Dataset històric (simulat)
- Model ML de predicció
- API de consulta

### Opció C: Chatbot d'atenció
- Bot per reserves de classes
- Integració amb calendari
- NLP bàsic o LLM

---

## Recursos gratuïts recomanats

- **IoT**: ESP32 + sensors, Wokwi (simulador)
- **Cloud**: Firebase, Supabase, Railway
- **Backend**: Node.js, FastAPI
- **ML**: Scikit-learn, TensorFlow Lite
- **App**: React Native, Flutter
- **Dashboard**: Grafana, Streamlit

---

## Preguntes guia

1. Com garantiries la privacitat de les dades dels socis?
2. Quina arquitectura edge/cloud proposaries per als sensors?
3. Com reduiries el churn amb les dades disponibles?
4. Quin ROI esperaries de la inversió en IoT?
5. Com integraries els sistemes legacy existents?
