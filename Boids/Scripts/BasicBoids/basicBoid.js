class BasicBoid {
    constructor() {
        this.position = new Vector2D(Math.random()*canvasWidth, Math.random()*canvasHeight);
        this.velocity = Vector2D.random();
        this.velocity.setMag(Math.random()*5);
        this.acceleration = new Vector2D(0, 0);
        this.maxForce = 0.2;
        this.maxSpeed = 10;
        this.drawSize = 15;
        this.visionRadius = this.drawSize*5;
        this.endlessBounds = true;
    }

    // behavior of boids to edges
    edges() {
        if (this.endlessBounds != true) {
            // add acceleration towards center when nearing out of bounds
            let rotationForce = new Vector2D(
                canvasWidth/2-this.position.x,
                canvasHeight/2-this.position.y);
            rotationForce.setMag(this.maxForce);
            if (this.position.x > canvasWidth*.9) {
                this.acceleration.add(rotationForce);
            }
            else if (this.position.x < canvasWidth*.1) {
                this.acceleration.add(rotationForce);
            }

            if (this.position.y > canvasHeight*.9) {
                this.acceleration.add(rotationForce);
            }
            else if (this.position.y < canvasHeight*.1) {
                this.acceleration.add(rotationForce);
            }
        }
        else {
            if (this.position.x > canvasWidth) {
                this.position.x = 0;
            }
            else if (this.position.x < 0) {
                this.position.x = canvasWidth;
            }
            if (this.position.y > canvasHeight) {
                this.position.y = 0;
            }
            else if (this.position.y < 0) {
                this.position.y = canvasHeight;
            }
        }
    }

    // boid alignment
    alignment(boids) {
        let rotationForce = new Vector2D(0, 0);
        let count = 0;

        for (let boid of boids) {
            let d = Vector2D.distance(this.position, boid.position);
            if (boid != this && d < this.visionRadius) {
                rotationForce.add(Vector2D.div(boid.velocity.normal(), d));
                count++;
            }
        }

        if (count > 0) {
            rotationForce.div(count);
            rotationForce.setMag(this.maxSpeed);
            rotationForce.sub(this.velocity);
            rotationForce.limit(this.maxForce);
        }
        
        return rotationForce;
    }

    // boid separation
    separation(boids) {
        let rotationForce = new Vector2D(0, 0);
        let count = 0;

        for (let boid of boids) {
            let d = Vector2D.distance(this.position, boid.position);
            if (boid != this && d < this.visionRadius) {
                let diff = Vector2D.sub(this.position, boid.position).normal();
                diff.div(d * d);
                rotationForce.add(diff);
                count++
            }
        }

        if (count > 0) {
            rotationForce.div(count);
            rotationForce.setMag(this.maxSpeed);
            rotationForce.sub(this.velocity);
            rotationForce.limit(this.maxForce);
        }
        
        return rotationForce;
    }

    // boid cohesion
    cohesion(boids) {
        let rotationForce = new Vector2D(0, 0);
        let count = 0;

        for (let boid of boids) {
            let d = Vector2D.distance(this.position, boid.position);
            if (boid != this && d < this.visionRadius) {
                rotationForce.add(Vector2D.div(boid.position.normal(), d));
                count++;
            }
        }

        if (count > 0) {
            rotationForce.div(count);
            rotationForce.sub(this.position);
            rotationForce.setMag(this.maxSpeed);
            rotationForce.sub(this.velocity);
            rotationForce.limit(this.maxForce);
        }

        return rotationForce;
    }

    boidBehavior(boids) {
        this.acceleration.add(Vector2D.mul(this.alignment(boids), alignmentSlider.value));
        this.acceleration.add(Vector2D.mul(this.separation(boids), separationSlider.value));
        this.acceleration.add(Vector2D.mul(this.cohesion(boids), cohesionSlider.value));

        // values that I thought looked good from using sliders to mess around
        // this.acceleration.add(Vector2D.mul(this.alignment(boids), 0.5));
        // this.acceleration.add(Vector2D.mul(this.separation(boids), 1.6));
        // this.acceleration.add(Vector2D.mul(this.cohesion(boids), 2.2));

        // this.acceleration.add(this.alignment(boids));
        // this.acceleration.add(this.separation(boids));
        // this.acceleration.add(this.cohesion(boids));
        this.edges();
        this.mouseCheck();
        this.acceleration.limit(this.maxForce);
    }

    update(dt) {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mul(0);
    }

    mouseCheck() {
        let d = Vector2D.distance(this.position, mousePosition);
        if (d < this.visionRadius) {
            let diff = Vector2D.sub(this.position, mousePosition);
            this.acceleration.add(diff.normal());
            // try finding perpendicular vector to the mousePosition
            // then use math to find which perpendicular vector is in the
            // same direction as the velocity?
        }
    }

    // draw the thing
    draw() {
        let frontPoint = new Vector2D(0, 0);
        let leftPoint = new Vector2D(0, 0);
        let rightPoint = new Vector2D(0, 0);
        
        frontPoint.x = this.velocity.normal().x*this.drawSize + this.position.x;
        frontPoint.y = this.velocity.normal().y*this.drawSize + this.position.y;

        leftPoint.x = (this.velocity.normal().x * Math.cos(Math.PI/180*120) - this.velocity.normal().y * Math.sin(Math.PI/180*120))*this.drawSize*2/3 + this.position.x;
        leftPoint.y = (this.velocity.normal().y * Math.cos(Math.PI/180*120) + this.velocity.normal().x * Math.sin(Math.PI/180*120))*this.drawSize*2/3 + this.position.y;

        rightPoint.x = (this.velocity.normal().x * Math.cos(Math.PI/180*240) - this.velocity.normal().y * Math.sin(Math.PI/180*240))*this.drawSize*2/3 + this.position.x;
        rightPoint.y = (this.velocity.normal().y * Math.cos(Math.PI/180*240) + this.velocity.normal().x * Math.sin(Math.PI/180*240))*this.drawSize*2/3 + this.position.y;

        context2D.fillStyle = "#ffd100";
        context2D.beginPath();
        context2D.moveTo(frontPoint.x, frontPoint.y);
        context2D.lineTo(rightPoint.x, rightPoint.y);
        context2D.lineTo(leftPoint.x, leftPoint.y);
        context2D.lineTo(frontPoint.x, frontPoint.y);
        context2D.closePath();
        context2D.fill();

        context2D.strokeStyle = "#202020";
        context2D.lineWidth = 5;
        context2D.beginPath();
        context2D.moveTo(frontPoint.x, frontPoint.y);
        context2D.lineTo(rightPoint.x, rightPoint.y);
        context2D.lineTo(leftPoint.x, leftPoint.y);
        context2D.lineTo(frontPoint.x, frontPoint.y);
        context2D.closePath();
        context2D.stroke();
    }

    debug(vector, color) {
        context2D.strokeStyle = color;
        context2D.lineWidth = 2;
        context2D.beginPath();
        context2D.moveTo(this.position.x, this.position.y);
        context2D.lineTo(this.position.x + vector.x, this.position.y + vector.y);
        context2D.closePath();
        context2D.stroke();
    }
}