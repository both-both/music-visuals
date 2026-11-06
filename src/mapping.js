import * as THREE from 'three';


export function createMapping(texture) {
    const corners = [
        new THREE.Vector2(-0.8, 0.8), // top-venstre
        new THREE.Vector2(0.6, 0.9), // top-højre 
        new THREE.Vector2(0.8, -0.7), // bund-højre
        new THREE.Vector2(-0.9, - 0.8), // bund-venstre
    ];

    const geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    function update() {
        const pos = geometry.attributes.position
        const uv = geometry.attributes.uv;

        for (let i = 0; i < pos.count; i++) {
            const u = uv.getX(i);
            const v = uv.getY(i);

            const top = corners[0].clone().lerp(corners[1], u);
            const bottom = corners[3].clone().lerp(corners[2], u)
            const point = bottom.lerp(top, v);

            pos.setXY(i, point.x, point.y)
        }
        pos.needsUpdate = true;
    }
    update();


    return { mesh, corners, update };
}

