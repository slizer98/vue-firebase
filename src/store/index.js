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
    },
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
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
    cerrarSesion({commit}) {
      commit('setUser', null)
      router.push('/login')
      localStorage.removeItem('usuario')
    },
    async ingresoUsuario({commit}, usuario) {
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDdung_-DxQotJkL3hWNtamgU-IrjjLxr0', {
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })
        const userDB = await res.json()
        if(userDB.error) {
          return console.log(userDB.error)
        }
        commit('setUser', userDB)
        router.push('/')
        localStorage.setItem('usuario', JSON.stringify(userDB))
      } catch (error) {
        console.log(error)
      }
    },
    async registrarUsuario({commit}, usuario) {
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDdung_-DxQotJkL3hWNtamgU-IrjjLxr0', {
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })
        const userDB = await res.json()
        console.log(userDB)
        if(userDB.error) {
          console.log(userDB.error)
          return
        }
        commit('setUser', userDB)
        router.push('/')
        localStorage.setItem('usuario', JSON.stringify(userDB))
      } catch (error) {
        console.log(error)
      }
    },
    async cargarLocalStorage({commit, state}) {  
      try {
        if(localStorage.getItem('usuario')) {
          commit('setUser', JSON.parse(localStorage.getItem('usuario')))
        } else {
          return commit('setUser', null)
        }
        const res = await fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas/${state.user.localId}.json?auth=${state.user.idToken}`, {
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
    async setTareas({ commit, state }, tarea) {
      try {
        const res = await fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
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
    deleteTareas({commit, state}, id) {
      try {
        fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas//${state.user.localId}/${id}.json?auth=${state.user.idToken}`, {
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
    async updateTarea({commit, state}, tarea) {
      try {
        const res = await fetch(`https://vue-firebase-2b6f3-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
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
  getters: {
    usuarioAutenticado(state) {
      return !!state.user
    }
  },
  modules: {
  }
})
