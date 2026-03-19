import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    token: null,
  }),

  persist: true,

  actions: {
    login(newuser) {
        this.token = newuser.token
      },
      logout() {
        this.token = null
    },
  },

  getters: {
    getDecodedToken: (state) => {
      const token = state.token
      return token ? jwtDecode(token) : null
    }
  }
})
