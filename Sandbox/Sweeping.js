const GameObject = require('../src/Ava').Engine.GameObject;
const LineRenderer = require('../src/Ava').Engine.Components.LineRenderer;
const { Vec3, Vec4, Mat4 } = require('../src/Ava').Math;
const CanvasAPI = require('../src/Ava').Canvas.CanvasApi;

class Sweeping extends GameObject {
    constructor() {
        super("Sweeping");

        this.m_LineRenderer = this.AddComponent(LineRenderer);
        this.m_Points = [];
        this.m_Color = new Vec4(1, 1, 1, 1);
    }

    Update(delta) {
        super.Update();
        this.UpdateMesh();
    }

    UpdateMesh() {
        let vertex = [];
        let index = [];
        // for (let p = 0; p < this.m_Points.length; p++) {
        //     vertex.push(this.m_Points[p].x, this.m_Points[p].y, this.m_Points[p].z, this.m_Color.x, this.m_Color.y, this.m_Color.z, this.m_Color.w, 0, 1, 0);
        //     if (p != this.m_Points.length - 1) {
        //         index.push(p, p + 1);
        //     }
        // }
        
        let step = 4;
        let counter = 0;
        for (let angle = 0; angle < 360; angle += step) {
            for (let i = 0; i < this.m_Points.length; i++) {
                let v = this.m_Points[i].multiplyMat4(Mat4.RotationY(angle));
                vertex.push(v.x, v.y, v.z, this.m_Color.x, this.m_Color.y, this.m_Color.z, this.m_Color.w, 0, 1, 0);
                if (i != this.m_Points.length - 1) {
                    index.push(counter, counter + 1);
                }
                counter++;
            }
        }

        this.m_LineRenderer.m_Mesh.Index = index;
        this.m_LineRenderer.m_Mesh.Vertex = vertex;
    }

    /**
     * 
     * @param {Vec3} point 
     */
    AddPoint(point) {
        this.m_Points.push(point);
    }

}

module.exports = Sweeping;