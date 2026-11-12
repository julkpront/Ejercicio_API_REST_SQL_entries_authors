# API REST con Express y PostgreSQL: Posts del blog (entries y authors)

API REST de un blog sencillo, construida con **Node.js + Express** y una base de datos relacional **PostgreSQL**. Gestiona dos recursos, **entries** (noticias) y **authors** (autores), con operaciones completas de lectura, creación, modificación y borrado.

El proyecto está **desplegado en Render** (servidor y base de datos), así que se puede probar directamente sin instalar nada.

> **URL de la API desplegada:** https://ejercicio-api-rest-sql-entries-authors-shp4.onrender.com

---

## Aviso importante: disponibilidad limitada (30 días)

El proyecto está alojado en el **plan gratuito de Render**, y la base de datos PostgreSQL gratuita **caduca a los 30 días de su creación**.

- **Fecha de creación:** 12 de noviembre de 2026.
- **Disponible hasta, aproximadamente:** **12 de diciembre de 2026**.
- **Pasada esa fecha**, la API dejará de responder datos y **no podrá visualizarse ni probarse** online. El código sigue estando completo en este repositorio y puede ejecutarse en local (ver [Ejecución en local](#ejecución-en-local)).

Otros detalles del plan gratuito a tener en cuenta:

- El servidor **se "duerme"** tras 15 minutos sin recibir visitas. La **primera petición** después de ese tiempo puede tardar cerca de **1 minuto** en responder, porque Render lo está despertando. Las siguientes son rápidas. No es un error.
- Los datos de prueba pueden ser modificados por cualquiera que pruebe la API. Si creas algo, por favor bórralo después.

---

## Resumen de lo realizado

### Aspectos esenciales del ejercicio (todos cumplidos)

| Requisito del enunciado | Estado |
|---|---|
| Evitar entries repetidas por título (`UNIQUE` en la tabla) | Cumplido |
| Rutas de `entries`: `GET` (todas y por email), `PUT`, `DELETE` (y `POST`) | Cumplido |
| Respuesta del `GET` por email con datos del autor y sin `id_entry` | Cumplido |
| Rutas de `authors`: `GET` (todos y por email), `POST`, `PUT`, `DELETE` | Cumplido |
| Carpeta `queries` con `entry.queries` y `author.queries` (incluye crear y borrar tablas) | Cumplido |
| Datos de conexión externalizados en `config/db_pgsql.js` | Cumplido |
| Morgan instalado como logger de peticiones HTTP | Cumplido |
| Base de datos SQL desplegada en Render | Cumplido |
| Servidor Express desplegado en Render | Cumplido |

### Mejoras añadidas (más allá del enunciado)

- **Validación de datos con `express-validator`** en todas las rutas (`GET`, `POST`, `PUT` y `DELETE`) de entries y authors: campos obligatorios, formato de email, URL de imagen válida, longitudes máximas según las columnas de la base de datos y recorte de espacios.
- **Validación contra la base de datos:** al crear o modificar una entry, se comprueba que el **autor exista** (`.custom()` de `express-validator`). Sin esta comprobación, una entry con un email de autor inexistente se guardaba con `id_author` nulo.
- **Restricción `NOT NULL` en `entries.id_author`:** toda entry debe tener autor, también a nivel de base de datos (última línea de defensa).
- **Gestión de errores de PostgreSQL con códigos HTTP claros:** `23505` (valor duplicado) devuelve **409**, y `23503` (borrar un autor con entries asociadas) devuelve **409**, en lugar de un 500 genérico.
- **Seguridad básica:**
  - `helmet`: cabeceras HTTP de seguridad.
  - `express-rate-limit`: máximo de **100 peticiones por minuto por IP** (responde **429** al superarlo).
  - Queries parametrizadas (`$1`, `$2`, ...) para evitar *SQL injection*.
  - Variables sensibles en `.env`, **excluido del repositorio** con `.gitignore`.
- **Arquitectura por capas** (rutas → validación → controlador → modelo → queries), con la responsabilidad de cada archivo bien separada.

---

## Tecnologías

- Node.js y Express 5
- PostgreSQL (librería `pg`, con `Pool`)
- `express-validator`, `helmet`, `express-rate-limit`, `morgan`, `dotenv`
- Despliegue en Render (Web Service + PostgreSQL gratuitos)

---

## Estructura del proyecto

```
.
├── app.js                          # Punto de entrada: middlewares y rutas
├── config/
│   └── db_pgsql.js                 # Conexión (Pool) a PostgreSQL con variables de entorno
├── queries/
│   ├── entries.queries.js          # SQL de entries (incluye crear/borrar tabla)
│   └── author.queries.js           # SQL de authors (incluye crear/borrar tabla)
├── models/
│   ├── entries.model.js            # Ejecuta las queries de entries
│   └── authors.model.js            # Ejecuta las queries de authors
├── controllers/
│   ├── entries.controller.js       # Lógica de las peticiones y códigos de respuesta
│   └── authors.controller.js
├── middlewares/
│   ├── handleValidation.js         # Responde 400 si hay errores de validación
│   ├── entries.validators.js       # Reglas de validación de entries
│   └── authors.validators.js       # Reglas de validación de authors
├── routes/
│   ├── entries.routes.js
│   └── authors.routes.js
├── queries.sql                     # Script original con tablas y datos de ejemplo
└── .env.example                    # Plantilla de variables de entorno
```

---

## Endpoints

URL base: `https://ejercicio-api-rest-sql-entries-authors-shp4.onrender.com`

### Entries (`/api/entries`)

| Método | Ruta | Descripción | Respuesta correcta |
|---|---|---|---|
| `GET` | `/api/entries` | Devuelve todas las entries | 200 |
| `GET` | `/api/entries?email=<email>` | Entries de un autor, con sus datos y sin `id_entry` | 200 |
| `POST` | `/api/entries` | Crea una entry | 201 |
| `PUT` | `/api/entries` | Modifica una entry (se busca por título) | 200 |
| `DELETE` | `/api/entries` | Borra una entry (se busca por título) | 200 |

**Cuerpo del `POST` y del `PUT`** (JSON):

```json
{
  "title": "Título de la noticia",
  "content": "Contenido de la noticia",
  "email": "alejandru@thebridgeschool.es",
  "category": "Tiempo"
}
```

- `title`, `content` y `email` son obligatorios. `category` es opcional (máx. 15 caracteres).
- `email` debe pertenecer a un autor existente.
- En el `PUT`, el `title` identifica la entry a modificar y **no se cambia**.

**Cuerpo del `DELETE`:**

```json
{ "title": "Título de la noticia" }
```

**Ejemplo de respuesta del `GET` por email:**

```json
{
  "title": "Noticia: Un panda suelto por la ciudad",
  "content": "El panda se comió todas las frutas de una tienda",
  "date": "2026-11-12T00:00:00.000Z",
  "category": "Sucesos",
  "name": "Birja",
  "surname": "Rivera",
  "email_author": "birja@thebridgeschool.es",
  "image": "https://randomuser.me/api/portraits/thumb/men/60.jpg"
}
```

### Authors (`/api/authors`)

| Método | Ruta | Descripción | Respuesta correcta |
|---|---|---|---|
| `GET` | `/api/authors` | Devuelve todos los autores | 200 |
| `GET` | `/api/authors?email=<email>` | Devuelve un autor (objeto) | 200 |
| `POST` | `/api/authors` | Crea un autor | 201 |
| `PUT` | `/api/authors` | Actualiza un autor (se busca por email) | 200 |
| `DELETE` | `/api/authors` | Borra un autor (se busca por email) | 200 |

**Cuerpo del `POST` y del `PUT`:**

```json
{
  "name": "Guillermu",
  "surname": "Develaweyer",
  "email": "guillermu@thebridgeschool.es",
  "image": "https://randomuser.me/api/portraits/thumb/men/34.jpg"
}
```

- `name`, `surname` y `email` son obligatorios. `image` es opcional, pero si se envía debe ser una URL válida.
- En el `PUT`, el `email` identifica al autor y **no se cambia**.

**Cuerpo del `DELETE`:**

```json
{ "email": "guillermu@thebridgeschool.es" }
```

### Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Operación correcta |
| 201 | Recurso creado |
| 400 | Datos no válidos (la respuesta incluye la lista de errores) |
| 404 | No existe el recurso buscado (título o email) |
| 409 | Conflicto: título o email duplicado, o autor con entries asociadas |
| 429 | Demasiadas peticiones (límite de 100 por minuto) |
| 500 | Error interno del servidor |

---

## Cómo probarla (durante el mes de disponibilidad)

Las peticiones `GET` pueden hacerse directamente **desde el navegador**. Para `POST`, `PUT` y `DELETE` se recomienda **Postman** (o Thunder Client, o `curl`): método correspondiente, pestaña **Body → raw → JSON**.

### Pruebas de lectura (navegador)

1. Todas las entries: `/api/entries`
2. Entries de un autor: `/api/entries?email=birja@thebridgeschool.es`
3. Todos los autores: `/api/authors`
4. Un autor concreto: `/api/authors?email=alejandru@thebridgeschool.es`
5. Autor inexistente (debe dar **404**): `/api/authors?email=noexiste@x.es`
6. Email con formato incorrecto (debe dar **400**): `/api/entries?email=hola`

### Pruebas de escritura (Postman)

Orden sugerido, para dejar los datos como estaban:

1. **Crear un autor** (`POST /api/authors`) con el cuerpo de ejemplo. Debe dar **201** y `usuario creado: ...`.
2. **Repetir la misma petición.** Debe dar **409** (email duplicado).
3. **Actualizar el autor** (`PUT /api/authors`) cambiando `name` o `image`. Debe dar **200**.
4. **Crear una entry** (`POST /api/entries`) asociada a ese autor. Debe dar **201**.
5. **Intentar borrar el autor** (`DELETE /api/authors`). Debe dar **409**, porque tiene una entry asociada.
6. **Borrar la entry** (`DELETE /api/entries`) con su título. Debe dar **200**.
7. **Borrar el autor** (`DELETE /api/authors`). Ahora debe dar **200**.

### Pruebas de validación (todas deben dar 400)

- `POST /api/entries` con el cuerpo vacío `{}`.
- `POST /api/entries` con `"email": "hola"`.
- `POST /api/entries` con una `category` de más de 15 caracteres.
- `POST /api/entries` con un email con formato válido pero de un **autor que no existe** (por ejemplo, `nadie@noexiste.es`).
- `POST /api/authors` con `"image": "no-es-una-url"`.
- `DELETE /api/entries` con cuerpo vacío.

### Prueba del límite de peticiones

Superar las 100 peticiones por minuto desde la misma IP devuelve **429** con el mensaje `Demasiadas peticiones, inténtalo de nuevo en un minuto`.

---

## Ejecución en local

**Requisitos:** Node.js 18 o superior, PostgreSQL (por ejemplo, en Docker) y pgAdmin 4 (opcional).

1. Clonar el repositorio e instalar dependencias:

   ```bash
   git clone <url-del-repositorio>
   cd Ejercicio_API_REST_SQL_entries_authors
   npm install
   ```

2. Crear en PostgreSQL las tablas y los datos de ejemplo ejecutando `queries.sql` (por ejemplo, desde pgAdmin 4). Para respetar la unicidad del título:

   ```sql
   ALTER TABLE entries ADD CONSTRAINT entries_titulo_unico UNIQUE (title);
   ALTER TABLE entries ALTER COLUMN id_author SET NOT NULL;
   ```

3. Crear el archivo `.env` a partir de `.env.example`:

   ```
   DB_HOST=localhost
   DB_USER=postgres
   DB_DATABASE=postgres
   DB_PORT=5432
   DB_PASSWORD=<tu_contraseña>
   ```

   Si la base de datos exige conexión cifrada (como la de Render desde fuera de su red), añadir también `DB_SSL=true`.

4. Arrancar el servidor:

   ```bash
   npm start
   ```

   La API queda disponible en `http://localhost:3000`.

---

## Despliegue

- **Base de datos:** PostgreSQL gratuito de Render. Las tablas se crearon con las queries de creación guardadas en `queries/`, y se cargaron los mismos datos de ejemplo de `queries.sql`.
- **Servidor:** Web Service gratuito de Render conectado a este repositorio.
  - *Build command:* `npm install`
  - *Start command:* `node app.js`
  - Variables de entorno: `DB_HOST`, `DB_USER`, `DB_DATABASE`, `DB_PORT` y `DB_PASSWORD` (configuradas en el panel de Render, nunca en el repositorio).
- Al estar detrás del proxy de Render, se usa `app.set('trust proxy', 1)` para que el límite de peticiones identifique correctamente la IP de cada visitante.

---

## Limitaciones conocidas

- La API **no tiene autenticación**: cualquiera con la URL puede crear, modificar o borrar datos. Es un ejercicio de clase, no un servicio en producción.
- El plan gratuito de Render tiene las limitaciones indicadas al principio (caducidad de la base de datos a los 30 días y servidor que se duerme por inactividad).
