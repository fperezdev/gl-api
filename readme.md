# API Grupo Lagos

API para el desafío técnico de Grupo Lagos hecho por Francisco Perez.
</br>
Se conecta a la API de Itunes para obtener canciones de algún artista y también permite guardar favoritos.

## Tabla de contenidos

- [API Grupo Lagos](#api-grupo-lagos)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Stack Tecnológico](#stack-tecnológico)
  - [Instalación](#instalación)
    - [Levantar localmente](#como-levantar-la-aplicación-localmente)
  - [Consideraciones](#consideraciones)
  - [Contribuyentes](#contribuyentes)

---

## Stack Tecnológico

- Node.js LTS 22.11.0
- Express
- SQLite
- Redis

---

## Instalación

### Como levantar la aplicación localmente

Los siguientes pasos aplican tanto para Windows, Mac o Linux.

1. Clonar el repositorio con `git clone https://github.com/fperezdev/gl-api.git`
2. Correr el comando `npm i` si se clonó por primera vez el proyecto. Esto estando en la carpeta raíz que contiene el `package.json`.
3. Levantar un contenedor de Redis en docker con los siguientes comandos:
   - `docker image pull redis/redis-stack:latest`
   - `docker run -d --name REDIS_CONTAINER_NAME -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`
4. Agregar en un archivo .env la variable de entorno `REDIS_URL=redis://localhost:6379`
5. Ejecutar el comando `npm run dev` para correr localmente la aplicación.

Si se quiere levantar con Docker

1. Crear un network para comunicar los contenedores `docker network create NETWORK_NAME`
2. Pullear imagen de redis `docker image pull redis/redis-stack:latest`
3. Crear imagen de la API `docker build -t API_IMAGE_NAME .`
4. Crear contenedor con la imagen de redis `docker run -d --network NETWORK_NAME --name REDIS_CONTAINER_NAME -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`
5. Crear contenedor con la imagen de la API `docker run -e REDIS_URL=redis://REDIS_CONTAINER_NAME:6379 -d --rm -p 3001:3000 --network NETWORK_NAME --name API_CONTAINER_NAME API_IMAGE_NAME`
6. Ahora se puede consultar en http://localhost:3001

## Consideraciones

Esta aplición cuenta con lo mínimo para cumplir los requerimientos del desafío, temas importantes como la seguridad se han dejado de lado para priorizar las funcionalidades.

---

## Contribuyentes

- Francisco Perez Lefiman
