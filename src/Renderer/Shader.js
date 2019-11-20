const Vec3 = require('../Mat/Vec3');
const Vec4 = require('../Mat/Vec4');

module.exports = class Shader {

    m_Data = {};

    Bind() {
    };

    Unbind() {    
    }

    Compile(script){
        let context = {Vec3, Vec4};
        this.m_Function = typeof script == 'function' ? script : new Function('ava', 'location', script).bind(context);
    }

    Execute(data){
        this.m_Function(data, this.m_Data);
    }

    UploadData(name, data){
        this.m_Data[name] = data;
    }
}