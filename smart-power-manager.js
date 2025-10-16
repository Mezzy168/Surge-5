// smart-power.js - Surge 5 智能省电脚本
const RESOURCE_THRESHOLD = 70;  // 系统资源使用百分比阈值
const IDLE_PERIOD = 30;         // 空闲时间阈值(分钟)
const NIGHT_MODE_START = 23;    // 23:00
const NIGHT_MODE_END = 6;       // 6:00
const CHECK_INTERVAL = 1800;    // 30分钟(秒)

// 状态追踪器
let lastPowerSaveState = null;
let lastCheckTime = 0;

function managePowerSaving() {
    try {
        const now = Date.now();
        
        // 频率控制：避免频繁检查
        if (now - lastCheckTime < 300) { // 5秒冷却时间
            return $done({status: "skip_short_interval"});
        }
        lastCheckTime = now;
        
        // 获取当前系统状态
        const systemStatus = $system.status || {};
        const resourceUsage = (systemStatus.cpuUsage || 0) + (systemStatus.memoryPressure || 0);
        const activeConns = $surge.activeConnectionCount || 0;
        
        // 获取时间状态
        const dateObj = new Date();
        const hours = dateObj.getHours();
        const isNightMode = hours >= NIGHT_MODE_START || hours < NIGHT_MODE_END;
        
        // 智能判断逻辑
        const shouldEnablePowerSave = 
            resourceUsage > RESOURCE_THRESHOLD ||  // 资源使用过高
            activeConns > 100 ||                  // 活动连接过多
            isNightMode;                          // 夜间时段
        
        // 状态变化检测
        const stateChanged = shouldEnablePowerSave !== lastPowerSaveState;
        lastPowerSaveState = shouldEnablePowerSave;
        
        // 无状态变化时跳过操作
        if (!stateChanged) {
            return $done({status: "no_change"});
        }
        
        // 应用省电策略
        if (shouldEnablePowerSave) {
            console.log("⚡️ 启用智能省电模式");
            
            // 关键省电操作
            $surge.setBool("reduce-background-activity", true);
            $surge.disableScript("memory-cleaner");
            
            // 可选：限制后台更新
            $surge.setInt("update-check-interval", 86400); // 24小时
            
            return $done({mode: "power_saving"});
        } else {
            console.log("✅ 恢复正常运行模式");
            
            // 恢复标准操作
            $surge.setBool("reduce-background-activity", false);
            $surge.enableScript("memory-cleaner");
            
            // 恢复默认更新频率
            $surge.setInt("update-check-interval", 3600); // 1小时
            
            return $done({mode: "normal"});
        }
    } catch (e) {
        console.error(`智能省电错误: ${e.message}`);
        return $done({error: e.message});
    }
}

// === 初始化阶段 ===
// 检查是否支持事件API
const isEventAPISupported = typeof $surge.event !== 'undefined' && 
                           typeof $surge.event.listen === 'function';

// 检查是否支持定时器API
const isTimerAPISupported = typeof $timer !== 'undefined' && 
                           typeof $timer.schedule === 'function';

// 支持事件API时注册监听器
if (isEventAPISupported) {
    console.log("注册事件监听器");
    $surge.event.listen("NETWORK_CHANGED", () => {
        console.log("网络状态变化触发");
        managePowerSaving();
    });
    
    $surge.event.listen("MEMORY_WARNING", () => {
        console.log("内存告警触发");
        managePowerSaving();
    });
} else {
    console.log("事件API不可用，跳过注册");
}

// 支持定时器API时设置定时检查
if (isTimerAPISupported) {
    console.log("设置定时检查");
    $timer.schedule({
        interval: CHECK_INTERVAL,
        handler: managePowerSaving
    });
} else {
    console.log("定时器API不可用，跳过设置");
}

// 初始执行
managePowerSaving();

$done();
