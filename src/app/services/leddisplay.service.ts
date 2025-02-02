// led-display.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class LedDisplayService {
  constructor(private firestore: Firestore) {}

  // Save a new LED display message
  async saveMessage(message: string): Promise<void> {
    await addDoc(collection(this.firestore, 'ledMessages'), { message, createdAt: new Date() });
  }

  // Retrieve LED display messages
  async getMessages(): Promise<any[]> {
    const messagesSnapshot = await getDocs(collection(this.firestore, 'ledMessages'));
    return messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
