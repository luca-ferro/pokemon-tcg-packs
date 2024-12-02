$i = 1
Get-ChildItem -Filter *.png | 
Sort-Object LastWriteTime | 
ForEach-Object {
    Rename-Item $_ -NewName "$i.png"
    $i++
}