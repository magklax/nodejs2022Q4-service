import { Injectable } from '@nestjs/common';

import { FavoriteEntity } from '../entities/favorite.entity';
import { FavoritesStorage } from '../interfaces/favorite-storage.interface';

@Injectable()
export class InMemoryFavoritesStorage implements FavoritesStorage {
  private favorites = new FavoriteEntity();

  findAll() {
    return this.favorites;
  }

  isExist(id: string, key: string) {
    return this.favorites[key].includes(id);
  }

  insert(id: string, key: string) {
    this.favorites[key].push(id);
  }

  remove(id: string, key: string) {
    this.favorites[key] = this.favorites[key].filter(
      (itemId: string) => itemId !== id,
    );
  }
}
