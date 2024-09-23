<template>
    <NavBar></NavBar>
    <div class="ma-4">
        Filtrar tareas por:
        <v-form ref="formFiltro">
            <v-row>
                <v-col cols="12" md="4">
                    <v-select
                        clearable
                        label="Categoría"
                        v-model="categoriaSeleccionada"
                        class="h-50"
                        :items="this.$store.getters.getCategories"
                        item-title="categoria"
                        item-value="id"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select
                        clearable
                        v-model="estadoSeleccionado"
                        label="Estado"
                        :items="this.$store.getters.getStatus"
                        item-title="estado"
                        item-value="id"
                    ></v-select>
                </v-col>
                <v-col cols="6" md="1">
                    <v-btn :disabled="loading" :loading="loading" block size="x-large" color="blue"
                        @Click="filtrarTareas"  
                    ><v-icon icon="mdi-filter-variant"></v-icon
                    ></v-btn>
                </v-col>
                <v-col cols="6" md="1">
                    <v-btn :disabled="loading2" :loading="loading2" block size="x-large" color="red"
                    @click="eliminarFiltroTareas"
                    ><v-icon icon="mdi-filter-variant-remove"></v-icon></v-btn>
                </v-col>
                <v-col md="2">
                    <v-btn
                        block
                        size="x-large"
                        color="blue-darken-4"
                        class="mb-4"
                        @Click="openDialogAddTask"
                        ><v-icon icon="mdi-pencil-plus"></v-icon
                    ></v-btn>
                </v-col>
            </v-row>
        </v-form>
    </div>

    <div class="mx-8">
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="mx-auto cardResponsiva pa-2" max-width="100%"  >
                  <v-chip
                    append-icon="mdi-book-open"
                    color="indigo"
                  >
                    Pendiente
                  </v-chip>
                  <div class="mt-5" v-show="noPendiente">
                    <h5>Aún no haz creado una tarea.</h5>
                  </div>
                  <v-list v-show="!mpPemdiente" v-for="tarea in tasksToDo" :key="tarea.id">
                        <v-card class="py-3" variant="tonal" color='indigo'>
                          <v-list-item :title="tarea.title">
                            {{ tarea.description }}
                          </v-list-item>
                          <v-card-text>
                            <v-row justify="space-between">
                              <v-col cols="12" md="6">
                                <v-chip
                                  prepend-icon="mdi-calendar-alert"
                                  color="pink"
                                  label
                                >
                                  Vencimiento: {{ tarea.dueDate }}
                                </v-chip>
                              </v-col>
                              <v-col cols="12" md="6" >
                                <div v-for="categoria in this.$store.getters.getCategories" :key="categoria.id">
                                  <v-chip
                                    color="pink"
                                    label
                                    v-show="tarea.categoryId === categoria.id"
                                  >
                                    {{ (tarea.categoryId === categoria.id) ? `Categoría: ${categoria.categoria}`: '' }}
                                  </v-chip>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn prepend-icon="mdi-check"  @Click="completarTask(tarea.id)">
                              Completar
                            </v-btn>
                            <v-btn prepend-icon="mdi-pencil" @Click="modificarTask(tarea.id)">
                              Modificar
                            </v-btn>
                            <v-btn prepend-icon="mdi-delete" @Click="eliminarTask(tarea.id)">
                              Eliminar
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                  </v-list>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="mx-auto cardResponsiva pa-2" max-width="100%">
                  <v-chip
                    append-icon="mdi-party-popper"
                    color="success"
                  >
                    Completada
                  </v-chip>
                  <div class="mt-5" v-show="noComplete">
                    <h5>Aún no hay tareas completadas</h5>
                  </div>
                  <div>
                    <v-list v-show="!noComplete" v-for="tarea in tasksComplete" :key="tarea.id">
                        <v-card class="py-3" variant="tonal" color='green'>
                          <v-list-item :title="tarea.title">
                            {{ tarea.description }}
                          </v-list-item>
                          <v-card-text>
                            <v-row justify="space-between">
                              <v-col cols="12" md="6">
                                <v-chip
                                  prepend-icon="mdi-calendar-alert"
                                  color="pink"
                                  label
                                >
                                  Vencimiento: {{ tarea.dueDate }}
                                </v-chip>
                              </v-col>
                              <v-col cols="12" md="6" >
                                <div v-for="categoria in this.$store.getters.getCategories" :key="categoria.id">
                                  <v-chip
                                    color="pink"
                                    label
                                    v-show="tarea.categoryId === categoria.id"
                                  >
                                    {{ (tarea.categoryId === categoria.id) ? `Categoría: ${categoria.categoria}`: '' }}
                                  </v-chip>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions>
                          </v-card-actions>
                        </v-card>
                    </v-list>
                  </div>
                </v-card>
            </v-col>
        </v-row>        
    </div>

    <v-dialog class="dialogClass" v-model="dialogAddTask">
      <v-card title="Agregar tarea">
        <v-form ref="form">
          <v-card-text>
            <v-text-field
              :counter="30"
              v-model="newTask.title"
              :rules="rulesTitle"
              required
              maxLength="30"
              label="Título *"
            ></v-text-field>

            <v-textarea
              rows="2"
              :counter="255"
              v-model="newTask.description"
              :rules="rulesDescripcion"
              maxLength="255"
              label="Descripción *"
            ></v-textarea>

            <v-text-field
              type="date"
              v-model="newTask.dueDate"
              label="Fecha de vencimiento *"
              :rules="rulesDate"
              required
            ></v-text-field>

            <v-select
                clearable
                label="Categoría *"
                v-model="newTask.categoryId"
                :rules="rulesCategoria"
                :items="this.$store.getters.getCategories"
                item-title="categoria"
                item-value="id"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn
              variant="elevated"
              class="me-2"
              color="success"
              :disabled="loadingAdd"
              :loading="loadingAdd"
              @Click.prevent="saveTask()"
            >
              <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
              Guardar
            </v-btn>
            <v-btn
              variant="elevated"
              class="ma-2"
              color="gray"
              @Click="closeDialogAddTask"
            >
              <v-icon start icon="mdi-minus-circle"></v-icon>
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <AlertComponent
      :type="alert.type"
      duration="5000"
      v-model="alert.show"
      :message="alert.mensaje"
    ></AlertComponent>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar.vue"
