const GameObject = require('../src/Ava').Engine.GameObject;
const PixelRenderer = require('../src/Ava').Engine.Components.PixelRenderer;
const Vec3 = require('../src/Ava').Math.Vec3;

class BilinearSurface extends GameObject {
    constructor(v1, v2, v3, v4, color) {
        super("Surface");
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4;
        this.color = color;

        this.m_PixelRenderer = this.AddComponent(PixelRenderer);
        this.CreateSurface();
    }

    Update(delta) {
        for (let c of this.m_Components) c.Update();
        this.CreateSurface();
    }

    CreateSurface() {
        let diag
        if (this.m_Parent)
            diag = Vec3.Sub(this.v4, this.v1).multiplyMat4(this.m_Parent.Transform.m_TransformationMatrix).Norm();
        else
            diag = Vec3.Sub(this.v4, this.v1).Norm();
        let step = 1 / diag//0.007;
        let pixels = [];
        let index = [];

        for (let u = 0; u <= 1; u += step) {
            for (let v = 0; v <= 1; v += step) {
                let v1 = Vec3.Mult(this.v1.multiplyMat4(this.Transform.Transformation), (1 - u) * v);
                let v2 = Vec3.Mult(this.v2.multiplyMat4(this.Transform.Transformation), (u) * v);
                let v3 = Vec3.Mult(this.v3.multiplyMat4(this.Transform.Transformation), (1 - u) * (1 - v));
                let v4 = Vec3.Mult(this.v4.multiplyMat4(this.Transform.Transformation), (u) * (1 - v));

                let result = v1.Add(v2).Add(v3).Add(v4);
                pixels.push(result.x, result.y, result.z, this.color.x, this.color.y, this.color.z, this.color.w, 0, 1, 0);
                index.push(index.length);
            }
        }

        this.m_PixelRenderer.m_Mesh.Vertex = pixels;
        this.m_PixelRenderer.m_Mesh.Index = index;
    }

}

module.exports = BilinearSurface;