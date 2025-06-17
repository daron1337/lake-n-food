// src/push/push.service.ts
import { Injectable } from '@nestjs/common';
import * as webPush from 'web-push';

@Injectable()
export class PushService {
  constructor() {
    // Imposta i dettagli VAPID utilizzando le chiavi memorizzate nelle variabili ambiente
    webPush.setVapidDetails(
      'mailto:your-email@example.com', // Inserisci la tua email
      'BBpYicakCOlmfT5pjnjAuJ2rq_CUoU04ZtTg6v5OKnwQs0TLK-WEK8hctSgLda5_d-YAGEQawM-KqmeKmYYQ3SQ',
      '3CG0YvF-cG_e4D5fo9Z8zXkDWpmzo0JiNUiJYh1W5PA',
    );
  }

  // Metodo per inviare una notifica a una sottoscrizione
  async sendNotification(subscription: any, payload: any) {
    try {
      const result = await webPush.sendNotification(
        subscription,
        JSON.stringify(payload),
      );
      console.log('Notifica inviata con successo:', result);
    } catch (error) {
      console.error("Errore durante l'invio della notifica:", error);
    }
  }
}
