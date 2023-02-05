import { FavoritesRepsonse } from './favorite-responce.interface';

export interface FavoritesStorage {
  findAll: () => FavoritesRepsonse;
  insert: (id: string, key: string) => void;
  remove: (id: string, key: string) => void;
}
