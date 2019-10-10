const Vec2 = require('../Mat/Vec2');
const Vec3 = require('../Mat/Vec3');

const status = {
    INSIDE: 0,
    LEFT: 1,
    RIGHT: 2,
    BOTTOM: 4,
    TOP: 8
};

module.exports = class Window {
    /**
     * 
     * @param {Vec2} position 
     * @param {Vec2} size 
     */
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    _VertexCode(vec) {
        let code = status.INSIDE;

        if (vec.x < this.position.x)
            code |= status.LEFT;
        else if (vec.x > this.position.x + this.size.x)
            code |= status.RIGHT;
        if (vec.y < this.position.y)
            code |= status.BOTTOM;
        else if (vec.y > this.position.y + this.size.y)
            code |= status.TOP;

        //console.log(this.position.x + this.size.x, vec.x);
            
        return code;
    }

    /**
     * 
     * @param {Vec3} origin 
     * @param {Vec3} dest 
     */
    Clip(origin, dest) {
        //console.log(origin, dest);
        let code1 = this._VertexCode(origin);
        let code2 = this._VertexCode(dest);

        let accept = false;
        let codeOut;
        let x, y;
        while (true) {

            if ((code1 == 0) && (code2 == 0)) {
                accept = true;                
                return true;
            } else if (code1 & code2) {
                return false;
            } else {
                if (code1 != 0) codeOut = code1;
                else codeOut = code2;

                if (codeOut & status.TOP) {
                    x = origin.x + (dest.x - origin.x) * (this.position.y + this.size.y - origin.y) / (dest.y - origin.y);
                    y = this.position.y + this.size.y;
                } else if (codeOut & status.BOTTOM) {
                    x = origin.x + (dest.x - origin.x) * (this.position.y - origin.y) / (dest.y - origin.y);
                    y = this.position.y;
                } else if (codeOut & status.RIGHT) {
                    y = origin.y + (dest.y - origin.y) * (this.position.x + this.size.x - origin.x) / (dest.x - origin.x);
                    x = this.position.x + this.size.x;
                } else if (codeOut & status.LEFT) {
                    y = origin.y + (dest.y - origin.y) * (this.position.x - origin.x) / (dest.x - origin.x);
                    x = this.position.x;
                }
            }

            if (codeOut == code1) {
                origin.x = x;
                origin.y = y;
                code1 = this._VertexCode(origin);
            } else {
                dest.x = x;
                dest.y = y;
                code2 = this._VertexCode(dest);
            }
        }
    }
}