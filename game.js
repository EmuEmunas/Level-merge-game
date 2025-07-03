// Dummy game.js content for simulation
window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  const player = BABYLON.MeshBuilder.CreateCylinder("player", {diameterTop: 0, diameterBottom: 1, height: 2}, scene);
  player.position.y = 1;
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
  engine.runRenderLoop(() => scene.render());
});
