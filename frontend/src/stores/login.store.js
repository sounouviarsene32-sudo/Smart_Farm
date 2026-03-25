import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    token: null,
  }),

  persist: true,

  actions: {
    login(token) {
        this.token = token
      },
      logout() {
        this.token = null
    },
  },

  getters: {
 // Dans ton login.store.js
getDecodedToken() {
  const token = this.token; // Ou localStorage.getItem('token')

  // Sécurité : Si le token n'existe pas ou est vide, on s'arrête là
  if (!token || typeof token !== 'string' || token === 'undefined') {
    return null; 
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Erreur de décodage du JWT :", error);
    return null;
  }
}
  }
})
