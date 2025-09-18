
# Plataforma de Descubrimiento y Reseñas de Libros

Esta aplicación permite buscar libros, ver detalles y dejar reseñas de manera sencilla. Está desarrollada con Next.js y TypeScript, y cuenta con tests automáticos para asegurar la calidad del código y las funcionalidades principales.

## URL de la aplicación

La aplicación está deployada y funcionando en: https://books-beta-red.vercel.app/ 
Repositorio: https://github.com/ValentinoBadaracco/vercel

## Deploy local

```bash
git clone https://github.com/ValentinoBadaracco/vercel.git
cd vercel
npm install
npm run dev
```

## Variables de entorno necesarias

Debes crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables (ejemplo):

```
# .env.local
API_URL=https://api.ejemplo.com
OTRA_VARIABLE=valor
```


## CI/CD con GitHub Actions

El proyecto cuenta con integración continua y despliegue automático:

- **build.yml**: Corre el build de la app en cada Pull Request a `main`. Si falla, el PR no se puede mergear.
- **test.yml**: Corre los tests en cada Pull Request a `main`. Si algún test falla, el PR no se puede mergear.
- **docker.yml**: Cuando se mergea a `main`, construye y publica una imagen Docker en GitHub Container Registry (ghcr.io).

Puedes ver el estado de los workflows en la pestaña "Actions" de GitHub.

## Deploy en Vercel

El deploy se realiza automáticamente en Vercel con cada push a `main`.
Recuerda configurar las variables de entorno en el dashboard de Vercel.

## Ejecutar con Docker

Puedes construir y correr la app en un contenedor Docker:

```bash
docker build -t my-next-app .
docker run -p 3000:3000 my-next-app
```

## Cómo funcionan los GitHub Actions

1. **Pull Request:**
	- Se ejecutan los workflows de build y test.
	- Si todo pasa, puedes mergear el PR.
2. **Merge a main:**
	- Se ejecuta el workflow de Docker, que publica la imagen en ghcr.io.
3. **Deploy en Vercel:**
	- Vercel detecta el push y hace el deploy automáticamente.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
