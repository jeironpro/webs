# Tema 1: Digitalització i Sectors Productius

> **RA1:** Analitza el concepte de digitalització i la seva repercussió en els sectors productius tenint en compte l'activitat de l'empresa i identificant entorns IT i OT característics.

---

## 1.1 Què és la Digitalització?

### Definició

La **digitalització** és el procés de transformar processos, productes i models de negoci mitjançant l'ús de tecnologies digitals per millorar l'eficiència, crear valor i generar noves oportunitats.

### Conceptes relacionats

| Terme | Definició |
|-------|-----------|
| **Digitalització** | Conversió d'informació analògica a format digital |
| **Digitalització de processos** | Ús de tecnologia per automatitzar i millorar processos |
| **Transformació Digital** | Canvi estratègic integral que afecta tota l'organització |

### Evolució: De l'analògic al digital

```
Indústria 1.0     Indústria 2.0     Indústria 3.0     Indústria 4.0
(Vapor)     →     (Electricitat)  →  (Automatització) → (Digitalització)
   1784              1870               1969              Avui

                                                    ┌─────────────────┐
                                                    │ IoT, IA, Cloud  │
                                                    │ Big Data, ML    │
                                                    │ Robots, AR/VR   │
                                                    └─────────────────┘
```

### Components clau de la digitalització

1. **Connectivitat** - Dispositius i sistemes interconnectats
2. **Dades** - Recollida, emmagatzematge i anàlisi
3. **Automatització** - Processos sense intervenció humana
4. **Intel·ligència** - Presa de decisions basada en dades

---

## 1.2 Entorns IT i OT

### Definicions

| Entorn | Significat | Funció |
|--------|------------|--------|
| **IT** | Information Technology | Gestió d'informació corporativa |
| **OT** | Operation Technology | Control de processos físics |

### Diferències i similituds

| Aspecte | IT | OT |
|---------|-----|-----|
| **Objectiu principal** | Gestió de dades i informació | Control de processos físics |
| **Prioritat** | Confidencialitat | Disponibilitat |
| **Cicle de vida** | 3-5 anys | 15-25 anys |
| **Actualitzacions** | Freqüents | Poc freqüents |
| **Protocols** | TCP/IP, HTTP, SQL | Modbus, OPC-UA, MQTT |
| **Temps de resposta** | Segons/minuts | Mil·lisegons |
| **Tolerància a errors** | Reinici acceptable | Zero tolerància |
| **Entorn** | Oficines, CPD | Planta, fàbrica |

### Similituds

- Ambdós utilitzen xarxes i comunicacions
- Necessiten seguretat (però amb enfocaments diferents)
- Generen i processen dades
- Requereixen gestió i manteniment

### Convergència IT/OT

```
        ┌─────────────────────────────────────────────────────┐
        │                    EMPRESA                          │
        │                                                     │
        │   ┌─────────────┐         ┌─────────────┐          │
        │   │     IT      │◄───────►│     OT      │          │
        │   │             │         │             │          │
        │   │ • ERP       │         │ • PLCs      │          │
        │   │ • CRM       │         │ • SCADA     │          │
        │   │ • Email     │         │ • Sensors   │          │
        │   │ • Web       │         │ • Actuadors │          │
        │   │ • BI        │         │ • HMI       │          │
        │   └─────────────┘         └─────────────┘          │
        │          │                       │                  │
        │          └───────────┬───────────┘                  │
        │                      │                              │
        │              ┌───────▼───────┐                      │
        │              │  CONVERGÈNCIA │                      │
        │              │    IT/OT      │                      │
        │              │               │                      │
        │              │ • IIoT        │                      │
        │              │ • Edge        │                      │
        │              │ • Digital Twin│                      │
        │              └───────────────┘                      │
        └─────────────────────────────────────────────────────┘
```

### Beneficis de la integració IT/OT

1. **Visibilitat completa** - Dades de planta disponibles a temps real
2. **Optimització** - Decisions basades en dades de producció
3. **Predicció** - Manteniment predictiu amb ML
4. **Eficiència** - Automatització de processos d'extrem a extrem

---

## 1.3 Departaments IT típics

### Estructura tradicional

| Departament | Funcions | Tecnologies |
|-------------|----------|-------------|
| **Infraestructura** | Servidors, xarxa, cloud | VMware, AWS, Azure |
| **Desenvolupament** | Aplicacions, integracions | Java, Python, .NET |
| **Suport/Helpdesk** | Atenció a usuaris | Ticketing, ITSM |
| **Seguretat** | Ciberseguretat, compliance | SIEM, firewalls, IAM |
| **Dades/BI** | Anàlisi, reporting | Power BI, Tableau |

### Nous rols amb la digitalització

