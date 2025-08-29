// dns-monitor-ultimate.js
const CRITICAL_DOMAINS = [
  "apple.com",
  "icloud.com",
  "dns.google"
];
const TIMEOUT = 3000; // 3秒超时

async function testDomain(domain) {
  return new Promise((resolve) => {
    let timer = setTimeout(() => resolve(false), TIMEOUT);
    
    $network.resolve(domain, (address) => {
      clearTimeout(timer);
      resolve(!!address);
    });
  });
}

(async () => {
  const results = await Promise.all(
    CRITICAL_DOMAINS.map(domain => testDomain(domain))
  );
  
  results.forEach((success, index) => {
    if (!success) {
      const domain = CRITICAL_DOMAINS[index];
      $notification.post("DNS警报", `${domain} 解析失败`, "触发自动修复");
      $surge.event.emit("DNS_FAILURE", {domain});
    }
  });
})();
