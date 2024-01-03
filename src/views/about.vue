<!-- <template>
  <div>
    <input v-model="email" />
    <input v-model="password" />
    <div @click="login" style="width: 50px;height: 0px;">login</div>
    <div @click="openAddEdit" style="width: 50px;height: 0px; margin-left: 200px ;">edit</div>
    <addoredit :open="ope" :mode="mode" :title="title" :init="init"  :fields="fields" @close="closeAddEdit" @submit="onsubmit">
    </addoredit>
    <div style="width: 50px;height: 0px; margin-left: 500px ;">{{ ope }}</div>
    <div style="width: 50px;height: 0px; margin-left: 500px ;">{{ Form }}</div>
    
  </div>
  
</template>
<script>
import { setToken } from '@/utils/auth'
import http from "@/http"
import addoredit from "@/views/components/addoredit/index.vue"

export default {

  components: {
    addoredit
  },

  data() {
    return {
      email: "",
      password: "",
      ope: false,
      mode: "add",
      title: "user",
      Form: {},
      init: {
        username: "",
        email: "",
        password: "",
        roles: [],
        Phone: "",
        country: "",
        state: "",
        city: "",
        postcode: "",
        detail: "",

      }
      ,
      countryList: [
        {
          value: 'Option1',
          label: 'Option1',

        }
        ,
        {
          value: 'Option2',
          label: 'Option2',
        },
      ],
      roles: [
        {
          value: 'Option1',
          label: 'Option1',

        }
        ,
        {
          value: 'Option2',
          label: 'Option2',
        },]
      ,
      fields: [
        { "type": "input", inputtype: "text", name: "username", label: "Username", placeholder: "Enter the username", span: "col-6", icon: 'Calendar' },
        { "type": "input", inputtype: "email", name: "email", label: "E-mail", placeholder: "Enter the E-mail" },
        { "type": "input", inputtype: "password", name: "password", label: "Password", placeholder: "Enter the password", data: null, span: "col-6" },
        {
          "type": "multipleSelect", inputtype: "multipleSelect", name: "roles", label: "Role", placeholder: "select the role", data: [
            {
              value: '1',
              label: 'Level one 1',
              children: [
                {
                  value: '1-1',
                  label: 'Level two 1-1',
                  children: [
                    {
                      value: '1-1-1',
                      label: 'Level three 1-1-1',
                    },
                    {
                      value: '1-1-2',
                      label: 'Level three 1-1-2',
                    }
                  ],
                },
              ],
            },
            {
              value: '2',
              label: 'Level one 2',
              children: [
                {
                  value: '2-1',
                  label: 'Level two 2-1',
                  children: [
                    {
                      value: '2-1-1',
                      label: 'Level three 2-1-1',
                    },
                  ],
                },
                {
                  value: '2-2',
                  label: 'Level two 2-2',
                  children: [
                    {
                      value: '2-2-1',
                      label: 'Level three 2-2-1',
                    },
                  ],
                },
              ],
            },]
        },
        { "type": "input", name: "Phone", label: "Phone", placeholder: "Enter the phone", data: null, inputtype: "phone", span: "col-6" },
        {
          "type": "address", label: { country: "Country", state: "State", city: "City", postcode: "Zipcode", detail: "Detail" }, name: { country: "country", state: "state", city: "city", postcode: "zipcode", detail: "detail" }, data: {
            country: [
              {
                value: 'Option1',
                label: 'Option1',

              }
              ,
              {
                value: 'Option2',
                label: 'Option2',
              },
            ]
          }
        },

      ]

    }
  },
  created() {

  },
  methods: {

    login() {
      this.$http.user.login({
        email: this.email,
        password: this.password
      }).then(res => {
        console.log(res)
        setToken(res.result)
      })
    },
    openAddEdit() {
      // this.ope ? this.ope = false : this.ope = true
      this.ope = true
    },
    closeAddEdit() {
      this.ope = false
    },
    onsubmit(n) {
      this.Form = n
    },
  },

}


</script> 
     -->
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
        email: "",
        password: "",
        rememberMe: false,
      },
      redirect: undefined,
     
    };
  },
  methods: {
    login() {
      this.$store.dispatch("Login", this.form).then(() => {
        this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
      }).catch(() => {
        console.log("error")
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
    