| Rol | Funció |
|-----|--------|
| **Data Engineer** | Pipelines de dades |
| **Data Scientist** | Models ML/IA |
| **DevOps Engineer** | Automatització CI/CD |
| **Cloud Architect** | Disseny cloud |
| **IoT Specialist** | Dispositius connectats |
| **Cybersecurity Analyst** | Seguretat IT/OT |

---

## 1.4 Tecnologies de digitalització per àrea

### Àrea de Negoci (IT)

| Àrea | Tecnologies | Exemples |
|------|-------------|----------|
| **Vendes** | CRM, e-commerce | Salesforce, Shopify |
| **Màrqueting** | Analytics, automatització | Google Analytics, HubSpot |
| **Finances** | ERP, RPA | SAP, UiPath |
| **RRHH** | HCM, portals | Workday, SuccessFactors |
| **Atenció client** | Chatbots, CRM | Zendesk, chatbots IA |

### Àrea de Planta (OT)

| Àrea | Tecnologies | Exemples |
|------|-------------|----------|
| **Producció** | MES, SCADA | Siemens, Rockwell |
| **Manteniment** | CMMS, IoT | IBM Maximo, sensors |
| **Qualitat** | SPC, visió artificial | Cognex, OpenCV |
| **Logística** | WMS, AGV | SAP EWM, robots |
| **Energia** | BMS, smart grid | Schneider, ABB |

### Tecnologies de connexió IT-OT

| Tecnologia | Funció |
|------------|--------|
| **OPC-UA** | Protocol estàndard de comunicació industrial |
| **MQTT** | Missatgeria lleugera per IoT |
| **API REST** | Integració entre sistemes |
| **Edge Computing** | Processament a la frontera |
| **Digital Twin** | Rèplica digital de processos físics |

---

## 1.5 Avantatges de la digitalització

### Per a l'empresa

| Avantatge | Descripció | Impacte |
|-----------|------------|---------|
| **Eficiència operativa** | Automatització de processos | -20-30% costos |
| **Qualitat** | Control en temps real | -50% defectes |
| **Agilitat** | Resposta ràpida al mercat | +40% time-to-market |
| **Innovació** | Nous productes i serveis | Nous ingressos |
| **Sostenibilitat** | Optimització de recursos | -15-20% consum |

### Per als treballadors

- Eliminació de tasques repetitives
- Accés a informació en temps real
- Eines de col·laboració
- Teletreball i flexibilitat
- Formació contínua (upskilling)

### Per als clients

- Experiència personalitzada
- Servei 24/7
- Productes conectats (IoT)
- Transparència i traçabilitat
- Nous canals de comunicació

---

## 1.6 Digitalització d'extrem a extrem (E2E)

### Què significa?

La digitalització **d'extrem a extrem** implica la transformació completa de la cadena de valor, des del proveïdor fins al client final.

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│Proveïdor│───►│Producció│───►│Logística│───►│ Vendes  │───►│ Client  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     │              │              │              │              │
     └──────────────┴──────────────┴──────────────┴──────────────┘
                            │
                    ┌───────▼───────┐
                    │   PLATAFORMA  │
                    │    DIGITAL    │
                    │               │
                    │ • Dades úniques│
                    │ • Visibilitat │
                    │ • Traçabilitat│
                    └───────────────┘
```

### Components d'una transformació E2E

1. **Integració de sistemes** - ERP, MES, CRM connectats
2. **Flux de dades** - Informació que flueix sense barreres
3. **Automatització** - Processos automàtics entre àrees
4. **Visibilitat** - Dashboard únic amb KPIs
5. **Predicció** - IA per anticipar problemes

### Exemples sectorials

| Sector | Transformació E2E |
|--------|-------------------|
| **Manufactura** | Smart Factory: sensors → MES → ERP → client |
| **Retail** | Omnicanal: online + físic + logística integrada |
| **Salut** | Historial digital: pacient → hospital → farmàcia |
| **Logística** | Supply chain digital: tracking E2E |

---

## Resum del Tema

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DIGITALITZACIÓ                                    │
│                                                                     │
│  ┌─────────────┐                          ┌─────────────┐          │
│  │     IT      │◄────── Convergència ─────►│     OT      │          │
│  │  (Informació)│                          │ (Operacions)│          │
│  └─────────────┘                          └─────────────┘          │
│         │                                        │                  │
│         └────────────────┬───────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│              ┌───────────────────────┐                              │
│              │  TRANSFORMACIÓ E2E    │                              │
│              │                       │                              │
│              │  • Eficiència         │                              │
│              │  • Qualitat           │                              │
│              │  • Agilitat           │                              │
│              │  • Innovació          │                              │
│              │  • Sostenibilitat     │                              │
│              └───────────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Activitat pràctica

> Identifica una empresa del teu sector i respon:
> 1. Quins departaments constitueixen l'entorn IT?
> 2. Quins sistemes formen l'entorn OT (si n'hi ha)?
> 3. Quin és el nivell d'integració IT/OT actual?
> 4. Quines àrees es podrien digitalitzar?
