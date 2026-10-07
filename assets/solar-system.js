import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const objects = [
  { name: "Matahari", color: 0xffb547, size: 1.15, distance: 0, type: "Bintang", description: "Bintang di pusat Tata Surya. Cahayanya menjadi sumber energi utama bagi planet-planet.", period: 0 },
  { name: "Merkurius", color: 0x9b938b, size: .2, distance: 2.1, type: "Planet kebumian", description: "Planet terkecil dan yang paling dekat dengan Matahari. Permukaannya dipenuhi kawah.", period: 4.1 },
  { name: "Venus", color: 0xe7b776, size: .31, distance: 3.05, type: "Planet kebumian", description: "Atmosfernya yang tebal memerangkap panas, menjadikannya planet terpanas.", period: 6.2 },
  { name: "Bumi", color: 0x4e94ff, size: .34, distance: 4.1, type: "Planet kebumian", description: "Rumah kita dan satu-satunya planet yang diketahui memiliki kehidupan.", period: 8.8 },
  { name: "Mars", color: 0xe36e4d, size: .27, distance: 5.2, type: "Planet kebumian", description: "Planet merah dengan gunung berapi raksasa, lembah, dan jejak air purba.", period: 11.5 },
  { name: "Jupiter", color: 0xd4a477, size: .7, distance: 7.05, type: "Raksasa gas", description: "Planet terbesar, terkenal dengan Bintik Merah Besar dan banyak satelit alami.", period: 16 },
  { name: "Saturnus", color: 0xe5cd91, size: .59, distance: 9.05, type: "Raksasa gas", description: "Raksasa gas yang memiliki sistem cincin luas dan tersusun terutama dari es serta batu.", period: 20 },
  { name: "Uranus", color: 0x83d8dc, size: .43, distance: 11.05, type: "Raksasa es", description: "Raksasa es berwarna biru-hijau yang berotasi dengan kemiringan sumbu ekstrem.", period: 24 },
  { name: "Neptunus", color: 0x4267df, size: .42, distance: 13.1, type: "Raksasa es", description: "Planet terjauh dari Matahari, dengan atmosfer sangat dingin dan angin yang kuat.", period: 28 }
];

const host = document.querySelector("#solar-view");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050812);
const camera = new THREE.PerspectiveCamera(48, 1, .1, 100);
camera.position.set(2, 12, 19);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(host.clientWidth, host.clientHeight);
host.prepend(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 8;
controls.maxDistance = 32;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xffffff, .42));
const sunLight = new THREE.PointLight(0xffffff, 110, 45, 1.6);
scene.add(sunLight);

const starPositions = new Float32Array(1800 * 3);
for (let i = 0; i < starPositions.length; i += 3) {
  starPositions[i] = (Math.random() - .5) * 80;
  starPositions[i + 1] = (Math.random() - .5) * 50;
  starPositions[i + 2] = (Math.random() - .5) * 80;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xd7e0ff, size: .075 })));

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(objects[0].size, 40, 32),
  new THREE.MeshBasicMaterial({ color: objects[0].color })
);
scene.add(sun);
const sunGlow = new THREE.Mesh(
  new THREE.SphereGeometry(objects[0].size * 1.22, 32, 24),
  new THREE.MeshBasicMaterial({ color: 0xffa438, transparent: true, opacity: .11, side: THREE.BackSide })
);
scene.add(sunGlow);

const planets = objects.slice(1).map((item, index) => {
  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(item.distance - .008, item.distance + .008, 128),
    new THREE.MeshBasicMaterial({ color: 0x59627c, transparent: true, opacity: .28, side: THREE.DoubleSide })
  );
  orbit.rotation.x = -Math.PI / 2;
  scene.add(orbit);

  const pivot = new THREE.Group();
  scene.add(pivot);
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(item.size, 32, 24),
    new THREE.MeshStandardMaterial({ color: item.color, roughness: .86, metalness: .02 })
  );
  mesh.position.x = item.distance;
  pivot.add(mesh);

  if (item.name === "Saturnus") {
    const rings = new THREE.Mesh(
      new THREE.RingGeometry(item.size * 1.25, item.size * 2.05, 64),
      new THREE.MeshStandardMaterial({ color: 0xd8c18c, transparent: true, opacity: .78, side: THREE.DoubleSide })
    );
    rings.rotation.x = Math.PI / 2.35;
    mesh.add(rings);
  }

  pivot.rotation.y = index * .73;
  return { item, pivot, mesh };
});

const nameElement = document.querySelector("#planet-name");
const descriptionElement = document.querySelector("#planet-description");
const orderElement = document.querySelector("#planet-order");
const typeElement = document.querySelector("#planet-type");
const list = document.querySelector("#planet-list");
const buttons = new Map();

function selectObject(item, button) {
  nameElement.textContent = item.name;
  descriptionElement.textContent = item.description;
  orderElement.textContent = item.name === "Matahari" ? "Pusat sistem" : `${objects.indexOf(item)} dari Matahari`;
  typeElement.textContent = item.type;
  buttons.forEach((entry) => entry.setAttribute("aria-pressed", String(entry === button)));
}

objects.forEach((item) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "planet-button";
  button.textContent = item.name;
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => selectObject(item, button));
  buttons.set(item.name, button);
  list.append(button);
});
selectObject(objects[0], buttons.get("Matahari"));

function resize() {
  const width = host.clientWidth;
  const height = host.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
new ResizeObserver(resize).observe(host);

function animate() {
  requestAnimationFrame(animate);
  planets.forEach(({ item, pivot, mesh }) => {
    pivot.rotation.y += .0006 * (30 / item.period);
    mesh.rotation.y += .006;
  });
  sun.rotation.y += .001;
  controls.update();
  renderer.render(scene, camera);
}
animate();
