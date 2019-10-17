module.exports = class UISelect {

    m_Options;

    /**
     * 
     * @param {Array<Object>} options 
     */
    constructor(options = []){
        if(!Array.isArray(options)) throw new Error("Only array accepted");
        this.m_Options = options;
    }

    AddOption(option){
        this.m_Options.push(option);
        this.Render();
    }

    RemoveOption(){
        
        this.Render();
    }

    onChange = (value) => {

    }

    Update(){

    }

    Render(){

    }
}