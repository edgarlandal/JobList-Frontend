# Joblist

Frontend con Next.js, React y TypeScript para registrar y gestionar postulaciones.

## Desarrollo

```sh
npm install
npm run dev
```

Copia `.env.example` a `.env` y configura:

```dotenv
FASTAPI_URL=http://localhost:8000/api/v1
APP_ORIGIN=http://localhost:3000
```

Inicia FastAPI por separado. `APP_ORIGIN` debe coincidir con la direcci?n del
navegador. Reinicia Next.js cuando cambies estas variables.

## Organizaci?n

- `app/`: p?ginas y rutas HTTP de Next.js.
- `app/dashboard/jobs/use-jobs.ts`: carga, cancelaci?n de peticiones, paginaci?n y borrado.
- `app/dashboard/jobs/components/`: tabla, men? por fila y formularios de jobs.
- `components/auth/`: tarjeta de autenticaci?n y campo de contrase?a compartidos.
- `components/discard-changes-dialog.tsx`: confirmaci?n de cambios sin guardar.
- `components/ui/`: componentes base de interfaz.
- `service/`: llamadas HTTP y traducci?n entre los modelos de frontend y backend.
- `lib/server/`: conexi?n con FastAPI, comprobaci?n de origen y cookies de sesi?n.
- `lib/api-error.ts`: extracci?n com?n de mensajes de error.
- `types/`: contratos de datos compartidos.
- `tests/`: pruebas de los contratos HTTP con respuestas simuladas.

El navegador llama a `/api` en Next.js. Las rutas del servidor a?aden el token
de la cookie HttpOnly al comunicarse con FastAPI. Los jobs usan paginaci?n
`limit`/`offset`, POST para crear, PATCH para editar y DELETE para eliminar.
No hay datos de ejemplo como alternativa a la API.

## Verificaci?n

```sh
npm run lint
node node_modules/typescript/bin/tsc --noEmit --incremental false
node --test tests/api-connection.test.cjs
npm run build
```

Las pruebas simulan el backend; no modifican registros reales.

## Criterios del refactor

Se separ? la gesti?n de datos de la p?gina de jobs y se extrajeron las piezas
que se repet?an en autenticaci?n, selectores y di?logos. Los formularios conservan
sus estados locales; no se a?adi? una abstracci?n gen?rica de formularios.
Se retiraron `use-pagination`, los tipos de validaci?n de login sin uso y
`jsconfig.json`, cuyo alias ya est? definido en `tsconfig.json`.

La paginaci?n ahora est? tipada y aplica el bloqueo de interacci?n durante el
borrado. La edici?n permite conservar un per?odo salarial no especificado.
El hook de pantalla m?vil usa una suscripci?n con un valor estable para SSR.

## Hallazgos pendientes

- `/dashboard` todav?a es una p?gina vac?a; Interviews y Profile son opciones futuras.
- La comprobaci?n de usuario para redirigir est? en `/`; el layout del dashboard
  no realiza esa comprobaci?n. Las rutas de datos s? exigen una cookie de sesi?n
  y FastAPI valida el token.
- Se almacena el refresh token, pero no hay un flujo de renovaci?n o cierre de sesi?n.
- La paginaci?n muestra un bot?n por p?gina; para vol?menes grandes conviene limitar
  los botones visibles.
- Falta cobertura de interacci?n en navegador para men?s, drawers y formularios.

Estos puntos requieren trabajo funcional adicional y no se cambiaron como parte
de la reorganizaci?n del c?digo.
