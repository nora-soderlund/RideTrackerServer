export default class XmlElement {
    attributes = {};
    elements = [];
    value = null;

    constructor(tagName, attributes = null, value = null) {
        this.tagName = tagName;

        if(attributes != null)
            this.attributes = attributes;

        if(value != null)
            this.value = value;
    };

    addElement(element) {
        this.elements.push(element);
    };

    toString(pretty) {
        const lines = [];

        let line = [];
        line.push(this.tagName);

        if(this.attributes) {
            let attributes = [];

            for(let key in this.attributes)
                attributes.push(`${key}="${this.attributes[key]}"`);
            
            if(attributes.length != 0)
                line.push(attributes.join(" "));
        }

        if(!this.elements.length && !this.value)
            line.push("/");

        lines.push(`<${line.join(" ")}>`);

        if(this.elements.length) {
            this.elements.forEach((element) => {
                lines.push(element.toString(pretty));
            });
        }
        
        if(this.value)
            lines.push(this.value);

        if(this.elements.length || this.value)
            lines.push(`</${this.tagName}>`);

        return lines.join((pretty && !this.value)?("\n"):(""));
    };
};
