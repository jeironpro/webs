import { ExternalLink, Cloud, Cpu, Database, Brain, Shield, BookOpen, Video, Wrench, Github } from 'lucide-react'

const recursos = [
  {
    categoria: 'Cloud Computing',
    icon: Cloud,
    color: 'bg-blue-500',
    items: [
      { nom: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', desc: '12 mesos de serveis gratuïts' },
      { nom: 'Google Cloud Free', url: 'https://cloud.google.com/free', desc: '$300 de crèdit inicial' },
      { nom: 'Azure for Students', url: 'https://azure.microsoft.com/free/students/', desc: '$100 crèdit amb compte educatiu' },
      { nom: 'Firebase', url: 'https://firebase.google.com/', desc: 'Backend as a Service gratuït' },
      { nom: 'Supabase', url: 'https://supabase.com/', desc: 'Alternativa open source a Firebase' },
      { nom: 'Vercel', url: 'https://vercel.com/', desc: 'Hosting gratuït per a frontends' },
    ],
  },
  {
    categoria: 'IoT i Sensors',
    icon: Cpu,
    color: 'bg-green-500',
    items: [
      { nom: 'Wokwi', url: 'https://wokwi.com/', desc: 'Simulador ESP32/Arduino online' },
      { nom: 'Tinkercad Circuits', url: 'https://www.tinkercad.com/circuits', desc: 'Simulador Arduino visual' },
      { nom: 'Node-RED', url: 'https://nodered.org/', desc: 'Programació visual per IoT' },
      { nom: 'MQTT Explorer', url: 'https://mqtt-explorer.com/', desc: 'Client MQTT per testing' },
      { nom: 'ThingSpeak', url: 'https://thingspeak.com/', desc: 'Plataforma IoT gratuïta' },
      { nom: 'Grafana Cloud', url: 'https://grafana.com/products/cloud/', desc: 'Dashboards i monitorització' },
    ],
  },
  {
    categoria: 'IA i Machine Learning',
    icon: Brain,
    color: 'bg-purple-500',
    items: [
      { nom: 'Google Colab', url: 'https://colab.research.google.com/', desc: 'Notebooks amb GPU gratuïta' },
      { nom: 'Hugging Face', url: 'https://huggingface.co/', desc: 'Models pre-entrenats i datasets' },
      { nom: 'Teachable Machine', url: 'https://teachablemachine.withgoogle.com/', desc: 'ML sense codi' },
      { nom: 'OpenAI API', url: 'https://platform.openai.com/', desc: 'GPT i altres models ($5 gratis)' },
      { nom: 'Kaggle', url: 'https://www.kaggle.com/', desc: 'Datasets i competicions ML' },
      { nom: 'Scikit-learn', url: 'https://scikit-learn.org/', desc: 'Biblioteca ML per Python' },
    ],
  },
  {
    categoria: 'Big Data i Analytics',
    icon: Database,
    color: 'bg-orange-500',
    items: [
      { nom: 'Metabase', url: 'https://www.metabase.com/', desc: 'BI open source' },
      { nom: 'Apache Superset', url: 'https://superset.apache.org/', desc: 'Visualització de dades' },
      { nom: 'MongoDB Atlas', url: 'https://www.mongodb.com/atlas', desc: 'Base de dades NoSQL cloud' },
      { nom: 'PostgreSQL', url: 'https://www.postgresql.org/', desc: 'Base de dades relacional' },
      { nom: 'DBeaver', url: 'https://dbeaver.io/', desc: 'Client universal de BBDD' },
      { nom: 'Power BI Desktop', url: 'https://powerbi.microsoft.com/', desc: 'Eina BI de Microsoft (gratis)' },
    ],
  },
  {
    categoria: 'Seguretat',
    icon: Shield,
    color: 'bg-red-500',
    items: [
      { nom: 'OWASP', url: 'https://owasp.org/', desc: 'Guies de seguretat web' },
      { nom: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/', desc: 'Verificació de filtracions' },
      { nom: 'SSL Labs', url: 'https://www.ssllabs.com/ssltest/', desc: 'Test de certificats SSL' },
      { nom: 'AEPD - RGPD', url: 'https://www.aepd.es/', desc: 'Guies oficials RGPD Espanya' },
      { nom: 'Security Headers', url: 'https://securityheaders.com/', desc: 'Anàlisi de capçaleres HTTP' },
    ],
  },
  {
    categoria: 'Desenvolupament',
    icon: Wrench,
    color: 'bg-gray-600',
    items: [
      { nom: 'GitHub', url: 'https://github.com/', desc: 'Control de versions i col·laboració' },
      { nom: 'VS Code', url: 'https://code.visualstudio.com/', desc: 'Editor de codi recomanat' },
      { nom: 'Docker Desktop', url: 'https://www.docker.com/products/docker-desktop/', desc: 'Contenidors locals' },
      { nom: 'Postman', url: 'https://www.postman.com/', desc: 'Testing d\'APIs' },
      { nom: 'Figma', url: 'https://www.figma.com/', desc: 'Disseny d\'interfícies' },
      { nom: 'Draw.io', url: 'https://draw.io/', desc: 'Diagrames i arquitectures' },
    ],
  },
]

const tutorials = [
  {
    tema: 'IoT amb ESP32',
    recursos: [
      { nom: 'Random Nerd Tutorials', url: 'https://randomnerdtutorials.com/', tipus: 'Web' },
      { nom: 'ESP32 amb Firebase', url: 'https://randomnerdtutorials.com/esp32-firebase-realtime-database/', tipus: 'Tutorial' },
    ],
  },
  {
    tema: 'Machine Learning',
    recursos: [
      { nom: 'ML Crash Course (Google)', url: 'https://developers.google.com/machine-learning/crash-course', tipus: 'Curs' },
      { nom: 'Fast.ai', url: 'https://www.fast.ai/', tipus: 'Curs' },
    ],
  },
  {
    tema: 'Cloud Architecture',
    recursos: [
      { nom: 'AWS Well-Architected', url: 'https://aws.amazon.com/architecture/well-architected/', tipus: 'Guia' },
      { nom: 'Azure Architecture Center', url: 'https://docs.microsoft.com/azure/architecture/', tipus: 'Guia' },
    ],
  },
  {
    tema: 'Seguretat i Zero Trust',
    recursos: [
      { nom: 'NIST Zero Trust Architecture', url: 'https://www.nist.gov/publications/zero-trust-architecture', tipus: 'Document' },
      { nom: 'Google BeyondCorp', url: 'https://cloud.google.com/beyondcorp', tipus: 'Model' },
    ],
  },
]

const plantilles = [
  { nom: 'Plantilla Document (Word/MD)', desc: 'Estructura completa del document de projecte', icon: BookOpen },
  { nom: 'Guia del Prototip', desc: 'Passos per desenvolupar el prototip', icon: Wrench },
  { nom: 'Presentació Base (PPT)', desc: 'Plantilla per a la defensa oral', icon: Video },
  { nom: 'Rúbrica Completa (PDF)', desc: 'Criteris detallats d\'avaluació', icon: BookOpen },
]

export default function Recursos() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Recursos</h1>
        <p className="text-gray-600">
          Col·lecció d'eines, plataformes i tutorials gratuïts per desenvolupar el teu projecte de transformació digital.
        </p>
      </div>

      {/* Downloadable templates */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Plantilles del Projecte</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plantilles.map((pl, i) => (
            <button
              key={i}
              className="flex items-start space-x-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <pl.icon className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">{pl.nom}</p>
                <p className="text-sm text-white/80">{pl.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tools by category */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Eines i Plataformes Gratuïtes</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {recursos.map((cat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`${cat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{cat.categoria}</h3>
              </div>
              <div className="space-y-2">
                {cat.items.map((item, j) => (
                  <a
                    key={j}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
                  >
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-primary-600">{item.nom}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorials */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Video className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-semibold text-gray-900">Tutorials i Cursos Recomanats</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tut, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{tut.tema}</h3>
              <ul className="space-y-2">
                {tut.recursos.map((rec, j) => (
                  <li key={j}>
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-gray-700 hover:text-primary-600"
                    >
                      <span>{rec.nom}</span>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">{rec.tipus}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub repos */}
      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-2 mb-4">
          <Github className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Repositoris d'Exemple</h2>
        </div>
        <p className="text-gray-400 mb-4">
          Projectes de referència per inspirar el teu prototip:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://github.com/topics/iot-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium">IoT Dashboards</p>
            <p className="text-sm text-gray-400">Exemples de visualització IoT</p>
          </a>
          <a
            href="https://github.com/topics/predictive-maintenance"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium">Predictive Maintenance</p>
            <p className="text-sm text-gray-400">ML per manteniment predictiu</p>
          </a>
          <a
            href="https://github.com/topics/smart-agriculture"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium">Smart Agriculture</p>
            <p className="text-sm text-gray-400">IoT per agricultura</p>
          </a>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-900 mb-3">Consells per al Prototip</h3>
        <ul className="space-y-2 text-yellow-800 text-sm">
          <li>• <strong>Comença petit:</strong> Un sensor + una visualització és millor que res</li>
          <li>• <strong>Simula si cal:</strong> Wokwi permet simular hardware sense comprar res</li>
          <li>• <strong>Documenta tot:</strong> El procés és tan important com el resultat</li>
          <li>• <strong>Usa serveis gratuïts:</strong> Firebase, Supabase, Vercel tenen tiers gratuïts generosos</li>
          <li>• <strong>Reutilitza codi:</strong> GitHub té exemples per a gairebé tot</li>
        </ul>
      </div>
    </div>
  )
}
