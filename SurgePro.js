var API_URL = "http://127.0.0.1:6171/v1/info";
var API_KEY = "1234";

$httpClient.get({
    url: API_URL,
    headers: { "X-Key": API_KEY }
}, function(error, response, data) {
    var panel = {
        title: "Surge 运行状态",
        icon: "rocket.fill",
        "icon-color": "#007AFF",
        content: ""
    };

    if (error) {
        panel.content = "内部请求失败: " + error;
        panel["icon-color"] = "#FF3B30";
        $done(panel);
        return;
    }

    if (response && response.status !== 200) {
        panel.content = "接口无响应 (状态码: " + response.status + ")\n请检查 http-api 配置。";
        panel["icon-color"] = "#FF9500";
        $done(panel);
        return;
    }

    try {
        var body = JSON.parse(data);
        var uptime = body.uptime || 0;
        
        var days = Math.floor(uptime / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        
        var uptimeStr = "";
        if (days > 0) {
            uptimeStr = days + "天 " + hours + "小时 " + minutes + "分钟";
        } else if (hours > 0) {
            uptimeStr = hours + "小时 " + minutes + "分钟";
        } else {
            uptimeStr = minutes + "分钟";
        }

        var networkType = "未连接";
        var ipAddress = $network.v4 ? $network.v4.primaryAddress : "无 IP 分配";
        
        if ($network.wifi && $network.wifi.ssid) {
            networkType = "Wi-Fi (" + $network.wifi.ssid + ")";
        } else if ($network.v4 && $network.v4.primaryAddress) {
            networkType = "蜂窝数据";
            panel.icon = "antenna.radiowaves.left.and.right";
            panel["icon-color"] = "#4CD964";
        }

        panel.content = "⏳ 运行时长: " + uptimeStr + "\n📡 当前网络: " + networkType + "\n🌐 本地 IP: " + ipAddress;
        $done(panel);

    } catch (e) {
        panel.content = "数据解析异常: " + e.message;
        panel["icon-color"] = "#FF3B30";
        $done(panel);
    }
});
