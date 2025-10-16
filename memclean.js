// memclean.js - Surge 5 内存清理脚本
const MEMORY_THRESHOLD = 25; // MB
const CLEAN_INTERVAL = 600000; // 10分钟

function cleanMemory() {
    try {
        // 兼容方式获取内存使用情况
        let memUsage;
        
        // 方式1: 使用$system.status API
        if (typeof $system !== 'undefined' && $system.status && $system.status.memoryUsage) {
            memUsage = $system.status.memoryUsage;
        }
        // 方式2: 使用$script.memoryUsage API
        else if (typeof $script !== 'undefined' && $script.memoryUsage) {
            memUsage = $script.memoryUsage;
        }
        // 方式3: 估算内存使用
        else {
            // 基于活动连接数估算内存使用
            const activeConns = $surge.activeConnectionCount || 0;
            memUsage = activeConns * 0.15; // 每个连接约0.15MB
        }
        
        console.log(`当前内存使用: ${memUsage.toFixed(2)}MB`);
        
        if (memUsage > MEMORY_THRESHOLD) {
            // 释放资源
            $surge.releaseIdleResources && $surge.releaseIdleResources();
            $surge.closeIdleConnections && $surge.closeIdleConnections();
            
            console.log(`内存超过阈值(${MEMORY_THRESHOLD}MB)，已释放资源`);
        }
    } catch (e) {
        console.error(`内存清理错误: ${e.message}`);
    }
}

// 初始化执行
cleanMemory();

// === 安全设置定时器 ===
if (typeof $timer !== 'undefined' && $timer.schedule) {
    $timer.schedule({
        interval: CLEAN_INTERVAL,
        handler: cleanMemory
    });
} else if (typeof setInterval !== 'undefined') {
    setInterval(cleanMemory, CLEAN_INTERVAL);
} else {
    console.log("定时器API不可用，跳过定时清理");
}

// === 安全注册事件监听 ===
if (typeof $surge !== 'undefined' && $surge.event && $surge.event.listen) {
    // 网络变化时执行清理
    $surge.event.listen('NETWORK_CHANGED', cleanMemory);
    
    // 内存警告时执行清理
    $surge.event.listen('MEMORY_WARNING', () => {
        console.log("收到内存警告，执行紧急清理");
        cleanMemory();
    });
} else {
    console.log("事件API不可用，跳过事件监听");
}

$done();
