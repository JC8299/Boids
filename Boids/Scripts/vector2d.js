class Vector2D {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    static add(a, b) {
        return new Vector2D(a.x + b.x, a.y + b.y);
    }

    static sub(a, b) {
        return new Vector2D(a.x - b.x, a.y - b.y);
    }

    static mul(a, b) {
        return new Vector2D(a.x * b, a.y * b);
    }

    static div(a, b) {
        if (b == 0) return;
        return new Vector2D(a.x / b, a.y / b);
    }

    static distance(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;

        return Math.sqrt(x*x + y*y);
    }

    static random() {
        let vec = new Vector2D(-1 + Math.random()*2,-1 + Math.random()*2);
        return vec;
    }

    add(b) {
        this.x += b.x;
        this.y += b.y;
    }

    sub(b) {
        this.x -= b.x;
        this.y -= b.y;
    }

    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normal() {
        return new Vector2D(this.x/this.magnitude(), this.y/this.magnitude());
    }

    setMag(magnitude) {

        this.x = this.normal().x * magnitude;
        this.y = this.normal().y * magnitude;
    }

    limit(length) {
        if (this.magnitude() > length) {
            this.x = this.normal().x * length;
            this.y = this.normal().y * length;
        }
    }
}