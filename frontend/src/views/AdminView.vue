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
    <!-- Delete Button -->
    <button @click="confirmDelete" class="delete-button">
      Delete All Orders
    </button>
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
      const submittedNumber = this.number; // Store the submitted number
      axios
        .post(`${serverUrl}/orders`, {
          number: submittedNumber
        })
        .then(response => {
          this.message = `Number ${submittedNumber} submitted successfully!`;
          this.success = true;
          this.resetForm(); // Reset the form on success
          console.log(`Submitted number: ${submittedNumber}`); // Log the submitted number
        })
        .catch(error => {
          this.message = `Failed to submit number ${submittedNumber}. Error: ${error.message}`;
          this.success = false;
          this.resetForm(); // Reset the form on error
          console.error(
            `Error submitting number: ${submittedNumber}. Error: ${error.message}`
          ); // Log the error and number
        });
    },
    resetForm() {
      this.number = null;
    },
    confirmDelete() {
      if (confirm("Are you sure you want to delete all orders?")) {
        this.deleteAllOrders();
      }
    },
    deleteAllOrders() {
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      axios
        .delete(`${serverUrl}/orders`)
        .then(response => {
          this.message = "All orders deleted successfully!";
          this.success = true;
        })
        .catch(error => {
          this.message = "Failed to delete orders. Error: " + error.message;
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
  justify-content: center;
  height: 100vh; /* Full viewport height to center vertically */
  width: 100vw; /* Full viewport width to center horizontally */
  box-sizing: border-box;
  margin: 0; /* Remove default margin */
  padding: 20px; /* Add padding if needed */
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
  margin-top: 10px; /* Add margin to separate the buttons */
}

.delete-button {
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}

.delete-button:hover {
  background-color: darkred;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
