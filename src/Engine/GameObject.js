const { Vec3, Mat4 } = require('../Mat');
const { CanvasApi, CanvasContext } = require('../Canvas');
const InputController = require('./InputController');


module.exports = class GameObject {
    /**@type {Vec3}*/
    m_Position;

    /**@type {Mat4}*/
    m_Transformation;

    /**@type {number}*/
    m_VertexBuffer;

    /**@type {number}*/
    m_IndexBuffer;

    /**@type {Array<Number>} */
    m_Vertex;

    /**@type {Array<Number>} */
    m_Index;

    m_RotationSpeed = 30.0;

    constructor(mutable = true) {
        this.m_Mutable = mutable;
        this.m_Transformation = Mat4.Identity();
    }

    Update(delta) {
        if(!this.m_Mutable) return;
        let center = this.center();
        if(InputController.Instance().IsKeyDown(16)) return;

        if (InputController.Instance().IsKeyDown(65)) {
            this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed*delta, center.x, center.y, center.z));
        }

        if (InputController.Instance().IsKeyDown(68)) {
            this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed*delta, center.x, center.y, center.z));
        }

        if (InputController.Instance().IsKeyDown(87)) {
            this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed*delta, center.x, center.y, center.z));
        }

        if (InputController.Instance().IsKeyDown(83)) {
            this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed*delta, center.x, center.y, center.z));
        }
    }

    center() {
        let x = 0;
        let y = 0;
        let z = 0;
        for(let i = 0; i < this.m_Vertex.length; i += 3){
            x += this.m_Vertex[i];
            y += this.m_Vertex[i + 1];
            z += this.m_Vertex[i + 2];
        }

        return new Vec3(3*x/this.m_Vertex.length, 3*y/this.m_Vertex.length, 3*z/this.m_Vertex.length);
    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    Render(context) {
        CanvasApi.AvaBindBuffer(context, CanvasContext.BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer);
        CanvasApi.AvaSetBufferData(context, CanvasContext.BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer, this.m_Vertex);

        CanvasApi.AvaBindBuffer(context, CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
        CanvasApi.AvaSetBufferData(context, CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer, this.m_Index);

        CanvasApi.SetLocation(context, 1, this.m_Transformation);

        CanvasApi.AvaDrawElements(context, CanvasContext.DrawMode.AVA_LINES, 3);
    }
}