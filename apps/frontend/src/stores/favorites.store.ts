import { ref, computed, watch } from 'vue';
import { productsApi } from '../api/products.api';

const GUEST_STORAGE_KEY = 'slavyanka-favorites-guest';
const STORAGE_VERSION_KEY = 'slavyanka-favorites-version';
const STORAGE_VERSION = 2;

let storageKey = GUEST_STORAGE_KEY;

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  description?: string;
  composition?: string;
  manufacturer?: string;
  country?: string;
  shelfLife?: string;
  weight?: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  discountPrice?: number;
  discountUntil?: string;
  isPromo?: boolean;
  avgRating?: number;
  reviewCount?: number;
}

const favorites = ref<FavoriteItem[]>([]);

function loadFavorites() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      favorites.value = JSON.parse(saved);
    } else {
      favorites.value = [];
    }
    // Миграция старых записей
    const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (savedVersion !== String(STORAGE_VERSION) || favorites.value.some(f => typeof f.description === 'undefined')) {
      setTimeout(() => migrateOldFavorites(), 100);
    }
  } catch (e) {
    console.error('Failed to load favorites:', e);
    favorites.value = [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(favorites.value));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

// Загружаем изначально
loadFavorites();

// Сохраняем изменения
watch(favorites, () => {
  saveFavorites();
}, { deep: true });

/** Сброс избранного в памяти */
export function resetFavorites() {
  favorites.value = [];
}

/** Привязать избранное к userId (или null для гостя) */
export function setFavoritesUserId(userId: string | null) {
  const newKey = userId ? `slavyanka-favorites-${userId}` : GUEST_STORAGE_KEY;
  if (newKey !== storageKey) {
    storageKey = newKey;
    loadFavorites();
  }
}

// Асинхронная миграция старых записей — обновляем с сервера
async function migrateOldFavorites() {
  try {
    let changed = false;
    const updated = await Promise.all(
      favorites.value.map(async (item) => {
        if (typeof item.description === 'undefined') {
          try {
            const serverProduct = await productsApi.getById(item.id);
            if (serverProduct) {
              changed = true;
              return {
                ...item,
                description: serverProduct.description || undefined,
                composition: serverProduct.composition || undefined,
                manufacturer: serverProduct.manufacturer || undefined,
                country: serverProduct.country || undefined,
                shelfLife: serverProduct.shelfLife || undefined,
                weight: serverProduct.weight || undefined,
                calories: serverProduct.calories ?? undefined,
                proteins: serverProduct.proteins ?? undefined,
                fats: serverProduct.fats ?? undefined,
                carbohydrates: serverProduct.carbohydrates ?? undefined,
                discountPrice: serverProduct.discountPrice || undefined,
                discountUntil: serverProduct.discountUntil || undefined,
                isPromo: serverProduct.isPromo || undefined,
                avgRating: serverProduct.avgRating ?? undefined,
                reviewCount: serverProduct.reviewCount ?? undefined,
              } as FavoriteItem;
            }
          } catch (e) {
            // Сервер недоступен — оставляем как есть
          }
        }
        return item;
      })
    );
    if (changed) {
      favorites.value = updated;
      localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
    }
  } catch (e) {
    console.error('Favorites migration failed:', e);
  }
}

export function useFavorites() {
  const count = computed(() => favorites.value.length);

  function toggle(item: FavoriteItem) {
    const index = favorites.value.findIndex(f => f.id === item.id);
    if (index === -1) {
      favorites.value.push(item);
    } else {
      favorites.value.splice(index, 1);
    }
  }

  function isFavorite(id: string): boolean {
    return favorites.value.some(f => f.id === id);
  }

  function remove(id: string) {
    const index = favorites.value.findIndex(f => f.id === id);
    if (index !== -1) {
      favorites.value.splice(index, 1);
    }
  }

  function getAll(): FavoriteItem[] {
    return [...favorites.value];
  }

  return {
    favorites,
    count,
    toggle,
    isFavorite,
    remove,
    getAll,
  };
}