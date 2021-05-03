import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Axis helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Group
const group = new THREE.Group();
scene.add(group);

/**
 * Loading manager
 */
const loader = new THREE.LoadingManager();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader(loader);
const matcapTexture = textureLoader.load('/textures/matcaps/7.png');

/**
 * Mesh
 */
let textMesh;
let donuts = [];

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader(loader);

const text = `
Creative
Frontend
Developer
`;

fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  const textGeometry = new THREE.TextGeometry(
    'Hello Three.js',
    {
      font,
      size: 0.5,
      height: 0.2,
      cuverSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4
    }
  );
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
  });
  // textMaterial.wireframe = true;
  textMesh = new THREE.Mesh(textGeometry, material);
  group.add(textMesh);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i <= 350; i++) {
    donuts[i] = new THREE.Mesh(donutGeometry, material);

    // donut.position.
    // donut.position.
    // donut.position.

    // donut.rotation.x = Math.random() * Math.PI;
    // donut.rotation.y = Math.random() * Math.PI;

    donuts[i].endposition = {
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 18
    }

    donuts[i].endrotation = {
      x: Math.random() * Math.PI,
      y: Math.random() * Math.PI
    }

    // const scale = Math.random();
    // donut[i].scale.set(scale, scale, scale);

    group.add(donuts[i]);
  }
});

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0
};

window.addEventListener('mousemove', event => {
  cursor.x = event.clientX / window.innerWidth - 0.5;
  cursor.y = - (event.clientY / window.innerHeight - 0.5);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 20;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock();

const init = () => {
  console.log('Init');


};

const tick = () => {
  console.log('Tick');

  const elapsedTime = clock.getElapsedTime();

  // Update camera on mouse move
  gsap.to(camera.position, {
    duration: 1,
    x: cursor.x * 10,
    y: cursor.y * 10,
    onUpdate: function () {
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  });

  gsap.to(group.rotation, {
    duration: 25,
    x: Math.sin(elapsedTime),
    y: Math.cos(elapsedTime)
  });

  if (textMesh) {
    gsap.to(textMesh.rotation, {
      duration: 20,
      x: - Math.sin(elapsedTime),
      y: - Math.cos(elapsedTime)
    });
  }

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

/**
 * Initialize
 */

// loader.onStart = () => {
//   console.log('On Start');
// };

// loader.onProgress = (item, loaded, total) => {
//   console.log('On Progress', item, loaded, total);
// };

loader.onLoad = () => {
  console.log('Loaded');

  init();
  tick();
};

// loader.onError = () => {
//   console.log('On Error');
// };