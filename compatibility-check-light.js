// compatibility-check-light.js
function checkCompatibility() {
  const results = {};
  
  // 仅检查核心API（减少资源消耗）
  const essentialApis = ['$surge', '$network', '$cacheManager', '$objectPool'];
  essentialApis.forEach(api => {
    results[api] = typeof eval(api) !== 'undefined';
  });
  
  console.log("核心API兼容性检查:");
  console.log(JSON.stringify(results, null, 2));
  
  // 仅当核心API缺失时启用传统模式
  if (!results['$surge'] || !results['$network']) {
    $surge.setConfig("legacy-api-support", "true");
    console.warn("核心API缺失，已启用传统API支持模式");
  }
  
  return results;
}

$done(checkCompatibility());