// memclean-ultimate-enhanced.js
const MEM_THRESHOLD = 20;
const CLEAN_AGGRESSIVENESS = 0.8;

function cleanMemory() {
  try {
    // 添加待机状态检测
    if ($device.isScreenOff && $network.isCellularUp) {
      console.log("设备处于待机状态，跳过内存清理");
      return {status: "待机跳过"};
    }
    
    // 获取内存使用量
    const memUsage = $surge.memoryUsage ? $surge.memoryUsage() : -1;
    
    if (memUsage > MEM_THRESHOLD && memUsage !== -1) {
      const toRelease = Math.floor((memUsage - MEM_THRESHOLD) * CLEAN_AGGRESSIVENESS);
      console.log(`内存超标: ${memUsage}MB, 释放${toRelease}MB`);
      
      // 优化清理策略（待机时更温和）
      const intensity = $device.isScreenOff ? 0.5 : 1.0;
      
      if ($cacheManager && $cacheManager.purge) {
        $cacheManager.purge("dns", toRelease * 0.5 * intensity);
      }
      
      if ($network && $network.releaseIdleConnections) {
        $network.releaseIdleConnections(0.7 * intensity);
      }
      
      if ($objectPool && $objectPool.cleanStaleObjects) {
        $objectPool.cleanStaleObjects(0.6 * intensity);
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