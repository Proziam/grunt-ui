param([Parameter(Mandatory = $true)][int]$ProcessId)

$ErrorActionPreference = 'Stop'
$root = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
if ($null -eq $root) { exit 0 }

# Retain handles before terminating the tree so PID reuse cannot change what
# we wait for. Bacon supplies the native Windows PID of its job process.
$processes = @($root)
$snapshot = @(Get-CimInstance Win32_Process)
$parents = @($ProcessId)
while ($parents.Count -gt 0) {
    $children = @($snapshot | Where-Object { $_.ParentProcessId -in $parents })
    $parents = @($children | ForEach-Object { [int]$_.ProcessId })
    foreach ($childId in $parents) {
        $child = Get-Process -Id $childId -ErrorAction SilentlyContinue
        if ($null -ne $child) { $processes += $child }
    }
}
foreach ($process in $processes) { $null = $process.Handle }

$killer = Start-Process taskkill.exe -ArgumentList @('/PID', $ProcessId, '/T', '/F') -NoNewWindow -Wait -PassThru
$killer.Dispose()
foreach ($process in $processes) {
    if (!$process.HasExited) { $process.Kill() }
    $process.WaitForExit()
    $process.Dispose()
}
