import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import MermaidDiagram from '../components/MermaidDiagram'

const temes = {
  1: {
    title: 'Digitalització i Sectors Productius',
    ra: 'RA1',
    sections: [
      {
        title: 'Què és la Digitalització?',
        content: `La **digitalització** és el procés de transformar processos, productes i models de negoci mitjançant l'ús de tecnologies digitals per millorar l'eficiència, crear valor i generar noves oportunitats.`,
        diagram: `
flowchart LR
    A[Indústria 1.0<br/>Vapor] --> B[Indústria 2.0<br/>Electricitat]
    B --> C[Indústria 3.0<br/>Automatització]
    C --> D[Indústria 4.0<br/>Digitalització]

    style D fill:#3b82f6,color:#fff
        `
      },
      {
        title: 'Entorns IT i OT',
        content: `Els entorns **IT** (Information Technology) gestionen la informació corporativa, mentre que els entorns **OT** (Operation Technology) controlen els processos físics.`,
        table: {
          headers: ['Aspecte', 'IT', 'OT'],
          rows: [
            ['Objectiu', 'Gestió de dades', 'Control de processos'],
            ['Prioritat', 'Confidencialitat', 'Disponibilitat'],
            ['Cicle de vida', '3-5 anys', '15-25 anys'],
            ['Protocols', 'TCP/IP, HTTP', 'Modbus, OPC-UA'],
          ]
        }
      },
      {
        title: 'Convergència IT/OT',
        diagram: `
flowchart TB
    subgraph IT["Entorn IT"]
        ERP[ERP]
        CRM[CRM]
        BI[Business Intelligence]
    end

    subgraph OT["Entorn OT"]
        PLC[PLCs]
        SCADA[SCADA]
        SENSORS[Sensors]
    end

    subgraph CONVERGENCIA["Convergència IT/OT"]
        IIOT[IIoT]
        EDGE[Edge Computing]
        DT[Digital Twin]
    end

    IT <--> CONVERGENCIA
    OT <--> CONVERGENCIA

    style CONVERGENCIA fill:#22c55e,color:#fff
        `
      },
      {
        title: 'Avantatges de la Digitalització',
        list: [
          'Eficiència operativa: -20-30% costos',
          'Qualitat: -50% defectes',
          'Agilitat: +40% time-to-market',
          'Innovació: Nous productes i serveis',
          'Sostenibilitat: -15-20% consum',
        ]
      }
    ]
  },
  2: {
    title: 'Tecnologies Habilitadores Digitals (THD)',
    ra: 'RA2',
    sections: [
      {
        title: 'Les 4 THD Principals',
        diagram: `
flowchart TB
    TD[Transformació Digital]

    TD --> IOT[IoT<br/>Sensors, Actuadors]
    TD --> BD[Big Data<br/>Volum, Velocitat]
    TD --> IA[IA / ML<br/>Predicció, Automatització]
    TD --> CLOUD[Cloud<br/>IaaS, PaaS, SaaS]

    style TD fill:#1e40af,color:#fff
    style IOT fill:#3b82f6,color:#fff
    style BD fill:#8b5cf6,color:#fff
    style IA fill:#ec4899,color:#fff
    style CLOUD fill:#06b6d4,color:#fff
        `
      },
      {
        title: 'Internet of Things (IoT)',
        content: `L'IoT és la xarxa de dispositius físics connectats a Internet que recullen i comparteixen dades.`,
        table: {
          headers: ['Component', 'Funció', 'Exemples'],
          rows: [
            ['Sensors', 'Captura de dades', 'Temperatura, humitat, vibració'],
            ['Actuadors', 'Execució d\'accions', 'Motors, vàlvules, relés'],
            ['Gateways', 'Connexió i protocol', 'Raspberry Pi, ESP32'],
            ['Plataforma', 'Gestió i visualització', 'AWS IoT, Azure IoT Hub'],
          ]
        }
      },
      {
        title: 'Big Data - Les 5 V',
        diagram: `
flowchart TB
    BD[Big Data]

    BD --> V1[Volum<br/>TB/PB de dades]
    BD --> V2[Velocitat<br/>Temps real]
    BD --> V3[Varietat<br/>Estructurades i no]
    BD --> V4[Veracitat<br/>Qualitat]
    BD --> V5[Valor<br/>Insights]

    style BD fill:#8b5cf6,color:#fff
        `
      },
      {
        title: 'Intel·ligència Artificial',
        content: `La IA permet automatitzar tasques que abans requerien judici humà.`,
        list: [
          'Machine Learning: Aprèn de les dades',
          'Deep Learning: Xarxes neuronals profundes',
          'NLP: Processament de llenguatge natural',
          'Visió Artificial: Anàlisi d\'imatges',
          'IA Generativa: LLMs (GPT, Claude, Gemini)',
        ]
      }
    ]
  },
  3: {
    title: 'Cloud Computing i Edge',
    ra: 'RA3',
    sections: [
      {
        title: 'Models de Servei Cloud',
        diagram: `
flowchart TB
    subgraph SAAS["SaaS"]
        S1[Aplicacions]
    end

    subgraph PAAS["PaaS"]
        P1[Plataforma]
        P2[Runtime]
    end

    subgraph IAAS["IaaS"]
        I1[Infraestructura]
        I2[Servidors]
        I3[Xarxa]
    end

    SAAS --> PAAS --> IAAS

    style SAAS fill:#22c55e,color:#fff
    style PAAS fill:#3b82f6,color:#fff
    style IAAS fill:#8b5cf6,color:#fff
        `
      },
      {
        title: 'Proveïdors Cloud',
        table: {
          headers: ['Proveïdor', 'IaaS', 'PaaS', 'Punts forts'],
          rows: [
            ['AWS', 'EC2, S3', 'Lambda, RDS', 'Líder de mercat'],
            ['Azure', 'VMs, Blob', 'App Service', 'Integració Microsoft'],
            ['GCP', 'Compute Engine', 'Cloud Run', 'ML/IA, Kubernetes'],
          ]
        }
      },
      {
        title: 'Arquitectura Cloud-Edge-Fog-Mist',
        diagram: `
flowchart TB
    CLOUD[Cloud<br/>Data Center]
    FOG[Fog<br/>Regional]
    EDGE[Edge<br/>Local]
    MIST[Mist<br/>Sensors]

    CLOUD --> FOG --> EDGE --> MIST

    CLOUD ---|">100ms"| FOG
    FOG ---|"10-100ms"| EDGE
    EDGE ---|"<10ms"| MIST

    style CLOUD fill:#3b82f6,color:#fff
    style FOG fill:#06b6d4,color:#fff
    style EDGE fill:#22c55e,color:#fff
    style MIST fill:#eab308,color:#000
        `
      },
      {
        title: 'Avantatges del Cloud',
        list: [
          'Escalabilitat automàtica',
          'Pay-as-you-go',
          'Disponibilitat alta (99.9%+)',
          'Seguretat certificada',
          'Innovació contínua',
        ]
      }
    ]
  },
  4: {
    title: 'Intel·ligència Artificial',
    ra: 'RA4',
    sections: [
      {
        title: 'Automatització amb IA',
        content: `La IA permet automatitzar tasques que requereixen judici, adaptació i predicció.`,
        diagram: `
flowchart LR
    subgraph TRADICIONAL["Automatització Tradicional"]
        T1[Regles fixes]
        T2[Determinista]
    end

    subgraph IA["Automatització IA"]
        I1[Aprenentatge]
        I2[Adaptació]
        I3[Predicció]
    end

    TRADICIONAL -->|"Evolució"| IA

    style IA fill:#ec4899,color:#fff
        `
      },
      {
        title: 'Relació IA i Big Data',
        diagram: `
flowchart LR
    BD[Big Data] --> ML[ML/IA] --> INS[Insights]
    INS --> DEC[Decisions]
    DEC --> ACC[Accions]
    ACC -->|"Més dades"| BD

    style ML fill:#ec4899,color:#fff
        `
      },
      {
        title: 'Sectors amb IA',
        table: {
          headers: ['Sector', 'Aplicació IA', 'Benefici'],
          rows: [
            ['Tecnologia', 'Assistents de codi', '+40% productivitat'],
            ['Finances', 'Detecció de frau', '-60% fraus'],
            ['Salut', 'Diagnòstic imatges', '+30% precisió'],
            ['Manufactura', 'Manteniment predictiu', '-25% defectes'],
            ['Retail', 'Recomanacions', '+15% vendes'],
          ]
        }
      },
      {
        title: 'Stack d\'IA Modern',
        list: [
          'Llenguatge: Python (95%)',
          'Llibreries: TensorFlow, PyTorch, Scikit-learn',
          'Models: GPT, Claude, LLaMA, BERT',
          'Plataformes: Hugging Face, OpenAI, Google AI',
          'MLOps: MLflow, Kubeflow, W&B',
        ]
      }
    ]
  },
  5: {
    title: 'Dades i Seguretat',
    ra: 'RA5',
    sections: [
      {
        title: 'Cicle de Vida de la Dada',
        diagram: `
flowchart LR
    C[Creació] --> E[Emmagatzematge]
    E --> P[Processament]
    P --> U[Utilització]
    U --> A[Arxiu]
    A --> D[Eliminació]

    style C fill:#22c55e,color:#fff
    style D fill:#ef4444,color:#fff
        `
      },
      {
        title: 'Pilars de la Seguretat (CIA)',
        diagram: `
flowchart TB
    SEC[Seguretat]

    SEC --> C[Confidencialitat<br/>Només autoritzats]
    SEC --> I[Integritat<br/>Dades no alterades]
    SEC --> A[Disponibilitat<br/>Accés quan cal]

    style SEC fill:#ef4444,color:#fff
    style C fill:#3b82f6,color:#fff
    style I fill:#22c55e,color:#fff
    style A fill:#f59e0b,color:#fff
        `
      },
      {
        title: 'Zero Trust',
        content: `"Never trust, always verify" - Cap confiança implícita, verificació contínua.`,
        list: [
          'Verificació explícita sempre',
          'Mínim privilegi (just-enough access)',
          'Assumir compromís (dissenyar com si ja estiguessis compromès)',
          'Microsegmentació de xarxa',
        ]
      },
      {
        title: 'Regulació',
        table: {
          headers: ['Normativa', 'Àmbit', 'Requisits clau'],
          rows: [
            ['RGPD', 'UE, dades personals', 'Consentiment, drets, DPO'],
            ['LOPDGDD', 'Espanya', 'Implementació RGPD'],
            ['NIS2', 'UE, ciberseguretat', 'Mesures, notificació'],
            ['ISO 27001', 'Internacional', 'SGSI'],
          ]
        }
      }
    ]
  },
  6: {
    title: 'Metodologia de Transformació Digital',
    ra: 'RA6',
    sections: [
      {
        title: 'Alineació Estratègica',
        content: `La transformació digital ha d'estar alineada amb els objectius de negoci.`,
        diagram: `
flowchart TB
    EST[Estratègia Empresarial]
    EST --> TD[Estratègia TD]

    TD --> PROC[Processos]
    TD --> TECH[Tecnologia]
    TD --> PERS[Persones]

    style EST fill:#1e40af,color:#fff
    style TD fill:#3b82f6,color:#fff
        `
      },
      {
        title: 'Objectius SMART',
        table: {
          headers: ['Criteri', 'Significat', 'Exemple'],
          rows: [
            ['Specific', 'Concret', 'Reduir temps producció'],
            ['Measurable', 'Quantificable', 'En un 20%'],
            ['Achievable', 'Assolible', 'Amb IoT disponible'],
            ['Relevant', 'Alineat', 'Millora competitivitat'],
            ['Time-bound', 'Amb termini', 'En 12 mesos'],
          ]
        }
      },
      {
        title: 'Fases del Projecte',
        diagram: `
flowchart LR
    F1[Descobriment] --> F2[Disseny]
    F2 --> F3[Implementació]
    F3 --> F4[Operació]

    F1 ---|"Business Case"| F2
    F2 ---|"Arquitectura"| F3
    F3 ---|"Sistema"| F4

    style F1 fill:#8b5cf6,color:#fff
    style F2 fill:#3b82f6,color:#fff
    style F3 fill:#22c55e,color:#fff
    style F4 fill:#06b6d4,color:#fff
        `
      },
      {
        title: 'Entregables del Projecte',
        list: [
          'Document (50%): Cas + Arquitectura + Pla',
          'Prototip (30%): Implementació funcional',
          'Defensa (20%): Presentació oral',
        ]
      }
    ]
  }
}

