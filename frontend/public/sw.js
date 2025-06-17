self.addEventListener("push", event => {
  // Presumi che il payload sia in formato JSON
  const data = event.data.json();
  const title = `Il tuo numero ${data.number} è arrivato!`;
  const options = {
    body: "Clicca per confermare.",
    requireInteraction: true // Richiede l'interazione dell'utente
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  // Potresti aprire la pagina dell'app, o inviare un messaggio al client per rimuovere il numero
  event.waitUntil(
    clients.openWindow("/") // apre la home page ad esempio
  );
});
