// dns-failover-ultimate.js
$event.listen("DNS_FAILURE", (event) => {
  console.warn(`DNS解析失败: ${event.domain}, 切换备用DNS`);
  
  // 切换到最可靠的DNS
  $network.switchDNS(["119.29.29.29", "system"]);
  
  // 刷新DNS缓存
  $cacheManager.purge("dns", 1.0);
  
  // 5分钟后恢复
  $timer.setTimeout(() => {
    $network.restoreDNS();
    console.log("DNS服务已恢复");
  }, 300000);
  
  return {action: "dns_switch"};
});