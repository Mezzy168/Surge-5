// compatibility-check-light.js
const startTime = Date.now();
const DEBUG_MODE = false; // 手动控制调试日志

function checkCompatibility() {
  const results = {};
  
  // 核心API列表（精简到最少必要）
  const essentialApis = ['$surge', '$network'];
  
  // 快速检查API存在性（安全方式）
  essentialApis.forEach(api => {
    try {
      // 使用最安全的检查方式
      results[api] = (typeof window[api] !== 'undefined') || 
                     (typeof globalThis[api] !== 'undefined');
    } catch (e) {
      results[api] = false;
    }
  });
  
  // 性能优化：手动控制调试日志
  if (DEBUG_MODE) {
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
          if (DEBUG_MODE) console.warn("核心API缺失，已启用传统API支持模式");
        }
      } catch (e) {
        if (DEBUG_MODE) console.error("传统模式切换失败:", e.message);
      }
    }, 0); // 下一个事件循环执行
  }
  
  return results;
}

// 安全执行并返回
try {
  const result = checkCompatibility();
  $done(result);
} catch (e) {
  console.error(`兼容性检查致命错误: ${e.message}`);
  $done({ error: e.message });
}
