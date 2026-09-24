# Cas 10: AutoParts BCN

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | AutoParts BCN S.A. |
| **Sector** | Automoció - Components |
| **Ubicació** | Martorell (prop de SEAT) |
| **Empleats** | 250 |
| **Facturació** | 35M€/any |
| **Clients** | OEMs i Tier 1 |

---

## Descripció del negoci

AutoParts BCN és un fabricant de components d'automoció (Tier 2):
- Peces d'estampació metàl·lica
- Conjunts soldats
- Recobriments i tractaments superficials

**Clients principals:** SEAT, Volkswagen, Gestamp, CIE Automotive

**Certificacions:** IATF 16949, ISO 14001, ISO 45001

---

## Situació actual

### Tecnologia existent
- **ERP**: SAP
- **MES**: Sistema propi bàsic
- **Qualitat**: Màquines de mesura (CMM) no integrades
- **Producció**: PLCs Siemens, alguns Allen-Bradley
- **Logística**: Kanban físic (targetes)

### Entorns IT/OT
```
IT: SAP, email, CAD, ofimàtica
OT: PLCs, premses, soldadura, tractaments
    → Integració parcial via OPC
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| Traçabilitat incompleta | Reclamacions OEM, auditors | Alta |
| OEE desconegut (real) | Decisions sense dades | Alta |
| Qualitat: detecció tardana | PPMs alts, reclamacions | Alta |
| No predicció de manteniment | Aturades imprevistes | Mitjana |
| EDI amb clients manual | Errors, temps | Mitjana |
| Gestió de magatzem amb paper | Errors d'inventari | Mitjana |

---

## Oportunitats de digitalització

### 1. MES avançat
- Traçabilitat completa (lot, peça)
- OEE en temps real
- Integració amb SAP

### 2. Qualitat 4.0
- Visió artificial inline
- SPC en temps real
- Integració CMM amb MES

### 3. IIoT i manteniment predictiu
- Sensors en premses
- Models de predicció de fallades
- CMMS integrat

### 4. Digital Twin
- Simulació de processos
- Optimització de paràmetres
- Virtual commissioning

### 5. Integració EDI/API
- Automatització de comandes
- ASN (Advanced Shipping Notice)
- Facturació electrònica

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTERPRISE (IT)                              │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   SAP    │  │   PLM    │  │ Analytics│  │   EDI    │        │
│  │   ERP    │  │   CAD    │  │    BI    │  │  Clients │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                           │                                     │
│                    ┌──────┴──────┐                              │
│                    │  MES / MOM  │                              │
│                    └──────┬──────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                     PLANTA (OT)                                 │
│                                                                 │
│           ┌───────────────┴───────────────┐                    │
│           │        EDGE PLATFORM          │                    │
│           │     (Industrial IoT Hub)      │                    │
│           └───────────────┬───────────────┘                    │
│                           │                                     │
│   ┌───────────┬───────────┼───────────┬───────────┐            │
│   │           │           │           │           │            │
│   ▼           ▼           ▼           ▼           ▼            │
│ ┌─────┐   ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐         │
│ │Premsa│   │Soldad│    │ CMM │     │Robot│     │Tracta│        │
│ │      │   │      │    │     │     │     │     │ments │        │
│ │ PLC  │   │ PLC  │    │     │     │ PLC │     │ PLC  │        │
│ │      │   │      │    │     │     │     │     │      │        │
│ │Sensors│  │Sensors│   │     │     │Sensors│   │Sensors│       │
│ └─────┘   └─────┘     └─────┘     └─────┘     └─────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IIoT** | Connectivitat PLCs, sensors |
| **Edge** | Processament local, temps real |
| **Big Data** | Històric producció, qualitat |
| **IA** | Visió artificial, manteniment predictiu |

---

## Prototip suggerit

### Opció A: Dashboard OEE amb traçabilitat
- Simulació de dades de producció
- Càlcul OEE per màquina/línia
- Traçabilitat de lots

### Opció B: Sistema de visió artificial
- Detecció de defectes (imatges)
- Model de classificació (OK/NOK)
- Integració amb línia (simulada)

### Opció C: Predictor de manteniment
- Dataset de sensors (vibració, temp)
- Model ML per anomalies
- Alertes predictives

---

## Dades disponibles (simulades)

- Ordres de fabricació (quantitats, temps)
- Dades de PLCs (cicles, parades)
- Mesures de qualitat (CMM)
- Historial de manteniment

---

## Recursos gratuïts recomanats

- **IIoT**: Node-RED, MQTT, InfluxDB
- **Edge**: Raspberry Pi, Balena
- **MES**: OpenMES, Apache Kafka
- **Visió**: OpenCV, TensorFlow, YOLO
- **ML**: Scikit-learn, PyTorch
- **Dashboard**: Grafana, Power BI

---

## Preguntes guia

1. Com implementaries traçabilitat unitària de peces?
2. Quins protocols utilitzaries per connectar PLCs (OPC-UA, MQTT)?
3. Com garantiries temps real per a control de qualitat inline?
4. Quina arquitectura edge/cloud proposaries per minimitzar latència?
5. Com compliries amb els requisits de ciberseguretat d'automoció?
