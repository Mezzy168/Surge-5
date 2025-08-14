 compatibility-check.js
function checkCompatibility() {
  const results = {};
  
   检查关键API
  results.event = typeof $event !== 'undefined';
  results.script = typeof $script !== 'undefined';
  results.network = typeof $network !== 'undefined';
  results.cacheManager = typeof $cacheManager !== 'undefined';
  results.objectPool = typeof $objectPool !== 'undefined';
  results.diagnosis = typeof $diagnosis !== 'undefined';
  
  console.log(兼容性检查结果);
  console.log(JSON.stringify(results, null, 2));
  
   根据结果调整配置
  if (!results.event) {
    $surge.setConfig(legacy-api-support, true);
    console.warn(启用传统API支持模式);
  }
  
  return results;
}

$done(checkCompatibility());