import { Link } from 'react-router-dom'
import { BookOpen, Briefcase, ClipboardCheck, Wrench, ArrowRight, Calendar, Users, Target } from 'lucide-react'
import MermaidDiagram from '../components/MermaidDiagram'

const features = [
  {
    name: 'Teoria',
    description: '6 temes coberts: Digitalització, THD, Cloud, IA, Dades i Projecte',
    href: '/teoria',
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    name: 'Casos Empresarials',
    description: '10 casos reals de diferents sectors per aplicar els coneixements',
    href: '/casos',
    icon: Briefcase,
    color: 'bg-green-500',
  },
  {
    name: 'Avaluació',
    description: 'Rúbrica, plantilles i guia del prototip',
    href: '/avaluacio',
    icon: ClipboardCheck,
    color: 'bg-purple-500',
  },
  {
    name: 'Recursos',
    description: 'Eines gratuïtes, tutorials i material addicional',
    href: '/recursos',
    icon: Wrench,
    color: 'bg-orange-500',
  },
]

const timeline = [
  { week: '1-2', title: 'Teoria', description: 'Digitalització, IT/OT, THD, Cloud, IA, Seguretat' },
  { week: '3', title: 'Selecció de cas', description: 'Elecció del cas empresarial i anàlisi inicial' },
  { week: '4-5', title: 'Arquitectura', description: 'Disseny de la solució tecnològica' },
  { week: '6-7', title: 'Prototip', description: 'Implementació i documentació' },
  { week: '8', title: 'Finalització', description: 'Preparació de la defensa' },
  { week: '9', title: 'Defenses', description: 'Presentació dels projectes' },
]

const estructuraDiagram = `
flowchart TB
    subgraph TEORIA["Teoria (8h)"]
        T1[Digitalització i IT/OT]
        T2[Tecnologies Habilitadores]
        T3[Cloud Computing]
        T4[Intel·ligència Artificial]
        T5[Dades i Seguretat]
        T6[Metodologia]
    end

    subgraph PROJECTE["Projecte (21h + 4h)"]
        P1[Selecció de Cas]
        P2[Anàlisi]
        P3[Arquitectura]
        P4[Prototip]
        P5[Document]
        P6[Defensa]
    end

    TEORIA --> PROJECTE
    P1 --> P2 --> P3 --> P4 --> P5 --> P6

    style TEORIA fill:#dbeafe
    style PROJECTE fill:#dcfce7
`

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-12 text-white">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          1665. Digitalització Aplicada als Sectors Productius
        </h1>
        <p className="text-lg lg:text-xl text-primary-100 mb-6 max-w-3xl">
          Aprèn a dissenyar i implementar projectes de transformació digital utilitzant
          IoT, Big Data, Intel·ligència Artificial i Cloud Computing.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
            <Calendar className="w-5 h-5" />
            <span>33 hores | 8-9 setmanes</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
            <Target className="w-5 h-5" />
            <span>3 ECTS</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
            <Users className="w-5 h-5" />
            <span>DAW | DAM | ASIX</span>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.href}
            className="bg-white rounded-xl p-6 shadow-sm card-hover border border-gray-100"
          >
            <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
            <div className="flex items-center text-primary-600 text-sm font-medium">
              Veure més <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Structure diagram */}
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estructura del Mòdul</h2>
        <MermaidDiagram chart={estructuraDiagram} />
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Temporització</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-12">
                <div className="absolute left-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {item.week.includes('-') ? '' : item.week}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm text-gray-500">Setmana {item.week}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation summary */}
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaluació</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
            <div className="font-semibold text-gray-900">Document</div>
            <p className="text-sm text-gray-600 mt-2">Cas + Arquitectura + Pla</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
            <div className="font-semibold text-gray-900">Prototip</div>
            <p className="text-sm text-gray-600 mt-2">Implementació funcional</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-4xl font-bold text-purple-600 mb-2">20%</div>
            <div className="font-semibold text-gray-900">Defensa</div>
            <p className="text-sm text-gray-600 mt-2">Presentació oral</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Comença ara!</h2>
        <p className="text-gray-400 mb-6">Explora els continguts teòrics o descobreix els casos empresarials disponibles.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/teoria"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Veure Teoria
          </Link>
          <Link
            to="/casos"
            className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explorar Casos
          </Link>
        </div>
      </div>
    </div>
  )
}
