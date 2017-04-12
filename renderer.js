(function()
{
	var data = // Data holder
	{
		scene: undefined,
		camera: undefined,
		raycaster: undefined,
		intersect: undefined, // Undefined if mouse not intersecting with object
		dragging: false
	};

	///////////////////////////////////
	// GJK algorithm
	///////////////////////////////////
	function support(shape1, shape2, d) // vertices of shape 1 and 2 and direction
	{
		// Get some point on the minkowski sum (difference really)
		// Do this by getting the farthest point in both directions of d
		var dir = d.clone().normalize();

		var p1 = getFarthestPoint(shape1, dir);
		var p2 = getFarthestPoint(shape2, dir.negate());

		return p1.clone().sub(p2);
	}

	function getFarthestPoint(shape, d) // vertices of shape and direction (normalized)
	{
		// Project all vertices onto shape and get the longest
		var p = new THREE.Vector3(0, 0, 0);
		var l = 0;

		for(var i = 0; i < shape.length; ++i)
		{
			var proj = shape[i].dot(d);
			if(proj > l)
			{
				p = shape[i];
				l = proj;
			}
		}

		return p;
	}

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
	// Mouse usage
	///////////////////////////////////
	function mouseMove(x, y)
	{
		if(data.dragging)
		{
			// Get position delta and update stored intersection
			data.raycaster.setFromCamera(new THREE.Vector2(x, y), data.camera);

			var point = data.raycaster.ray.origin.clone();
			point.add(data.raycaster.ray.direction.clone().multiplyScalar(data.intersect.distance));

			var diff = point.clone().sub(data.intersect.point);
			data.intersect.point = point;

			// Move all vertices
			for(var i = 0; i < data.intersect.object.geometry.vertices.length; ++i)
				data.intersect.object.geometry.vertices[i].add(diff);

			data.intersect.object.geometry.verticesNeedUpdate = true;
			data.intersect.object.geometry.computeBoundingSphere();
		}
		else
		{
			// Make all objects white
			for(var i = 0; i < data.scene.children.length; ++i)
				data.scene.children[i].material.color.set(0xffffff);

			// Cast a ray for mouse picking and make the found object green
			data.raycaster.setFromCamera(new THREE.Vector2(x, y), data.camera);
			var inters = data.raycaster.intersectObjects(data.scene.children);

			if(inters.length < 1)
				data.intersect = undefined;
			else
			{
				// Also store the intersection
				inters[0].object.material.color.set(0x00ff00);
				data.intersect = inters[0];
			}
		}
	}

	function mouseDown(x, y)
	{
		if(data.intersect !== undefined)
			data.dragging = true;
	}

	function mouseUp(x, y)
	{
		data.dragging = false;
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
			mouseMove(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * -2 + 1);
		}, false);

		window.addEventListener('mousedown', function(e)
		{
			mouseDown(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * -2 + 1);
		}, false);

		window.addEventListener('mouseup', function(e)
		{
			mouseUp(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * -2 + 1);
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
