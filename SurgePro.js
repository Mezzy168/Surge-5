const API_URL = "http://127.0.0.1:6171/v1/info";
const API_KEY = "1234";

$httpClient.get({
    url: API_URL,
    headers: { "X-Key": API_KEY }
}, function(error, response, data) {
    let panel = {
        title: "Surge 运行状态",
        icon: "rocket.fill",
        "icon-color": "#007AFF",
        content: ""
    };

    // 1. 网络请求本身的错误
    if (error) {
        panel.content = "内部请求失败: " + error;
        panel["icon-color"] = "#FF3B30";
        $done(panel);
        return;
    }

    // 2. HTTP 状态码错误 (比如密码错、端口错)
    if (response && response.status !== 200) {
        panel.content = "接口无响应 (状态码: " + response.status + ")\n请检查 [General] 下的 http-api 配置。";
        panel["icon-color"] = "#FF9500";
        $done(panel);
        return;
    }

    // 3. 数据解析
    try {
        let body = JSON.parse(data);
        let uptime = body.uptime || 0;
        
        let days = Math.floor(uptime / 86400);
        let hours = Math.floor((uptime % 86400) / 3600);
        let minutes = Math.floor((uptime % 3600) / 60);
        
        let uptimeStr = days > 0 ? `${days}天 ${hours}小时 ${minutes}分钟` : (hours > 0 ? `${hours}小时 ${minutes}分钟` : `${minutes}分钟`);

        let networkType = "未连接";
        let ipAddress = $network.v4 ? $network.v4.primaryAddress : "无 IP 分配";
        
        if ($network.wifi && $network.wifi.ssid) {
            networkType = `Wi-Fi (${$network.wifi.ssid})`;
        } else if ($network.v4 && $network.v4.primaryAddress) {
            networkType = "蜂窝数据";
            panel.icon = "antenna.radiowaves.left.and.right";
            panel["icon-color"] = "#4CD964";
        }

        panel.content = `⏳ 运行时长: ${uptimeStr}\n📡 当前网络: ${networkType}\n🌐 本地 IP: ${ipAddress}`;
        $done(panel);

    } catch (e) {
        panel.content = "数据解析异常，返回内容非 JSON 格式。";
        panel["icon-color"] = "#FF3B30";
        $done(panel);
    }
});
