// memclean-ultimate.js
const MEM_THRESHOLD = 20; // 内存阈值20MB
const CLEAN_AGGRESSIVENESS = 0.8; // 清理强度

function cleanMemory() {
  try {
    // 获取内存使用量（兼容方式）
    const memUsage = $surge.memoryUsage ? $surge.memoryUsage() : 
                    $script.memoryUsage ? $script.memoryUsage() : 
                    -1;
    
    if (memUsage > MEM_THRESHOLD && memUsage !== -1) {
      const toRelease = Math.floor((memUsage - MEM_THRESHOLD) * CLEAN_AGGRESSIVENESS);
      console.log(`内存超标: ${memUsage}MB, 释放${toRelease}MB`);
      
      // 清理策略
      if ($cacheManager && $cacheManager.purge) {
        $cacheManager.purge("dns", toRelease * 0.5);
      }
      
      if ($network && $network.releaseIdleConnections) {
        $network.releaseIdleConnections(0.7);
      }
      
      if ($objectPool && $objectPool.cleanStaleObjects) {
        $objectPool.cleanStaleObjects(0.6);
      }
      
      return {released: toRelease};
    }
    return {status: "正常"};
  } catch (e) {
    console.error(`内存清理错误: ${e.message}`);
    return {error: e.message};
  }
}

$done(cleanMemory());