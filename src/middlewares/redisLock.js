const redisClient = require("../config/redis");

const acquireLock = async (key, ttl = 5000) => {
  const lockKey = `lock:${key}`;
  const value = Date.now() + ttl;

  const isLocked = await redisClient.set(lockKey, value, { NX: true, PX: ttl });

  return isLocked ? lockKey : null;
};

const releaseLock = async (key) => {
  await redisClient.del(`lock:${key}`);
};

module.exports = { acquireLock, releaseLock };
