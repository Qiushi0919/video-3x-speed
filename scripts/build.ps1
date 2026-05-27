$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist"
$package = Join-Path $dist "video-speed-freestyle-chrome-web-store.zip"
$staging = Join-Path $dist "package"

if (Test-Path -LiteralPath $staging) {
  Remove-Item -LiteralPath $staging -Recurse -Force
}

New-Item -ItemType Directory -Path $staging -Force | Out-Null

$include = @(
  "manifest.json",
  "content.js",
  "popup.html",
  "popup.css",
  "popup.js",
  "LICENSE",
  "images"
)

foreach ($item in $include) {
  $source = Join-Path $root $item
  $target = Join-Path $staging $item
  if ((Get-Item -LiteralPath $source).PSIsContainer) {
    Copy-Item -LiteralPath $source -Destination $target -Recurse
  } else {
    Copy-Item -LiteralPath $source -Destination $target
  }
}

if (Test-Path -LiteralPath $package) {
  Remove-Item -LiteralPath $package -Force
}

Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $package -Force
Remove-Item -LiteralPath $staging -Recurse -Force

Write-Host "Created $package"
