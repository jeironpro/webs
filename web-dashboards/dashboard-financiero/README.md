# Dashboard Financiero «Suma»

Frontend de dashboard financiero para portafolio personal: **ingresos, facturación, suscripciones, estado de pagos y reportes fiscales/contables**.

## ✨ Qué incluye

- **Resumen**: KPIs de ingresos, gastos, utilidad y MRR, más desglose de ingresos y gastos por concepto.
- **Facturas**: tabla de facturas con estado (pagada / pendiente / vencida) y acciones rápidas.
- **Suscripciones**: planes y tabla de suscripciones activas.
- **Pagos**: movimientos recientes con método y estado.
- **Reportes**: IVA, estado de resultados y balance general.
- **Perfil**: datos de la cuenta.

## Stack

| Capa      | Tecnología                      |
| --------- | ------------------------------ |
| Framework | HTML / CSS / JavaScript vanilla |
| Build     | Vite                            |
| Datos     | datos de ejemplo en `app.js`    |
| Testing   | vitest                          |

## 🚀 Arranque

```bash
yarn install
yarn dev
```

## ✅ Scripts

```bash
yarn dev        # servidor de desarrollo
yarn build      # build de producción
yarn preview    # previsualiza el build
yarn lint       # ESLint
yarn test       # vitest
yarn format     # Prettier
```

## 🧱 Estructura

```
app.js           # datos de ejemplo, layout y vistas (resumen, facturas, …)
index.html       # página publicada
index.src.html   # fuente que compila el hub
assets/          # CSS compilado y favicon
```

## Licencia

MIT — ver [LICENSE](LICENSE).
