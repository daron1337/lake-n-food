<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="header-message">
        Controlla il tuo ordine anche da cellulare alla pagina
        https://lakenroll.dvisionlab.it o scannerizza il QR CODE
      </h1>
    </header>
    <div class="number-selector">
      <input v-model="newNumber" placeholder="Inserisci numero" />
      <button @click="addNumber">Aggiungi</button>
    </div>
    <div class="selected-numbers">
      <span v-for="num in selectedNumbers" :key="num">
        {{ num }} <button @click="removeNumber(num)">X</button>
      </span>
    </div>
    <div class="scroll-container">
      <div class="grid-container">
        <div class="square qr-square">
          <img src="@/assets/lakenroll_qr.png" alt="QR Code" class="qr-code" />
        </div>
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
      messages: [],
      selectedNumbers:
        JSON.parse(localStorage.getItem("selectedNumbers")) || [],
      newNumber: ""
    };
  },
  created() {
    // Richiedi permesso notifiche al caricamento
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        console.log("Permesso notifiche:", permission);
      });
    }
    this.connect();
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    addNumber() {
      const num = this.newNumber.trim();
      if (num && !this.selectedNumbers.includes(num)) {
        this.selectedNumbers.push(num);
        localStorage.setItem(
          "selectedNumbers",
          JSON.stringify(this.selectedNumbers)
        );
        this.newNumber = "";
      }
    },
    removeNumber(num) {
      this.selectedNumbers = this.selectedNumbers.filter(n => n !== num);
      localStorage.setItem(
        "selectedNumbers",
        JSON.stringify(this.selectedNumbers)
      );
    },
    handleNewOrder(message) {
      const newOrder = { ...message, isNew: true };
      this.orders.push(newOrder);
      this.orders.sort(
        (a, b) => new Date(b.createdAtRome) - new Date(a.createdAtRome)
      );

      // Controlla se il numero è in quelli selezionati
      if (this.selectedNumbers.includes(String(newOrder.number))) {
        // Se le notifiche sono autorizzate
        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification(
            `Il tuo numero ${newOrder.number} è arrivato!`,
            {
              requireInteraction: true // Resta visibile finché l'utente non interagisce
            }
          );
          notification.onclick = () => {
            // Quando l'utente conferma, rimuove il numero dalla lista
            this.removeNumber(String(newOrder.number));
            console.log("fooasd");
            notification.close();
          };
        } else {
          // Fallback: utilizza un alert di conferma
          if (
            confirm(
              `Il tuo numero ${newOrder.number} è arrivato! Premi OK per confermare.`
            )
          ) {
            this.removeNumber(String(newOrder.number));
          }
        }
      }
      setTimeout(() => {
        newOrder.isNew = false;
      }, 500);
    },
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
        this.handleNewOrder(message);
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
  animation: new-order 5s ease-out; /* Increased duration to 5 seconds */
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #181818; /* Dark background for contrast */
}

.page-header {
  width: 100%;
  padding: 20px;
  background-color: #282c34;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-message {
  color: #fff;
  font-size: 36px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-square {
  background-color: #fff; /* Optional: Different background color for QR code */
}

.qr-code {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

.selected-numbers {
  color: white;
}

.timestamp {
  font-size: 1.5em; /* Default font size for the timestamp */
}

/* Media query for smaller screens */
@media (max-width: 600px) {
  .page-header {
    display: none; /* Hide header on mobile devices */
  }

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
  color: white;
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
