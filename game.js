const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.18, 0.18, 0.28);

const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
camera.lowerRadiusLimit = 5;
camera.upperRadiusLimit = 50;

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);

// Beispiel-Charakter
const player = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 1 }, scene);
player.position.y = 0.5;
player.position.x = -5;
player.position.z = -5;

const playerLabel = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
const playerText = new BABYLON.GUI.TextBlock();
playerText.text = "🧍 Spielerstärke: 1";
playerText.color = "white";
playerText.fontSize = 18;
playerText.top = "-45%";
playerText.left = "-45%";
playerText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
playerText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
playerLabel.addControl(playerText);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
