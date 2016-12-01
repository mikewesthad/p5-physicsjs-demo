/*
	Integrating a Physics library with p5js! For this demo, I've choosen 
	PhysicsJS.  It is a physics engine that will allow us to simulate how shapes
	with mass/velocity/acceleration/etc. act over time. We can use it to figure
	out the math for how these shapes move, then we can use p5js to render the
	shapes.
	
	See the PhysicsJS links below to get a better idea of how PhysicsJS works.

	Main site with demos: http://wellcaffeinated.net/PhysicsJS/
	Basic usage: http://wellcaffeinated.net/PhysicsJS/basic-usage
	Creating a scene: http://wellcaffeinated.net/PhysicsJS/tutorials/creating-a-scene-of-interacting-polygons
	Fundamentals: https://github.com/wellcaffeinated/PhysicsJS/wiki/Fundamentals
	API Documentation: http://wellcaffeinated.net/PhysicsJS/docs/
*/

// The world is the foundation of the PhysicsJS engine. This holds all the 
// information about your physics simulation. You add physics bodies 
// to it (i.e. shapes that have mass/acceleration/etc.) and you add behaviors to
// it (e.g. applying gravity).
var world = Physics();

// Global variables for physics shapes
var ball;
var rectangle;
var square;

var img;

function preload() {
	img = loadImage("images/SandcastlesKid.jpg");
}

function setup() {
	// --- p5js setup ---
	createCanvas(500, 500);

	// --- PhysicsJS setup ---
	
	// PhysicsJS uses "bodies" to represent physical objects in the world. These
	// are shapes that have physical properties like mass, position, velocity,
	// etc. There are built-in bodies for "circle", "point", "rectangle", 
	// "convex-polygon" and "point". You can also create your own. See for some 
	// more information:
	// 	https://github.com/wellcaffeinated/PhysicsJS/wiki/Bodies
	ball = Physics.body("circle", {
		x: 50, // x-coordinate
		y: 30, // y-coordinate
		vx: 0.2, // velocity in x-direction
		vy: 0.01, // velocity in y-direction
		radius: 50,
		mass: 1.0,
		restitution: 0.9, // Bounciness when it collides with something
		cof: 0.8 // Friction when it collides with something
	});
	world.add(ball); // Add body to the world in order for it to be updated

	// Add another body - this time, a rectangle
	rectangle = Physics.body("rectangle", {
		x: 300, // x-coordinate
		y: 30, // y-coordinate
		vx: 0.2, // velocity in x-direction
		vy: 0.5, // velocity in y-direction
		width: 100,
		height: 50,
		mass: 1.0,
		restitution: 0.9, // Bounciness when it collides with something
		cof: 0.8 // Friction when it collides with something
	});
	world.add(rectangle); // Add body to the world in order for it to be updated

	// Add another body - this time, a square. This is simply a rectangle with
	// equal width and height, but we can use this to draw a square image later.
	square = Physics.body("rectangle", {
		x: 100, // x-coordinate
		y: 30, // y-coordinate
		vx: 0.2, // velocity in x-direction
		vy: 0.5, // velocity in y-direction
		width: 150,
		height: 150,
		mass: 1.0,
		restitution: 0.9, // Bounciness when it collides with something
		cof: 0.8 // Friction when it collides with something
	});
	world.add(square); // Add body to the world in order for it to be updated

	// Add a gravity "behavior." A behavior is a rule that gets applied to the 
	// physical bodies. 
	var gravity = Physics.behavior("constant-acceleration", {
		acc: { x : 0, y: 0.0004 } // Accelerate down in the y direction
	});
	world.add(gravity); // Behaviors must also be added to the world

  // Set up a behavior for colliding with the edges of the world. This keeps the
  // bodies from flying offscreen.
  var edgeCollision = Physics.behavior("edge-collision-detection", {
	  // aabb is a rectangle that matches our canvas size
      aabb: Physics.aabb(0, 0, width, height),
      restitution: 0.99, // Bounciness of the world edges
      cof: 0.99 // Friction of the world edges
  });
  world.add(edgeCollision); // Behaviors must also be added to the world

  // You can add multiple behaviors and bodies to the world at once using an
  // array.
  world.add([
	  // Make bodies bounce off the edges of the walls
	  Physics.behavior("body-impulse-response"),
	  // Make bodies collide with one another
	  Physics.behavior("body-collision-detection"),
	  // Speed up collision between bodies
	  Physics.behavior("sweep-prune")
  ]);
}

function draw() {
	// Update the world - this runs the simulation. Pass the current time into 
	// the step function to let the world know how much it needs to simulate.
	var currentTime = millis();
	world.step(currentTime);

	// Clear the screen
	background(0);

	// --- Drawing physics bodies ---
	// You can access the state of a physics body by saying body.state. The 
	// state contains: "pos", "vel", "acceleration" & "angular" properties. Its 
	// up to us to determine how we want to draw the physics body. Should 
	// it be a simple shape? Or should it be an image?
	
	// Draw the circle body using an ellipse in p5. ball.radius gives us the 
	// radius.
	push();
		// The coordinates from the body tell us where the center of the body
		// is, so we need to make sure we draw our ellipse from the center.
		ellipseMode(CENTER);
		translate(ball.state.pos.x, ball.state.pos.y);
		rotate(ball.state.angular.pos); // Angle the body is rotated (radians)
		fill(255, 100, 0);
		// p5's ellipse function expects width and height: 2 * radius = width
		ellipse(0, 0, 2 * ball.radius, 2 * ball.radius);
	pop();

	// Same deal for the rectangle body! (Except that for rectangle bodies, you
	// want to use body.width and body.height.)
	push();
		// The coordinates from the body tell us where the center of the body
		// is, so we need to make sure we draw our ellipse from the center.
		rectMode(CENTER);
		translate(rectangle.state.pos.x, rectangle.state.pos.y);
		rotate(rectangle.state.angular.pos); // Angle in radians
		fill(255, 0, 255);
		rect(0, 0, rectangle.width, rectangle.height);
	pop();

	// Instead of drawing another rect in p5, this time we can draw an image
	// where the square physics body is.
	push();
		// The coordinates from the body tell us where the center of the body
		// is, so we need to make sure we draw our image from the center.
		imageMode(CENTER);
		translate(square.state.pos.x, square.state.pos.y);
		rotate(square.state.angular.pos); // Angle in radians
		image(img, 0, 0, square.width, square.height);
	pop();
}
