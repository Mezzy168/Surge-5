// dns-auto-fix.js 核心逻辑
const FAILURE_THRESHOLD = 3;
const COOLDOWN_PERIOD = 300; // 5分钟冷却

$surge.event.listen('DNS_FAILURE', (event) => {
  const domain = event.domain;
  const failureCount = $cache.get(`dns_fail_${domain}`) || 0;
  
  if (failureCount >= FAILURE_THRESHOLD) {
    $cache.set(`dns_blacklist_${domain}`, true, COOLDOWN_PERIOD);
    $notification.post("DNS保护", `${domain} 临时禁用`, "已加入黑名单5分钟");
  } else {
    $cache.set(`dns_fail_${domain}`, failureCount + 1, 60);
  }
});