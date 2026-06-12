# BookZone — E-Commerce de Libros

Aplicación e-commerce completa para venta de libros, construida con Next.js 16, MongoDB y NextAuth.

---

## Características

- Catálogo de libros con filtro por autor
- Vista de detalle con descripción extendida, stock y especificaciones
- Autenticación completa (registro y login)
- Favoritos por usuario
- Carrito de compras con verificación de stock
- Registro de ventas en base de datos
- Descuento automático de stock al comprar
- Internacionalización en 3 idiomas (ES / EN / PT)
- Correo de bienvenida al registrarse
- Reporte mensual de ventas por email (cron job)

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 16 (App Router) | Framework principal |
| TypeScript | Tipado estático |
| MongoDB + Mongoose | Base de datos |
| NextAuth v5 | Autenticación |
| next-intl | Internacionalización |
| Nodemailer | Envío de emails |
| Tailwind CSS 4 | Estilos |
| pnpm | Gestor de paquetes |

---

## Requisitos previos

- Node.js 18+
- pnpm
- MongoDB Atlas (o instancia local)
- Cuenta de Gmail con [App Password](https://myaccount.google.com/apppasswords) habilitada

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd e-commerce

# Instalar dependencias
pnpm install
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```env
# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/bookzone

# NextAuth
NEXTAUTH_SECRET=genera-un-secret-seguro
NEXTAUTH_URL=http://localhost:3000

# Cron job
CRON_SECRET=genera-un-secret-seguro

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-correo@gmail.com
MAIL_PASS=tu-app-password-de-16-caracteres
REPORT_EMAIL=correo-donde-llegan-reportes@gmail.com
```

### Generar secrets seguros

```bash
# Con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# O con OpenSSL
openssl rand -base64 32
```

> **Importante:** `MAIL_PASS` debe ser una [App Password de Google](https://myaccount.google.com/apppasswords), no tu contraseña normal. Requiere tener la verificación en 2 pasos activada.

---

## Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000/es`

---

## Poblar la base de datos

Con el servidor corriendo, llama el endpoint de seed:

```bash
curl http://localhost:3000/api/seed
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── [locale]/           # Rutas con soporte i18n
│   │   ├── page.tsx        # Catálogo principal
│   │   ├── login/          # Inicio de sesión
│   │   ├── register/       # Registro
│   │   ├── favorites/      # Favoritos del usuario
│   │   ├── cart/           # Carrito de compras
│   │   └── products/[id]/  # Detalle de producto
│   └── api/
│       ├── auth/           # NextAuth + registro
│       ├── products/       # CRUD productos
│       ├── cart/           # Gestión del carrito
│       ├── favorites/      # Gestión de favoritos
│       ├── sales/          # Registro de ventas
│       ├── cron/           # Reporte mensual de ventas
│       └── seed/           # Poblar base de datos
├── components/             # Componentes reutilizables
├── context/                # CartContext (conteo del carrito)
├── services/               # Capa de servicios (lógica de negocio)
│   ├── userService.ts
│   ├── productService.ts
│   ├── cartService.ts
│   ├── favoritesService.ts
│   └── salesService.ts
├── models/                 # Modelos de MongoDB
│   ├── User.ts
│   ├── Product.ts
│   ├── Cart.ts
│   ├── Favorite.ts
│   └── Sale.ts
├── lib/
│   ├── auth.ts             # Configuración NextAuth
│   ├── mongodb.ts          # Conexión MongoDB
│   ├── mailer.ts           # Envío de emails
│   └── i18n.ts             # Configuración next-intl
└── messages/               # Traducciones
    ├── es.json
    ├── en.json
    └── pt.json
```

---

## Rutas disponibles

| Ruta | Descripción | Auth requerida |
|---|---|---|
| `/` | Catálogo con filtro por autor | No |
| `/products/[id]` | Detalle del producto | No |
| `/login` | Inicio de sesión | No |
| `/register` | Registro de usuario | No |
| `/favorites` | Productos favoritos | Sí |
| `/cart` | Carrito de compras | Sí |

---

## Probar el cron job manualmente

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron
```

Respuesta exitosa: `{ "message": "Reporte enviado" }`

---

## Despliegue en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Agrega todas las variables de entorno en **Settings → Environment Variables**
3. Cambia `NEXTAUTH_URL` por tu dominio: `https://tu-app.vercel.app`
4. Crea `vercel.json` en la raíz para activar el cron job automático:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 8 * * *"
    }
  ]
}
```

El reporte se enviará todos los días a las 8:00 AM UTC.
