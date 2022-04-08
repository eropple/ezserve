import QuickLRU from 'quick-lru';

import { cacheSize } from './config.js';
import { CacheItem } from './types.js';

export const cache = new QuickLRU<string, CacheItem>({
  maxSize: cacheSize,
})
