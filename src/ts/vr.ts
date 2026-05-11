import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { addLight } from "./utils.ts";

import Teline from "../data/teline.glb?inline";

const timer = new THREE.Timer();
timer.connect(document);
let mixer: THREE.AnimationMixer;

let container = document.createElement("div");
document.body.appendChild(container);

const scene = new THREE.Scene();
scene.background = new THREE.Color("lightblue");

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(10.0, 0.0, 0.0);

const controls = new OrbitControls(camera, container);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// const floorGeometry = new THREE.PlaneGeometry(4, 4);
// const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2;
// floor.receiveShadow = true;
// scene.add(floor);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.xr.enabled = true;

container.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

addLight(-1, 2, 4, scene);
addLight(1, -1, -2, scene);

renderer.setAnimationLoop(render);

let model: THREE.Group | null = null;

const loader = new GLTFLoader();
console.log("Loading model from:", Teline);
loader.load(
  Teline,
  (gltf) => {
    model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    console.log("Model size:", size);
    console.log("Model center:", center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 10 / maxDim;
    model.scale.setScalar(scale);

    model.position.x = -center.x * scale;
    model.position.y = -center.y * scale;
    model.position.z = -center.z * scale;

    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    for (let i = 0; i < gltf.animations.length; i++) {
      mixer.clipAction(gltf.animations[i]).play();
    }
  },
  (progress) => {
    if (progress.total > 0) {
      console.log("Loading:", ((progress.loaded / progress.total) * 100).toFixed(1) + "%");
    }
  },
  (error) => {
    console.error("Error loading GLTF:", error);
  },
);

function render() {
  timer.update();
  const delta = timer.getDelta();

  if (model) {
    model.rotation.y += delta * 0.3;
  }

  if (mixer) {
    mixer.update(delta);
  }

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
