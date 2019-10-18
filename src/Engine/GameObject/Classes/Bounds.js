const { Vec3 } = require('../../../Mat');

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
}