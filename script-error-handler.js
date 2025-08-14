// script-error-handler.js
$event.listen("SCRIPT_ERROR", (error) => {
  console.error(`脚本错误: ${error.message}`);
  
  // 针对内存清理脚本的特殊处理
  if (error.scriptName.includes("memory-cleaner")) {
    console.warn("内存清理脚本出错，尝试回退到基本清理");
    $cacheManager.purge("dns", 1.0);
    $network.releaseIdleConnections(1.0);
  }
  
  return {handled: true};
});