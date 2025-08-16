// compatibility-check-light.js
function checkCompatibility() {
  const results = {};
  
  // 安全地检查核心API
  const essentialApis = ['$surge', '$network', '$cacheManager', '$objectPool'];
  essentialApis.forEach(api => {
    // 使用全局对象检查代替eval
    results[api] = typeof globalThis[api] !== 'undefined';
  });
  
  console.log("核心API兼容性检查:");
  console.log(JSON.stringify(results, null, 2));
  
  // 安全地启用传统模式
  if (!results['$surge'] || !results['$network']) {
    // 检查$surge是否存在再调用
    if (typeof $surge !== 'undefined' && $surge.setConfig) {
      $surge.setConfig("legacy-api-support", "true");
      console.warn("核心API缺失，已启用传统API支持模式");
    } else {
      console.error("无法启用传统模式：$surge API不可用");
    }
  }
  
  return results;
}

// 正确调用$done
$done(checkCompatibility);
