// 修复版内存清理脚本 (memclean-fixed.js)
const MEMORY_THRESHOLD = 25; // MB
const CLEAN_INTERVAL = 600000; // 10分钟

function cleanMemory() {
    const memUsage = $surge.memoryUsage();
    console.log(`当前内存使用: ${memUsage}MB`);
    
    if (memUsage > MEMORY_THRESHOLD) {
        $surge.releaseIdleResources();
        $surge.closeIdleConnections();
        console.log(`内存超过阈值(${MEMORY_THRESHOLD}MB)，已释放资源`);
    }
}

// 定时执行清理
$surge.setInterval(cleanMemory, CLEAN_INTERVAL);

// 网络变化时执行清理
$surge.event.listen('NETWORK_CHANGED', cleanMemory);

// 内存警告时执行清理
$surge.event.listen('MEMORY_WARNING', () => {
    console.log("收到内存警告，执行紧急清理");
    $surge.releaseIdleResources();
    $surge.closeIdleConnections();
});

// 初始化时执行一次清理
cleanMemory();
