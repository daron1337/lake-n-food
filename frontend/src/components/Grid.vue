<template>
  <div class="grid-container">
    <div v-for="order in orders" :key="order.id" class="square">
      <div class="number">{{ order.number }}</div>
      <div class="timestamp">{{ formatTime(order.createdAtRome) }}</div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import axios from "axios";

export default {
  name: "SquareGrid",
  data() {
    return {
      orders: [],
      socket: null,
      messages: []
    };
  },
  created() {
    this.connect();
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    fetchOrders() {
      axios
        .get(`${serverUrl}/orders`)
        .then(response => {
          this.orders = response.data;
          console.log(this.orders);
        })
        .catch(error => console.error("Error fetching orders:", error));
    },
    formatTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    connect() {
      this.socket = io(`${serverUrl}`, { autoConnect: true });

      this.socket.on("connect", () => {
        console.log("Socket.IO connected!");
      });

      this.socket.on("orderSaved", message => {
        console.log("Received message:", message);
        this.orders.push(message);
        this.orders.sort(
          (a, b) => new Date(b.createdAtRome) - new Date(a.createdAtRome)
        ); // Re-sort orders after adding new one
      });

      this.socket.on("disconnect", () => {
        console.log("Socket.IO disconnected");
      });
    }
  },
  unmounted() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  width: 100vw; /* Full viewport width */
  margin: 0; /* Remove default margin */
  padding: 10px; /* Add padding if needed */
  box-sizing: border-box;
}
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-size: 20px;
  font-weight: bold;
  aspect-ratio: 1 / 1; /* Ensure squares maintain 1:1 aspect ratio */
  width: 100%;
  color: black;
  flex-direction: column;
}
.number {
  font-size: 2em; /* Larger font size for the number */
}
.timestamp {
  font-size: 1em; /* Smaller font size for the date */
}
</style>
