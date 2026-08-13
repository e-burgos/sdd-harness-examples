# legacy-shop — instrucciones para agentes

> Este archivo existía **antes** de instalar SDD. Está acá a propósito: `harness configure sdd`
> lo absorbe dentro de `sdd/dual-harness/` en vez de pisarlo, y recién después reemplaza la raíz
> por un symlink. Buscá su contenido en `sdd/dual-harness/AGENTS.md` del ejemplo generado.

## Reglas del proyecto

- El módulo de pagos (`src/payments.js`) no se toca sin aprobación del equipo de finanzas.
- Los precios se guardan en centavos, como enteros. Nunca en float.
- `npm test` usa el runner nativo de Node: no agregar Jest ni Vitest.
