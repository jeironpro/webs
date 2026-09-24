import { Link } from 'react-router-dom'
import { Building2, Factory, Truck, Heart, Grape, Hotel, HardHat, GraduationCap, Car, Dumbbell } from 'lucide-react'

const casos = [
  {
    id: 1,
    name: 'TechnoGym Fitness',
    sector: 'Fitness/Salut',
    thd: ['IoT', 'Cloud', 'IA'],
    difficulty: 2,
    icon: Dumbbell,
    color: 'bg-blue-500',
    description: 'Cadena de gimnasos amb 3 centres. Necessita monitorització d\'ocupació, manteniment de màquines i experiència de soci personalitzada.',
  },
  {
    id: 2,
    name: 'FreshMarket',
    sector: 'Retail alimentació',
    thd: ['IoT', 'Big Data', 'IA'],
    difficulty: 2,
    icon: Building2,
    color: 'bg-green-500',
    description: 'Cadena de supermercats de proximitat. Problemes amb merma de frescos, gestió d\'inventari i manca d\'e-commerce.',
  },
  {
    id: 3,
    name: 'MetalPrecis',
    sector: 'Manufactura CNC',
    thd: ['IoT', 'IA', 'Edge'],
    difficulty: 3,
    icon: Factory,
    color: 'bg-gray-600',
    description: 'Taller de mecanitzat de precisió. Màquines CNC no connectades, manteniment reactiu, traçabilitat manual.',
  },
  {
    id: 4,
    name: 'LogiTrans',
    sector: 'Logística',
    thd: ['IoT', 'Big Data', 'Cloud'],
    difficulty: 2,
    icon: Truck,
    color: 'bg-yellow-500',
    description: 'Empresa de transport amb 45 vehicles. Rutes no optimitzades, manca de tracking en temps real per clients.',
  },
  {
    id: 5,
    name: 'ClinicaSalut',
    sector: 'Sanitat privada',
    thd: ['Cloud', 'IA', 'Big Data'],
    difficulty: 3,
    icon: Heart,
    color: 'bg-red-500',
    description: 'Clínica multidisciplinar. Històries clíniques fragmentades, cites per telèfon, sense telemedicina.',
  },
  {
    id: 6,
    name: 'AgroTech Vinyes',
    sector: 'Agricultura',
    thd: ['IoT', 'IA', 'Edge'],
    difficulty: 2,
    icon: Grape,
    color: 'bg-purple-500',
    description: 'Explotació vitícola de 120ha. Reg no optimitzat, decisió de verema subjectiva, traçabilitat manual.',
  },
  {
    id: 7,
    name: 'HotelMar',
    sector: 'Hostaleria',
    thd: ['IoT', 'Cloud', 'IA'],
    difficulty: 2,
    icon: Hotel,
    color: 'bg-cyan-500',
    description: 'Hotel 4* amb 150 habitacions. Check-in lent, gestió energètica ineficient, dependència d\'OTAs.',
  },
  {
    id: 8,
    name: 'BuildCorp',
    sector: 'Construcció',
    thd: ['IoT', 'BIM', 'Cloud'],
    difficulty: 3,
    icon: HardHat,
    color: 'bg-orange-500',
    description: 'Constructora mitjana. Desviacions de cost no detectades, BIM poc implementat, seguretat en paper.',
  },
  {
    id: 9,
    name: 'EduLearn Academy',
    sector: 'Educació',
    thd: ['Cloud', 'IA', 'Big Data'],
    difficulty: 2,
    icon: GraduationCap,
    color: 'bg-indigo-500',
    description: 'Acadèmia de formació. LMS obsolet, manca d\'analítica d\'aprenentatge, atenció alumne lenta.',
  },
  {
    id: 10,
    name: 'AutoParts BCN',
    sector: 'Automoció',
    thd: ['IoT', 'IA', 'MES'],
    difficulty: 3,
    icon: Car,
    color: 'bg-slate-600',
    description: 'Fabricant de components Tier 2. Traçabilitat incompleta, OEE desconegut, qualitat amb detecció tardana.',
  },
]

const DifficultyStars = ({ level }) => (
  <div className="flex space-x-1">
    {[1, 2, 3].map((star) => (
      <span
        key={star}
        className={`text-lg ${star <= level ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))}
  </div>
)

export default function Casos() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Casos Empresarials</h1>
        <p className="text-gray-600">
          Escull un cas per desenvolupar el teu projecte de transformació digital.
          Cada cas inclou la descripció de l'empresa, els problemes identificats i les oportunitats de digitalització.
        </p>
      </div>

      {/* Filters info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Com escollir el teu cas?</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Considera les THD que ja coneixes de la teva optativa</li>
          <li>• Valora la complexitat segons el temps disponible (★ = fàcil, ★★★ = complex)</li>
          <li>• Llegeix tots els casos abans de decidir</li>
        </ul>
      </div>

      {/* Cases grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {casos.map((cas) => (
          <Link
            key={cas.id}
            to={`/casos/${cas.id}`}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover"
          >
            <div className="flex items-start space-x-4">
              <div className={`${cas.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <cas.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{cas.name}</h3>
                  <DifficultyStars level={cas.difficulty} />
                </div>
                <p className="text-sm text-gray-500 mb-2">{cas.sector}</p>
                <p className="text-gray-600 text-sm mb-3">{cas.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cas.thd.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Custom case info */}
      <div className="bg-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Pots proposar el teu propi cas?</h3>
        <p className="text-gray-600 text-sm mb-4">
          Sí, però ha de complir els requisits següents i tenir l'aprovació prèvia del professor:
        </p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>✓ Empresa real o realista del teu entorn</li>
          <li>✓ Mínim 3 àrees susceptibles de digitalització</li>
          <li>✓ Possibilitat d'aplicar almenys 2 THD</li>
        </ul>
      </div>
    </div>
  )
}
