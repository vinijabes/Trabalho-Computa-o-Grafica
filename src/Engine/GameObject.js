const { Vec3, Mat4 } = require('../Mat');
const { CanvasApi, CanvasContext } = require('../Canvas');
const InputController = require('./InputController');


module.exports = class GameObject {
    /**@type {String} */
    m_Name;

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
    m_TranslationSpeed = 60.0;

    constructor(name, mutable = true) {
        this.m_Name = name;
        this.m_Mutable = mutable;
        this.m_Transformation = Mat4.Identity();
    }

    Transform(transformation){
        this.m_Transformation = this.m_Transformation.multiplyMat4(transformation);
    }

    Update(delta) {
        if (!this.m_Mutable) return;
        let center = this.center();

        if (!InputController.Instance().IsKeyDown(16)) {
            if (InputController.Instance().IsKeyDown(65)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed * delta, center.x, center.y, center.z));
            }

            if (InputController.Instance().IsKeyDown(68)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed * delta, center.x, center.y, center.z));
            }

            if (InputController.Instance().IsKeyDown(87)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed * delta, center.x, center.y, center.z));
            }

            if (InputController.Instance().IsKeyDown(83)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed * delta, center.x, center.y, center.z));
            }

            if (InputController.Instance().IsKeyDown(81)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationZ(-this.m_RotationSpeed * delta, center.x, center.y, center.z));
            }

            if (InputController.Instance().IsKeyDown(69)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationZ(this.m_RotationSpeed * delta, center.x, center.y, center.z));
            }

            if (InputController.Instance().IsKeyDown(37)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.Translation(-this.m_TranslationSpeed * delta, 0, 0, 0));
            }

            if (InputController.Instance().IsKeyDown(39)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.Translation(this.m_TranslationSpeed * delta, 0, 0, 0));
            }

            if (InputController.Instance().IsKeyDown(38)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.Translation(0, this.m_TranslationSpeed * delta, 0, 0));
            }

            if (InputController.Instance().IsKeyDown(40)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.Translation(0, -this.m_TranslationSpeed * delta, 0));
            }

            if (InputController.Instance().IsKeyDown(17)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.Translation(0, 0, -this.m_TranslationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(32)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.Translation(0, 0, this.m_TranslationSpeed * delta));
            }
        } else {
            if (InputController.Instance().IsKeyDown(65)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(68)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(87)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(83)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(81)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationZ(-this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(69)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationZ(this.m_RotationSpeed * delta));
            }
        }
    }

    center() {
        let x = 0;
        let y = 0;
        let z = 0;
        let v3;
        for (let i = 0; i < this.m_Vertex.length; i += 3) {
            v3 = new Vec3(this.m_Vertex[i], this.m_Vertex[i + 1], this.m_Vertex[i + 2]);
            v3 = v3.multiplyMat4(this.m_Transformation);
            x += v3.x;
            y += v3.y;
            z += v3.z;
        }

        return new Vec3(3 * x / this.m_Vertex.length, 3 * y / this.m_Vertex.length, 3 * z / this.m_Vertex.length);
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