module.exports = class Vec2 {
    constructor(x, y) {
        this._x = x
        this._y = y;
    }

    get x() { return this._x; }
    get y() { return this._y; }

    set x(val) { this._x = val; }
    set y(val) { this._y = val; }
}