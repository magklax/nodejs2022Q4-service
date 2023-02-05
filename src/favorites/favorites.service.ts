import { Injectable } from '@nestjs/common';
import { InMemoryFavoritesStorage } from './storage/favorites.storage';

@Injectable()
export class FavoritesService {
  constructor(private storage: InMemoryFavoritesStorage) {}

  insert(id: string, key: string) {
    this.storage.insert(id, key);
  }

  findAll() {
    return this.storage.findAll();
  }

  isExist(id: string, key: string) {
    return this.storage.isExist(id, key);
  }

  remove(id: string, key: string) {
    this.storage.remove(id, key);
  }
}
