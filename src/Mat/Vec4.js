const Vec3 = require('./Vec3');

module.exports = class Vec4 {
    constructor(x, y, z, w) {
        if(x instanceof Vec3){
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
            this._w = y;
        }else{
            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;
        }
    }

    multiplyVec4(v4){
        this._x *= v4.x;
        this._y *= v4.y;
        this._z *= v4.z;
        this._w *= v4.w;
        return this;
    }

    Mult(a){
        this._x *= a;
        this._y *= a;
        this._z *= a;
        this._w *= a;
        return this;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    get w() { return this._w; }
}