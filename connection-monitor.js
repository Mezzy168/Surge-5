// connection-monitor.js
const BLACKLIST = [
  "183.60.118.146:8006"
];

$surge.event.listen('NETWORK_CHANGED', () => {
  BLACKLIST.forEach(target => {
    const [host, port] = target.split(':');
    
    $network.ping(host, (latency) => {
      if (latency === -1) {
        $notification.post("连接故障", `${target} 无法访问`, "已加入黑名单");
        $surge.setPolicy(`IP-CIDR,${host}/32,REJECT`);
      }
    });
  });
});