import { FileText, Code, Presentation, Download, CheckCircle } from 'lucide-react'
import MermaidDiagram from '../components/MermaidDiagram'

const entregables = [
  {
    nom: 'Document',
    pes: 50,
    color: 'bg-blue-500',
    icon: FileText,
    descripcio: 'Cas empresarial + Arquitectura tecnològica + Pla d\'implementació',
    criteris: [
      'Anàlisi del cas empresarial (15%)',
      'Proposta d\'arquitectura tecnològica (20%)',
      'Pla d\'implementació i seguretat (15%)',
    ],
  },
  {
    nom: 'Prototip',
    pes: 30,
    color: 'bg-green-500',
    icon: Code,
    descripcio: 'Implementació bàsica funcional amb recursos gratuïts',
    criteris: [
      'Funcionalitat demostrada',
      'Alineació amb arquitectura proposada',
      'Ús de recursos gratuïts',
      'Documentació tècnica reproduïble',
      'Innovació i creativitat',
    ],
  },
  {
    nom: 'Defensa',
    pes: 20,
    color: 'bg-purple-500',
    icon: Presentation,
    descripcio: 'Presentació oral i demo del projecte',
    criteris: [
      'Claredat expositiva',
      'Domini del contingut',
      'Respostes a preguntes',
      'Material de suport',
      'Treball en equip (si aplica)',
    ],
  },
]

const rubricaDocument = [
  {
    seccio: 'Anàlisi del Cas (15%)',
    criteris: [
      { nom: 'Context empresarial', ra: 'RA1: 1.1, 1.2' },
      { nom: 'Identificació IT/OT', ra: 'RA1: 1.3, 1.4, 1.6' },
      { nom: 'Àrees a digitalitzar', ra: 'RA6: 6.2, 6.3' },
      { nom: 'Objectius estratègics', ra: 'RA6: 6.1, 6.5' },
    ],
  },
  {
    seccio: 'Arquitectura (20%)',
    criteris: [
      { nom: 'Identificació THD', ra: 'RA2: 2.1, 2.2' },
      { nom: 'Arquitectura Cloud', ra: 'RA3: 3.1-3.4' },
      { nom: 'Integració IA', ra: 'RA4: 4.1, 4.2, 4.6' },
      { nom: 'Gestió de dades', ra: 'RA5: 5.2, 5.3, 5.6' },
      { nom: 'Encaix entre àrees', ra: 'RA6: 6.4, 6.6, 6.9' },
    ],
  },
  {
    seccio: 'Pla i Seguretat (15%)',
    criteris: [
      { nom: 'Anàlisi de riscos', ra: 'RA6: 6.7' },
      { nom: 'Estratègia Zero Trust', ra: 'RA5: 5.9' },
      { nom: 'Tractament de dades', ra: 'RA6: 6.8' },
      { nom: 'Documentació i RRHH', ra: 'RA6: 6.10, 6.11' },
      { nom: 'Avantatges i sostenibilitat', ra: 'RA1: 1.7, RA2: 2.3' },
    ],
  },
]

const plantillaChecklist = [
  'Portada completa',
  'Resum executiu (màx. 1 pàgina)',
  'Totes les seccions completades',
  'Diagrames d\'arquitectura inclosos',
  'Anàlisi de riscos i Zero Trust',
  'Cronograma d\'implementació',
  'Prototip documentat',
  'Codi font accessible',
  'Revisió ortogràfica',
]

const mapejoDiagram = `
flowchart TB
    subgraph DOC["DOCUMENT 50%"]
        D1[Anàlisi Cas<br/>RA1, RA6]
        D2[Arquitectura<br/>RA2, RA3, RA4, RA5]
        D3[Pla Seguretat<br/>RA5, RA6]
    end

    subgraph PROTO["PROTOTIP 30%"]
        P1[Implementació<br/>Competència tècnica]
    end

    subgraph DEF["DEFENSA 20%"]
        F1[Presentació<br/>Competències transversals]
    end

    style DOC fill:#dbeafe
    style PROTO fill:#dcfce7
    style DEF fill:#f3e8ff
`

export default function Avaluacio() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Avaluació</h1>
        <p className="text-gray-600">
          El projecte s'avalua en base a tres entregables: Document, Prototip i Defensa.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {entregables.map((ent) => (
          <div key={ent.nom} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`${ent.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <ent.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{ent.nom}</h3>
                <p className="text-2xl font-bold text-gray-900">{ent.pes}%</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{ent.descripcio}</p>
            <ul className="space-y-1">
              {ent.criteris.map((crit, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {crit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mapping diagram */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mapatge amb RAs</h2>
        <MermaidDiagram chart={mapejoDiagram} />
      </div>

      {/* Document rubric */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Rúbrica del Document</h2>
        <div className="space-y-6">
          {rubricaDocument.map((sec, i) => (
            <div key={i}>
              <h3 className="font-medium text-gray-900 mb-3">{sec.seccio}</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {sec.criteris.map((crit, j) => (
                  <div key={j} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{crit.nom}</p>
                    <p className="text-sm text-gray-500">{crit.ra}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grading scale */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Escala de Puntuació</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Puntuació</th>
                <th className="px-4 py-2 text-left">Nivell</th>
                <th className="px-4 py-2 text-left">Descripció</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2"><span className="font-bold text-green-600">4</span></td>
                <td className="px-4 py-2">Excel·lent</td>
                <td className="px-4 py-2 text-gray-600">Supera les expectatives</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2"><span className="font-bold text-blue-600">3</span></td>
                <td className="px-4 py-2">Notable</td>
                <td className="px-4 py-2 text-gray-600">Compleix correctament</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2"><span className="font-bold text-yellow-600">2</span></td>
                <td className="px-4 py-2">Suficient</td>
                <td className="px-4 py-2 text-gray-600">Compleix mínims</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><span className="font-bold text-red-600">1</span></td>
                <td className="px-4 py-2">Insuficient</td>
                <td className="px-4 py-2 text-gray-600">No compleix</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Càlcul nota final:</strong> (Document × 0.50) + (Prototip × 0.30) + (Defensa × 0.20)
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900">Checklist d'Entrega</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {plantillaChecklist.map((item, i) => (
            <label key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600" />
              <span className="text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Downloads */}
      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Documents Descarregables</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span>Plantilla Document</span>
          </button>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span>Guia Prototip</span>
          </button>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span>Rúbrica Completa</span>
          </button>
        </div>
      </div>
    </div>
  )
}
