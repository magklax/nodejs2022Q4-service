import { FavoriteEntity } from '../entities/favorite.entity';

export interface FavoritesStorage {
  findAll: () => FavoriteEntity;
  insert: (id: string, key: string) => void;
  remove: (id: string, key: string) => void;
  isExist: (id: string, key: string) => boolean;
}
