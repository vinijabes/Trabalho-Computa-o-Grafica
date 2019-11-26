const { Vec3, Mat4 } = require('../../../Mat');
const Plane = require('./Plane');

const status = {
    INSIDE: 0,
    LEFT: 1,
    RIGHT: 2,
    BOTTOM: 4,
    TOP: 8,
    FRONT: 16,
    BACK: 32
};

module.exports = class Bounds {
    /**@type {Vec3}*/
    m_Center;

    /**@type {Vec3}*/
    m_Extents;

    /**@type {Vec3}*/
    m_Size;

    /**@type {Vec3}*/
    m_Max;

    /**@type {Vec3}*/
    m_Min;

    m_Rotation;

    /**@type {Vec3}*/
    get Min() { return this.m_Min; }

    /**@type {Vec3}*/
    get Max() { return this.m_Max; }

    constructor() {
        this.m_Center = new Vec3(0, 0, 0);
        this.m_Size = new Vec3(0, 0, 0);
        this.m_Extents = new Vec3(0, 0, 0);
        this.m_Max = new Vec3(0, 0, 0);
        this.m_Min = new Vec3(0, 0, 0);
    }

    /**
     * 
     * @param {Vec3} min 
     * @param {Vec3} max 
     */
    SetMinMax(min, max) {
        this.m_Size = Vec3.Sub(max, min);
        this.m_Extents = Vec3.Div(this.m_Size, 2);
        this.m_Max = max.Clone();
        this.m_Min = min.Clone();
        this.m_Center = Vec3.Add(this.m_Min, this.m_Extents);
    }

    /**
     * 
     * @param {Vec3} v3 
     */
    Contains(v3) {
        return (v3.x > this.m_Min.x && v3.x < this.Max.x
            && v3.y > this.m_Min.y && v3.y < this.Max.y
            && v3.z > this.m_Min.z && v3.z < this.Max.z);
    }

    /**
     * 
     * @param {Bounds} bounds 
     */
    Intersects(bounds) {
        return (this.Min.x <= bounds.Max.x && this.Max.x >= bounds.Min.x) &&
            (this.Min.y <= bounds.Max.y && this.Max.y >= bounds.Min.y) &&
            (this.Min.z <= bounds.Max.z && this.Max.z >= bounds.Min.z)
    }

    /**
     * 
     * @param {Vec3} point 
     */
    ClosestPointOnBounds(point) {
        let top = new Plane();
        top.m_Normal
    }

    _VertexCode(vec) {
        let code = status.INSIDE;

        if (vec.x < this.m_Min.x)
            code |= status.LEFT;
        else if (vec.x > this.m_Max.x)
            code |= status.RIGHT;
        if (vec.y < this.m_Min.y)
            code |= status.BOTTOM;
        else if (vec.y > this.m_Max.y)
            code |= status.TOP;
        if (vec.z < this.m_Min.z)
            code |= status.BACK;
        else if (vec.z > this.m_Max.z)
            code |= status.FRONT;

        return code;
    }

    ClipEdge(A, B) {
        let code1 = this._VertexCode(A);
        let code2 = this._VertexCode(B);

        A = A.Clone();
        B = B.Clone();

        let accept = false;
        let codeOut;
        let x, y, z;
        while (true) {

            if ((code1 == 0) && (code2 == 0)) {
                accept = true;                
                return [A, B];
            } else if (code1 & code2) {
                return false;
            } else {
                if (code1 != 0) codeOut = code1;
                else codeOut = code2;

                if (codeOut & status.TOP) {
                    x = A.x + (B.x - A.x) * (this.m_Max.y - A.y) / (B.y - A.y);
                    z = A.z + (B.z - A.z) * (this.m_Max.y - A.y) / (B.y - A.y);
                    y = this.m_Max.y;
                } else if (codeOut & status.BOTTOM) {
                    x = A.x + (B.x - A.x) * (this.Min.y - A.y) / (B.y - A.y);
                    z = A.z + (B.z - A.z) * (this.m_Min.y - A.y) / (B.y - A.y);
                    y = this.m_Min.y;
                } else if (codeOut & status.RIGHT) {
                    y = A.y + (B.y - A.y) * (this.m_Max.x - A.x) / (B.x - A.x);
                    z = A.z + (B.z - A.z) * (this.m_Max.x - A.x) / (B.x - A.x);
                    x = this.m_Max.x;
                } else if (codeOut & status.LEFT) {
                    y = A.y + (B.y - A.y) * (this.m_Min.x - A.x) / (B.x - A.x);
                    z = A.z + (B.z - A.z) * (this.m_Min.x - A.x) / (B.x - A.x);
                    x = this.m_Min.x;
                } else if (codeOut & status.BACK) {
                    x = A.x + (B.x - A.x) * (this.m_Min.z - A.z) / (B.z - A.z);
                    y = A.y + (B.y - A.y) * (this.m_Min.z - A.z) / (B.z - A.z);
                    z = this.m_Min.z;
                } else if (codeOut & status.FRONT) {
                    x = A.x + (B.x - A.x) * (this.m_Max.z - A.z) / (B.z - A.z);
                    y = A.y + (B.y - A.y) * (this.m_Max.z - A.z) / (B.z - A.z);
                    z = this.m_Max.z;
                }
            }

            if (codeOut == code1) {
                A.x = x;
                A.y = y;
                A.z = z;
                code1 = this._VertexCode(A);
            } else {
                B.x = x;
                B.y = y;
                B.z = z;
                code2 = this._VertexCode(B);
            }
        }
    }
}