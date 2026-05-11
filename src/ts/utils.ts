import type { WebGLRenderer, Scene } from "three";
import * as THREE from "three";

export function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  return true;
}

export function addLight(x: number, y: number, z: number, scene: Scene) {
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  scene.add(light);
}
