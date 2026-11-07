# Builds AnormalMath.apk with the Android SDK tools directly вЂ” no Gradle.
$ErrorActionPreference = 'Stop'

$ROOT = 'N:\DeepSeekHarness\apk\anormalmath'
$ANDROID = "$ROOT\mobile\android"
$BUILD = "$ROOT\mobile\build"
$OUT = 'N:\DeepSeekHarness\apk\out'
$BT = 'N:\Android\build-tools\36.0.0'
$JAR = 'N:\Android\platforms\android-34\android.jar'
$JAVA = 'N:\Microsoft\jdk-21.0.11.10-hotspot\bin'
$KS = "$OUT\anorm.jks"
$PASS = 'anorm2026build'

$env:JAVA_HOME = 'N:\Microsoft\jdk-21.0.11.10-hotspot'
$env:PATH = "$JAVA;$env:PATH"

Write-Host '== 1. sources =='
# assets are packed by hand further down: aapt2 -A writes backslash paths on Windows,
# which the WebView asset loader cannot resolve.
$www = "$ROOT\mobile\www"
if (-not (Test-Path "$www\index.html")) { throw 'mobile/www is missing index.html' }

Write-Host '== 2. resources =='
if (Test-Path $BUILD) { Remove-Item $BUILD -Recurse -Force }
New-Item -ItemType Directory -Force -Path $BUILD, "$BUILD\classes", "$BUILD\dex" | Out-Null
& "$BT\aapt2.exe" compile --dir "$ANDROID\res" -o "$BUILD\res.zip"
if ($LASTEXITCODE -ne 0) { throw 'aapt2 compile failed' }

Write-Host '== 3. link =='
& "$BT\aapt2.exe" link -o "$BUILD\base.apk" -I $JAR --manifest "$ANDROID\AndroidManifest.xml" `
    --java "$BUILD\gen" "$BUILD\res.zip"
if ($LASTEXITCODE -ne 0) { throw 'aapt2 link failed' }

Write-Host '== 4. javac =='
$sources = @(Get-ChildItem "$ANDROID\java" -Recurse -Filter *.java | ForEach-Object { $_.FullName })
$rjava = @(Get-ChildItem "$BUILD\gen" -Recurse -Filter R.java -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName })
$jargs = @('-source', '8', '-target', '8', '-nowarn', '-classpath', $JAR, '-d', "$BUILD\classes") + $sources + $rjava
& "$JAVA\javac.exe" @jargs
if ($LASTEXITCODE -ne 0) { throw 'javac failed' }

Write-Host '== 5. d8 =='
$classes = @(Get-ChildItem "$BUILD\classes" -Recurse -Filter *.class | ForEach-Object { $_.FullName })
& "$BT\d8.bat" --lib $JAR --min-api 24 --output "$BUILD\dex" @classes
if ($LASTEXITCODE -ne 0) { throw 'd8 failed' }

Write-Host '== 6. package dex + assets =='
Add-Type -AssemblyName System.IO.Compression.FileSystem
$apk = "$BUILD\base.apk"
$zip = [IO.Compression.ZipFile]::Open($apk, 'Update')

function Add-Entry($zip, $file, $name) {
    $existing = $zip.GetEntry($name)
    if ($existing) { $existing.Delete() }
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, $name, 'Optimal') | Out-Null
}

Add-Entry $zip "$BUILD\dex\classes.dex" 'classes.dex'

# assets/www/** with forward slashes, exactly as AssetManager expects
$www = "$ROOT\mobile\www"
$files = @(Get-ChildItem $www -Recurse -File)
foreach ($f in $files) {
    $rel = $f.FullName.Substring($www.Length + 1).Replace('\', '/')
    Add-Entry $zip $f.FullName "assets/www/$rel"
}
$zip.Dispose()
Write-Host ("   packed {0} asset files" -f $files.Count)

Write-Host '== 7. align + sign =='
& "$BT\zipalign.exe" -p -f 4 $apk "$BUILD\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw 'zipalign failed' }

$final = "$OUT\AnormalMath-1.0.2.apk"
& "$BT\apksigner.bat" sign --ks $KS --ks-key-alias anorm --ks-pass "pass:$PASS" --key-pass "pass:$PASS" `
    --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true `
    --out $final "$BUILD\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw 'apksigner failed' }

Write-Host '== 8. verify =='
& "$BT\apksigner.bat" verify --print-certs $final
& "$BT\zipalign.exe" -c -p 4 $final
""
Get-Item $final | Select-Object FullName, @{n='MB';e={[math]::Round($_.Length/1MB,2)}} | Format-Table -AutoSize

