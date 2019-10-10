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

    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }

    set x(value) { this._x = value; }
    set y(value) { this._y = value; }
    set z(value) { this._z = value; }
}

module.exports = Vec3;