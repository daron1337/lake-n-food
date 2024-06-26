<template>
  <div class="number-input-form">
    <div class="number-log">Ordine n: {{ numberLog }}</div>
    <number-pad @submit="submitForm" @update="updateLog"></number-pad>
    <!-- Message Display -->
    <div
      v-if="message"
      :class="{ 'success-message': success, 'error-message': !success }"
    >
      {{ message }}
    </div>
    <!-- Delete Button -->
    <button @click="confirmDelete" class="delete-button">
      Delete All Orders
    </button>
  </div>
</template>

<script>
import axios from "axios";
import NumberPad from "./NumberPad.vue"; // Import the NumberPad component

export default {
  components: {
    NumberPad
  },
  data() {
    return {
      numberLog: "",
      message: "",
      success: false
    };
  },
  methods: {
    submitForm(submittedNumber) {
      if (submittedNumber === "") return;

      const serverUrl = import.meta.env.VITE_SERVER_URL;
      axios
        .post(`${serverUrl}/orders`, {
          number: submittedNumber
        })
        .then(response => {
          this.message = `Number ${submittedNumber} submitted successfully!`;
          this.success = true;
          this.clearLog(); // Clear the log on success
          console.log(`Submitted number: ${submittedNumber}`); // Log the submitted number
        })
        .catch(error => {
          this.message = `Failed to submit number ${submittedNumber}. Error: ${error.message}`;
          this.success = false;
          this.clearLog(); // Clear the log on error
          console.error(
            `Error submitting number: ${submittedNumber}. Error: ${error.message}`
          ); // Log the error and number
        });
    },
    updateLog(currentInput) {
      this.numberLog = currentInput;
    },
    clearLog() {
      this.numberLog = "";
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

.number-log {
  font-size: 48px;
  color: red;
  margin-bottom: 20px;
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
