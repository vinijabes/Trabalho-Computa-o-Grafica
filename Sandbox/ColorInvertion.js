const GameObject = require('../src/Ava').Engine.GameObject;
const PixelRenderer = require('../src/Ava').Engine.Components.PixelRenderer;
const LineRenderer = require('../src/Ava').Engine.Components.LineRenderer;
const { Vec3, Vec4 } = require('../src/Ava').Math;
const CanvasAPI = require('../src/Ava').Canvas.CanvasApi;

class ColorInvertion extends GameObject {
    constructor(lines) {
        super("ColorInvertion");

        this.m_LineRenderer = this.AddComponent(LineRenderer);

        this.m_Lines = lines;
        this.m_Lines.sort((a, b) => {
            if (a.v1.x < b.v1.x || a.v1.x < b.v2.x || a.v2.x < b.v1.x || a.v2.x < b.v2.x) return -1;
            if (a.v1.x > b.v1.x || a.v1.x > b.v2.x || a.v2.x > b.v1.x || a.v2.x > b.v2.x) return 1;
            return 0;
        })

        console.log(this.m_Lines);
        this.CreateSurface();
    }

    Update(delta) {
        super.Update();
        this.CreateSurface();
    }

    CreateSurface() {
        let vertex = [];
        let index = [];
        for (let l of this.m_Lines) {
            vertex.push(l.v1.x, l.v1.y, l.v1.z, l.color.x, l.color.y, l.color.z, l.color.w, 0, 1, 0);
            vertex.push(l.v2.x, l.v2.y, l.v2.z, l.color.x, l.color.y, l.color.z, l.color.w, 0, 1, 0);
            index.push(index.length, index.length + 1);
        }

        let z = 0;
        let coloring = true;

        let background = new Vec4(0, 0, 0, 1);
        if (this.m_Show) background = new Vec4(1, 0, 0, 1);
        
        for (let l of this.m_Lines) {
            if (l.v1.y == l.v2.y) continue;
            let x = Math.min(l.v1.x, l.v2.x);
            for (let i = x; i < CanvasAPI.s_Context.Width / 2 - this.Transform.m_Position.x; i++) {
                if (coloring) {
                    vertex.push(l.v1.x + i - x, l.v1.y, l.v1.z + z, l.color.x, l.color.y, l.color.z, l.color.w, 0, 1, 0);
                    vertex.push(l.v2.x + i - x, l.v2.y, l.v2.z + z, l.color.x, l.color.y, l.color.z, l.color.w, 0, 1, 0);
                    index.push(index.length, index.length + 1);
                } else {
                    vertex.push(l.v1.x + i - x, l.v1.y, l.v1.z + z, background.x, background.y, background.z, background.w, 0, 1, 0);
                    vertex.push(l.v2.x + i - x, l.v2.y, l.v2.z + z, background.x, background.y, background.z, background.w, 0, 1, 0);
                    index.push(index.length, index.length + 1);
                }
            }
            coloring = !coloring;
            z += 10;
        }

        this.m_LineRenderer.m_Mesh.Vertex = vertex;
        this.m_LineRenderer.m_Mesh.Index = index;
    }
}

module.exports = ColorInvertion;