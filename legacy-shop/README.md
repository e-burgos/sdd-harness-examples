# legacy-shop

API de storefront que ya existía antes de SDD. En este repo de ejemplos sirve de **semilla**:
`scripts/generate.mjs` la copia a un directorio temporal y le corre

```bash
npx @e-burgos/sdd-harness configure sdd --name legacy-shop --description "..."
```

El resultado queda en [`../../legacy-shop`](../../legacy-shop) — el mismo código, más el sistema
SDD instalado encima y sin nada perdido.