import AlertComponent from "../components/AlertComponent.vue";

export default {
  name: "TodoListView",
  components:{
    NavBar,
    AlertComponent
  },
  data() {
    return {
        loading: false,
        loading2: false,
        loadingAdd: false,
        today: new Date().toISOString().substr(0, 10),
        newTask: {
            title: "",
            description: "",
            dueDate: '',
            categoryId: '',
            statusId: ''
        },
        rulesTitle: [
          v => !!v || 'Título requerido',
          v => (v && v.length <= 30) || 'El título debe tener menos de 30 caracteres',
        ],
        rulesDescripcion: [(v) => !!v || "Descripcion requerida"],
        rulesDate: [
          (v) => !!v || "Fecha requerida",
          (v) => v >= this.today || "La fecha no puede ser anterior a la actual"
        ],
        rulesCategoria: [(v) => !!v || "Categoria requerida"],
        categoriaSeleccionada: '',
        estadoSeleccionado: '',
        editedTask: {}, 
        alert: {
          mensaje: "",
          dismissible: true,
          type: "",
          show: false,
        },
        dialogAddTask: false,
        createOrMod: 'cre',
        completeTask:{
          statusId: ''
        },
        noComplete: true,
        noPendiente: true,
        userId: JSON.parse(localStorage.getItem("userId")),
    };
  },
  methods: {
    async filtrarTareas(){
      this.loading = true;

      let response;

      let filtros = {
        categoryId:null,
        statusId: null,
      }

      if(this.estadoSeleccionado){
        filtros.statusId = this.estadoSeleccionado
      } if(this.categoriaSeleccionada){
        filtros.categoryId = this.categoriaSeleccionada
      }

      if (filtros.categoryId != null && filtros.statusId != null) {
        response = await axios.get("http://localhost:3001/tasks?userId="+this.userId+"&statusId="+filtros.statusId+"&categoryId="+filtros.categoryId)
      } else if(filtros.categoryId != null && filtros.statusId === null ) {
        response = await axios.get("http://localhost:3001/tasks?userId="+this.userId+"&categoryId="+filtros.categoryId)
      } else if (filtros.categoryId === null && filtros.statusId != null){
        response = await axios.get("http://localhost:3001/tasks?userId="+this.userId+"&statusId="+filtros.statusId)
      }

      if (response && response.data.length != 0) {
          const tasks = response.data;

          const tasksComplete = tasks.filter(task => task.statusId === 2);
          const tasksToDo = tasks.filter(task => task.statusId === 1);  

          this.$store.commit('setTasksComplete', tasksComplete);
          this.$store.commit('setTasksToDo', tasksToDo);
        }else{
          this.alert.show = true;
          this.alert.type = "error";
          this.alert.mensaje = "No se encontraron tareas con esos filtros.";
        }

      this.loading = false;
    },
    eliminarFiltroTareas(){
      this.loading2 = true;
      this.$store.dispatch("upTasks", this.userId);
      this.estadoSeleccionado = '';
      this.categoriaSeleccionada = '';
      this.loading2 = false;
    },

    async saveTask(){
      this.loadingAdd = true;
      const { valid } = await this.$refs.form.validate();
      if(valid){
        if(this.createOrMod === 'cre'){
          let estados = this.$store.getters.getStatus;

          estados.forEach(estado =>{
            if(estado.estado == "Pendiente" || estado.estado == "pendiente"){
              this.newTask.statusId = estado.id
            }
          })
          this.newTask.userId = this.userId;

          axios.post('http://localhost:3001/tasks', this.newTask)
          .then(() => {
            this.$store.dispatch("upTasks", this.userId);
            this.alert.show = true;
            this.alert.type = "success";
            this.alert.mensaje = "Se agregó exitosamente.";
            this.dialogAddTask = false
          }).catch(()=>{
            this.alert.show = true;
            this.alert.type = "error";
            this.alert.mensaje = "Hubo un error.";
          })
        } else if(this.createOrMod === 'mod'){
          axios.put('http://localhost:3001/tasks/'+this.newTask.id, this.newTask)
          .then(()=>{
            this.$store.dispatch("upTasks", this.userId);
            this.alert.show = true;
            this.alert.type = "success";
            this.alert.mensaje = "Se modificó exitosamente.";
            this.dialogAddTask = false
            this.createOrMod = 'cre'
            delete this.newTask.id;
          }).catch(()=>{
            this.alert.show = true;
            this.alert.type = "error";
            this.alert.mensaje = "Hubo un error.";
          })
        }
      }
      this.newTask.title = ''
      this.newTask.description = ''
      this.newTask.dueDate = ''
      this.newTask.categoryId = ''
      this.newTask.statusId = ''
      this.loadingAdd = false;
    },

    openDialogAddTask(){
      this.dialogAddTask = true;
    },

    closeDialogAddTask(){
      this.createOrMod = 'cre'
      delete this.newTask.id
      this.newTask.title = ''
      this.newTask.description = ''
      this.newTask.dueDate = ''
      this.newTask.categoryId = ''
      this.newTask.statusId = ''
      this.dialogAddTask = false;
    },

    async modificarTask(identificador){
      let modTarea;
      this.createOrMod = 'mod';

      await axios.get("http://localhost:3001/tasks?userId="+this.userId+"&id="+identificador)
      .then(response =>{
        modTarea = response.data[0];
        this.newTask.id = modTarea.id;
        this.newTask.title = modTarea.title;
        this.newTask.description = modTarea.description;
        this.newTask.dueDate = modTarea.dueDate;
        this.newTask.categoryId = modTarea.categoryId;
        this.newTask.statusId = modTarea.statusId;
        this.dialogAddTask = true;
      }).catch(()=>{
          this.alert.show = true;
          this.alert.type = "error";
          this.alert.mensaje = "Hubo un error.";
      })
    },

    async completarTask(identificador){
      let estados = this.$store.getters.getStatus;
      let completadoId;

      estados.forEach(estado =>{
        if(estado.estado == "Completado" || estado.estado == "completado"){
          completadoId = estado.id
        }
      })

      this.completeTask.statusId = completadoId;
      console.log(this.completeTask)
      await axios.patch('http://localhost:3001/tasks/'+identificador, this.completeTask)
      .then(()=>{
        this.$store.dispatch("upTasks", this.userId);
        this.alert.show = true;
        this.alert.type = "success";
        this.alert.mensaje = "¡FElICIDADES!";
        this.completeTask.statusId = ''
      }).catch(()=>{
        this.alert.show = true;
        this.alert.type = "error";
        this.alert.mensaje = "Hubo un error.";
      })
    },

    async eliminarTask(identificador) {
        await axios.delete('http://localhost:3001/tasks/'+identificador)
        .then(()=>{
          this.$store.dispatch("upTasks", this.userId);
          this.alert.show = true;
          this.alert.type = "success";
          this.alert.mensaje = "Tarea eliminada";
        }).catch(()=>{
          this.alert.show = true;
          this.alert.type = "error";
          this.alert.mensaje = "Hubo un error.";
        })
    },
  },
  async beforeCreate() {
    let session = JSON.parse(localStorage.getItem("session"));
    if ((await session) !== "true") {
      this.$router.push("/");
    }

    let userIden = JSON.parse(localStorage.getItem("userId"));
    this.$store.dispatch("upTasks", userIden)
    this.$store.dispatch("upCategories");
    this.$store.dispatch("upStatus");
  },
  watch:{
    tasksToDo(){
      if(this.tasksToDo.length == 0){
        this.noPendiente = true;
      } else {
        this.noPendiente = false;
      }
    },
    tasksComplete(){
      if(this.tasksComplete.length == 0){
        this.noComplete = true;      
      } else {
        this.noComplete = false;
      }

    }
  },

  computed:{
    tasksToDo:{
      get(){
        return this.$store.state.tasksToDo || []
      }
    },
    tasksComplete:{
      get(){
        return this.$store.state.tasksComplete || []
      }
    }
  }
};
</script>

<style scoped>
.cardResponsiva{
  width: 75%;
}
.dialogClass{
  width: 35%;
}

@media (max-width: 1300px) {
  .cardResponsiva{
    width: 100%;
  }
  .dialogClass{
  width: 100%;
}
}

@media (max-width: 600px) {
  .cardResponsiva{
    width: 100%;
  }
  .dialogClass{
  width: 100%;
}
}
</style>