export default function Teoria() {
  const { tema } = useParams()
  const temaId = tema ? parseInt(tema) : null
  const currentTema = temaId ? temes[temaId] : null

  if (!currentTema) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Continguts Teòrics</h1>
        <p className="text-gray-600">Selecciona un tema per veure el contingut.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(temes).map(([id, tema]) => (
            <Link
              key={id}
              to={`/teoria/${id}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover"
            >
              <div className="text-sm text-primary-600 font-medium mb-2">{tema.ra}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tema {id}: {tema.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {tema.sections.length} seccions
              </p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const prevTema = temaId > 1 ? temaId - 1 : null
  const nextTema = temaId < 6 ? temaId + 1 : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm text-primary-600 font-medium mb-2">{currentTema.ra}</div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tema {temaId}: {currentTema.title}
        </h1>
      </div>

      {/* Content sections */}
      {currentTema.sections.map((section, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>

          {section.content && (
            <p className="text-gray-600 mb-4">{section.content}</p>
          )}

          {section.diagram && (
            <MermaidDiagram chart={section.diagram} className="my-6" />
          )}

          {section.table && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {section.table.headers.map((header, i) => (
                      <th key={i} className="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-gray-300 px-4 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section.list && (
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {section.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Navigation */}
      <div className="flex justify-between">
        {prevTema ? (
          <Link
            to={`/teoria/${prevTema}`}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Tema {prevTema}</span>
          </Link>
        ) : <div />}

        {nextTema ? (
          <Link
            to={`/teoria/${nextTema}`}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <span>Tema {nextTema}</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
