import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer;

// init();
// render();

function init(gltfFilePath, folderPath) {
    const container = document.querySelector('.viewer');

    let fieldOfView = 75; // Поле зрения
    let aspectRatio = container.clientWidth / container.clientHeight; // Соотношение сторон
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio);

    let cameraPosition = [7, 3, 7] // Позиция камеры (x, y, z)
    camera.position.set(...cameraPosition);

    // Создание сцены
    scene = new THREE.Scene();

    const hlight = new THREE.AmbientLight(0x404040, 1);
    scene.add(hlight);

    let directionalLightBack = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 100%)'), 1);
    directionalLightBack.position.set(30, 100, 100);
    scene.add(directionalLightBack);

    let directionalLightFront = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 100%)'), 1);
    directionalLightFront.position.set(-30, 100, -100);
    scene.add(directionalLightFront);

    /////
    new RGBELoader()
        .setPath('backgrounds')
        .load('/default.hdr', function (texture) {

            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

            render();

            // model

            const loader = new GLTFLoader().setPath('scenes/' + folderPath + '/');
            loader.load(gltfFilePath + '.gltf', function (gltf) {
                scene.add(gltf.scene);
                render();
            });

        });
    ////
    // const loader = new GLTFLoader().setPath('scenes/' + folderPath + '/');
    // loader.load(gltfFilePath + '.gltf', function (gltf) {
    //     scene.add(gltf.scene);
    //     render();
    // });

    // Создание рендера со сглаживанием (antialias: true)
    renderer = new THREE.WebGLRenderer({antialias: true});

    //Устанавливает соотношение пикселей устройства, чтобы предотвратить размытие выходного холста
    renderer.setPixelRatio(window.devicePixelRatio);

    // Установка размеров окна для рендера
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Устанавливает тон изображения (Более яркие цвета)
    renderer.toneMapping = THREE.LinearToneMapping;

    // Устанавливает уровень экспозиции
    renderer.toneMappingExposure = 1.8;

    // Определяет выходную кодировку средства визуализации
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    // Позволяет камере двигаться по орбите вокруг цели
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 2;
    controls.maxDistance = 20;

    // Устанавливает точку, вокруг которой камера будет двигаться
    controls.target.set(0, 0, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    // Обновляет матрицу проекции камеры
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function render() {
    renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', (event) => {
    let list = document.querySelectorAll('.file');
    list.forEach((item) => {
        item.addEventListener('click', (event) => {
            let viewer = document.querySelector('.viewer');
            viewer.innerHTML = "";

            let target = event.target;
            let binFilePath = target.getAttribute('data-bin');
            let gltfFilePath = target.getAttribute('data-gltf');
            let folderPath = target.getAttribute('data-folder');

            if (binFilePath !== gltfFilePath) {
                alert('bin and gltf files name are not equal');
            } else {
                init(gltfFilePath, folderPath);
                render();
            }
        });
    });
});