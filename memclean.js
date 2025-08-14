const MEM_THRESHOLD = 25; // MB
const CLEAN_AGGRESSIVENESS = 0.7; // 清理强度

$event.listen("MEMORY_USAGE", (usage) => {
  if (usage > MEM_THRESHOLD) {
    const toRelease = Math.floor((usage - MEM_THRESHOLD) * CLEAN_AGGRESSIVENESS);
    console.log(`内存超标: ${usage}MB, 释放${toRelease}MB`);
    
    // 优先清理DNS缓存
    $cacheManager.purge("dns", toRelease * 0.4);
    
    // 释放空闲连接
    $network.releaseIdleConnections();
    
    // 清理过期对象
    $objectPool.cleanStaleObjects();
    
    $done({released: toRelease});
  }
});