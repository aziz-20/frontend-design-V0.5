<template>
    <div id="app">
        <div class="login-container">
            <h2>Login</h2>
            <form @submit.prevent="login" ref="loginform">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" v-model="form.email" id="email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="form.password" id="password" required />
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" v-model="form.rememberMe" />
                        Remember Me
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</template>
<script>
import { setToken } from '@/utils/auth'
export default {
    data() {
        return {
            form: {
                email: "modi@neu.com",
                password: "123456",
                rememberMe: false,
            },
            redirect: undefined,

        };
    },
    watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
    methods: {
        login() {
            this.$store.dispatch("Login", this.form).then(() => {
                this.$router.push({ path: this.redirect || "/" }).catch(() => { });
            }).catch(() => {
                console.error("error")
            });
        },
    },
};
</script>
          
          
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
}

.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    background-color: #3498db;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #2980b9;
}
</style>
          