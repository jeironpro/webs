# Cas 2: FreshMarket

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | FreshMarket |
| **Sector** | Retail alimentació |
| **Ubicació** | Àrea metropolitana Barcelona |
| **Centres** | 8 supermercats de proximitat |
| **Empleats** | 120 |
| **Facturació** | 15M€/any |

---

## Descripció del negoci

FreshMarket és una cadena de supermercats de proximitat especialitzada en productes frescos i locals. Competeixen amb qualitat i servei personalitzat, no per preu.

**Diferenciació:**
- Productes km0 de productors locals
- Secció de frescos molt cuidada
- Servei d'encàrrecs personalitzats
- Horari ampliat (8h-22h)

---

## Situació actual

### Tecnologia existent
- **TPV**: Sistema antic de punt de venda
- **Inventari**: Full de càlcul per botiga
- **Comandes proveïdors**: Email i telèfon
- **Fidelització**: Targeta física amb segells
- **E-commerce**: No en tenen

### Entorns IT/OT
```
IT: TPV, comptabilitat, email
OT: Càmeres frigorífiques (control manual), alarmes
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| Merma de productes frescos | 8% de pèrdues (120.000€/any) | Alta |
| No hi ha visibilitat d'estocs en temps real | Ruptures i excés d'estoc | Alta |
| Comandes a proveïdors manuals | Errors, temps, ineficiència | Mitjana |
| Sense e-commerce | Pèrdua de vendes (competència) | Alta |
| Programa fidelització obsolet | Poc engagement | Mitjana |
| Temperatura càmeres no monitoritzada | Risc de seguretat alimentària | Alta |

---

## Oportunitats de digitalització

### 1. Gestió intel·ligent d'inventari
- Estoc en temps real per botiga
- Predicció de demanda per producte
- Comandes automàtiques a proveïdors
- Alertes de caducitat

### 2. IoT per a cadena de fred
- Sensors de temperatura en càmeres
- Alertes automàtiques
- Registre per compliment normatiu

### 3. E-commerce i omnicanalitat
- Web/app de compra online
- Click & collect
- Lliurament a domicili

### 4. Analítica de vendes
- Dashboard centralitzat
- Anàlisi de cistella
- Segmentació de clients
- Optimització de preus

### 5. Fidelització digital
- App amb punts i ofertes
- Personalització per client
- Gamificació

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD                                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │E-commerce│  │Inventari │  │Analytics │  │   IA     │       │
│  │  Web/App │  │Central   │  │   BI     │  │Predicció │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───┴───┐               ┌───┴───┐               ┌───┴───┐
│Botiga1│               │Botiga2│               │Botiga N│
│       │               │       │               │       │
│┌─────┐│               │┌─────┐│               │┌─────┐│
││ TPV ││               ││ TPV ││               ││ TPV ││
│└──┬──┘│               │└──┬──┘│               │└──┬──┘│
│   │   │               │   │   │               │   │   │
│┌──┴──┐│               │┌──┴──┐│               │┌──┴──┐│
││Sensor││              ││Sensor││              ││Sensor││
││Temp. ││               ││Temp. ││               ││Temp. ││
│└─────┘│               │└─────┘│               │└─────┘│
└───────┘               └───────┘               └───────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **IoT** | Sensors temperatura, estocs |
| **Big Data** | Vendes, comportament client, predicció |
| **IA** | Predicció demanda, recomanacions, pricing |
| **Cloud** | E-commerce, gestió centralitzada |

---

## Prototip suggerit

### Opció A: Predictor de demanda
- Dataset de vendes (simulat)
- Model ML per predir vendes per producte
- Dashboard de visualització

### Opció B: Monitor de cadena de fred
- Sensors de temperatura (ESP32 + DHT22)
- Alertes en temps real
- Històric i compliance

### Opció C: Sistema de recomanacions
- Anàlisi de cistella de compra
- Algoritme de recomanació
- API per integrar amb app

---

## Dades disponibles (simulades)

Per al prototip podeu simular:
- Històric de vendes (12 mesos)
- Productes (500 SKUs)
- Transaccions (10.000/mes per botiga)
- Temperatures (lectures cada 5 min)

---

## Recursos gratuïts recomanats

- **E-commerce**: Shopify Lite, WooCommerce
- **Backend**: Supabase, Firebase
- **ML**: Python + Scikit-learn, Prophet
- **IoT**: ESP32, ThingSpeak
- **BI**: Metabase, Google Data Studio
- **App client**: Flutter, PWA

---

## Preguntes guia

1. Com reduiries la merma de frescos amb dades?
2. Quina estratègia de predicció de demanda proposaries?
3. Com integraries el canal online amb les botigues físiques?
4. Quines dades recolliries per millorar la fidelització?
5. Com garantiries la traçabilitat dels productes?
