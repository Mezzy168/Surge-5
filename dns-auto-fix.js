// dns-fix-fixed.js
const FAILURE_THRESHOLD = 3;
const COOLDOWN_PERIOD = 300; // 5分钟冷却

$surge.event.listen('DNS_FAILURE', (event) => {
  const domain = event.domain;
  const failureCount = $persistentStore.read(`dns_fail_${domain}`) || 0;
  
  if (failureCount >= FAILURE_THRESHOLD) {
    $persistentStore.write("true", `dns_blacklist_${domain}`, COOLDOWN_PERIOD);
    $notification.post("DNS保护", `${domain} 临时禁用`, "已加入黑名单5分钟");
  } else {
    $persistentStore.write(failureCount + 1, `dns_fail_${domain}`, 60);
  }
});
