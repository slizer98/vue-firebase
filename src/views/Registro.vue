<template>
  <h1 class="my-5">Registro de usuarios</h1>
  <form class="" @submit.prevent="procesarFormulario()">
    <input
      type="email"
      placeholder="Email"
      class="form-control my-2"
      v-model.trim="email"
      >
    <input
      type="password"
      class="form-control my-2"
      placeholder="Password"
      v-model.trim="pass1"
      >
    <input
      type="password"
      class="form-control my-2"
      placeholder="Repetir Password"
      v-model.trim="pass2"
      >
    <button type="submit" class="btn btn-primary" :disabled="bloquear">Registrar</button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            email: 'erick@prueba.com',
            pass1: '123456',
            pass2: '123456',
            emailRegex: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
        }
    },
    computed: {
        bloquear() {
            if(!this.emailRegex.test(this.email)) {
                return true
            }
            if(this.pass1.length > 5 && this.pass1 === this.pass2) {
                return false
            }
            return true
        }
    },
    methods: {
      ...mapActions(['registrarUsuario']),
      procesarFormulario() {
        this.registrarUsuario({email: this.email, password: this.pass1})
        this.email = ''
        this.pass1 = ''
        this.pass2 = ''
      }
    },
}
</script>

