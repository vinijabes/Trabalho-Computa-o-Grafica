const UIObject = require('./UIObject');
module.exports = class UISelect extends UIObject {

    m_Options = [];
    onChange = null;

    /**
     * @param {UIObject} parent
     * @param {Array<Object>} options 
     */
    constructor(parent, options = []) {
        super(parent, document.createElement('select'));

        if (!Array.isArray(options)) throw new Error("Only array accepted");

        this.m_Options = [];
        for (let opt of options) this.AddOption(opt);

        this.m_DomNode.onchange = (e) => {
            if (this.onChange)
                this.onChange(this.m_Options[this.m_DomNode.value].value);
        }
    }

    AddOption(option, value) {
        if (!value) {
            if (typeof (option) != 'object') option = { text: option, value: null }
            this.m_Options.push(option);
        } else {
            this.m_Options.push({ text: option, value });
        }
        this.Render();
    }

    RemoveOption() {
        this.Render();
    }

    AddChild() { };

    Render() {
        this.m_DomNode.innerHTML = '';

        let i = 0;
        for (let option of this.m_Options) {
            let optionDom = document.createElement("option");
            optionDom.text = option.text;
            optionDom.value = i++;
            this.m_DomNode.add(optionDom);
        }
    }

    Value(){
        return this.m_Options[this.m_DomNode.value].value;
    }
}