# ToDo List Application

Esta es una aplicación de lista de tareas (ToDo List) desarrollada con **Vue 3**, **Vuetify**, **Vuex**, **Vue Router**, y **json-server** para simular la API. La aplicación permite a los usuarios gestionar sus tareas y ofrece autenticación de usuario.

## Requisitos previos

Antes de instalar y ejecutar esta aplicación, asegúrate de tener instalados los siguientes programas:

- **Node.js** (versión 14 o superior)
- **npm** (versión 6 o superior) o **yarn**

## Instalación

1. **Clona este repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/todolist.git

2. **Navega al directorio del proyecto:**

cd todolist 

3. **Instala las dependencias del proyecto:**
    ```Si usas npm:
    npm install

    ```si usas yarn:
    yarn install

## Ejecución de la aplicación

1. **Ejecutar el servidor de desarrollo**

Para iniciar la aplicación en modo de desarrollo, ejecuta el siguiente comando:
npm run serve

Esto iniciará la aplicación Vue y podrás acceder a ella desde tu navegador en la siguiente dirección: **http://localhost:8080**

2. **Iniciar el servidor json-server**

La aplicación usa json-server para simular una API backend. Para iniciarlo, ejecuta:
npm run start

Esto iniciará el servidor json-server en el **puerto 3001** y usará el archivo **db.json** localizado en el directorio **./mock/** */. Podrás acceder a la API desde: **http://localhost:3001**

## Dependencias del proyecto

Las principales dependencias usadas en este proyecto son:

- **Vue 3**: Framework JavaScript progresivo.
- **Vuetify**: Framework de componentes UI basado en Material Design.
- **Vue Router**: Sistema de enrutamiento oficial de Vue.js.
- **Vuex**: Librería de manejo de estado para Vue.js.
- **Axios**: Cliente HTTP para realizar solicitudes a la API simulada con json-server.
- **json-server**: Simulador de API REST que usa un archivo JSON como base de datos.