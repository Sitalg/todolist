<template>
  <div class="register-container">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="400" rounded="lg">
      <v-card-title class="text-h5 text-center">Registrarse</v-card-title>

      <AlertComponent
        class="mt-2 alertClass"
        :type="alert.type"
        :dismissible="true"
        v-model="alert.show"
        :message="alert.mensaje"
      ></AlertComponent>

      <div class="text-subtitle-1 text-medium-emphasis">Nombre completo</div>
      <InputComponent
        id="nombre"
        label="Nombre"
        type="text"
        v-model="registro.name"
        placeholder="Ingresa tu nombre completo"
      />
      <span v-if="nameError" class="error">{{ nameError }}</span>

      <div class="text-subtitle-1 text-medium-emphasis">Correo electrónico</div>
      <InputComponent
        id="email"
        label="Correo Electrónico"
        type="email"
        v-model="registro.email"
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
        v-model="registro.password"
        placeholder="Ingresa una contraseña"
      />
      <span v-if="passwordError" class="error">{{ passwordError }}</span>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Confirmar contraseña
      </div>
      <InputComponent
        id="confirmpass"
        label="Confirmación de contraseña"
        type="password"
        v-model="registro.confirmPassword"
        placeholder="Confirma tu contraseña"
      />
      <span v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</span>

      <div class="text-center mt-2">
        <ButtonComponent type="primary" @click="register" :disabled="disBtn"
          >Registrarse</ButtonComponent
        >
      </div>

      <v-card-text class="text-center mt-6">
        ¿Ya tienes cuenta?
        <a class="text-blue text-decoration-none" href="/">Inicia sesión aquí</a>
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
  name: "RegisterView",
  components: {
    ButtonComponent,
    InputComponent,
    AlertComponent,
  },
  data() {
    return {
      registro: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },

      alert: {
        mensaje: "",
        dismissible: true,
        type: "",
        show: false,
      },
      nameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      disBtn: false,
    };
  },
  methods: {
    validateName() {
      this.disBtn = true;
      const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!this.registro.name) {
        this.nameError = "El nombre es requerido.";
        this.disBtn = false;
        return false;
      } else if (!namePattern.test(this.registro.name)) {
        this.nameError = "El nombre no puede contener números ni caracteres especiales.";
        this.disBtn = false;
        return false;
      }
      this.nameError = "";
      this.disBtn = false;
      return true;
    },

    validateEmail() {
      this.disBtn = true;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.registro.email) {
        this.emailError = "El correo es requerido.";
        this.disBtn = false;
        return false;
      } else if (!emailPattern.test(this.registro.email)) {
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
      const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,8}$/;
      if (!this.registro.password) {
        this.passwordError = "La contraseña es requerida.";
        this.disBtn = false;
        return false;
      } else if (!passwordPattern.test(this.registro.password)) {
        this.passwordError =
          "La contraseña debe tener entre 5-8 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
        this.disBtn = false;
        return false;
      }
      this.passwordError = "";
      this.disBtn = false;
      return true;
    },

    validateConfirmPassword() {
      this.disBtn = true;
      if (!this.registro.confirmPassword) {
        this.confirmPasswordError = "La confirmación de la contraseña es requerida.";
        this.disBtn = false;
        return false;
      } else if (this.registro.confirmPassword !== this.registro.password) {
        this.confirmPasswordError = "Las contraseñas no coinciden.";
        this.disBtn = false;
        return false;
      }
      this.confirmPasswordError = "";
      this.disBtn = false;
      return true;
    },

    async register() {
      const isNameValid = this.validateName();
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      const isConfirmPasswordValid = this.validateConfirmPassword();

      if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        await axios.get("http://localhost:3001/users?email=" + this.registro.email)
          .then((response) => {
            if (response.data.length === 0) {
              delete this.registro.confirmPassword;
              axios.post("http://localhost:3001/users", this.registro)
                .then((response2) => {
                  if (response2.status === 201) {
                    localStorage.setItem("session", JSON.stringify("true"));
                    localStorage.setItem("userId", JSON.stringify(response2.data.id));
                    this.$store.dispatch("cargarUsuario", response2.data);
                    this.$router.push("/todolist");
                  }
                })
                .catch(() => {
                  this.alert.show = true;
                  this.alert.type = "error";
                  this.alert.mensaje = "Hubo un error al crear la cuenta.";
                });
            } else {
              this.alert.show = true;
              this.alert.type = "error";
              this.alert.mensaje = "Ya existe una cuenta registrada con este correo.";
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error {
  color: red;
  font-size: 12px;
  min-height: 20px;
  display: block;
}

v-card {
  max-width: 400px;
  width: 100%;
}

@media (max-width: 600px) {
  .register-container {
    padding: 5px;
    height: 100vh;
  }

  v-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>
