import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";
import * as GUI from "https://cdn.babylonjs.com/gui/babylon.gui.min.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.18, 0.18, 0.25);

const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3.5, 25, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 16, height: 16 }, scene);
ground.position.y = 0;

const player = BABYLON.MeshBuilder.CreateBox("player", { size: 1 }, scene);
player.position = new BABYLON.Vector3(-6, 0.5, 0);
let playerStrength = 1;

const playerLabel = createWorldLabel(player, "🧍 Stärke: 1");

function createWorldLabel(target, text) {
  const plane = BABYLON.MeshBuilder.CreatePlane("label", { width: 2, height: 0.6 }, scene);
  plane.parent = target;
  plane.position.y = 1.5;
  const tex = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
  const label = new GUI.TextBlock();
  label.text = text;
  label.color = "white";
  label.fontSize = 50;
  tex.addControl(label);
  return label;
}

function createEnemy(position, level) {
  const enemy = BABYLON.MeshBuilder.CreateSphere("enemy", { diameter: 1 }, scene);
  enemy.position = position.add(new BABYLON.Vector3(0, 0.5, 0));
  enemy.metadata = { strength: level };

  const labelPlane = BABYLON.MeshBuilder.CreatePlane("enemyLabel", { width: 1, height: 0.5 }, scene);
  labelPlane.position = new BABYLON.Vector3(0, 1.3, 0);
  labelPlane.parent = enemy;
  const tex = GUI.AdvancedDynamicTexture.CreateForMesh(labelPlane);
  const label = new GUI.TextBlock();
  label.text = "Lvl " + level;
  label.color = "white";
  label.fontSize = 40;
  label.background = "red";
  tex.addControl(label);

  return enemy;
}

const enemies = [
  createEnemy(new BABYLON.Vector3(-2, 0, 0), 1),
  createEnemy(new BABYLON.Vector3(2, 0, 0), 2),
  createEnemy(new BABYLON.Vector3(6, 0, 0), 3),
];

scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
    const picked = pointerInfo.pickInfo.pickedMesh;
    if (picked && picked.name.startsWith("enemy")) {
      const enemy = picked;
      const strength = enemy.metadata.strength;

      if (strength <= playerStrength) {
        playerStrength += strength;
        playerLabel.text = "🧍 Stärke: " + playerStrength;
        enemy.dispose();
      } else {
        alert("🛑 Gegner war zu stark! Versuch es erneut.");
        resetGame();
      }
    }
  }
});

function resetGame() {
  player.position = new BABYLON.Vector3(-6, 0.5, 0);
  playerStrength = 1;
  playerLabel.text = "🧍 Stärke: 1";

  enemies.forEach(e => e.dispose());
  enemies.length = 0;

  enemies.push(
    createEnemy(new BABYLON.Vector3(-2, 0, 0), 1),
    createEnemy(new BABYLON.Vector3(2, 0, 0), 2),
    createEnemy(new BABYLON.Vector3(6, 0, 0), 3),
  );
}

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
