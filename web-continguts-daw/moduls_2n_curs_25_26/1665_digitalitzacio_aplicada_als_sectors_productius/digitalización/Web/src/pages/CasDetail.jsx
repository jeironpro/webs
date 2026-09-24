import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, Users, Euro, MapPin, AlertTriangle, Lightbulb, Cpu, Wrench } from 'lucide-react'
import MermaidDiagram from '../components/MermaidDiagram'

const casosData = {
  1: {
    name: 'TechnoGym Fitness',
    sector: 'Fitness i Salut',
    ubicacio: 'Barcelona (3 centres)',
    empleats: 45,
    facturacio: '2.5M€/any',
    clients: '4.500 socis actius',
    descripcio: 'TechnoGym Fitness és una cadena de gimnasos urbans amb 3 centres a Barcelona. Ofereixen sala de musculació i cardio, classes dirigides, entrenadors personals i zona de spa.',
    problemes: [
      { text: 'No hi ha visibilitat d\'ocupació en temps real', impacte: 'Queixes de socis', prioritat: 'Alta' },
      { text: 'Reserves de classes per telèfon', impacte: '2 recepcionistes dedicades', prioritat: 'Alta' },
      { text: 'Màquines sense monitorització', impacte: 'Avaries imprevistes', prioritat: 'Mitjana' },
      { text: 'Experiència poc personalitzada', impacte: 'Churn 18%', prioritat: 'Alta' },
      { text: 'Consum energètic alt', impacte: '45.000€/any', prioritat: 'Mitjana' },
    ],
    oportunitats: [
      'App mòbil per a socis (reserves, ocupació, plans personalitzats)',
      'IoT al gimnàs (sensors ocupació, màquines connectades, clima intel·ligent)',
      'Analítica i IA (predicció ocupació, recomanacions, detecció abandó)',
      'Plataforma cloud (gestió centralitzada multi-centre)',
    ],
    arquitectura: `
flowchart TB
    subgraph CLOUD["Cloud"]
        API[App API Backend]
        AN[Analytics Dashboard]
        ML[ML Predicció]
    end

    subgraph CENTRE["Centre (x3)"]
        GW[Gateway IoT]
        SENS[Sensors Ocupació]
        MAQ[Màquines]
        CLIMA[Clima]
    end

    CLOUD <--> GW
    GW <--> SENS
    GW <--> MAQ
    GW <--> CLIMA

    style CLOUD fill:#3b82f6,color:#fff
    style CENTRE fill:#22c55e,color:#fff
    `,
    thd: [
      { nom: 'IoT', us: 'Sensors d\'ocupació, màquines connectades, clima' },
      { nom: 'Cloud', us: 'Backend, app, gestió multi-centre' },
      { nom: 'Big Data', us: 'Històric d\'ús, patrons de comportament' },
      { nom: 'IA', us: 'Predicció ocupació, churn, recomanacions' },
    ],
    prototips: [
      { nom: 'Dashboard d\'ocupació', desc: 'Sensors simulats + visualització temps real' },
      { nom: 'Predictor d\'ocupació', desc: 'Model ML amb dades històriques' },
      { nom: 'Chatbot d\'atenció', desc: 'Bot per reserves amb NLP/LLM' },
    ],
    recursos: ['ESP32 + sensors', 'Firebase/Supabase', 'Node.js/FastAPI', 'Scikit-learn', 'React Native', 'Grafana'],
  },
  2: {
    name: 'FreshMarket',
    sector: 'Retail alimentació',
    ubicacio: 'Àrea metropolitana Barcelona',
    empleats: 120,
    facturacio: '15M€/any',
    clients: '8 supermercats',
    descripcio: 'Cadena de supermercats de proximitat especialitzada en productes frescos i locals. Competeixen amb qualitat i servei, no per preu.',
    problemes: [
      { text: 'Merma de productes frescos', impacte: '8% pèrdues (120K€/any)', prioritat: 'Alta' },
      { text: 'No visibilitat d\'estocs en temps real', impacte: 'Ruptures i excés', prioritat: 'Alta' },
      { text: 'Sense e-commerce', impacte: 'Pèrdua de vendes', prioritat: 'Alta' },
      { text: 'Temperatura càmeres no monitoritzada', impacte: 'Risc seguretat alimentària', prioritat: 'Alta' },
    ],
    oportunitats: [
      'Gestió intel·ligent d\'inventari amb predicció de demanda',
      'IoT per a cadena de fred (sensors temperatura)',
      'E-commerce i omnicanalitat',
      'Analítica de vendes i fidelització digital',
    ],
    arquitectura: `
flowchart TB
    subgraph CLOUD["Cloud"]
        ECOM[E-commerce]
        INV[Inventari Central]
        AN[Analytics BI]
        IA[IA Predicció]
    end

    subgraph BOTIGA["Botiga (x8)"]
        TPV[TPV]
        TEMP[Sensors Temp]
    end

    CLOUD <--> BOTIGA

    style CLOUD fill:#22c55e,color:#fff
    `,
    thd: [
      { nom: 'IoT', us: 'Sensors temperatura, estocs' },
      { nom: 'Big Data', us: 'Vendes, comportament client' },
      { nom: 'IA', us: 'Predicció demanda, recomanacions' },
      { nom: 'Cloud', us: 'E-commerce, gestió centralitzada' },
    ],
    prototips: [
      { nom: 'Predictor de demanda', desc: 'Model ML per predir vendes per producte' },
      { nom: 'Monitor cadena de fred', desc: 'Sensors temperatura amb alertes' },
      { nom: 'Sistema recomanacions', desc: 'Anàlisi cistella de compra' },
    ],
    recursos: ['ESP32 + DHT22', 'Python + Prophet', 'Metabase', 'Supabase', 'Flutter'],
  },
  // More cases would be added here...
}

