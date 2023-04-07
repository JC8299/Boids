// lots of setup taken from https://codepen.io/gamealchemist/pen/VeawyL?editors=0010

// globals
let canvas;
let context2D;
let canvasWidth;
let canvasHeight;
let applicationTime = 0; // time elapsed in application
let currentApplication = null;

let timeSpeed = 1;
let typicalFrameTime = 16.6;
let maxFrameTime = 200;
let minFrameTime = 16.6;
let useTrailEffect = true;
let trailAlpha = 0.7;

let alignmentSlider = document.getElementById("alignmentSlider");
let separationSlider = document.getElementById("separationSlider");
let cohesionSlider = document.getElementById("cohesionSlider");
let alignmentValue = document.getElementById("alignmentValue");
let separationValue = document.getElementById("separationValue");
let cohesionValue = document.getElementById("cohesionValue");

let boidCountSlider = document.getElementById("boidCountSlider");
let boidCountValue = document.getElementById("boidCountValue");

let drawQuadtreeCheckbox = document.getElementById("drawQuadtree");
let drawQuadtree = true;
let endlessBoundsCheckbox = document.getElementById("endlessBounds");
let endlessBounds = false;
let pauseCheckbox = document.getElementById("pause");
let blurCheckbox = document.getElementById("blur");
let orbitMouseCheckbox = document.getElementById("orbitMouse");

let mousePosition = new Vector2D(0, 0);
let mouseActive = false;
let orbitMouse = true;
let quadtree;
let boidCount = 200;
const boids = [];

setup();

let myApp = new boidApplication();
launchApplication(myApp)

function boidApplication() {
    this.paused = false;

    this.update = function(dt) {
        let cell = new Rectangle(canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight);
        quadtree = new Quadtree(cell, 2);
        for (let i = 0; i < boidCount; i++) {
            quadtree.insert(boids[i]);
        }

        for (let i = 0; i < boidCount; i++) {
            boids[i].boidBehavior();
            boids[i].update(dt);
        }
    }

    this.draw = function() {
        // may need to redraw background
        if (drawQuadtree) quadtree.draw();
        for (let i = 0; i < boidCount; i++) {
            boids[i].draw();
        }
    }

    this.update(0);
}

// animation
function animate(now) {
    // needed for the loop
    requestAnimationFrame(animate);
    // time handling
    // should be 60 fps
    let dt = now - animate._lastTime;
    if (dt < minFrameTime) return;
    if (dt > maxFrameTime) dt = typicalFrameTime; // frame time cap
    dt *= timeSpeed;
    animate._lastTime = now;

    if (useTrailEffect) {
        context2D.globalAlpha = trailAlpha;
        context2D.fillStyle = '#202020';
        context2D.fillRect(0, 0, canvasWidth, canvasHeight);
        context2D.globalAlpha = 1;
    }
    else {
        context2D.clearRect(0, 0, canvasWidth, canvasHeight);
        context2D.fillStyle = '#202020';
        context2D.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // update
    if (currentApplication) {
        if (!currentApplication.paused) {
            currentApplication.update(dt);
        }
        // draw
        currentApplication.draw();
    }

    if (currentApplication && currentApplication.paused) {
        context2D.save();
        context2D.globalAlpha = 0.5;
        context2D.fillStyle = '#202020';
        context2D.fillRect(0, 0, canvasWidth, canvasHeight);
        context2D.restore();
    }

    // update time
    applicationTime += dt;
}

function launchAnimation() {
    if (launchAnimation.launched) return;
    launchAnimation.launched = true;
    requestAnimationFrame(_launchAnimation);

    function _launchAnimation(now) {
        animate._lastTime = now;
        requestAnimationFrame(animate);
    }
}

function launchApplication(application) {
    currentApplication = application;
    launchAnimation();
}

function mouseMovement(event) {
    if (mouseActive) {
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
    }
}

function mouseEnter(event) {
    mouseActive = true;
}

function mouseExit(event) {
    mouseActive = false;
}

function setup() {
    // setup canvas
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    context2D = canvas.getContext('2d');

    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
    
    canvas.style.display = 'block';
    canvas.style.background = '#202020';
    canvas.addEventListener('mousemove', mouseMovement);
    canvas.addEventListener('mouseenter', mouseEnter);
    canvas.addEventListener('mouseout', mouseExit);

    // change canvas size on resize
    function resize() {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
        context2D.clearRect(0, 0, canvasWidth, canvasHeight);
        context2D.fillStyle = '#202020';
        context2D.fillRect(0, 0, canvasWidth, canvasHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    // setup quadtree
    let cell = new Rectangle(canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight);
    quadtree = new Quadtree(cell, 2);

    // setup boids
    for (let i = 0; i < 1000; i++) {
        let boid = new Boid();
        boids.push(boid);
        quadtree.insert(boid);
    }

    // setup options menu values
    alignmentValue.innerHTML = alignmentSlider.value;
    separationValue.innerHTML = separationSlider.value;
    cohesionValue.innerHTML = cohesionSlider.value;
    alignmentSlider.oninput = function() {
        alignmentValue.innerHTML = this.value;
    }
    separationSlider.oninput = function() {
        separationValue.innerHTML = this.value;
    }
    cohesionSlider.oninput = function() {
        cohesionValue.innerHTML = this.value;
    }

    boidCountValue.innerHTML = boidCountSlider.value;
    boidCountSlider.oninput = function() {
        boidCountValue.innerHTML = this.value;
        boidCount = this.value;
    }

    drawQuadtree = drawQuadtreeCheckbox.checked;
    drawQuadtreeCheckbox.oninput = function() {
        drawQuadtree = drawQuadtreeCheckbox.checked;
    }
    
    endlessBounds = endlessBoundsCheckbox.checked;
    endlessBoundsCheckbox.oninput = function() {
        endlessBounds = endlessBoundsCheckbox.checked;
    }

    pauseCheckbox.checked = false;
    pauseCheckbox.oninput = function() {
        if (currentApplication) {
            currentApplication.paused = !currentApplication.paused;
        }
    }

    useTrailEffect = blurCheckbox.checked;
    blurCheckbox.oninput = function() {
        useTrailEffect = blurCheckbox.checked;
    }

    orbitMouse = orbitMouseCheckbox.checked;
    orbitMouseCheckbox.oninput = function() {
        orbitMouse = orbitMouseCheckbox.checked;
    }
}

