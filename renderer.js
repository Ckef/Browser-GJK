(function()
{
	// Detect if WebGL is available
	if(!Detector.webgl)
		document.body.appendChild(Detector.getWebGLErrorMessage());
	else
	{
		// Create renderer, scene, camera and initialize
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		init();

		// Main renderer loop
		(function render()
		{
			requestAnimationFrame(render);
			update();
			renderer.render(scene, camera);
		})();
	}

	///////////////////////////////////
	// Initialization function
	///////////////////////////////////
	function init()
	{
		console.log("init");
	}

	///////////////////////////////////
	// Main update function
	///////////////////////////////////
	function update()
	{
		console.log("update");
	}

})();
