# Star Wars Explorer

## Descripción

La **Star Wars Explorer** es una aplicación interactiva que permite a los usuarios explorar el vasto universo de Star Wars. A través de una interfaz fácil de usar, los fanáticos pueden obtener detalles fascinantes sobre personajes, planetas, naves espaciales y películas icónicas de esta saga galáctica. Los usuarios pueden profundizar en la historia y especificaciones de cada entidad, gracias a datos proporcionados por la API pública de Star Wars (SWAPI), combinada con funcionalidades propias que enriquecen la experiencia.

### Funcionalidades principales

- **Personajes**: Muestra información detallada de personajes, incluyendo su altura, color de piel, género, y mundo natal.
- **Planetas**: Proporciona información sobre los planetas, tales como clima, gravedad, periodo de rotación y más.
- **Naves Espaciales**: Muestra especificaciones técnicas de naves como el hiperimpulso, velocidad máxima, capacidad de carga y tripulación.
- **Películas**: Ofrece detalles sobre cada película de Star Wars, incluyendo el episodio, director, productor y la famosa introducción de texto.
- **Elementos Relacionados**: Facilita la exploración entre personajes, naves, películas, y planetas relacionados, mejorando la inmersión en el universo de Star Wars.

### API

La aplicación interactúa con una API interna basada en **Express**, que a su vez se sincroniza con la **API pública de Star Wars (SWAPI)**. Esta API interna ofrece varias rutas para gestionar los recursos de personajes, planetas, naves y películas.

#### Rutas de la API

- **Personajes**:
  - `GET /people`: Devuelve una lista de todos los personajes.
  - `GET /people/:id`: Obtiene un personaje específico por su ID.
  - `POST /people/save`: Guarda o actualiza personajes en la base de datos. Se ejecuta diariamente en un **cronjob**. Si el personaje ya existe, no lo guarda; de lo contrario, lo agrega o actualiza si es necesario.

- **Películas**:
  - `GET /films`: Devuelve una lista de todas las películas.
  - `GET /films/:id`: Obtiene los detalles de una película específica por su ID.
  - `POST /films/save`: Guarda o actualiza películas en la base de datos. Funciona de forma similar a los personajes, evitando duplicados o actualizando registros según sea necesario.

- **Naves Espaciales**:
  - `GET /starships`: Devuelve una lista de todas las naves espaciales.
  - `GET /starships/:id`: Obtiene los detalles de una nave específica por su ID.
  - `POST /starships/save`: Guarda o actualiza naves espaciales en la base de datos mediante el **cronjob** diario.

- **Planetas**:
  - `GET /planets`: Devuelve una lista de todos los planetas.
  - `GET /planets/:id`: Obtiene los detalles de un planeta específico por su ID.
  - `POST /planets/save`: Guarda o actualiza planetas en la base de datos de manera similar a los otros recursos, evitando duplicados o actualizando registros.

### Cronjob

La aplicación utiliza un **cronjob** que se ejecuta diariamente para sincronizar los datos de la API de Star Wars con la base de datos interna. Este proceso asegura que los nuevos elementos se agreguen y los existentes se mantengan actualizados. La sincronización evita duplicados, lo que garantiza que la información sea precisa y esté al día sin necesidad de intervención manual.

### Tecnología utilizada

- **React**: Frontend basado en componentes para una experiencia de usuario interactiva y dinámica.
- **Redux**: Para la gestión del estado global de la aplicación, facilitando el flujo de datos entre los componentes.
- **Axios**: Para realizar peticiones HTTP a la API y obtener los datos de los recursos de Star Wars.
- **React Router**: Para manejar la navegación interna en la aplicación y permitir la exploración fluida entre los diferentes recursos.
- **TypeScript**: Utilizado para tipado estático y mayor robustez del código.
- **Express.js**: Para crear y gestionar la API interna que interactúa con la base de datos.
- **MongoDB**: Base de datos utilizada para almacenar y gestionar la información sincronizada.
