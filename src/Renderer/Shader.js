module.exports = class Shader {

    m_Data = {};

    Bind() {
    };

    Unbind() {    
    }

    Compile(script){
        this.m_Function = typeof script == 'function' ? script : new Function('ava', 'location', script);
    }

    Execute(data){
        this.m_Function(data, this.m_Data);
    }

    UploadData(name, data){
        this.m_Data[name] = data;
    }
}