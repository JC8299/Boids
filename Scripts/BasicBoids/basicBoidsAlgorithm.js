// lots of setup taken from https://codepen.io/gamealchemist/pen/VeawyL?editors=0010

// globals
let canvas;
let context2D;
let canvasWidth;
let canvasHeight;
let canvasGradient;
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
let mousePosition = new Vector2D(0, 0);
const boids = [];

setup();

let myApp = new boidApplication();
launchApplication(myApp)

function boidApplication() {
    // variables?

    this.update = function(dt) {
        // to reduce number of times running through array, will draw in update
        for (let boid of boids) {
            boid.boidBehavior(boids);
            boid.update(dt);
            boid.draw();
        }
    }

    this.draw = function() {
        // may need to redraw background
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
        // context2D.fillStyle = '#d6d6d6';
        context2D.fillStyle = canvasGradient;
        context2D.fillRect(0, 0, canvasWidth, canvasHeight);
        context2D.globalAlpha = 1;
    }
    else {
        context2D.clearRect(0, 0, canvasWidth, canvasHeight);
        context2D.fillStyle = canvasGradient;
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

    // if (currentApplication && currentApplication.paused) {
    //     context2D.save();
    //     context2D.globalAlpha = 0.5;
    //     context2D.fillStyle = '#000';
    //     context2D.fillRect(0, 0, canvasWidth, canvasHeight);
    //     context2D.fillStyle = '#fff';
    //     context2D.fillText('PAUSED', canvasWidth/2, canvasHeight/2);
    //     context2D.restore();
    // }

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
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
}

function setup() {
    // setup canvas
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    context2D = canvas.getContext('2d');
    // context2D = canvas.getContext('2d', {
    //     alpha:false
    // });

    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;

    setGradient(canvasWidth, canvasHeight);
    
    canvas.style.display = 'block';
    canvas.style.background = '#d6d6d6';
    canvas.addEventListener('mousemove', mouseMovement);

    context2D.clearRect(0, 0, canvasWidth, canvasHeight);
    context2D.fillStyle = canvasGradient;
    context2D.fillRect(0, 0, canvasWidth, canvasHeight);

    // change canvas size on resize
    function resize() {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
        setGradient(canvasWidth, canvasHeight);
        context2D.clearRect(0, 0, canvasWidth, canvasHeight);
        context2D.fillStyle = canvasGradient;
        context2D.fillRect(0, 0, canvasWidth, canvasHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    //setup boids
    for (let i = 0; i < 200; i++) {
        boids.push(new BasicBoid());
    }
}

function setGradient(width, height) {
    canvasGradient = context2D.createLinearGradient(0, canvasHeight/2, canvasWidth, canvasHeight/2);
    canvasGradient.addColorStop(0, '#202020');
    canvasGradient.addColorStop(0.2, '#d6d6d6');
    canvasGradient.addColorStop(0.8, '#d6d6d6');
    canvasGradient.addColorStop(1, '#202020');
}