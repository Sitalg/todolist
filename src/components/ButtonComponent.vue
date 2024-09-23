<template>
  <button :class="btnClass" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ButtonComponent",
  props: {
    type: {
      type: String,
      default: "primary",
    },
  },
  computed: {
    btnClass() {
      return {
        "btn-primary": this.type === "primary",
        "btn-secondary": this.type === "secondary",
        "btn-danger": this.type === "danger",
      };
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; 
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3; 
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268; 
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333; 
}
</style>
