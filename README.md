# Hue Show Creator · v2

Aplicación Vue 3 sobre Nuxt 4, con Pinia, Tailwind CSS y backend Nitro.

## Desarrollo

Usa Node.js 22 (último parche LTS) y npm. Con nvm: `nvm use`.

```sh
npm install
npm run dev
```

La aplicación abre en http://localhost:3000. `GET /api/health` devuelve
`{"status":"ok","service":"hue-sc-app"}` y permite verificar el backend.

## Producción

```sh
npm run build
npm run start
```

`npm run preview` permite revisar el build localmente. Despliega `.output/`
en un servidor Node.js; usa `PORT` y `HOST` para configurar el proceso.
Este proyecto requiere un servidor para ejecutar las rutas API.

## Estructura

- `nuxt.config.js`: Nuxt, estilos, Pinia y servidor.
- `src/app.vue`: raíz de la aplicación.
- `src/pages/`: rutas automáticas de Nuxt.
- `src/components/`, `src/stores/`, `src/composables/`: interfaz y lógica Vue existentes.
- `server/api/`: endpoints del backend Nitro.
- `public/`: archivos públicos.

Nuxt renderiza la página en el servidor y la hidrata en el navegador.
Las secuencias y datos del bridge siguen en `localStorage`, separados por
usuario. Los usuarios se guardan en SQLite y el acceso requiere una sesión. Las llamadas de control Hue siguen saliendo
del navegador al bridge en la red local, con las mismas restricciones de
conectividad y HTTP del proyecto original.

Para agregar backend, crea archivos como `server/api/example.get.ts`.
No guardes credenciales en `public/` ni en configuración pública de Nuxt.

## Autenticación

Registro en `/register` e inicio de sesión en `/login`. El registro inicia
sesión automáticamente. Las contraseñas requieren 12–128 caracteres y se
almacenan con hash scrypt; la sesión usa una cookie cifrada HttpOnly,
SameSite=Lax y dura siete días. Las cookies usan Secure en producción, que requiere HTTPS.
Hay validación en el servidor, comprobación de origen y límites de intentos
por IP y correo (ventanas de 15 minutos, compartidas en SQLite).

### Configuración

```sh
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Pega el resultado en `NUXT_SESSION_PASSWORD`. No lo publiques ni lo cambies
entre reinicios salvo que quieras invalidar todas las sesiones.
En desarrollo, el módulo genera un secreto si no hay uno configurado.
`npm run start` carga `.env` si existe; en despliegue también puedes definir
las variables en el entorno. El servidor exige un secreto de al menos
32 caracteres para arrancar.

`NUXT_AUTH_DATABASE_PATH` apunta al archivo SQLite (por defecto
`.data/auth.sqlite`). Su directorio debe ser privado, escribible y persistente;
haz copias de seguridad. La base usa el módulo nativo `node:sqlite` de Node 22,
que en esta versión todavía emite un aviso de API experimental. Esta configuración
es para un servidor Node con disco persistente; no para instancias sin disco
ni varios servidores con bases independientes.

### Endpoints y pruebas

- `POST /api/auth/register`: `{ "email": "...", "password": "..." }`.
- `POST /api/auth/login`: mismo cuerpo.
- `GET /api/_auth/session`: usuario de la sesión, sin hash de contraseña.
- `DELETE /api/_auth/session`: cerrar sesión.

Las páginas privadas redirigen a `/login`; el middleware del servidor exige
sesión para nuevas rutas `/api/`, salvo la lista pública explícita.

```sh
npm run build
npm run test:auth
```

Las pruebas usan una base temporal y comprueban registro, validación,
correo duplicado, login, cookies, logout, protección de rutas, persistencia,
CSRF y límites de intentos. No escriben usuarios en la base de desarrollo.

Los datos locales antiguos (`savedSequences`, `bridgeSettings`) permanecen en
el navegador sin asignarse automáticamente a una cuenta. Los datos nuevos
usan claves con el ID del usuario. No se sincronizan entre dispositivos.

### Google más adelante

`nuxt-auth-utils` ya incluye Google OAuth. La tabla `auth_identities` separa
proveedor e identificador externo del usuario, y `password_hash` admite NULL
para futuras cuentas de Google. La siguiente etapa agregará el endpoint OAuth,
credenciales de Google y el botón de acceso. Para vincular una cuenta existente
se requerirá una sesión o verificación explícita; no se vincularán cuentas
solo por coincidir el correo.

Este alcance no incluye verificación de correo ni recuperación de contraseña.
