# GitHub User Explorer

Aplicación web ligera desarrollada como parte de una prueba técnica de Frontend.  
Permite buscar usuarios públicos de GitHub por nombre de usuario y visualizar su información principal en una tarjeta reutilizable, utilizando la API pública de GitHub.

---

## 1. Objetivo

El objetivo de este ejercicio es demostrar buenas prácticas de desarrollo Frontend con **TypeScript** y **Web Components**, evitando el uso de frameworks (Angular, React, etc.), pero manteniendo una arquitectura clara, testeable y escalable.

---

## 2. Vista previa

/docs/screenshot.png

---

## 3. Requisitos funcionales cubiertos

La aplicación cumple con los requisitos solicitados en la prueba técnica: README

- Búsqueda por nombre de usuario de GitHub.
- Consumo de la API REST: `https://api.github.com/users/{username}`.
- Visualización de una tarjeta reutilizable con:
  - Avatar
  - Nombre
  - Bio
  - Número de repositorios públicos
  - Enlace al perfil de GitHub

- Manejo de estados y errores:
  - Usuario no encontrado (404)
  - Errores genéricos de red / API
  - Estado inicial sin resultados
  - Estado de carga (loading) mientras se consulta la API

- Diseño responsive para desktop y mobile.
- Comunicación entre componentes mediante eventos personalizados (Custom Events).

---

## 4. Stack tecnológico

- Lenguaje: TypeScript
- UI: Web Components (Custom Elements + Shadow DOM)
- Bundler / Dev server: Vite
- Testing: Vitest para tests unitarios

---

## 5. Arquitectura y organización

Aunque se trata de una aplicación pequeña, el código se organizó inspirándose en Clean Architecture y principios SOLID, buscando una separación clara de responsabilidades y un bajo acoplamiento entre capas. README

**Capas principales**
- Core *(Dominio + servicios)*
  - `GitHubUser` como modelo de dominio.
  - `mapGitHubUser` para desacoplar el contrato de la API del modelo interno.
  - `GitHubUserService` encapsula las llamadas a la API de GitHub y el manejo de errores.

- Presentación (UI) – Web Components

  - `<app-root>`: componente raíz, orquesta el estado de la aplicación (usuario, loading, error).
  - `<github-search-form>`: formulario de búsqueda, emite el evento personalizado `search-user`.
  - `<github-user-card>`: tarjeta reutilizable encargada de mostrar:
    - Estados: inicial, loading, error, resultado.
    - Información del usuario cuando la búsqueda es exitosa.

**Principios aplicados**
- Responsabilidad Única *(SRP – SOLID)*:
  Cada componente/clase concentra una única responsabilidad *(servicio de datos, formulario, tarjeta, orquestador)*.

- Separación de preocupaciones:
  El acceso a datos está en `GitHubUserService`; la UI consume el modelo de dominio sin conocer detalles de la API.

- Tipado estático con TypeScript:
  El modelo GitHubUser y las funciones asociadas están fuertemente tipadas para facilitar mantenimiento y detectar errores en tiempo de compilación.

- Eventos personalizados:
  La comunicación entre `<github-search-form>` y `<app-root>` se realiza mediante CustomEvent, evitando acoplar los componentes entre sí.

---

## 6. Estructura de carpetas

src/
  core/
    services/
      github-user.service.ts   # Llamadas a la API de GitHub + manejo de errores
    types/
      github-user.ts           # Modelo de dominio + mapper desde la API

  components/
    app-root.ts                # Componente raíz y gestión de estado
    search-form.ts             # Formulario de búsqueda, emite 'search-user'
    user-card.ts               # Tarjeta de usuario, muestra datos y estados

  index.css                    # Estilos globales *(tokens de diseño y layout base)*
  main.ts                      # Punto de entrada, registra `<app-root>`

---

## 7. Ejecución del proyecto

- Requisitos previos
  
  - Node.js *(versión recomendada: LTS 18+)*
  - npm / pnpm / yarn

- Instalación

  - npm install

- Entorno de desarrollo

  - npm run dev

  La aplicación quedará disponible en la URL que indique Vite `(por defecto, http://localhost:5173)`.

- Build de producción
  - npm run build
  - npm run preview

---

## 8. Tests

El proyecto utiliza Vitest para tests unitarios sobre la capa de dominio.

- npm run test

Actualmente se incluye un test para el mapper `mapGitHubUser`, que valida la conversión desde la respuesta cruda de la API de GitHub al modelo de dominio `GitHubUser`.

---

## 9. Decisiones de diseño

- Se utilizaron Web Components para demostrar la capacidad de construir una UI reutilizable sin frameworks, manteniendo al mismo tiempo una arquitectura clara y testeable. README

- La API pública de GitHub se consume desde una capa de servicio dedicada (GitHubUserService), lo que permite aislar el código de infraestructura de la UI.

- La interfaz se diseñó inspirándose en layouts de productos de GitHub (pricing, marketplace, landing pages), con:

  - Fondo gris claro (#f6f8fa) y tarjetas blancas con borde sutil.
  - Jerarquía tipográfica clara (título, subtítulo, metadatos).
  - Componentes centrados, con suficiente espacio en blanco para mejorar legibilidad.

- Se añadieron estados de error y mensajes de ayuda para guiar al usuario cuando la búsqueda está vacía, falla o no encuentra resultados.

---

## 10. Posibles extensiones futuras

Algunas mejoras que podrían incorporarse si el alcance se ampliara:

  - Listar y paginar los repositorios públicos del usuario.
  - Añadir selector de tema (light / dark) manteniendo el mismo sistema de design tokens.
  - Gestionar límites de rate-limit de la GitHub API con mensajes específicos.
  - Añadir tests E2E (por ejemplo, con Playwright) sobre la experiencia completa.
  - Internacionalización (i18n) para soportar múltiples idiomas.

---

## 11. Autor

Desarrollado por Marcos Flores como parte de una prueba técnica para el rol de Desarrollador Frontend.