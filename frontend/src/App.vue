<script setup lang="ts">
import { RouterView } from "vue-router";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(registration => {
      console.log("Service Worker registrato:", registration);
      subscribeUserToPush(registration);
    })
    .catch(error => {
      console.error(
        "Errore durante la registrazione del Service Worker:",
        error
      );
    });
}

async function subscribeUserToPush(registration: ServiceWorkerRegistration) {
  // La tua chiave VAPID pubblica (ottenuta dal backend)
  const vapidPublicKey =
    "BBpYicakCOlmfT5pjnjAuJ2rq_CUoU04ZtTg6v5OKnwQs0TLK-WEK8hctSgLda5_d-YAGEQawM-KqmeKmYYQ3SQ";
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
    console.log("Sottoscrizione ottenuta:", subscription);

    // Invia la sottoscrizione al backend (usa axios, fetch o altro)
    await fetch("http://localhost:3000/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(subscription)
    });
    console.log("Sottoscrizione inviata al backend.");
  } catch (error) {
    console.error("Errore nella sottoscrizione ai push:", error);
  }
}

// Funzione di utilità per convertire la chiave VAPID
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
</script>

<template>
  <RouterView />
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
}
</style>
