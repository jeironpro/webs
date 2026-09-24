# Cas 7: HotelMar

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | HotelMar Resort & Spa |
| **Sector** | Hostaleria |
| **Ubicació** | Costa Brava |
| **Categoria** | 4 estrelles superior |
| **Habitacions** | 150 |
| **Empleats** | 85 (alta), 35 (baixa) |

---

## Descripció del negoci

HotelMar és un hotel vacacional de 4 estrelles amb:
- 150 habitacions (80 vista mar)
- Restaurant buffet + restaurant gastronòmic
- Spa i wellness
- Piscines i jardins
- Sales de reunions

**Temporada:** Abril-Octubre (pics juliol-agost)

---

## Situació actual

### Tecnologia existent
- **PMS**: Sistema de gestió antic (local)
- **Reserves**: Booking, Expedia + telèfon
- **Check-in**: Manual a recepció
- **Habitacions**: Clau física
- **Clima**: Control manual per planta
- **Restaurant**: Comandes en paper

### Entorns IT/OT
```
IT: PMS, channel manager, web, WiFi clients
OT: Clima centralitzat (manual), control accés bàsic
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| Check-in lent | Cues, queixes clients | Alta |
| No personalització | Experiència genèrica | Mitjana |
| Gestió energètica ineficient | 200.000€/any energia | Alta |
| Dependència OTAs | Comissions 15-20% | Alta |
| Manteniment reactiu | Queixes d'habitacions | Mitjana |
| Restaurant sense reserves | Esperes, capacitat mal gestionada | Mitjana |

---

## Oportunitats de digitalització

### 1. Guest Experience digital
- App de l'hotel
- Check-in online / self check-in
- Clau mòbil (Bluetooth)
- Serveis des de l'app (room service, spa)

### 2. Habitació intel·ligent
- Control de clima per presència
- Il·luminació automatitzada
- Assistents de veu
- TV integrada amb serveis

### 3. Gestió energètica
- Sensors de presència
- Optimització de clima per IA
- Monitorització de consums

### 4. Revenue Management
- Pricing dinàmic
- Predicció d'ocupació
- Optimització de canals

### 5. Operacions
- Gestió de neteja en temps real
- Manteniment preventiu
- Comandes de restaurant digitals

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD                                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   PMS    │  │ Revenue  │  │Guest App │  │Analytics │        │
│  │  Cloud   │  │Management│  │ Backend  │  │   BI     │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                      HOTEL (Edge)                               │
│                                                                 │
│           ┌───────────────┴───────────────┐                    │
│           │         EDGE SERVER           │                    │
│           └───────────────┬───────────────┘                    │
│                           │                                     │
│   ┌───────────┬───────────┼───────────┬───────────┐            │
│   │           │           │           │           │            │
│   ▼           ▼           ▼           ▼           ▼            │
│ ┌─────┐   ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐         │
│ │Habit│   │Habit│     │ Spa │     │Rest.│     │Zones│         │
│ │ 1   │   │ N   │     │     │     │     │     │comuns│        │
│ │     │   │     │     │     │     │     │     │     │         │
│ │•Clima│  │•Clima│    │•Reserv│   │•Coman│    │•Clima│        │
│ │•Llum│   │•Llum│     │•Acces│    │•POS  │    │•Ocup │        │
│ │•Acces│  │•Acces│    │      │    │      │    │      │        │
│ └─────┘   └─────┘     └─────┘     └─────┘     └─────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IoT** | Sensors habitacions, energia, presència |
| **Cloud** | PMS, app, gestió centralitzada |
| **IA** | Revenue management, personalització |
| **Big Data** | Històric reserves, comportament client |

---

## Prototip suggerit

### Opció A: App de l'hoste
- Reserva de serveis (spa, restaurant)
- Check-in online
- Informació i notificacions

### Opció B: Dashboard d'ocupació i energia
- Visualització d'habitacions
- Consums en temps real
- Alertes d'eficiència

### Opció C: Revenue Management bàsic
- Predicció d'ocupació
- Suggeriment de preus
- Comparativa amb competència

---

## Dades disponibles (simulades)

- Històric de reserves (3 anys)
- Ocupació per dia/habitació
- Preus i canals de venda
- Consums energètics
- Reviews i valoracions

---

## Recursos gratuïts recomanats

- **App**: Flutter, React Native
- **Backend**: Supabase, Firebase
- **IoT**: ESP32 + sensors, Home Assistant
- **ML**: Prophet (predicció), Scikit-learn
- **Dashboard**: Grafana, Metabase
- **Integració**: n8n, Node-RED

---

## Preguntes guia

1. Com implementaries check-in contactless de forma segura?
2. Quina arquitectura IoT proposaries per a les habitacions?
3. Com optimitzaries el consum energètic amb sensors?
4. Quines dades utilitzaries per a revenue management?
5. Com personalitzaries l'experiència del client?
