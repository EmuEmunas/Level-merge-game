import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";
import * as GUI from "https://cdn.babylonjs.com/gui/babylon.gui.min.js";

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
        const player = BABYLON.MeshBuilder.CreateCylinder("player", { diameterTop: 0, diameterBottom: 1, height: 2 }, scene);
        player.position.y = 1;

        const playerLabel = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const label = new GUI.Rectangle("label");
        label.background = "blue";
        label.height = "30px";
        label.width = "60px";
        label.cornerRadius = 5;
        label.thickness = 1;
        label.linkOffsetY = -60;
        playerLabel.addControl(label);
        label.linkWithMesh(player);
        const text = new GUI.TextBlock();
        text.text = "Lvl 1";
        text.color = "white";
        label.addControl(text);

        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
});