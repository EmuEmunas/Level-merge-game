window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.18, 0.18, 0.28);

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 20;

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
        ground.position.y = 0;
        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const player = BABYLON.MeshBuilder.CreateCylinder("player", {
            diameterTop: 0,
            diameterBottom: 1,
            height: 2
        }, scene);
        player.position = new BABYLON.Vector3(-3, 1, 0);

        const playerGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const playerLabel = new BABYLON.GUI.Rectangle();
        playerLabel.width = "60px";
        playerLabel.height = "30px";
        playerLabel.cornerRadius = 5;
        playerLabel.color = "white";
        playerLabel.thickness = 1;
        playerLabel.background = "blue";
        playerGUI.addControl(playerLabel);
        const playerText = new BABYLON.GUI.TextBlock();
        playerText.text = "Lvl 1";
        playerText.color = "white";
        playerLabel.addControl(playerText);
        playerLabel.linkWithMesh(player);
        playerLabel.linkOffsetY = -60;

        const enemy = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 2}, scene);
        enemy.position = new BABYLON.Vector3(2, 1, 0);

        const enemyLabel = new BABYLON.GUI.Rectangle();
        enemyLabel.width = "60px";
        enemyLabel.height = "30px";
        enemyLabel.cornerRadius = 5;
        enemyLabel.color = "white";
        enemyLabel.thickness = 1;
        enemyLabel.background = "red";
        playerGUI.addControl(enemyLabel);
        const enemyText = new BABYLON.GUI.TextBlock();
        enemyText.text = "Lvl 2";
        enemyText.color = "white";
        enemyLabel.addControl(enemyText);
        enemyLabel.linkWithMesh(enemy);
        enemyLabel.linkOffsetY = -60;

        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh === enemy) {
                enemy.dispose();
                enemyLabel.dispose();
                player.position = pointerInfo.pickInfo.pickedPoint;
                player.position.y = 1;
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
});