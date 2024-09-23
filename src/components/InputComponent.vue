<template>
  <input class="input-box" 
  :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue',
  $event.target.value)" :placeholder="placeholder" />
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    id: String,
    type: {
      type: String,
      default: "text",
    },
    modelValue: String,
    placeholder: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.input-box {
  width: 100%;
  padding: 5px;
  border: 2px solid #007bff; 
  border-radius: 4px;
  background-color: #ffffff; 
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}
.input-box:hover {
  border-color: #0056b3; 
}
.input-box:focus {
  border-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); 
  outline: none; 
}
::placeholder {
  color: #bbb;
  font-style: italic;
}
</style>
