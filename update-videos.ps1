<#
.SYNOPSIS
    Pulsenmore Clinical Scan Gallery - Video Scanner & Watcher
.DESCRIPTION
    Scans the /videos directory for ultrasound clips (.mp4, .mov, .webm)
    and updates videos/videos.json.
    Can also run continuously in -Watch mode to auto-update when files are added.
.EXAMPLE
    .\update-videos.ps1
    .\update-videos.ps1 -Watch
#>

param(
    [switch]$Watch
)

$VideosDir = Join-Path $PSScriptRoot "videos"
$ManifestPath = Join-Path $VideosDir "videos.json"

function Update-VideoManifest {
    if (-not (Test-Path $VideosDir)) {
        Write-Warning "Directory '$VideosDir' does not exist."
        return
    }

    $validExtensions = @(".mp4", ".mov", ".webm")
    $videoFiles = Get-ChildItem -Path $VideosDir -File | Where-Object {
        $validExtensions -contains $_.Extension.ToLower()
    } | Select-Object -ExpandProperty Name | Sort-Object

    $jsonContent = $videoFiles | ConvertTo-Json -Depth 2
    Set-Content -Path $ManifestPath -Value $jsonContent -Encoding UTF8

    $count = ($videoFiles | Measure-Object).Count
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$timestamp] Successfully synced $count video files to $ManifestPath" -ForegroundColor Green
}

# Run immediately once
Update-VideoManifest

# If -Watch is enabled, start FileSystemWatcher
if ($Watch) {
    Write-Host "`nWatching '$VideosDir' for new ultrasound video files (Press Ctrl+C to stop)..." -ForegroundColor Cyan

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $VideosDir
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true

    $action = {
        param($source, $eventArgs)
        $ext = [System.IO.Path]::GetExtension($eventArgs.FullPath).ToLower()
        if (@(".mp4", ".mov", ".webm") -contains $ext) {
            Start-Sleep -Milliseconds 500
            Update-VideoManifest
        }
    }

    Register-ObjectEvent $watcher 'Created' -Action $action | Out-Null
    Register-ObjectEvent $watcher 'Deleted' -Action $action | Out-Null
    Register-ObjectEvent $watcher 'Renamed' -Action $action | Out-Null

    while ($true) {
        Start-Sleep -Seconds 1
    }
}
