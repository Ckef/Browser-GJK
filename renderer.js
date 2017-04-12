(function()
{
	var data = // Data holder
	{
		scene: undefined,
		camera: undefined,
		raycaster: undefined,
	};

	///////////////////////////////////
	// Initialization function
	///////////////////////////////////
	function init()
	{
		// Create a scene
		data.camera.position.z = 50;

		var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
		var geometry = new THREE.TorusGeometry(10, 3, 8, 12);

		data.scene.add(new THREE.Mesh(geometry, material));
	}

	///////////////////////////////////
	// Main update function
	///////////////////////////////////
	function update()
	{
	}

	///////////////////////////////////
	// Mouse movement
	///////////////////////////////////
	function mouse(x, y)
	{
		// Make all objects white
		for(var i = 0; i < data.scene.children.length; ++i)
			data.scene.children[i].material.color.set(0xffffff);

		// Cast a ray for mouse picking and make the found object green
		data.raycaster.setFromCamera(new THREE.Vector2(x, y), data.camera);

		var objs = data.raycaster.intersectObjects(data.scene.children);
		if(objs.length > 0) objs[0].object.material.color.set(0x00ff00);
	}

	///////////////////////////////////
	// Detect if WebGL & setup
	///////////////////////////////////
	if(!Detector.webgl)
		document.body.appendChild(Detector.getWebGLErrorMessage());
	else
	{
		// Create renderer, scene, camera, raycaster and initialize
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		data.scene = new THREE.Scene();
		data.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		data.raycaster = new THREE.Raycaster();

		init();

		// Resize the renderer and camera and react to mouse movement
		window.addEventListener('resize', function()
		{
	 		renderer.setSize(window.innerWidth, window.innerHeight);
			data.camera.aspect = window.innerWidth / window.innerHeight;
			data.camera.updateProjectionMatrix();
		}, false);

		window.addEventListener('mousemove', function(e)
		{
			mouse(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * -2 + 1);
		}, false);

		// Main renderer loop
		(function render()
		{
			requestAnimationFrame(render);
			update();
			renderer.render(data.scene, data.camera);
		})();
	}

})();
