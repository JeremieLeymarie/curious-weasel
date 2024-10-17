<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-center text-gray-700 mb-6">Register</h1>
      <form @submit.prevent="registerUser" class="space-y-6">
        <div class="space-y-1">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" v-model="user.username" class="input-field" required />
        </div>

        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="user.email" class="input-field" required />
        </div>

        <div class="space-y-1">
          <label for="hash_password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="hash_password" v-model="user.hash_password"
          class="input-field"
          required
          />
        </div>

        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Register
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
  name: 'UserRegister',
  data() {
    return {
      user: {
        username: '',
        email: '',
        hash_password: ''  // Utilisation du champ hash_password pour le mot de passe en clair
      },
      error: null
    };
  },
  methods: {
    async registerUser() {
      try {
        // Envoyer le mot de passe en clair dans le champ hash_password
        const response = await axios.post('http://localhost:4000/api/users/register', {
          user: this.user
        });
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        this.$router.push('/');
      } catch (err) {
        console.error(err.response.data);
        this.error = err.response.data.errors || 'Registration failed. Please try again.';
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
