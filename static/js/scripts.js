// scripts.js

// Fonction pour filtrer les astéroïdes
function filterAsteroids(filterType) {
    fetch(`/asteroids?filter=${filterType}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#asteroids-table tbody");
            tableBody.innerHTML = ""; // Effacer le contenu actuel

            data.forEach(asteroid => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${asteroid.name}</td>
                    <td>${asteroid.estimated_diameter.kilometers.estimated_diameter_max}</td>
                    <td>${asteroid.close_approach_data[0].relative_velocity.kilometers_per_second}</td>
                    <td>${asteroid.close_approach_data[0].miss_distance.kilometers}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Erreur :", error));
}

// Charger les données initiales au chargement de la page
window.onload = () => filterAsteroids("closest");


// scripts.js

// Fonction pour initialiser l'animation 3D
// scripts.js

// Fonction pour initialiser l'animation 3D
function init3DAnimation() {
    // Vérifier si Three.js est chargé
    if (typeof THREE === 'undefined') {
        console.error('Three.js n\'est pas chargé.');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('animation-container').appendChild(renderer.domElement);

    // Ajouter une lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // Charger la texture de la Terre
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthNormalMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');

    // Créer la Terre
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        normalMap: earthNormalMap,
        specularMap: earthSpecularMap,
        shininess: 10
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Créer des astéroïdes
    const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const asteroids = [];

    for (let i = 0; i < 50; i++) {
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
        scene.add(asteroid);
        asteroids.push(asteroid);
    }

    // Positionner la caméra
    camera.position.z = 10;

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        // Faire tourner la Terre
        earth.rotation.y += 0.005;

        // Faire bouger les astéroïdes
        asteroids.forEach(asteroid => {
            asteroid.rotation.x += 0.01;
            asteroid.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }

    animate();
}

// Démarrer l'animation 3D au chargement de la page
window.onload = () => {
    init3DAnimation();
    filterAsteroids("closest"); // Charger les données initiales
};