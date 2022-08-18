import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    tareas: [],
    tarea: {
      id: '',
      nombre: '',
      categorias: [],
      estado: '',
      numero: 0
    }
  },
  mutations: {
    cargar(state, payload) {
      state.tareas = payload
    },
    set(state, payload) {
      state.tareas.push(payload);
    },
    eliminar(state, payload) {
      state.tareas = state.tareas.filter(tarea => tarea.id !== payload) 
    },
    tarea(state, payload) {
      if(!state.tareas.find(tarea => tarea.id === payload)) {
        router.push('/error')
        return
      }
      state.tarea = state.tareas.find(tarea => tarea.id === payload)
    },
    update(state, payload) {
      state.tareas = state.tareas.map(tarea => tarea.id === payload.id ? payload : tarea)
      router.push('/')
    }
  },
  actions: {
    async cargarLocalStorage({commit}) {  
      try {
        const res = await fetch('https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas.json', {
          method: 'GET'
        })
        const dataDB = await res.json()
        const arrayTareas = []
        for(let id in dataDB) {
          arrayTareas.push(dataDB[id])
        }
        commit('cargar', arrayTareas)

      } catch (error) {
        console.log(error)
      }
    },
    async setTareas({ commit }, tarea) {
      try {
        const res = await fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas/${tarea.id}.json`, {
          method: 'PUT',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify(tarea),
        })

        const dataDB = await res.json()
        commit('set', dataDB);
        
      } catch (error) {
        console.log(error)
      }
    },
    deleteTareas({commit}, id) {
      try {
        fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas/${id}.json`, {
          method: 'DELETE',
        })
        commit('eliminar', id)

      } catch (error) {
        console.log(error)
      }
    },
    setTarea({commit}, id) {
      commit('tarea', id)
    },
    async updateTarea({commit}, tarea) {
      try {
        const res = await fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas/${tarea.id}.json`, {
          method: 'PATCH',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify(tarea)
        })
        const dataDB = await res.json()
        commit('update', dataDB)

      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  }
})
