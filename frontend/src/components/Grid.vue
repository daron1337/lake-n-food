<template>
  <div class="scroll-container">
    <div class="grid-container">
      <div
        v-for="order in orders"
        :key="order.id"
        :class="{ square: true, 'new-order': order.isNew }"
      >
        <div class="number">{{ order.number }}</div>
        <div class="timestamp">{{ formatTime(order.createdAtRome) }}</div>
      </div>
    </div>
    <footer class="footer">
      Made with <span class="heart">❤</span> by
      <a href="http://www.dvisionlab.it" target="_blank">D/Vision Lab</a>
    </footer>
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
        const newOrder = { ...message, isNew: true };
        this.orders.push(newOrder);
        this.orders.sort(
          (a, b) => new Date(b.createdAtRome) - new Date(a.createdAtRome)
        ); // Re-sort orders after adding new one

        // Remove the isNew flag after the animation ends
        setTimeout(() => {
          newOrder.isNew = false;
        }, 500); // Duration of the animation
      });

      this.socket.on("ordersCleared", () => {
        console.log("Orders cleared");
        this.orders = [];
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
@keyframes new-order {
  0% {
    transform: scale(0.9);
    opacity: 0;
    background-color: yellowgreen; /* Flash color at start */
  }
  50% {
    background-color: yellow; /* Flash color in the middle */
  }
  100% {
    transform: scale(1);
    opacity: 1;
    background-color: #f0f0f0; /* Original background color */
  }
}

.new-order {
  animation: new-order 2s ease-out; /* Increased duration to 2 seconds */
}

.scroll-container {
  height: 100vh; /* Full viewport height */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 20px; /* Add padding if needed */
  box-sizing: border-box;
  width: 100vw; /* Full viewport width */
  overflow-x: hidden; /* Disable horizontal scrolling */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px); /* Fixed column size */
  gap: 20px; /* Default gap between squares */
  justify-content: center; /* Center the grid items horizontally */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove padding */
  box-sizing: border-box;
}

.square {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-size: 24px; /* Default font size */
  font-weight: bold;
  width: 200px; /* Fixed width */
  height: 200px; /* Fixed height */
  color: black;
  flex-direction: column;
}

.number {
  font-size: 3em; /* Default font size for the number */
}

.timestamp {
  font-size: 1.5em; /* Default font size for the timestamp */
}

/* Media query for smaller screens */
@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, 100px); /* Smaller column size */
    gap: 10px; /* Smaller gap */
  }

  .square {
    font-size: 16px; /* Smaller font size */
    width: 100px; /* Smaller width */
    height: 100px; /* Smaller height */
  }

  .number {
    font-size: 2em; /* Smaller font size for the number */
  }

  .timestamp {
    font-size: 1em; /* Smaller font size for the timestamp */
  }
}

.footer {
  text-align: center;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #181818;
}

.footer .heart {
  color: red;
}

.footer a {
  text-decoration: none;
  color: #007bff;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
