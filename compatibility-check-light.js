// compatibility-check-light.js
const startTime = Date.now();

function checkCompatibility() {
  const results = {};
  
  // 核心API列表（精简到最少必要）
  const essentialApis = ['$surge', '$network'];
  
  // 快速检查API存在性（避免eval和globalThis）
  essentialApis.forEach(api => {
    try {
      // 使用最安全的检查方式
      results[api] = typeof window[api] !== 'undefined' || 
                    typeof globalThis[api] !== 'undefined';
    } catch (e) {
      results[api] = false;
    }
  });
  
  // 性能优化：仅在调试模式输出详细日志
  if ($config.debugMode) {
    console.log("核心API兼容性检查:");
    console.log(JSON.stringify(results, null, 2));
    console.log(`检查耗时: ${Date.now() - startTime}ms`);
  }
  
  // 异步处理传统模式切换（避免阻塞主线程）
  if (!results.$surge || !results.$network) {
    setTimeout(() => {
      try {
        if (typeof $surge !== 'undefined' && $surge.setConfig) {
          $surge.setConfig("legacy-api-support", "true");
          console.warn("核心API缺失，已启用传统API支持模式");
        }
      } catch (e) {
        console.error("传统模式切换失败:", e.message);
      }
    }, 0); // 下一个事件循环执行
  }
  
  return results;
}

// 立即返回结果，避免额外延迟
$done(checkCompatibility());
