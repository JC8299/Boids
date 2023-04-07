// Quadtree resources
// https://codingee.com/boids-algorithm-implementation-with-quadtree/
// https://github.com/hiiambhanu/cg-boids
// https://hiiambhanu.github.io/cg-boids/

class Rectangle {
    constructor(centerX, centerY, width, height) {
        this.x = centerX;
        this.y = centerY;
        this.width = width;
        this.height = height;
    }

    // checks if any edge of the rectangles are not possible to overlap
    // ex. if left of targetRect is too far right of this, then impossible to overlap
    // this is done with every edge
    overlaps(targetRect) {
        return !(targetRect.x - targetRect.width/2 > this.x + this.width/2 ||
            targetRect.x + targetRect.width/2 < this.x - this.width/2 ||
            targetRect.y - targetRect.height/2 > this.y + this.height/2 ||
            targetRect.y + targetRect.height/2 < this.y - this.height/2);
    }

    contains(boid) {
        return (boid.position.x >= this.x - this.width/2 && boid.position.x <= this.x + this.width/2 &&
            boid.position.y >= this.y - this.height/2 && boid.position.y <= this.y + this.height/2);
    }
}

class Quadtree {
    constructor(cell, capacity) {
        this.boids = [];
        this.capacity = capacity;
        this.subdivided = false;
        this.cell = cell;
    }

    totalBoids() {
        if (!this.subdivided) return this.boids.length;
        return this.boids.length +
            this.northWest.totalBoids() +
            this.northEast.totalBoids() +
            this.southWest.totalBoids() +
            this.southEast.totalBoids();
    }

    // find boids in cells overlapping with targetRect
    query(targetRect, visible) {
        if (!visible) visible = [];

        if (!this.cell.overlaps(targetRect)) {
            return visible;
        }

        visible.push(...this.boids);

        if (this.subdivided) {
            this.northWest.query(targetRect, visible);
            this.northEast.query(targetRect, visible);
            this.southWest.query(targetRect, visible);
            this.southEast.query(targetRect, visible);
        }

        return visible;
    }

    subdivide() {
        this.subdivided = true;
        let newWidth = this.cell.width/2;
        let newHeight = this.cell.height/2;

        this.northWest = new Quadtree(
            new Rectangle(this.cell.x - newWidth/2, this.cell.y - newHeight/2, newWidth, newHeight),
            this.capacity
        );

        this.northEast = new Quadtree(
            new Rectangle(this.cell.x + newWidth/2, this.cell.y - newHeight/2, newWidth, newHeight),
            this.capacity
        );

        this.southWest = new Quadtree(
            new Rectangle(this.cell.x - newWidth/2, this.cell.y + newHeight/2, newWidth, newHeight),
            this.capacity
        );

        this.southEast = new Quadtree(
            new Rectangle(this.cell.x + newWidth/2, this.cell.y + newHeight/2, newWidth, newHeight),
            this.capacity
        );
    }

    insert(boid) {
        if (!this.cell.contains(boid)) {
            return false;
        }

        if (this.boids.length < this.capacity) {
            this.boids.push(boid);
            return true;
        }
        else {
            if (!this.subdivided) {
                this.subdivide();
            }
            return this.northWest.insert(boid) ? true :
                this.northEast.insert(boid) ? true :
                this.southWest.insert(boid) ? true :
                this.southEast.insert(boid);
        }
    }

    draw() {
        context2D.strokeStyle = "#d6d6d6";
        context2D.lineWidth = 2;
        context2D.strokeRect(
            this.cell.x-this.cell.width/2,
            this.cell.y-this.cell.height/2,
            this.cell.width,
            this.cell.height);
        if (this.subdivided) {
            this.northWest.draw();
            this.northEast.draw();
            this.southWest.draw();
            this.southEast.draw();
        }
    }
}