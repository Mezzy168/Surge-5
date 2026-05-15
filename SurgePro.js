/**
 * Surge 运行状态面板 (绝对防弹优化版)
 * 兼容所有数据返回格式，防止 undefined 崩溃
 */

const HTTP_API_PWD = "1234";  // 你的 http-api 密码
const HTTP_API_PORT = "6171"; // 你的 http-api 端口
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
        panel.content = `HTTP API 请求失败，请检查端口与密码\n报错: ${error}`;
        panel["icon-color"] = "#FF3B30";
        $done(panel);
        return;
    }

    try {
        // 兼容处理：Surge 有时会直接返回对象，有时返回 JSON 字符串
        let parsedData = typeof data === "string" ? JSON.parse(data) : data;
        
        // 健壮性提取：兼容不同版本的 API 返回结构
        let uptime = 0;
        if (parsedData) {
            if (parsedData.uptime !== undefined) {
                uptime = parsedData.uptime; // 新版结构
            } else if (parsedData.info && parsedData.info.uptime !== undefined) {
                uptime = parsedData.info.uptime; // 旧版嵌套结构
            }
        }

        let uptimeStr = "";
        if (uptime > 0) {
            let days = Math.floor(uptime / 86400);
            let hours = Math.floor((uptime % 86400) / 3600);
            let minutes = Math.floor((uptime % 3600) / 60);
            
            if (days > 0) {
                uptimeStr = `${days}天 ${hours}小时 ${minutes}分钟`;
            } else if (hours > 0) {
                uptimeStr = `${hours}小时 ${minutes}分钟`;
            } else {
                uptimeStr = `${minutes}分钟`;
            }
        } else {
            uptimeStr = "获取失败 (暂无数据)";
        }

        // 获取网络信息
        let networkType = "未连接";
        let ipAddress = $network.v4 ? $network.v4.primaryAddress : "无 IP 分配";
        
        if ($network.wifi && $network.wifi.ssid) {
            networkType = `Wi-Fi (${$network.wifi.ssid})`;
        } else if ($network.v4 && $network.v4.primaryAddress) {
            networkType = "蜂窝数据 (Cellular)";
            panel.icon = "antenna.radiowaves.left.and.right";
            panel["icon-color"] = "#4CD964"; // 蜂窝网络下切换为绿色天线图标
        }

        // 组装面板
        panel.content = `⏳ 运行时长: ${uptimeStr}\n📡 当前网络: ${networkType}\n🌐 本地 IP: ${ipAddress}`;
        $done(panel);

    } catch (e) {
        // 即使出错也优雅降级，不再报红三角
        panel.content = `脚本处理异常，请重试\n报错: ${e.message}`;
        panel["icon-color"] = "#FF9500";
        $done(panel);
    }
});