// Default case template for cases not fully defined
const defaultCase = {
  problemes: [
    { text: 'Problema per definir', impacte: 'Per analitzar', prioritat: 'Mitjana' },
  ],
  oportunitats: ['Oportunitat per identificar'],
  arquitectura: `
flowchart TB
    CLOUD[Cloud] <--> EDGE[Edge/Local]
    EDGE <--> DISP[Dispositius]
  `,
  thd: [{ nom: 'Per definir', us: 'A determinar' }],
  prototips: [{ nom: 'Per definir', desc: 'A determinar' }],
  recursos: ['Per definir'],
}

export default function CasDetail() {
  const { casId } = useParams()
  const cas = casosData[casId] || { ...defaultCase, name: `Cas ${casId}`, descripcio: 'Contingut en desenvolupament.' }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        to="/casos"
        className="inline-flex items-center text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tornar als casos
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{cas.name}</h1>
        <p className="text-gray-600 mb-6">{cas.descripcio}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cas.sector && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span>{cas.sector}</span>
            </div>
          )}
          {cas.ubicacio && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{cas.ubicacio}</span>
            </div>
          )}
          {cas.empleats && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5 text-gray-400" />
              <span>{cas.empleats} empleats</span>
            </div>
          )}
          {cas.facturacio && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Euro className="w-5 h-5 text-gray-400" />
              <span>{cas.facturacio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Problems */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Problemes Identificats</h2>
        </div>
        <div className="space-y-3">
          {cas.problemes.map((prob, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{prob.text}</p>
                <p className="text-sm text-gray-600">{prob.impacte}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                prob.prioritat === 'Alta' ? 'bg-red-200 text-red-800' :
                prob.prioritat === 'Mitjana' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {prob.prioritat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Oportunitats de Digitalització</h2>
        </div>
        <ul className="space-y-2">
          {cas.oportunitats.map((op, i) => (
            <li key={i} className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-gray-700">{op}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Architecture */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Cpu className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Arquitectura Proposada</h2>
        </div>
        <MermaidDiagram chart={cas.arquitectura} />
      </div>

      {/* THD */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tecnologies Habilitadores</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {cas.thd.map((tech, i) => (
            <div key={i} className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">{tech.nom}</h3>
              <p className="text-blue-700 text-sm">{tech.us}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prototypes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Wrench className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900">Idees de Prototip</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cas.prototips.map((proto, i) => (
            <div key={i} className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Opció {String.fromCharCode(65 + i)}: {proto.nom}</h3>
              <p className="text-purple-700 text-sm mt-1">{proto.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recursos Recomanats</h2>
        <div className="flex flex-wrap gap-2">
          {cas.recursos.map((rec, i) => (
            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {rec}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
