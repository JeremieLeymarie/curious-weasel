<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-center text-gray-700 mb-6">Sign In</h1>
      <form @submit.prevent="signInUser" class="space-y-6">
        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="user.email" class="input-field" required />
        </div>

        <div class="space-y-1">
          <label for="hash_password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="hash_password" v-model="user.hash_password" class="input-field" required />
        </div>

        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Sign In
        </button>
      </form>

      <div v-if="error" class="text-red-500 font-semibold text-center mt-4">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignIn',
  data() {
    return {
      user: {
        email: '',
        hash_password: '' // Utilisation du champ hash_password pour le mot de passe en clair
      },
      error: null
    };
  },
  mounted() {
    // Vérifier si un utilisateur est déjà connecté
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log('User already connected with ID:', storedUserId);
      // Redirection ou affichage d'un message si déjà connecté
    }
  },
  methods: {
    async signInUser() {
      try {
        const storedUserId = localStorage.getItem('userId');

        // Envoyer la requête pour connecter le nouvel utilisateur
        const response = await axios.post('http://localhost:4000/api/users/sign_in', {
          user: this.user
        });

        const { id, token } = response.data;

        if (storedUserId && storedUserId !== id.toString()) {
          // Si l'utilisateur connecté est différent, vider le localStorage
          console.log('Different user detected. Clearing localStorage.');
          localStorage.clear();
        }

        // Stocker le nouveau token et l'ID utilisateur dans le localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id.toString());

        console.log('User connected:', response.data);

        // Rediriger vers la page d'accueil ou autre après connexion
        this.$router.push('/');
      } catch (err) {
        console.error(err.response.data);
        this.error = err.response.data.errors || 'Sign in failed. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150;
}
</style>
