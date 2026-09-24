# Cas 6: AgroTech Vinyes

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | AgroTech Vinyes |
| **Sector** | Agricultura / Viticultura |
| **Ubicació** | Alt Penedès |
| **Hectàrees** | 120 ha de vinya |
| **Empleats** | 25 (pics de 60 en verema) |
| **Producció** | 800.000 kg raïm/any |

---

## Descripció del negoci

AgroTech Vinyes és una explotació vitícola que produeix raïm d'alta qualitat per a caves i vins DO Penedès.

**Activitats:**
- Cultiu de vinya (varietats: Macabeu, Xarel·lo, Parellada, Chardonnay)
- Venda de raïm a cellers
- Marca pròpia de vi (petita producció)

**Diferenciació:** Viticultura sostenible, qualitat premium.

---

## Situació actual

### Tecnologia existent
- **Gestió**: Excel i quaderns de camp
- **Reg**: Sistema gota a gota (manual)
- **Meteorologia**: Estació bàsica
- **Tractaments**: Calendari fix
- **Verema**: Decisió per experiència

### Entorns IT/OT
```
IT: Comptabilitat, email
OT: Sistema de reg (vàlvules manuals), estació meteo (aïllada)
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| Reg no optimitzat | 20% més aigua de la necessària | Alta |
| Tractaments per calendari fix | Sobre-tractament, cost, medi ambient | Alta |
| No es monitoritza l'estat de la vinya | Detecció tardana de problemes | Mitjana |
| Decisió de verema subjectiva | Qualitat variable | Alta |
| Traçabilitat manual | Certificacions DO | Mitjana |
| Dependència d'experts (jubilació) | Pèrdua de coneixement | Mitjana |

---

## Oportunitats de digitalització

### 1. Agricultura de precisió amb IoT
- Sensors d'humitat de sòl
- Estacions meteorològiques
- Sensors de planta (dendrometria)
- Reg automatitzat intel·ligent

### 2. Monitorització amb drons/satèl·lit
- Índexs de vegetació (NDVI)
- Detecció d'estrès hídric
- Identificació de malalties

### 3. Predicció i IA
- Model de maduració del raïm
- Predicció de plagues
- Optimització de tractaments

### 4. Traçabilitat digital
- Quadern de camp digital
- Blockchain per certificació DO
- Integració amb cellers

### 5. Automatització
- Reg automatitzat
- Tractaments variables segons zones

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD                                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Quadern   │  │ Analytics│  │   IA     │  │Traçabili-│        │
│  │ Digital  │  │  Vinya   │  │Predicció │  │   tat    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                     ┌──────┴──────┐
                     │   GATEWAY   │
                     │    LoRa     │
                     └──────┬──────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                       CAMP                                      │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │ Sensor  │  │ Sensor  │  │ Estació │  │ Dron    │           │
│   │ Humitat │  │ Planta  │  │  Meteo  │  │ (NDVI)  │           │
│   │  Sòl    │  │         │  │         │  │         │           │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│        │            │            │                              │
│   ┌────┴────────────┴────────────┴────┐                        │
│   │        Sistema de REG             │                        │
│   │     (vàlvules automatitzades)     │                        │
│   └───────────────────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IoT** | Sensors de camp, reg automatitzat |
| **Edge** | Gateway LoRa, processament local |
| **IA** | Predicció maduració, malalties |
| **Big Data** | Històric meteorològic, producció |

---

## Prototip suggerit

### Opció A: Sistema de monitorització
- Sensors simulats (o reals amb ESP32)
- Dashboard de condicions de camp
- Alertes per WhatsApp/Telegram

### Opció B: Predictor de verema
- Dataset de condicions i dates de verema
- Model ML per predir data òptima
- Considerant meteorologia i varietat

### Opció C: Quadern de camp digital
- App mòbil per registrar operacions
- Geolocalització de parcel·les
- Generació d'informes DO

---

## Dades disponibles (simulades)

- Històric meteorològic (Open-Meteo, AEMET)
- Dates de verema històriques
- Anàlisis de raïm (grau, acidesa)
- Parcel·les i varietats

---

## Recursos gratuïts recomanats

- **IoT**: ESP32 + sensors, LoRa modules
- **Gateway**: The Things Network (LoRaWAN)
- **Meteo**: Open-Meteo API, AEMET OpenData
- **Satèl·lit**: Sentinel Hub (ESA), Google Earth Engine
- **ML**: Scikit-learn, Prophet
- **App**: Flutter, React Native
- **Maps**: QGIS, Leaflet

---

## Preguntes guia

1. Com dissenyaries una xarxa de sensors per 120 ha?
2. Quins protocols de comunicació utilitzaries (WiFi, LoRa, Sigfox)?
3. Com alimentaries els sensors al camp (bateria, solar)?
4. Quines dades necessites per predir la data òptima de verema?
5. Com garantiries la traçabilitat per a la DO?
