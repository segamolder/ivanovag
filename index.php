<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blender.gltf Files Viewer</title>
    <link rel="stylesheet" href="style.css?<?=time()?>">
</head>
<body>
<header>
    <h1>Blender.gltf Files Viewer</h1>
    <div class="uploader">
        <form action="/src/upload.php" method="post" enctype="multipart/form-data">
            <input type="file" name="fileToUpload" id="fileToUpload" accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed">
            <input type="submit" value="Загрузить" name="submit">
        </form>
    </div>
</header>
<section>
    <div class="files">
        <ul>
            <?php
            $mainScenesDirPath = "scenes";
            $folders = scandir($mainScenesDirPath);
            foreach ($folders as $folder) {
                if ($folder != '.' && $folders != '..' && ($files = scandir($mainScenesDirPath . DIRECTORY_SEPARATOR . $folder))) {
                    $binFile = '';
                    $gltfFile = '';

                    foreach ($files as $file) {
                        if (strpos($file, '.bin') !== false) {
                            $binFile = rtrim($file, '.bin');
                        }
                        if (strpos($file, '.gltf') !== false) {
                            $gltfFile = rtrim($file, '.gltf');
                        }
                    }

                    if ($binFile && $gltfFile) {
                        echo '<li class="file" data-folder="' . $folder . '" data-bin="' . $binFile . '" data-gltf="' . $gltfFile . '">' . $folder . '</li>';
                    }
                }
            }
            ?>
        </ul>
    </div>
    <div class="viewer">

    </div>
</section>

<!--local three.js library-->
<script async src="js/modules/es-module-shims.js"></script>
<script type="importmap">
{
	"imports": {
		"three": "/js/modules/three.module.js",
		"three/addons/": "/js/modules/three-addons/"
	}
}




</script>

<!--external three.js library-->
<!--<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>-->
<!--<script type="importmap">-->
<!--{-->
<!--	"imports": {-->
<!--		"three": "https://unpkg.com/three@0.149.0/build/three.module.js",-->
<!--		"three/addons/": "https://unpkg.com/three@0.149.0/examples/jsm/"-->
<!--	}-->
<!--}-->
<!--</script>-->

<script type="module" src="js/script.js?<?=time()?>"></script>
</body>
</html>