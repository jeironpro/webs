# Cas 4: LogiTrans

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | LogiTrans Express S.L. |
| **Sector** | Logística i Transport |
| **Ubicació** | Zona Franca, Barcelona |
| **Empleats** | 95 |
| **Flota** | 45 vehicles (furgonetes i camions) |
| **Facturació** | 6M€/any |

---

## Descripció del negoci

LogiTrans és una empresa de transport i logística que ofereix:
- Distribució d'última milla (B2C)
- Transport de mercaderies (B2B)
- Emmagatzematge i gestió de magatzem
- Logística inversa (devolucions)

**Àmbit:** Catalunya i connexions amb la resta d'Espanya.

---

## Situació actual

### Tecnologia existent
- **Gestió de flota**: GPS bàsic en vehicles
- **Magatzem**: WMS antic (local)
- **Rutes**: Planificació manual per operari expert
- **Comunicació**: WhatsApp amb conductors
- **Clients**: Portal web bàsic per seguiment

### Entorns IT/OT
```
IT: ERP, WMS, web client, email
OT: GPS vehicles (aïllat), sensors porta magatzem
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| Rutes no optimitzades | 15% km extra, combustible | Alta |
| No visibilitat temps real per client | Queixes, trucades | Alta |
| Gestió de devolucions manual | Errors, temps | Mitjana |
| No predicció de demanda | Sobre/infraestoc | Mitjana |
| Manteniment flota reactiu | Avaries en ruta | Alta |
| Paper en lliuraments | Signatura, albarans | Mitjana |

---

## Oportunitats de digitalització

### 1. Optimització de rutes amb IA
- Algoritmes d'optimització (VRP)
- Consideració de trànsit en temps real
- Reoptimització dinàmica

### 2. Plataforma de tracking
- Seguiment en temps real per a clients
- ETAs precisos amb ML
- Notificacions automàtiques

### 3. IoT en vehicles
- Telemetria avançada (consum, conducció)
- Sensors de càrrega
- Manteniment predictiu

### 4. Digitalització de lliuraments
- App per a conductors
- Signatura digital
- Foto de prova de lliurament

### 5. Analytics i predicció
- Dashboard de KPIs
- Predicció de volums
- Optimització de magatzem

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD                                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Portal  │  │  Route   │  │ Tracking │  │Analytics │        │
│  │  Client  │  │Optimizer │  │  Engine  │  │   BI     │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴───────┐   ┌───────┴───────┐   ┌───────┴───────┐
│   VEHICLE 1   │   │   VEHICLE N   │   │   MAGATZEM    │
│               │   │               │   │               │
│ ┌───────────┐ │   │ ┌───────────┐ │   │ ┌───────────┐ │
│ │ App mòbil │ │   │ │ App mòbil │ │   │ │   WMS     │ │
│ │ conductor │ │   │ │ conductor │ │   │ │           │ │
│ └───────────┘ │   │ └───────────┘ │   │ └───────────┘ │
│ ┌───────────┐ │   │ ┌───────────┐ │   │ ┌───────────┐ │
│ │    OBD    │ │   │ │    OBD    │ │   │ │  Sensors  │ │
│ │  + GPS    │ │   │ │  + GPS    │ │   │ │   IoT     │ │
│ └───────────┘ │   │ └───────────┘ │   │ └───────────┘ │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IoT** | GPS, OBD vehicles, sensors magatzem |
| **Big Data** | Històric de rutes, volums, ETAs |
| **IA** | Optimització rutes, predicció ETA |
| **Cloud** | Plataforma centralitzada, escalabilitat |

---

## Prototip suggerit

### Opció A: Optimitzador de rutes
- Dataset de punts de lliurament
- Algoritme VRP (Google OR-Tools)
- Visualització de rutes en mapa

### Opció B: Predictor d'ETA
- Dades històriques de lliuraments
- Model ML considerant hora, zona, trànsit
- API de consulta

### Opció C: Dashboard de flota
- Simulació de posicions GPS
- Mapa en temps real
- KPIs de flota

---

## Dades disponibles (simulades)

- Històric de lliuraments (dates, adreces, temps)
- Posicions GPS de vehicles
- Dades de trànsit (APIs públiques)
- Volums per zona i dia

---

## Recursos gratuïts recomanats

- **Mapes**: Leaflet, OpenStreetMap, Mapbox free tier
- **Optimització**: Google OR-Tools, OSRM
- **Backend**: Node.js, FastAPI
- **Real-time**: Socket.io, Firebase
- **ML**: Scikit-learn, Prophet
- **App conductor**: React Native, Flutter

---

## Preguntes guia

1. Com optimitzaries rutes considerant finestres de lliurament?
2. Quines dades necessites per predir ETAs amb precisió?
3. Com implementaries el tracking en temps real de forma econòmica?
4. Quina informació proporcionaries al client final?
5. Com gestionaries la ciberseguretat de les dades de posició?
