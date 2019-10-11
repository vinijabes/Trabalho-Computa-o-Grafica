const UIObject = require('./UIObject');

module.exports = class UIInput extends UIObject {
    
    /**@type {String} */
    m_Value;

    /**
     * 
     * @param {UIObject} parent 
     */
    constructor(parent, value) {        
        super(parent, document.createElement('input'));
        this.m_Value = value;
        this.m_DomNode.value = value;
    }

    Render(){
    }

    SetValue(newValue){
        if(newValue != this.m_Value){
            this.m_Value = newValue;
            this.m_DomNode.value = newValue;
            this.Render();
        }
    }

    Update(delta){
    }

    Value(){
        return this.m_DomNode.value;
    }
}