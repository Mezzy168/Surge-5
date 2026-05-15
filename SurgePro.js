/**
 * Surge 运行状态面板 (低内存纯本地版)
 * 专为低内存设备调优，无任何外部网络依赖
 */

const HTTP_API_PWD = "1234";  // 读取自你的配置文件
const HTTP_API_PORT = "6171"; // 读取自你的配置文件
const API_URL = `http://127.0.0.1:${HTTP_API_PORT}/v1/info`;

$httpClient.get({
    url: API_URL,
    headers: { "X-Key": HTTP_API_PWD }
}, function(error, response, data) {
    let panel = {
        title: "Surge 运行状态",
        icon: "rocket.fill",
        "icon-color": "#007AFF",
        content: ""
    };

    if (error) {
        panel.content = `数据获取失败，请确保 http-api 已开启\n报错: ${error}`;
        panel["icon-color"] = "#FF3B30";
        $done(panel);
        return;
    }

    try {
        let info = JSON.parse(data);
        
        // 1. 运行时长计算
        let uptime = info.uptime || 0;
        let days = Math.floor(uptime / 86400);
        let hours = Math.floor((uptime % 86400) / 3600);
        let minutes = Math.floor((uptime % 3600) / 60);
        
        let uptimeStr = "";
        if (days > 0) {
            uptimeStr = `${days}天 ${hours}小时 ${minutes}分钟`;
        } else if (hours > 0) {
            uptimeStr = `${hours}小时 ${minutes}分钟`;
        } else {
            uptimeStr = `${minutes}分钟`;
        }

        // 2. 网络状态判断
        let networkType = "未连接";
        let ipAddress = $network.v4 ? $network.v4.primaryAddress : "无 IP 分配";
        
        if ($network.wifi && $network.wifi.ssid) {
            networkType = `Wi-Fi (${$network.wifi.ssid})`;
        } else if ($network.v4 && $network.v4.primaryAddress) {
            networkType = "蜂窝数据 (Cellular)";
            panel.icon = "antenna.radiowaves.left.and.right";
            panel["icon-color"] = "#4CD964"; // 切换为绿色图标
        }

        // 3. 组装面板展示内容
        panel.content = `⏳ 运行时长: ${uptimeStr}\n📡 当前网络: ${networkType}\n🌐 本地 IP: ${ipAddress}`;
        
        $done(panel);

    } catch (e) {
        panel.content = `脚本解析异常: ${e.message}`;
        panel["icon-color"] = "#FF3B30";
        $done(panel);
    }
});
