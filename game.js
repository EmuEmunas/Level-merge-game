
window.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.35);

    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 3, Math.PI / 3, 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMat;

    const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    let playerLevel = 1;
    let player;

    function createLabel(mesh, text, color = "red") {
        const rect = new BABYLON.GUI.Rectangle();
        rect.width = "50px";
        rect.height = "25px";
        rect.cornerRadius = 5;
        rect.color = "white";
        rect.thickness = 1;
        rect.background = color;
        gui.addControl(rect);

        const label = new BABYLON.GUI.TextBlock();
        label.text = text;
        label.color = "white";
        rect.addControl(label);
        rect.linkWithMesh(mesh);
        rect.linkOffsetY = -50;
        return label;
    }

    function createPlayer() {
        const cone = BABYLON.MeshBuilder.CreateCylinder("player", {diameterTop: 0, diameterBottom: 1, height: 1.5}, scene);
        cone.position = new BABYLON.Vector3(-3, 0.75, -3);
        const mat = new BABYLON.StandardMaterial("playerMat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1);
        cone.material = mat;
        createLabel(cone, "Lvl " + playerLevel, "blue");
        return cone;
    }

    function createEnemy(x, z, level) {
        const enemy = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 1}, scene);
        enemy.position = new BABYLON.Vector3(x, 0.5, z);
        const mat = new BABYLON.StandardMaterial("enemyMat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        enemy.material = mat;
        createLabel(enemy, "Lvl " + level);
        enemy.level = level;
        enemy.isEnemy = true;
        return enemy;
    }

    player = createPlayer();
    const enemies = [
        createEnemy(-1, -3, 1),
        createEnemy(1, -1, 2),
        createEnemy(3, 1, 3)
    ];

    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh.isEnemy) {
            const target = pointerInfo.pickInfo.pickedMesh;
            if (playerLevel >= target.level) {
                player.position = target.position.clone();
                playerLevel += target.level;
                gui.dispose();
                const newGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
                createLabel(player, "Lvl " + playerLevel, "blue");
                target.dispose();
            } else {
                alert("Gegner war zu stark! Spiel beginnt von vorn.");
                window.location.reload();
            }
        }
    }, BABYLON.PointerEventTypes.POINTERPICK);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
});
