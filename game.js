window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);
    const cone = BABYLON.MeshBuilder.CreateCylinder('cone', { diameterTop: 0, diameterBottom: 1, height: 2 }, scene);

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });
});
