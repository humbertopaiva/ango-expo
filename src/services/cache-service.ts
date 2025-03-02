// Path: src/services/cache-service.ts
import { storage } from "@/src/lib/storage";

// Tipo para itens em cache
export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Cache em memória
const memoryCache: Record<string, CacheItem<any>> = {};

// Tempo padrão de expiração do cache em milissegundos (30 minutos)
const DEFAULT_EXPIRATION = 30 * 60 * 1000;

/**
 * Serviço para gerenciar o cache de dados da aplicação,
 * combinando armazenamento em memória e persistente
 */
export const cacheService = {
  /**
   * Obtém um item do cache, verificando primeiro a memória e depois o storage
   * @param key Chave do item no cache
   * @param expirationTime Tempo de expiração em ms (opcional)
   */
  async get<T>(
    key: string,
    expirationTime = DEFAULT_EXPIRATION
  ): Promise<T | null> {
    const now = Date.now();

    // Verifica primeiro no cache em memória (mais rápido)
    if (memoryCache[key]) {
      const cacheTime = memoryCache[key].timestamp;

      // Se o cache em memória for válido, use-o
      if (now - cacheTime < expirationTime) {
        console.log(`Cache em memória válido para: ${key}`);
        return memoryCache[key].data as T;
      }
    }

    // Verifica no storage se não encontrou em memória ou expirou
    try {
      const cachedItemStr = await storage.getItem(key);
      if (cachedItemStr) {
        const cachedItem: CacheItem<T> = JSON.parse(cachedItemStr);
        const cacheTime = cachedItem.timestamp;

        // Verifica se o storage ainda é válido
        if (now - cacheTime < expirationTime) {
          console.log(`Cache em storage válido para: ${key}`);

          // Atualiza o cache em memória
          memoryCache[key] = cachedItem;

          return cachedItem.data;
        }
      }
    } catch (error) {
      console.error(`Erro ao ler cache de ${key}:`, error);
    }

    // Retorna null se não encontrou ou expirou
    return null;
  },

  /**
   * Salva um item no cache (memória e storage)
   * @param key Chave do item no cache
   * @param data Dados a serem armazenados
   */
  async set<T>(key: string, data: T): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    // Salva em memória
    memoryCache[key] = cacheItem;

    // Salva no storage
    try {
      await storage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error(`Erro ao salvar cache de ${key}:`, error);
    }
  },

  /**
   * Remove um item do cache
   * @param key Chave do item no cache
   */
  async remove(key: string): Promise<void> {
    // Remove da memória
    delete memoryCache[key];

    // Remove do storage
    try {
      await storage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover cache de ${key}:`, error);
    }
  },

  /**
   * Invalida todos os itens do cache que começam com um determinado prefixo
   * @param prefix Prefixo da chave
   */
  async invalidateWithPrefix(prefix: string): Promise<void> {
    // Remove da memória
    Object.keys(memoryCache).forEach((key) => {
      if (key.startsWith(prefix)) {
        delete memoryCache[key];
      }
    });

    // Para o storage, precisaríamos de uma forma de listar todas as chaves
    // Como não temos acesso direto, essa funcionalidade fica limitada à memória
    console.log(`Invalidando cache com prefixo: ${prefix} (apenas em memória)`);
  },

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<void> {
    // Limpa a memória
    Object.keys(memoryCache).forEach((key) => {
      delete memoryCache[key];
    });

    // Não é recomendado limpar todo o storage,
    // pois pode afetar outros dados não relacionados ao cache
    console.log("Cache em memória limpo");
  },
};
