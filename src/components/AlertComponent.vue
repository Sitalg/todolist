<template>
  <v-snackbar
    v-model="visible"
    :timeout="duration"
    :color="snackbarColor"
    top
    right
    multi-line
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        text
        @click="visible = false"
        v-bind="attrs"
      >
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "AlertComponent",
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    },
    duration: {
      type: Number,
      default: 3000 
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    snackbarColor() {
      switch (this.type) {
        case 'success':
          return 'green';
        case 'error':
          return 'red';
        case 'info':
          return 'blue';
        case 'warning':
          return 'orange';
        default:
          return 'grey';
      }
    }
  },
  methods: {
    showSnackbar() {
      this.visible = true;
    },
    closeSnackbar() {
      this.visible = false;
    }
  },
  mounted() {
    this.showSnackbar();
  }
};
</script>

<style scoped>
</style>
