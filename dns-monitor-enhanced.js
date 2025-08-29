// dns-monitor-enhanced.js
const CRITICAL_DOMAINS = [
  "p207-contacts.icloud.com",
  "dns.google",
  "apple.com"
];

function testDNS(domain) {
  return new Promise((resolve) => {
    $network.resolve(domain, (address) => {
      resolve(!!address); // 返回解析是否成功
    });
  });
}

(async () => {
  for (const domain of CRITICAL_DOMAINS) {
    const success = await testDNS(domain);
    if (!success) {
      $notification.post("DNS警报", `${domain} 解析失败`, "触发自动修复");
      $surge.event.emit("DNS_FAILURE", {domain});
    }
  }
})();
