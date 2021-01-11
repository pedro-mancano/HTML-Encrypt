!function crypt(){
    if(this == window){
        return new crypt();
    }
    
    this.page = "";

    this.params = () => {
        for(var i of document.getElementsByTagName('script')[0].src.split('?')[1].split('&')){
            var b;
            if(i && (b=i.split('=')).length == 2){
                if(i[0]=='v'){
                    this.page = "/"+i[1];
                }
            }
        }
    }
    
    this.clear = () => {
        for(var v of document.children){
            v.remove();
        }
    };

    this.jsonToElement = (value, parent) => {
        if(Array.isArray(value)){
            for(var v in value){
                jsonToElement(value[v], parent);
            }
        }else{
            var el = document.createElement(value.tag);
            for(var attrs of value.attributes){
                el.setAttribute(attrs.name, attrs.value);
            }
            if(value.text){
                el.innerText = value.text;
            }
            for(var child of value.children){
                jsonToElement(child, el);
            }
            if(parent){
                parent.append(el);
            }else{
                document.childNodes[1].append(el);
            }
        }
    };

    this.elementToJson = (el, ignoreThis) => {
        var text = this.getText(el);
        var children = [];
        for(var child of el.children){
            children.push(elementToJson(child));
        }
        var value = {
            tag:el.localName,
            attributes:this.NamedNodeMapToArray(el.attributes),
            text:text,
            children:children
        };
        return ignoreThis ? children : value;
       }
    
    this.NamedNodeMapToArray = (nnm) => {
        var b = [];
        for(var n of nnm){
            b.push({name:n.localName,value:n.nodeValue});
        }
        return b;
    }
    
    this.getText = (el) => {
        var str = "";
        var children = el.childNodes;
        for(var child in children){
            if(children[child].nodeName == "#text" && children[child].nodeValue){
                str += children[child].nodeValue.trim();
            }
        }
        return str;
    }

    this.createPage = (json) => {
        this.clear();
        this.jsonToElement(json, document);
    }

    this.request = () => {
        this.params();
        var cryptInstance = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                cryptInstance.createPage(xhttp.responseText);
            }
        };
        xhttp.open("GET", this.page, true);
        xhttp.send();
    }
}().request();


