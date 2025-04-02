import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// Redis 클라이언트 초기화
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

interface RateLimitConfig {
  maxRequests: number;
}

const getClientIp = (): string => {
  const forwardedFor = headers().get('x-forwarded-for');
  return forwardedFor?.split(',')[0] ?? 'unknown';
};

const getRateLimitKey = (prefix: string): string => {
  const ip = getClientIp();
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
  return `rate-limit:${prefix}:${ip}:${date}`;
};

const getSecondsUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
};

export const createRateLimiter = (config: RateLimitConfig) => {
  const isRateLimited = async (prefix: string): Promise<boolean> => {
    const key = getRateLimitKey(prefix);
    const currentRequests: number = (await redis.get(key)) || 0;
    return currentRequests >= config.maxRequests;
  };

  const increment = async (prefix: string): Promise<void> => {
    const key = getRateLimitKey(prefix);
    const currentRequests: number = (await redis.get(key)) || 0;
    const secondsUntilMidnight = getSecondsUntilMidnight();

    if (currentRequests === 0) {
      await redis.setex(key, secondsUntilMidnight, 1);
    } else {
      await redis.incr(key);
    }
  };

  return {
    isRateLimited,
    increment,
  };
};
