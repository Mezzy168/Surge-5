// dns-monitor-enhanced.js 核心功能
const CRITICAL_DOMAINS = [
  "p207-contacts.icloud.com",
  "dns.google",
  "apple.com"
];

function testDNS(domain) {
  const result = $dns.resolve(domain);
  if (!result || result.answer.length === 0) {
    $surge.event.emit("DNS_FAILURE", {domain});
    return false;
  }
  return true;
}

CRITICAL_DOMAINS.forEach(domain => {
  if (!testDNS(domain)) {
    $notification.post("DNS警报", `${domain} 解析失败`, "触发自动修复");
  }
});