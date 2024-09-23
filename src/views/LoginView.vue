<template>
  <div class="login-container">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-card-title class="text-h5 text-center">Iniciar sesión</v-card-title>

      <div class="text-subtitle-1 text-medium-emphasis">Correo electrónico</div>
      <InputComponent
        id="email"
        label="Correo Electrónico"
        type="email"
        v-model="usuario.email"
        placeholder="Ingresa tu correo"
      />

      <span v-if="emailError" class="error">{{ emailError }}</span>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Contraseña
      </div>
      <InputComponent
        id="pass"
        label="Contraseña"
        type="password"
        v-model="usuario.password"
        placeholder="Ingresa tu contraseña"
      />

      <span v-if="passwordError" class="error">{{ passwordError }}</span>

      <div class="text-center mt-2">
        <ButtonComponent type="primary" @click="login" :disabled="disBtn"
          >Iniciar sesión</ButtonComponent
        >
      </div>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="/register"
          rel="noopener noreferrer"
        >
          Registrate ahora <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
    <AlertComponent
        :type="alert.type"
        duration="5000"
        v-model="alert.show"
        :message="alert.mensaje"
      ></AlertComponent>
  </div>
</template>

<script>
import ButtonComponent from "../components/ButtonComponent.vue";
import InputComponent from "../components/InputComponent.vue";
import AlertComponent from "../components/AlertComponent.vue";
import axios from "axios";

export default {
  name: "LoginView",

  components: {
    ButtonComponent,
    InputComponent,
    AlertComponent,
  },
  data() {
    return {
      usuario: {
        email: "",
        password: "",
      },
      alert: {
        mensaje: "",
        dismissible: true,
        type: "",
        show: false,
      },
      emailError: "",
      passwordError: "",
      disBtn: false,
    };
  },
  methods: {
    validateEmail() {
      this.disBtn = true;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.usuario.email) {
        this.emailError = "El correo es requerido.";
        this.disBtn = false;
        return false;
      } else if (!emailPattern.test(this.usuario.email)) {
        this.emailError = "El correo no tiene un formato válido.";
        this.disBtn = false;
        return false;
      }
      this.emailError = "";
      this.disBtn = false;
      return true;
    },
    validatePassword() {
      this.disBtn = true;
      if (!this.usuario.password) {
        this.passwordError = "La contraseña es requerida.";
        this.disBtn = false;
        return false;
      } else if (this.usuario.password.length < 5 || this.usuario.password.length > 8) {
        this.passwordError = "La contraseña debe tener entre 5-8 caracteres.";
        this.disBtn = false;
        return false;
      }
      this.passwordError = "";
      this.disBtn = false;
      return true;
    },
    async login() {
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();

      if (isEmailValid && isPasswordValid) {
        await axios.get("http://localhost:3001/users?email="+this.usuario.email+"&password="+this.usuario.password)
          .then((response) => {
            if (response.data.length === 0) {
              this.alert.show = true;
              this.alert.type = "error";
              this.alert.mensaje = "Email o contraseña incorrecto.";
            }else {
              localStorage.setItem("session", JSON.stringify("true"));
              localStorage.setItem("userId", JSON.stringify(response.data[0].id));
              this.$store.dispatch("cargarUsuario", response.data);
              this.$router.push("/todolist");
            }
          });
      }
    },
  },
  async beforeCreate() {
    let session = JSON.parse(localStorage.getItem("session"));
    if ((await session) === "true") {
      this.$router.push("/todolist");
    }
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
}

.error {
  color: red;
  font-size: 10px;
  min-height: 20px;
  display: block;
}

v-card {
  max-width: 448px;
  width: 100%;
}

@media (max-width: 1920) {
  v-card {
  max-width: 600px;
  width: 100%;
}
}

@media (max-width: 600px) {
  .login-container {
    padding: 5px;
  }

  v-card {
    width: 100%;
    max-width: 448px;
  }
}
</style>
