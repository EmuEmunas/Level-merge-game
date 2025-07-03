// Spiel mit Babylon.js
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let playerStrength = 1;
let playerMesh;

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20;

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15);
    ground.material = groundMaterial;

    // GUI
    const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    function createLabel(text) {
        const rect = new BABYLON.GUI.Rectangle();
        rect.background = "red";
        rect.height = "24px";
        rect.width = "50px";
        rect.cornerRadius = 5;
        rect.thickness = 1;
        rect.color = "white";
        gui.addControl(rect);

        const label = new BABYLON.GUI.TextBlock();
        label.text = text;
        label.color = "white";
        label.fontSize = 14;
        rect.addControl(label);

        return rect;
    }

    function createEnemy(name, level, posX, posZ) {
        const enemy = BABYLON.MeshBuilder.CreateSphere(name, { diameter: 1 }, scene);
        enemy.position = new BABYLON.Vector3(posX, 0.5, posZ);
        enemy.level = level;

        const label = createLabel("Lvl " + level);
        label.linkWithMesh(enemy);
        label.linkOffsetY = -30;

        enemy.actionManager = new BABYLON.ActionManager(scene);
        enemy.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            if (!playerMesh) return;

            if (playerStrength >= enemy.level) {
                playerStrength += enemy.level;
                enemy.dispose();
                label.dispose();
                updatePlayerLabel();
            } else {
                showDefeatMessage();
                resetGame(scene);
            }
        }));

        return enemy;
    }

    function createPlayer() {
        const player = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 1 }, scene);
        player.position = new BABYLON.Vector3(-3, 0.5, -3);
        return player;
    }

    function showDefeatMessage() {
        const msg = new BABYLON.GUI.TextBlock();
        msg.text = "Zu stark! Starte von vorn.";
        msg.color = "white";
        msg.fontSize = 24;
        msg.top = "-40%";
        gui.addControl(msg);
        setTimeout(() => gui.removeControl(msg), 2000);
    }

    let playerLabel;
    function updatePlayerLabel() {
        if (playerLabel) gui.removeControl(playerLabel);
        playerLabel = createLabel("Lvl " + playerStrength);
        playerLabel.linkWithMesh(playerMesh);
        playerLabel.linkOffsetY = -30;
    }

    function resetGame(scene) {
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith("enemy")) mesh.dispose();
        });
        playerMesh.position = new BABYLON.Vector3(-3, 0.5, -3);
        playerStrength = 1;
        updatePlayerLabel();
        createEnemy("enemy1", 1, -1, -1);
        createEnemy("enemy2", 2, 1, 1);
        createEnemy("enemy3", 3, 3, 2);
    }

    playerMesh = createPlayer();
    updatePlayerLabel();

    createEnemy("enemy1", 1, -1, -1);
    createEnemy("enemy2", 2, 1, 1);
    createEnemy("enemy3", 3, 3, 2);

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
