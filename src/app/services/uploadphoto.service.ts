// storage.service.ts
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private storage: Storage) {}

  // Upload a file and return its download URL.
  async uploadFile(file: File, filePath: string): Promise<string> {
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}
