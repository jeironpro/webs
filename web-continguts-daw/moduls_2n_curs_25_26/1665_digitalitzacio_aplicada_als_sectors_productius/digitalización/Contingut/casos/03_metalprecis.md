# Cas 3: MetalPrecis

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | MetalPrecis S.L. |
| **Sector** | Manufactura - Mecanitzat de precisió |
| **Ubicació** | Polígon industrial Vallès |
| **Empleats** | 85 |
| **Facturació** | 8M€/any |
| **Clients** | Automoció, aeronàutica, mèdic |

---

## Descripció del negoci

MetalPrecis és un taller de mecanitzat de precisió que fabrica peces metàl·liques per a sectors exigents. Disposen de:
- 12 centres de mecanitzat CNC
- 5 torns CNC
- 3 màquines d'electroerosió
- Sala de metrologia
- Magatzem de matèria primera

**Certificacions:** ISO 9001, ISO 14001, EN 9100 (aeronàutica)

---

## Situació actual

### Tecnologia existent
- **ERP**: SAP Business One (comptabilitat, compres)
- **Producció**: Fulls de ruta en paper
- **Qualitat**: Mesures manuals, Excel
- **Màquines**: CNC moderns però no connectats
- **Manteniment**: Correctiu (quan falla)

### Entorns IT/OT
```
IT: ERP, email, ofimàtica
OT: Màquines CNC (aïllades), metrologia
    → IT i OT NO estan connectats
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| No es coneix l'OEE real de les màquines | Decisions sense dades | Alta |
| Manteniment reactiu | Aturades imprevistes (5%/mes) | Alta |
| Traçabilitat manual | Auditors demanen millores | Alta |
| No hi ha visibilitat de producció en temps real | Planificació ineficient | Mitjana |
| Qualitat: dades en paper | Anàlisi lent, errors | Mitjana |
| Consum energètic descontrolat | Costos, sostenibilitat | Baixa |

---

## Oportunitats de digitalització

### 1. Connectivitat de màquines (IIoT)
- Recollida de dades de CNC via OPC-UA
- Monitorització en temps real
- Càlcul d'OEE automàtic

### 2. Manteniment predictiu
- Sensors de vibració i temperatura
- Models ML per predicció de fallades
- Planificació preventiva intel·ligent

### 3. MES (Manufacturing Execution System)
- Digitalització d'ordres de fabricació
- Traçabilitat completa
- Integració amb ERP

### 4. Qualitat 4.0
- Digitalització de mesures
- SPC (Statistical Process Control)
- Alertes automàtiques de desviació

### 5. Digital Twin
- Simulació de processos
- Optimització de programes CNC

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD / ON-PREMISE                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   ERP    │  │   MES    │  │Analytics │  │   ML     │        │
│  │   SAP    │◄─┤          │  │   BI     │  │Predictiu │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                      EDGE / FOG                                 │
│           ┌───────────────┴───────────────┐                    │
│           │        EDGE GATEWAY           │                    │
│           │     (Industrial PC)           │                    │
│           │   OPC-UA / MQTT / Modbus      │                    │
│           └───────────────┬───────────────┘                    │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                      PLANTA (OT)                                │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │  CNC 1  │  │  CNC 2  │  │  CNC N  │  │Metrologia│          │
│   │         │  │         │  │         │  │         │          │
│   │ OPC-UA  │  │ OPC-UA  │  │ OPC-UA  │  │  RS232  │          │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│        │            │            │            │                 │
│   ┌────┴────┐  ┌────┴────┐                                     │
│   │ Sensor  │  │ Sensor  │  Vibració, temperatura              │
│   │ Add-on  │  │ Add-on  │                                     │
│   └─────────┘  └─────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IoT/IIoT** | Connectivitat màquines, sensors |
| **Edge Computing** | Processament local, baixa latència |
| **Big Data** | Històric de producció, qualitat |
| **IA/ML** | Manteniment predictiu, optimització |

---

## Prototip suggerit

### Opció A: Dashboard OEE
- Simulació de dades de màquines
- Càlcul OEE (Disponibilitat × Rendiment × Qualitat)
- Visualització en temps real

### Opció B: Predictor de fallades
- Dataset de vibracions (públic o simulat)
- Model ML de classificació (normal/anomalia)
- Alertes predictives

### Opció C: Sistema de traçabilitat
- Escaneig de codis QR/barres
- Registre de cada operació
- Consulta d'historial per peça

---

## Dades disponibles (simulades)

- Històric de producció (ordres, temps, peces)
- Lectures de sensors (vibració, temperatura)
- Registres de qualitat (mesures, defectes)
- Històric de manteniment (avaries, intervencions)

---

## Recursos gratuïts recomanats

- **IIoT**: Node-RED, Eclipse Mosquitto (MQTT)
- **Simulació OPC-UA**: Prosys OPC UA Simulation Server
- **Edge**: Raspberry Pi, Balena
- **ML**: Python + Scikit-learn, TensorFlow
- **Dashboard**: Grafana, InfluxDB
- **MES**: OpenMES (open source)

---

## Preguntes guia

1. Com connectaries màquines CNC de diferents fabricants?
2. Quines dades necessites per calcular l'OEE?
3. Com implementaries manteniment predictiu amb recursos limitats?
4. Quina arquitectura edge/cloud proposaries per minimitzar latència?
5. Com garantiries la ciberseguretat IT/OT?
