// 内存监控脚本
const MEMORY_THRESHOLD = 50; // MB

$surge.event.listen('MEMORY_USAGE', (usage) => {
    const memUsage = usage / 1024 / 1024; // 转换为MB
    
    if (memUsage > MEMORY_THRESHOLD) {
        $notification.post("内存警告", `内存使用过高: ${memUsage.toFixed(2)}MB`, "将尝试清理");
        $surge.releaseMemory();
        $surge.releaseIdleResources();
    }
});

$surge.event.listen('NETWORK_CHANGED', () => {
    $surge.releaseIdleResources();
    $surge.closeIdleConnections();
});

// 每5分钟检查一次内存
$surge.setInterval(() => {
    $surge.triggerEvent('MEMORY_USAGE', $surge.memoryUsage());
}, 300000); // 5分钟