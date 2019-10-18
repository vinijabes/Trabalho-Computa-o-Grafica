const Mat3 = require('./Mat3');

class Vec3 {
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    /**
     * 
     * @param {Mat3} mat3 
     */
    multiplyMat3(mat3) {
        let x = this.x * mat3.Get(0)[0] + this.y * mat3.Get(1)[0] + 1 * mat3.Get(2)[0];
        let y = this.x * mat3.Get(0)[1] + this.y * mat3.Get(1)[1] + 1 * mat3.Get(2)[1];
        let z = this.x * mat3.Get(0)[2] + this.y * mat3.Get(1)[2] + 1 * mat3.Get(2)[2];
        let vec3 = new Vec3(x / z, y / z, 1);
        return vec3;
    }

    /**
     * 
     * @param {Mat4} mat4 
     */
    multiplyMat4(mat4) {
        let x = this.x * mat4.Get(0)[0] + this.y * mat4.Get(1)[0] + this.z * mat4.Get(2)[0] + mat4.Get(3)[0];
        let y = this.x * mat4.Get(0)[1] + this.y * mat4.Get(1)[1] + this.z * mat4.Get(2)[1] + mat4.Get(3)[1];
        let z = this.x * mat4.Get(0)[2] + this.y * mat4.Get(1)[2] + this.z * mat4.Get(2)[2] + mat4.Get(3)[2];
        let w = this.x * mat4.Get(0)[3] + this.y * mat4.Get(1)[3] + this.z * mat4.Get(2)[3] + mat4.Get(3)[3];
        let vec3 = new Vec3(x / w, y / w, z / w);
        return vec3;
    }

    /**
     * 
     * @param {Vec3} v3
     */
    Add(v3) {
        this.x += v3.x;
        this.y += v3.y;
        this.z += v3.z;
        return this;
    }

    /**
     * 
     * @param {Vec3} v1 
     * @param {Vec3} v2 
     */
    static Add(v1, v2) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * 
     * @param {Vec3} v3
     */
    Sub(v3) {
        this.x -= v3.x;
        this.y -= v3.y;
        this.z -= v3.z;
        return this;
    }

    /**
     * 
     * @param {Vec3} v1 
     * @param {Vec3} v2 
     */
    static Sub(v1, v2) {
        return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * 
     * @param {number} a
     */
    Div(a) {
        this.x /= a;
        this.y /= a;
        this.z /= a;
        return this;
    }

    /**
     * 
     * @param {Vec3} v3
     * @param {number} a
     */
    static Div(v3, a) {
        return new Vec3(v3.x / a, v3.y / a, v3.z / a);
    }

    Clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    Normalize() {
        let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

        if (mag > 0) {
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }

        return this;
    }

    static Right() {
        return new Vec3(1, 0, 0);
    }

    static Up() {
        return new Vec3(0, 1, 0);
    }

    static Forward() {
        return new Vec3(0, 0, 1);
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }

    set x(value) { this._x = value; }
    set y(value) { this._y = value; }
    set z(value) { this._z = value; }
}

module.exports = Vec3;