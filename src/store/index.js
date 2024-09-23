import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    session:false,
    categories: [],
    status:[],
    tasksComplete: [],
    tasksToDo: []
  },
  getters: {
    getSession(state){
      return state.session;
    },
    getUsuario(state){
      return state.usuario;
    },
    getCategories(state){
      return state.categories
    },
    getStatus(state){
      return state.status
    },
    getTasksComplete(state){
      return state.tasksComplete
    },
    getTasksToDo(state){
      return state.ToDo
    }
  },
  mutations: {
    setUsuario(state, array){
      state.usuario = array;
      state.session = true;
    },
    setCategories(state, array){
      state.categories = array;
    },
    setStatus(state, array){
      state.status = array;
    },
    setTasksComplete(state, array){
      state.tasksComplete = array;
    },
    setTasksToDo(state, array){
      state.tasksToDo = array;
    }
  },
  actions: {
    cargarUsuario({commit}, data){
      commit('setUsuario',data)
    },
    async upCategories({commit}){
      try{
        const response = await axios.get("http://localhost:3001/Categories")
        commit('setCategories', response.data);
      } catch{
        console.log('Error al cargar categorias')
      }
    },
    async upStatus({commit}){
      try{
        const response = await axios.get("http://localhost:3001/status")
        commit('setStatus', response.data);
        
      } catch{
        console.log('Error al cargar los estados')
      }
    },
    async upTasks({commit}, userId){
      try {
        let response
        response = await axios.get("http://localhost:3001/tasks?userId="+userId)
        if (response && response.data) {
          const tasks = response.data;
    
          const tasksComplete = tasks.filter(task => task.statusId == 2);
          const tasksToDo = tasks.filter(task => task.statusId == 1);  

          commit('setTasksComplete', tasksComplete);
          commit('setTasksToDo', tasksToDo);
        }
      } catch {
        console.log('Error al cargar las tareas.')
      }
    },

  },
  modules: {
  }
})
