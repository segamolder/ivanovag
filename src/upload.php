<?php
$scenesDir = __DIR__ . "/../scenes/";

$fileName = basename($_FILES["fileToUpload"]["name"]);
$filePath = $scenesDir . basename($_FILES["fileToUpload"]["name"]);
$tmpFilePath = $_FILES["fileToUpload"]["tmp_name"];
$fileNoExt = basename($fileName, '.zip');
$targetDir = $scenesDir . $fileNoExt;

removeFolderIfExist($targetDir);
createFilesFolder($targetDir);

if (move_uploaded_file($tmpFilePath, $filePath)) {
    $zip = new \ZipArchive();
    $openedZip = $zip->open($filePath);
    if ($openedZip === true) {
        $zip->extractTo($targetDir);
        $zip->close();

        unlink($filePath);
    }
    $message = "Your .zip file was uploaded and unpacked.";
} else {
    $message = "There was a problem with the upload. Please try again.";
}

header('Location: ' . $_SERVER['HTTP_REFERER']);

function removeFolderIfExist($targetDir)
{
    if (is_dir($targetDir)) {
        rmdirRecursive($targetDir);
    }
}

function createFilesFolder($targetDir)
{
    if (!mkdir($targetDir, 0777) && !is_dir($targetDir)) {
        throw new \RuntimeException(sprintf('Directory "%s" was not created', $targetDir));
    }
}

function rmdirRecursive($dir) {
    foreach(scandir($dir) as $file) {
        if ('.' === $file || '..' === $file) continue;
        if (is_dir("$dir/$file")) rmdirRecursive("$dir/$file");
        else unlink("$dir/$file");
    }

    rmdir($dir);
}