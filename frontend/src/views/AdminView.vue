<template>
  <div class="number-input-form">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="numberInput">Enter a Number</label>
        <input
          type="number"
          id="numberInput"
          v-model="number"
          class="number-input"
          placeholder="Enter number here"
        />
      </div>
      <button type="submit">Submit</button>
      <!-- Message Display -->
      <div
        v-if="message"
        :class="{ 'success-message': success, 'error-message': !success }"
      >
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      number: null,
      message: "",
      success: false
    };
  },
  methods: {
    submitForm() {
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      axios
        .post(`${serverUrl}/order`, {
          number: this.number
        })
        .then(response => {
          this.message = "Number submitted successfully!";
          this.success = true;
        })
        .catch(error => {
          this.message = "Failed to submit number. Error: " + error.message;
          this.success = false;
        });
    }
  }
};
</script>

<style scoped>
.number-input-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.form-group {
  margin-bottom: 20px;
}

.number-input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
}

button {
  padding: 10px 15px;
  font-size: 16px;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
