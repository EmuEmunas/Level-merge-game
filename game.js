
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let playerStrength = 1;
let playerMesh = null;

const createLabel = (text, color = "red") => {
    const plane = BABYLON.MeshBuilder.CreatePlane("labelPlane", {width: 1, height: 0.5});
    plane.isPickable = false;
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    const label = new BABYLON.GUI.TextBlock();
    label.text = text;
    label.color = "white";
    label.background = color;
    label.fontSize = 100;
    advancedTexture.addControl(label);
    return plane;
};

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);

    // Spieler als Kegel
    playerMesh = BABYLON.MeshBuilder.CreateCylinder("player", {diameterTop: 0, diameterBottom: 1, height: 2}, scene);
    playerMesh.position.y = 1;
    const playerMaterial = new BABYLON.StandardMaterial("playerMat", scene);
    playerMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
    playerMesh.material = playerMaterial;

    const playerLabel = createLabel(`👤 ${playerStrength}`, "blue");
    playerLabel.parent = playerMesh;
    playerLabel.position.y = 2.2;

    const enemyLevels = [1, 2, 3];
    const enemyMeshes = [];

    enemyLevels.forEach((level, index) => {
        const enemy = BABYLON.MeshBuilder.CreateSphere(`enemy${index}`, {diameter: 1}, scene);
        enemy.position = new BABYLON.Vector3(index * 2 - 2, 0.5, 3);
        const enemyMaterial = new BABYLON.StandardMaterial(`enemyMat${index}`, scene);
        enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        enemy.material = enemyMaterial;

        const label = createLabel(`Lvl ${level}`);
        label.parent = enemy;
        label.position.y = 1.2;

        enemy.level = level;
        enemyMeshes.push(enemy);
    });

    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh && pointerInfo.pickInfo.pickedMesh.level !== undefined) {
            const enemy = pointerInfo.pickInfo.pickedMesh;
            if (playerStrength >= enemy.level) {
                playerStrength += enemy.level;
                enemy.dispose();
                if (playerMesh && playerMesh.getChildMeshes()[0]) {
                    playerMesh.getChildMeshes()[0].dispose();
                }
                const newLabel = createLabel(`👤 ${playerStrength}`, "blue");
                newLabel.parent = playerMesh;
                newLabel.position.y = 2.2;
            } else {
                alert("Der Gegner war zu stark! Versuche es erneut.");
                location.reload();
            }
        }
    }, BABYLON.PointerEventTypes.POINTERPICK);

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => {
    engine.resize();
});
