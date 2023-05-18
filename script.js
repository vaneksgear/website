// You can remove the JavaScript code since we no longer have a countdown

// PointerLockControls by MrDoob
THREE.PointerLockControls = function (camera) {
	var scope = this;
	camera.rotation.set(0, 0, 0);
	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);
	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add(pitchObject);
	var PI_2 = Math.PI / 2;
	var onMouseMove = function (event) {
		if (scope.enabled === false) return;
		var movementX =
			event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY =
			event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;
		pitchObject.rotation.x = Math.max(
			-PI_2,
			Math.min(PI_2, pitchObject.rotation.x)
		);
	};
	this.dispose = function () {
		document.removeEventListener("mousemove", onMouseMove, false);
	};
	document.addEventListener("mousemove", onMouseMove, false);
	this.enabled = false;
	this.getObject = function () {
		return yawObject;
	};
	this.getDirection = (function () {
		var direction = new THREE.Vector3(0, 0, -1);
		var rotation = new THREE.Euler(0, 0, 0, "YXZ");
		return function (v) {
			rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
			v.copy(direction).applyEuler(rotation);
			return v;
		};
	})();
};
//

var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(255,255,255)");
var camera = new THREE.PerspectiveCamera(
	95,
	window.innerWidth / window.innerHeight,
	0.1,
	20
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.PointerLockControls(camera);
controls.enabled = true;
scene.add(controls.getObject());
controls.getObject().position.set(0, 0, 0);

var geometry = new THREE.BoxGeometry(10, 10, 10, 12, 12, 12);
var material = new THREE.MeshBasicMaterial({
	color: 0x333333,
	wireframe: true
});

var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

var animate = function () {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

animate();
