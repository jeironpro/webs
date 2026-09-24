# Cas 8: BuildCorp

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | BuildCorp Construccions |
| **Sector** | Construcció |
| **Ubicació** | Barcelona i àrea metropolitana |
| **Empleats** | 180 |
| **Obres/any** | 15-20 projectes |
| **Facturació** | 25M€/any |

---

## Descripció del negoci

BuildCorp és una constructora mitjana especialitzada en:
- Edificació residencial (plurifamiliar)
- Rehabilitació d'edificis
- Obra pública menor (equipaments municipals)
- Reformes comercials

**Certificacions:** ISO 9001, ISO 14001, ISO 45001

---

## Situació actual

### Tecnologia existent
- **ERP**: Sistema de gestió (comptabilitat, compres)
- **Projectes**: AutoCAD, alguns pilots amb Revit
- **Planificació**: Microsoft Project (local)
- **Obres**: Excel per seguiment
- **Seguretat**: Documentació en paper

### Entorns IT/OT
```
IT: ERP, CAD, email, servidor de fitxers
OT: Maquinària d'obra (no connectada)
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|---------|
| Desviacions de cost no detectades a temps | Pèrdues 5-10% per obra | Alta |
| Documentació d'obra fragmentada | Pèrdua de temps, errors | Alta |
| BIM poc implementat | Coordinació deficient | Mitjana |
| Seguretat i salut en paper | Auditors, inspeccions | Alta |
| No visibilitat de l'obra en temps real | Reunions presencials constants | Mitjana |
| Control de maquinària inexistent | Robatoris, mal ús | Mitjana |

---

## Oportunitats de digitalització

### 1. BIM (Building Information Modeling)
- Model 3D amb informació integrada
- Coordinació entre oficis
- Detecció de col·lisions
- BIM 4D (planificació) i 5D (costos)

### 2. Plataforma de gestió d'obres
- Seguiment en temps real
- Control de costos
- Documentació centralitzada
- Comunicació equips

### 3. IoT a l'obra
- Sensors de maquinària (ús, ubicació)
- Control d'accessos
- Sensors ambientals (pols, soroll)
- Càmeres time-lapse

### 4. Seguretat i salut digital
- Checklist digitals
- Formacions online
- Control d'EPIs
- Alertes de risc

### 5. Analytics i reporting
- Dashboards de projecte
- Predicció de desviacions
- Comparativa entre obres

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD                                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   BIM    │  │  Gestió  │  │   PRL    │  │Analytics │        │
│  │ (CDE)    │  │  Obres   │  │ Digital  │  │   BI     │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
┌──────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐
│   OFICINA   │      │   OBRA 1    │      │   OBRA N    │
│             │      │             │      │             │
│ ┌─────────┐ │      │ ┌─────────┐ │      │ ┌─────────┐ │
│ │ BIM     │ │      │ │ Tablet  │ │      │ │ Tablet  │ │
│ │ Workst. │ │      │ │ Camp    │ │      │ │ Camp    │ │
│ └─────────┘ │      │ └─────────┘ │      │ └─────────┘ │
│             │      │ ┌─────────┐ │      │ ┌─────────┐ │
│             │      │ │ Sensors │ │      │ │ Sensors │ │
│             │      │ │IoT/GPS  │ │      │ │IoT/GPS  │ │
│             │      │ └─────────┘ │      │ └─────────┘ │
│             │      │ ┌─────────┐ │      │ ┌─────────┐ │
│             │      │ │ Càmeres │ │      │ │ Càmeres │ │
│             │      │ └─────────┘ │      │ └─────────┘ │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **Cloud** | BIM (CDE), gestió, col·laboració |
| **IoT** | Sensors obra, maquinària, accessos |
| **Big Data** | Històric de projectes, desviacions |
| **IA** | Predicció de riscos, desviacions |

---

## Prototip suggerit

### Opció A: Dashboard de seguiment d'obra
- Indicadors de progrés, cost, termini
- Alertes de desviació
- Actualització des de camp (app)

### Opció B: Checklist digital de seguretat
- App mòbil per inspeccions
- Fotos i geolocalització
- Generació d'informes

### Opció C: Visualitzador BIM web
- Model 3D navegable
- Informació de components
- Anotacions i incidències

---

## Dades disponibles (simulades)

- Històric de projectes (costos, terminis)
- Planificacions inicials vs reals
- Incidències i desviacions
- Parts de treball

---

## Recursos gratuïts recomanats

- **BIM**: IFC.js (visualitzador web), Speckle
- **Gestió**: Procore (free trial), Fieldwire
- **App camp**: Flutter, React Native
- **IoT**: ESP32 + GPS, trackers
- **Cloud**: Autodesk Construction Cloud (trial)
- **3D**: Three.js, A-Frame

---

## Preguntes guia

1. Com implementaries BIM en una empresa que fa servir CAD?
2. Quins sensors IoT instal·laries a l'obra i per què?
3. Com garantiries la connectivitat a zones sense cobertura?
4. Quins KPIs de projecte són més crítics?
5. Com milloraries la seguretat laboral amb tecnologia?
