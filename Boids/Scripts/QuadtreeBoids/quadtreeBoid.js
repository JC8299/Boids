class Boid {
    constructor() {
        this.position = new Vector2D(Math.random()*canvasWidth, Math.random()*canvasHeight);
        this.velocity = Vector2D.random();
        this.velocity.setMag(Math.random()*5);
        this.acceleration = new Vector2D(0, 0);
        this.maxForce = 0.4;
        this.maxSpeed = 10;
        this.drawSize = 15;
        this.alignmentVisionRadius = 75;
        this.separationVisionRadius = 50;
        this.cohesionVisionRadius = 75;
        this.mouseVisionRadius = 150;
    }

    // behavior of boids to edges
    edges() {
        if (endlessBounds) {
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
        else {
            if (this.position.x > canvasWidth*.99) {
                this.acceleration.x -= 5;
            }
            else if (this.position.x < canvasWidth*.01) {
                this.acceleration.x += 5;
            }
            if (this.position.y > canvasHeight*.99) {
                this.acceleration.y -= 5;
            }
            else if (this.position.y < canvasHeight*.01) {
                this.acceleration.y += 5;
            }
        }
    }

    // boid alignment
    alignment() {
        let rotationForce = new Vector2D(0, 0);
        let count = 0;

        let nearby = quadtree.query(new Rectangle(this.position.x, this.position.y, this.alignmentVisionRadius, this.alignmentVisionRadius));

        for (let boid of nearby) {
            if (boid === this) continue;
            let d = Vector2D.distance(this.position, boid.position);
            rotationForce.add(Vector2D.div(boid.velocity, d));
            count++;
        }

        if (count > 0) {
            rotationForce.div(count);
            rotationForce.setMag(this.maxSpeed);
            rotationForce.limit(this.maxForce);
        }
        
        return rotationForce;
    }

    // boid separation
    separation() {
        let rotationForce = new Vector2D(0, 0);
        let count = 0;

        let nearby = quadtree.query(new Rectangle(this.position.x, this.position.y, this.separationVisionRadius, this.separationVisionRadius));

        for (let boid of nearby) {
            if (boid === this) continue;
            let d = Vector2D.distance(this.position, boid.position);
            let diff = Vector2D.sub(this.position, boid.position);

            if (d <= 0) {
                d = 0.01
            }
            
            rotationForce.add(Vector2D.div(diff, d*d));
            count++
        }
        
        if (count > 0) {
            rotationForce.div(count);
            rotationForce.setMag(this.maxSpeed);
            rotationForce.limit(this.maxForce);
        }
        
        return rotationForce;
    }

    // boid cohesion
    cohesion() {
        let rotationForce = new Vector2D(0, 0);
        let count = 0;

        let nearby = quadtree.query(new Rectangle(this.position.x, this.position.y, this.cohesionVisionRadius, this.cohesionVisionRadius));

        for (let boid of nearby) {
            if (boid === this) continue;
            let d = Vector2D.distance(this.position, boid.position);

            if (d <= 0) {
                d = 0.01
            }

            let diff = Vector2D.sub(boid.position, this.position);
            rotationForce.add(Vector2D.div(diff, d));
            count++;
        }

        if (count > 0) {
            rotationForce.div(count);
            rotationForce.setMag(this.maxSpeed);
            rotationForce.limit(this.maxForce);
        }

        return rotationForce;
    }

    boidBehavior() {
        this.acceleration.add(Vector2D.mul(this.alignment(), alignmentSlider.value));
        this.acceleration.add(Vector2D.mul(this.separation(), separationSlider.value));
        this.acceleration.add(Vector2D.mul(this.cohesion(), cohesionSlider.value));

        this.mouseCheck();
        this.edges();
    }

    update(dt) {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mul(0);
    }

    mouseCheck() {
        if (orbitMouse && mouseActive) {
            let d = Vector2D.distance(this.position, mousePosition);
            if (d < this.mouseVisionRadius) {
                // reset acceleration
                this.acceleration.mul(0);

                // // find tangent of r distance from the mouse position
                let radius = 2/3 * this.mouseVisionRadius;
                let tangentPoint = new Vector2D(mousePosition.x, mousePosition.y);

                let diff = Vector2D.sub(this.position, mousePosition);
                diff.setMag(radius);
                tangentPoint.add(diff);

                // // create vector of tangent line of certain magnitude
                diff = Vector2D.sub(mousePosition, tangentPoint);
                let tangentVector = new Vector2D(-diff.y, diff.x);

                if ((tangentVector.y*this.velocity.x - tangentVector.x*this.velocity.y) *
                    (tangentVector.y*diff.x - tangentVector.x*diff.y) < 0 &&
                    (diff.y*this.velocity.x - diff.x*this.velocity.y) *
                    (diff.y*tangentVector.x - diff.x*tangentVector.y) < 0) {
                    
                    tangentVector.x = diff.y;
                    tangentVector.y = -diff.x;
                }

                tangentVector.setMag(this.maxForce);

                let target = Vector2D.add(tangentPoint, tangentVector);
                this.acceleration.add(Vector2D.sub(target, this.position));
                this.acceleration.limit(this.maxForce*2);
            }
        }
    }

    // draw the thing
    draw() {
        let frontPoint = new Vector2D(0, 0);
        let leftPoint = new Vector2D(0, 0);
        let rightPoint = new Vector2D(0, 0);
        let forwardVector;
        if (this.velocity.magnitude() == 0) {
            forwardVector = new Vector2D(0, -1);
        }
        else {
            forwardVector = this.velocity.normal();
        }

        frontPoint.x = forwardVector.x*this.drawSize + this.position.x;
        frontPoint.y = forwardVector.y*this.drawSize + this.position.y;

        leftPoint.x = (forwardVector.x * Math.cos(Math.PI/180*120) - forwardVector.y * Math.sin(Math.PI/180*120))*this.drawSize*2/3 + this.position.x;
        leftPoint.y = (forwardVector.y * Math.cos(Math.PI/180*120) + forwardVector.x * Math.sin(Math.PI/180*120))*this.drawSize*2/3 + this.position.y;

        rightPoint.x = (forwardVector.x * Math.cos(Math.PI/180*240) - forwardVector.y * Math.sin(Math.PI/180*240))*this.drawSize*2/3 + this.position.x;
        rightPoint.y = (forwardVector.y * Math.cos(Math.PI/180*240) + forwardVector.x * Math.sin(Math.PI/180*240))*this.drawSize*2/3 + this.position.y;

        context2D.fillStyle = "#ffd100";
        context2D.beginPath();
        context2D.moveTo(frontPoint.x, frontPoint.y);
        context2D.lineTo(rightPoint.x, rightPoint.y);
        context2D.lineTo(leftPoint.x, leftPoint.y);
        context2D.lineTo(frontPoint.x, frontPoint.y);
        context2D.closePath();
        context2D.fill();

        context2D.strokeStyle = "#202020";
        context2D.lineWidth = 3;
        context2D.beginPath();
        context2D.moveTo(frontPoint.x, frontPoint.y);
        context2D.lineTo(rightPoint.x, rightPoint.y);
        context2D.lineTo(leftPoint.x, leftPoint.y);
        context2D.lineTo(frontPoint.x, frontPoint.y);
        context2D.closePath();
        context2D.stroke();
    }
}