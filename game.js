
window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

    // Spieler-Kegel
    const player = BABYLON.MeshBuilder.CreateCylinder("player", { diameterTop: 0, diameterBottom: 1, height: 2 }, scene);
    player.position.y = 1;

    // GUI-Text für Spieler
    const guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const playerLabel = new BABYLON.GUI.Rectangle();
    playerLabel.width = "60px";
    playerLabel.height = "30px";
    playerLabel.cornerRadius = 5;
    playerLabel.color = "white";
    playerLabel.thickness = 1;
    playerLabel.background = "blue";
    guiTexture.addControl(playerLabel);

    const labelText = new BABYLON.GUI.TextBlock();
    labelText.text = "Lvl 1";
    labelText.color = "white";
    playerLabel.addControl(labelText);

    playerLabel.linkWithMesh(player);
    playerLabel.linkOffsetY = -100;

    return scene;
  };

  const scene = createScene();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
});
