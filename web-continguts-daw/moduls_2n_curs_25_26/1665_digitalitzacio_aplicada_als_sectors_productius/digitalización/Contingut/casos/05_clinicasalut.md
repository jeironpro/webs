# Cas 5: ClinicaSalut

## Fitxa de l'empresa

| | |
|---|---|
| **Nom** | ClinicaSalut |
| **Sector** | Sanitat privada |
| **Ubicació** | Barcelona ciutat |
| **Empleats** | 150 |
| **Especialitats** | 15 |
| **Pacients/any** | 45.000 visites |

---

## Descripció del negoci

ClinicaSalut és una clínica privada multidisciplinar que ofereix:
- Consultes externes (15 especialitats)
- Diagnòstic per la imatge (RX, eco, TAC)
- Laboratori d'anàlisis
- Cirurgia ambulatòria
- Rehabilitació

**Diferenciació:** Atenció personalitzada, sense llistes d'espera.

---

## Situació actual

### Tecnologia existent
- **HIS (Hospital Information System)**: Sistema antic local
- **Cites**: Telèfon + web bàsica
- **Història clínica**: Parcialment digitalitzada
- **Imatges mèdiques**: PACS local
- **Laboratori**: Sistema propi aïllat

### Entorns IT/OT
```
IT: HIS, web, email, PACS
OT: Equipament mèdic (RX, TAC, eco) - no integrat
```

---

## Problemes identificats

| Problema | Impacte | Prioritat |
|----------|---------|-----------|
| Histories clíniques fragmentades | Pèrdua de temps, errors | Alta |
| Cites per telèfon | 2 recepcionistes, esperes | Alta |
| No integració amb asseguradores | Facturació manual | Mitjana |
| Diagnòstic per imatge aïllat | Metges no accedeixen fàcilment | Alta |
| Sense telemedicina | Pèrdua de pacients post-COVID | Mitjana |
| Recordatoris manuals | No-shows 12% | Mitjana |

---

## Oportunitats de digitalització

### 1. Història Clínica Electrònica unificada
- Integració de tots els sistemes
- Accés des de qualsevol consulta
- Interoperabilitat (HL7 FHIR)

### 2. Portal del pacient
- Cites online 24/7
- Accés a resultats i informes
- Comunicació amb metges
- Telemedicina integrada

### 3. IA en diagnòstic
- Suport a radiologia (detecció)
- Triatge intel·ligent
- Alertes clíniques

### 4. Automatització administrativa
- Facturació automàtica a asseguradores
- Recordatoris automàtics
- Chatbot d'atenció

### 5. Analytics clínic
- Dashboard de KPIs
- Predicció de demanda
- Optimització d'agendes

---

## Arquitectura proposada (orientativa)

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLOUD (amb compliment normatiu)        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Portal  │  │   HIS    │  │   IA     │  │Analytics │        │
│  │ Pacient  │  │  Cloud   │  │Diagnòstic│  │  Clínic  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                           │                                     │
│                    ┌──────┴──────┐                              │
│                    │  API FHIR   │                              │
│                    │ Integració  │                              │
│                    └──────┬──────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                     ON-PREMISE                                  │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │  PACS   │  │Laboratori│  │Equipament│  │Consultes│          │
│   │ Imatges │  │  LIS    │  │  mèdic  │  │         │          │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## THD recomanades

| THD | Aplicació |
|-----|-----------|
| **Cloud** | HIS cloud, portal pacient, escalabilitat |
| **IA** | Suport diagnòstic, chatbot, triatge |
| **Big Data** | Històric clínic, analytics |
| **IoT** | Dispositius mèdics connectats (futur) |

---

## Prototip suggerit

### Opció A: Portal de cites
- Sistema de reserves online
- Integració amb calendari
- Recordatoris automàtics

### Opció B: Chatbot de triatge
- Preguntes simptomàtiques
- Recomanació d'especialitat
- Derivació a cita o urgències

### Opció C: Dashboard de gestió
- KPIs de la clínica (visites, esperes, no-shows)
- Visualització de dades
- Alertes

---

## Consideracions especials

### Normativa i compliment
- **RGPD**: Dades de salut (categoria especial)
- **LOPDGDD**: Aplicació espanyola
- **ENS**: Si treballen amb sector públic
- **Interoperabilitat**: HL7 FHIR

### Seguretat
- Encriptació obligatòria
- Control d'accés estricte
- Auditoria de tots els accessos
- Backup i recuperació

---

## Recursos gratuïts recomanats

- **FHIR**: HAPI FHIR (servidor open source)
- **Portal**: React, Next.js
- **Chatbot**: Rasa, Dialogflow free tier
- **ML**: Hugging Face (models mèdics)
- **Cloud**: Azure for Healthcare, AWS HealthLake (free tier)
- **Calendari**: Cal.com (open source)

---

## Preguntes guia

1. Com garantiries la privacitat de les dades mèdiques (RGPD)?
2. Quina estratègia d'integració proposaries per als sistemes legacy?
3. Com implementaries telemedicina de forma segura?
4. Quins controls d'accés aplicaries a la història clínica?
5. Com asseguraries la disponibilitat del sistema (HA)?
