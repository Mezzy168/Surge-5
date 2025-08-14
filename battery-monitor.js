// battery-monitor.js
const LOW_BATTERY_THRESHOLD = 0.2; // 20%

function monitorBattery() {
  try {
    const batteryLevel = $device.batteryLevel;
    const isCharging = $device.isCharging;
    
    if (batteryLevel < LOW_BATTERY_THRESHOLD && !isCharging) {
      console.log(`电量过低 (${batteryLevel*100}%)，暂停非必要任务`);
      
      // 暂停内存清理脚本
      $surge.disableScript("memory-cleaner");
      $surge.disableScript("memory-monitor");
      
      // 减少网络活动
      $surge.setConfig("reduce-background-activity", "true");
      
      return {action: "low_power_mode"};
    } else {
      // 恢复脚本
      $surge.enableScript("memory-cleaner");
      $surge.enableScript("memory-monitor");
      $surge.setConfig("reduce-background-activity", "auto");
      
      return {status: "normal"};
    }
  } catch (e) {
    console.error(`电量监控错误: ${e.message}`);
    return {error: e.message};
  }
}

$done(monitorBattery());