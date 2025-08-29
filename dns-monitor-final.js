// dns-monitor-final.js
const CRITICAL_DOMAINS = ["apple.com"]; // 只保留最关键的域名
const TIMEOUT = 1500; // 1.5秒超时

function testDomain(domain) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let resolved = false;
    
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({success: false, time: TIMEOUT});
      }
    }, TIMEOUT);
    
    $network.resolve(domain, (address) => {
      if (!resolved) {
        clearTimeout(timer);
        resolved = true;
        resolve({success: !!address, time: Date.now() - startTime});
      }
    });
  });
}

async function runChecks() {
  const results = [];
  
  for (const domain of CRITICAL_DOMAINS) {
    const result = await testDomain(domain);
    results.push({domain, ...result});
    
    if (!result.success) {
      $notification.post("DNS警报", `${domain} 解析失败`, `耗时 ${result.time}ms`);
      $surge.event.emit("DNS_FAILURE", {domain});
    }
  }
  
  // 记录性能数据
  $persistentStore.write(
    JSON.stringify(results), 
    "dns-check-results", 
    600 // 10分钟缓存
  );
}

// 主执行逻辑
runChecks().catch(error => {
  $notification.post("脚本错误", "DNS健康检查失败", error.message);
});