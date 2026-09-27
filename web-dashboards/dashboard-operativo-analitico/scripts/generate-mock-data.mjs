/**
 * Generador determinista de datos MOCK del dashboard.
 *
 * Produce JSONs realistas de un e-commerce boutique ("Nébula") para 2026:
 * - daily-sales.json: ventas diarias por (fecha, categoría, región, canal).
 * - weekly.json:      agregación semanal (últimas 12 semanas).
 * - monthly.json:     agregación mensual (sep 2025 – ago 2026).
 * - customers.json:   adquisición y retención de clientes por mes.
 * - orders.json:      pedidos recientes (60).
 * - categories.json / regions.json / channels.json: dimensiones.
 *
 * Uso: yarn mock:data
 * Los JSONs generados se commitean (src/data/).
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'src', 'data')
mkdirSync(OUT, { recursive: true })

/* ---- PRNG determinista (mulberry32) ---- */
function createRng(seed) {
    let a = seed >>> 0
    return function () {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/* ---- Utilidades ---- */
const round1 = (n) => Math.round(n * 10) / 10
const iso = (d) => d.toISOString().slice(0, 10)

function addDays(date, days) {
    const d = new Date(date)
    d.setUTCDate(d.getUTCDate() + days)
    return d
}

/** Distribución base de una categoría: ticket, peso de volumen y estacionalidad. */
const CATEGORIES = [
    { id: 'electronica', name: 'Electrónica', ticket: 214, volume: 0.1, peak: 0 },
    { id: 'hogar', name: 'Hogar', ticket: 86, volume: 0.18, peak: 0 },
    { id: 'moda', name: 'Moda', ticket: 54, volume: 0.24, peak: 0 },
    { id: 'deportes', name: 'Deportes', ticket: 48, volume: 0.14, peak: 1 },
    { id: 'alimentacion', name: 'Alimentación', ticket: 31, volume: 0.26, peak: 0 },
    { id: 'juguetes', name: 'Juguetes', ticket: 39, volume: 0.08, peak: 2 },
]

const REGIONS = [
    { id: 'centro', name: 'Centro', weight: 0.28 },
    { id: 'norte', name: 'Norte', weight: 0.2 },
    { id: 'sur', name: 'Sur', weight: 0.18 },
    { id: 'este', name: 'Este', weight: 0.17 },
    { id: 'oeste', name: 'Oeste', weight: 0.17 },
]

const CHANNELS = [
    { id: 'online', name: 'Online', weight: 0.55, conv: 0.028, season: 1.0 },
    { id: 'tienda', name: 'Tienda', weight: 0.2, conv: 0.34, season: 1.12 },
    { id: 'marketplace', name: 'Marketplace', weight: 0.18, conv: 0.031, season: 1.05 },
    { id: 'mayorista', name: 'Mayorista', weight: 0.07, conv: 0.11, season: 0.8 },
]

const DAY_START = new Date('2026-01-01T00:00:00.000Z')
const DAY_END = new Date('2026-08-18T00:00:00.000Z')

/* ---- Modelo de generación ---- */

/** Índice de demanda diaria: tendencia de crecimiento + estacionalidad semanal + promos. */
function dayFactor(rng, date) {
    const daysFromStart = Math.floor((date - DAY_START) / 86400000)
    const dayOfWeek = date.getUTCDay()
    const growth = 1 + daysFromStart * 0.0012 // ~8 % de crecimiento en 8 meses
    let seasonal = 1
    if (dayOfWeek === 5 || dayOfWeek === 6)
        seasonal = 1.28 // viernes y sábado
    else if (dayOfWeek === 0) seasonal = 1.12
    else if (dayOfWeek === 1) seasonal = 0.86 // lunes flojo

    const month = date.getUTCMonth()
    if (month === 6) seasonal *= 1.14 // rebajas de julio
    if (month === 11) seasonal *= 1.22 // diciembre

    const noise = 0.82 + rng() * 0.36 // ±18 %
    return growth * seasonal * noise
}

/** Factor de estacionalidad por categoría (picos puntuales). */
function categoryPeak(categoryId, rng, date) {
    const month = date.getUTCMonth()
    const day = date.getUTCDate()
    if (categoryId === 'juguetes' && month === 11) return 1.5
    if (categoryId === 'deportes' && month === 0) return 1.2 // enero: propósitos
    if (categoryId === 'deportes' && month === 6) return 1.15
    if (categoryId === 'electronica' && month === 6 && day >= 10 && day <= 20) return 1.18
    return 1
}

function pickWeighted(rng, items, weightFn) {
    const total = items.reduce((sum, item) => sum + weightFn(item), 0)
    let roll = rng() * total
    for (const item of items) {
        roll -= weightFn(item)
        if (roll <= 0) return item
    }
    return items[items.length - 1]
}

/** Genera las ventas diarias a nivel (fecha, categoría, región, canal). */
function generateDailySales(rng) {
    const records = []
    const cursor = new Date(DAY_START)
    while (cursor <= DAY_END) {
        const factor = dayFactor(rng, cursor)
        for (const category of CATEGORIES) {
            const catFactor = factor * categoryPeak(category.id, rng, cursor)
            for (const region of REGIONS) {
                const regionBias = 0.9 + rng() * 0.2
                for (const channel of CHANNELS) {
                    const demand =
                        catFactor * region.weight * regionBias * channel.weight * channel.season
                    const orders = Math.max(0, Math.round(demand * 18))
                    const ticket = category.ticket * (0.82 + rng() * 0.36)
                    const revenue = round1(orders * ticket)
                    const units = Math.max(orders, Math.round(orders * (1.05 + rng() * 0.35)))
                    const visitors =
                        channel.id === 'mayorista'
                            ? Math.round(orders * (6 + rng() * 8))
                            : Math.round((orders / channel.conv) * (0.9 + rng() * 0.2))
                    const newShare = 0.42 + rng() * 0.1 - daysSinceStart(cursor) * 0.00005
                    const nc = Math.round(orders * newShare)
                    const rc = Math.max(0, orders - nc)
                    const refunds = rng() < 0.05 ? Math.round(orders * (0.03 + rng() * 0.08)) : 0

                    if (orders > 0 || revenue > 0) {
                        records.push({
                            d: iso(cursor),
                            c: category.id,
                            r: region.id,
                            ch: channel.id,
                            rev: revenue,
                            ord: orders,
                            uni: units,
                            vis: visitors,
                            nc,
                            rc,
                            ref: refunds,
                        })
                    }
                }
            }
        }
        cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    return records
}

function daysSinceStart(date) {
    return Math.floor((date - DAY_START) / 86400000)
}

/* ---- Agregaciones ---- */
function aggregate(records, keyFn) {
    const map = new Map()
    for (const rec of records) {
        const key = keyFn(rec)
        if (!map.has(key)) {
            map.set(key, { rev: 0, ord: 0, uni: 0, vis: 0, nc: 0, rc: 0, ref: 0 })
        }
        const acc = map.get(key)
        acc.rev += rec.rev
        acc.ord += rec.ord
        acc.uni += rec.uni
        acc.vis += rec.vis
        acc.nc += rec.nc
        acc.rc += rec.rc
        acc.ref += rec.ref
    }
    return map
}

function isoWeekStart(date) {
    const d = new Date(date)
    const day = d.getUTCDay() === 0 ? 6 : d.getUTCDay() - 1
    d.setUTCDate(d.getUTCDate() - day)
    return d
}

/* ---- Generación ---- */
const rng = createRng(20260818)

const dailySales = generateDailySales(rng)

/* Semanal: últimas 12 semanas */
const weeklyAgg = aggregate(dailySales, (rec) => iso(isoWeekStart(new Date(rec.d + 'T00:00:00Z'))))
const weekKeys = [...weeklyAgg.keys()].sort().slice(-12)
const weekly = weekKeys.map((week) => {
    const a = weeklyAgg.get(week)
    return {
        week,
        start: week,
        end: iso(addDays(new Date(week + 'T00:00:00Z'), 6)),
        revenue: round1(a.rev),
        orders: a.ord,
        units: a.uni,
        visitors: a.vis,
        newCustomers: a.nc,
        returningCustomers: a.rc,
        refunds: a.ref,
    }
})

/* Mensual: sep 2025 – ago 2026 (los meses de 2026 se agregan de la serie diaria) */
const monthlyAgg = aggregate(dailySales, (rec) => rec.d.slice(0, 7))
const monthly = []
for (let m = 8; m < 12; m++) {
    // sep–dic 2025: se generan con el mismo modelo (sin respaldo diario)
    const monthKey = `2025-${String(m + 1).padStart(2, '0')}`
    monthly.push(generateLegacyMonth(rng, monthKey))
}
for (let m = 0; m < 8; m++) {
    const monthKey = `2026-${String(m + 1).padStart(2, '0')}`
    const a = monthlyAgg.get(monthKey) ?? { rev: 0, ord: 0, uni: 0, vis: 0, nc: 0, rc: 0, ref: 0 }
    monthly.push({
        month: monthKey,
        revenue: round1(a.rev),
        orders: a.ord,
        units: a.uni,
        visitors: a.vis,
        newCustomers: a.nc,
        returningCustomers: a.rc,
        refunds: a.ref,
        margin: round1(a.rev * (0.31 + rng() * 0.04)),
    })
}

function generateLegacyMonth(rng, monthKey) {
    const daysInMonth = new Date(`${monthKey}-01T00:00:00Z`)
    const month = Number(monthKey.slice(5, 7))
    const seasonal = month === 11 ? 1.28 : month === 10 ? 1.05 : 1
    const revenue = round1(520000 * seasonal * (0.9 + rng() * 0.2))
    const orders = Math.round(revenue / 58)
    return {
        month: monthKey,
        revenue,
        orders,
        units: Math.round(orders * 1.22),
        visitors: Math.round(orders / 0.029),
        newCustomers: Math.round(orders * 0.44),
        returningCustomers: Math.round(orders * 0.56),
        refunds: Math.round(orders * 0.035),
        margin: round1(revenue * (0.3 + rng() * 0.05)),
    }
}

/* Clientes: adquisición, retención y NPS por mes (2026) */
const customers = []
for (let m = 0; m < 8; m++) {
    const monthKey = `2026-${String(m + 1).padStart(2, '0')}`
    const a = monthlyAgg.get(monthKey) ?? { nc: 0, rc: 0 }
    const acquired = Math.max(80, Math.round(a.nc * (0.85 + rng() * 0.3)))
    const base = 0.52 + m * 0.012 // la retención mejora con el tiempo
    customers.push({
        month: monthKey,
        acquired,
        retained30: Math.round(acquired * base),
        retained60: Math.round(acquired * (base - 0.09)),
        retained90: Math.round(acquired * (base - 0.15)),
        churnRate: round1((1 - base) * 100),
        nps: 34 + Math.round(rng() * 14),
    })
}

/* Perfil de la persona (propietaria del dashboard) */
const profile = {
    name: 'Nadia Herrera',
    initials: 'NH',
    role: 'Analista de Operaciones',
    company: 'Nébula',
    email: 'nadia@nebula.mx',
    phone: '+52 55 1234 5678',
    location: 'Ciudad de México, MX',
    timezone: 'America/Mexico_City (UTC−6)',
    team: 'Comercial · Operaciones',
    joined: '2024-03-04',
    bio: 'Analizo las operaciones diarias de Nébula: KPIs, tendencias y reportes para el equipo comercial. Fan de los datos claros y del café con leche.',
    skills: ['Análisis de datos', 'E-commerce', 'Reporting', 'Excel avanzado', 'SQL', 'Power BI'],
    languages: ['Español (nativo)', 'Inglés (avanzado)'],
    stats: [
        { id: 'pedidos', label: 'Pedidos procesados', value: 4820, format: 'number' },
        { id: 'reportes', label: 'Reportes exportados', value: 326, format: 'number' },
        { id: 'horas', label: 'Horas de análisis', value: 1240, format: 'number' },
        { id: 'satisfaccion', label: 'Satisfacción interna', value: 92, format: 'percent' },
    ],
    activity: [
        {
            id: 'a1',
            type: 'export',
            title: 'Exportó el reporte de ventas por categoría',
            date: '2026-08-18T09:42:00Z',
        },
        {
            id: 'a2',
            type: 'filter',
            title: 'Ajustó el rango de fechas a los últimos 30 días',
            date: '2026-08-18T08:15:00Z',
        },
        {
            id: 'a3',
            type: 'order',
            title: 'Revisó 24 pedidos pendientes de envío',
            date: '2026-08-17T17:30:00Z',
        },
        {
            id: 'a4',
            type: 'kpi',
            title: 'Compartió el KPI de retención con el equipo',
            date: '2026-08-16T12:05:00Z',
        },
    ],
}

/* Pedidos recientes (60) derivados de la serie diaria de los últimos días */
const recentDays = dailySales.filter((rec) => rec.d >= '2026-08-08')
const firstNames = [
    'Lucía',
    'Mateo',
    'Valentina',
    'Santiago',
    'Camila',
    'Nicolás',
    'Isabella',
    'Daniel',
    'Sofía',
    'Julián',
    'Renata',
    'Andrés',
    'Emilia',
    'Tomás',
    'Mariana',
    'Felipe',
    'Antonia',
    'Sebastián',
    'Carolina',
    'Gabriel',
]
const lastNames = [
    'Gómez',
    'Rodríguez',
    'Fernández',
    'López',
    'Martínez',
    'Sánchez',
    'Pérez',
    'García',
    'Romero',
    'Torres',
    'Díaz',
    'Ramírez',
    'Flores',
    'Morales',
    'Castillo',
]
const statuses = [
    'completado',
    'enviado',
    'procesando',
    'completado',
    'completado',
    'cancelado',
    'enviado',
]
const namesByRegion = {
    centro: 'CDMX',
    norte: 'Monterrey',
    sur: 'Oaxaca',
    este: 'Cancún',
    oeste: 'Guadalajara',
}

const orders = []
const today = new Date('2026-08-18T00:00:00Z')
for (let i = 0; i < 60; i++) {
    const rec = recentDays[Math.floor(rng() * recentDays.length)]
    const date = addDays(today, -Math.floor(rng() * 10))
    const name = `${firstNames[Math.floor(rng() * firstNames.length)]} ${lastNames[Math.floor(rng() * lastNames.length)]}`
    const category = CATEGORIES.find((c) => c.id === rec.c)
    const ticket = category.ticket * (0.8 + rng() * 0.6)
    orders.push({
        id: `NB-${String(4820 + i).padStart(5, '0')}`,
        date: iso(date),
        customer: name,
        category: rec.c,
        region: rec.r,
        channel: rec.ch,
        items: 1 + Math.floor(rng() * 4),
        revenue: round1(ticket),
        status: statuses[Math.floor(rng() * statuses.length)],
    })
}
orders.sort((a, b) => (a.date < b.date ? 1 : -1))

/* ---- Salida ---- */
const files = {
    'categories.json': CATEGORIES.map(({ id, name }) => ({ id, name })),
    'regions.json': REGIONS.map(({ id, name }) => ({ id, name })),
    'channels.json': CHANNELS.map(({ id, name }) => ({ id, name })),
    'daily-sales.json': dailySales,
    'weekly.json': weekly,
    'monthly.json': monthly,
    'customers.json': customers,
    'orders.json': orders,
    'profile.json': profile,
}

for (const [file, data] of Object.entries(files)) {
    const path = join(OUT, file)
    const isLarge = file === 'daily-sales.json'
    const count = Array.isArray(data) ? data.length : 1
    const body = isLarge ? JSON.stringify(data) : JSON.stringify(data, null, 2)
    writeFileSync(path, `${body}\n`)
    console.log(
        `✓ ${file} (${count} ${Array.isArray(data) ? 'registros' : 'objeto'}, ${(Buffer.byteLength(body) / 1024 / 1024).toFixed(2)} MB)`,
    )
}

console.log('\nDatos mock generados en src/data/')
