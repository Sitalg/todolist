<template>
  <div>
    <v-toolbar
      dark
      prominent
    >

      <v-toolbar-title>To Do List</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @Click="cerrarSesion">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
export default {
    name: 'NavBar',
    methods: {
      cerrarSesion(){
        localStorage.clear(),
        this.$router.push("/");
      }
    },
}
</script>