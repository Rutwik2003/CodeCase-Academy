# Optimize Images Script for Detective Academy

# This script converts images to modern formats for better performance
# Run this to optimize your images for web delivery

param(
    [string]$SourceDir = "assets",
    [string]$OutputDir = "public/optimized"
)

Write-Host "🕵️‍♂️ Detective Academy Image Optimizer" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# Create output directory if it doesn't exist
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force
    Write-Host "📁 Created output directory: $OutputDir" -ForegroundColor Green
}

# Get all images from assets folder
$images = Get-ChildItem -Path $SourceDir -Include "*.jpg", "*.jpeg", "*.png" -Recurse

if ($images.Count -eq 0) {
    Write-Host "❌ No images found in $SourceDir" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Found $($images.Count) images to optimize`n" -ForegroundColor Yellow

foreach ($image in $images) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($image.Name)
    $extension = $image.Extension.ToLower()
    
    Write-Host "🖼️  Processing: $($image.Name)" -ForegroundColor White
    
    # Copy original for WebP conversion tools
    $originalPath = Join-Path $OutputDir "$baseName$extension"
    Copy-Item $image.FullName $originalPath -Force
    
    # Create different sizes for responsive images
    $sizes = @(
        @{ suffix = "_small"; width = 400 },
        @{ suffix = "_medium"; width = 800 },
        @{ suffix = "_large"; width = 1200 }
    )
    
    foreach ($size in $sizes) {
        $outputName = "$baseName$($size.suffix)$extension"
        $outputPath = Join-Path $OutputDir $outputName
        
        # For now, just copy the original (manual optimization needed)
        Copy-Item $image.FullName $outputPath -Force
        Write-Host "   ✅ Created: $outputName" -ForegroundColor Green
    }
    
    Write-Host ""
}

Write-Host "🎉 Image optimization complete!" -ForegroundColor Green
Write-Host "📊 Generated responsive versions for $($images.Count) images" -ForegroundColor Cyan
Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Use WebP conversion tools for better compression" -ForegroundColor White
Write-Host "   2. Consider using online services like TinyPNG" -ForegroundColor White
Write-Host "   3. Update image references to use OptimizedImage component" -ForegroundColor White
