$ErrorActionPreference = 'Stop'
$child = $null
$status = 0
# Quote forwarded arguments for native Windows parsing.
$cargoArguments = (@('run', '--locked', '--features', 'catalog', '--bin', 'catalog', '--', 'serve') + $args | ForEach-Object {
    '"' + (($_ -replace '(\\*)"', '$1$1\"') -replace '(\\+)$', '$1$1') + '"'
}) -join ' '
try {
    $child = Start-Process cargo -ArgumentList $cargoArguments -NoNewWindow -PassThru
    while (!$child.HasExited) { Start-Sleep -Milliseconds 200 }
    $status = $child.ExitCode
} finally {
    if ($null -ne $child) {
        if (!$child.HasExited) {
            & powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$PSScriptRoot/stop-dev.ps1" $child.Id
            if ($LASTEXITCODE -ne 0) { $status = 1 }
        }
        $child.WaitForExit()
        $child.Dispose()
    }
}
exit $status
