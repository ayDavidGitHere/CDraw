let CDrawf = {};    
class CDraw{
    static scope= this
    static a
    static b
    static init= function(a, b){
        CDraw.a = a; CDraw.b = b;
    }
    static line= function(x, endX, y, endY, color="red", thick=1){
        [this.x, this.endX, this.y, this.endY, this.color,this.thick] =
        [x, endX, y, endY, color, thick];
        this.lengthX = Math.abs(this.x-this.endX);
        this.breadthY = Math.abs(this.y-this.endY);
        this.center = {};
        this.rotation = {rad: 0, about:this.center};
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.updateProps = (B)=>{
            this.center.x=this.x//+this.thick/2;
            this.center.y=this.y+this.breadthY/2;
        }//EO updateProps
        let autoStyle = new CDraw.autoStyle(this.thick+"_"+this.color, this);
        
        this.draw = (B)=>{      
        B.beginPath();     
        autoStyle.call(B);
        B.moveTo(this.x, this.y); 
        B.lineTo(this.endX, this.endY); B.stroke();    
        B.closePath(); 
        this.updateProps(B);
        }
    }
    static sLine= function(x, lengthX, y, breadthY, color, thick){
        [this.x, this.lengthX, this.y, this.breadthY, this.color,this.thick] =
        [x, lengthX, y, breadthY, color, thick];
        this.center = {};
        this.rotation = {rad: 0, about:this.center};
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.updateProps = (B)=>{
            this.center.x=this.x//+this.thick/2;
            this.center.y=this.y+this.breadthY/2;
        }//EO updateProps
        let autoStyle = new CDraw.autoStyle(this.thick+"_"+this.color, this);
        
        this.draw = (B)=>{   
        this.endX = this.x+this.lengthX; this.endY = this.y+this.breadthY
        B.beginPath();     
        autoStyle.call(B);
        B.moveTo(this.x, this.y); 
        B.lineTo(this.endX, this.endY); B.stroke();    
        B.closePath();
        this.updateProps()
        }
    }
    static text= function(fontStyle, text, x, y,styling, maxWidth=309000){
        this.adjustment = [ MHelp.countIn(fontStyle, "+"), MHelp.countIn(fontStyle, "*")];
        this.textAlign =    ["left", "center", "right"][this.adjustment[0]];
        this.textBaseline=    ["top", "middle", "bottom"][this.adjustment[1]];
        this.value = text; this.x = x; this.y = y; 
        this.font = fontStyle.replace( "+", "" ).replace("*", "");
        this.maxWidth = maxWidth;
        this.styling = styling;
        this.fontSize = this.font.replace(/\D/g, "");
        this.center = {}
        this.rotation = {rad: 0, about:this.center}
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.updateProps = (B)=>{
            this.center.x=this.x+(-(this.adjustment[0]-1)*this.fontSize/2);
            this.center.y=this.y-(-(this.adjustment[1]-1)*this.fontSize/2);
        }//EO updateProps
        let autoStyle = new CDraw.autoStyle(this.styling, this);
        
        
        this.draw = (B)=>{   
        B.textAlign = this.textAlign; 
        B.textBaseline =  this.textBaseline;
        B.font = this.font;
        autoStyle.call(B, ()=>{
            B.strokeText(this.value, this.x, this.y, this.maxWidth); 
        },
        ()=>{
            B.fillText(this.value, this.x, this.y, this.maxWidth);
        });
        this.updateProps(B);
        }//EO draw
    }
    static arc= function(x, y, r, startAngle, endAngle, styling){
        this.x = x; this.y = y, this.radius = r; this.startAngle= startAngle;
        this.endAngle = endAngle; 
        this.styling = styling; this.type = "arc";
        this.center = {};
        this.rotation = {rad: 0, about:this.center}
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.updateProps = (B)=>{
            this.center.x = this.x; this.center.y = this.y;
        }
        let autoStyle = new CDraw.autoStyle(this.styling, this);
        
        this.draw = (B)=>{   
            B.beginPath();
            B.arc(this.x, this.y, this.radius, this.startAngle,this.endAngle);
            autoStyle.call(B);
            B.closePath();
            this.updateProps(B);
        }
    }
    static rect= function( x, lengthX, y, breadthY, styling ){
        this.x = x;   this.lengthX = lengthX;
        this.y = y;   this.breadthY = breadthY;
        this.styling = styling;
        this.center = {};
        this.rotation = {rad: 0, about:this.center};
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.updateProps = (B)=>{
            this.center.x=this.x+this.lengthX/2;
            this.center.y=this.y+this.breadthY/2;
        }//EO updateProps
        let autoStyle = new CDraw.autoStyle(this.styling, this);
        
        this.draw = (B)=>{      
            B.beginPath();
            autoStyle.call(B, ()=>{
            B.strokeRect(this.x, this.y, this.lengthX, this.breadthY );
            },
            ()=>{
            B.fillRect(this.x, this.y, this.lengthX, this.breadthY );
            })
            B.closePath();
        this.updateProps(B);
        }//EO draw
    }
    static group = function(){
        
    }
    static autoStyle= function(styling, object){
       var spl;
       if(typeof styling === "string")spl = styling.split("_");
       else spl = styling;
       this.object = object;
       this.color = object.color = spl[1]; 
       this.strokeWidth = object.strokeWidth = Number(spl[0]);
       this.styleType = "FILL";
       if(spl[0] == "") this.styleType = "FILL";    
       if(spl[0] != "") this.styleType = "STROKE";
       this.call = (B, 
        strokeCallback=function(){B.stroke();},
        fillCallback=function(){B.fill();}
        )=>{
           this.color = this.object.color
           this.strokeWidth = this.object.strokeWidth
           if(this.styleType=="FILL"){ 
               B.fillStyle = this.color; fillCallback(); 
           }
           if(this.styleType =="STROKE"){
               B.lineWidth = this.strokeWidth; 
               B.strokeStyle = this.color;
               strokeCallback(); 
           }
       }//EO call
       
    }
    //Transform
    static rotate= function(child, B){
        if(child.rotation.rad!=0 && child.center!=undefined){
            B.translate(child.rotation.about.x, child.rotation.about.y);
            B.rotate(child.rotation.rad);
            B.translate(-child.rotation.about.x, -child.rotation.about.y);
        }
    }
    static shadow = function(B, params){
        [B.shadowColor, B.shadowOffsetX, B.shadowOffsetY, B.shadowBlur] =
        [params[2], params[0], params[1], params[3]];
    }
    static stylesAndComposites = {
        draw: function(child, B){
            B.globalAlpha = child.alpha; 
            CDraw.shadow(B, child.GCParams.shadow);
            B.globalCompositeOperation = (child.GCParams.op!=undefined?child.GCParams.op:"source-over");
        },
        restore: function(B){
            B.globalAlpha = 1;  
            CDraw.shadow(B, [0, 0, "transparent", 0]);
            B.globalCompositeOperation = "source-over";
        }
    }
    static useScene= function(context){
        ["rect", "text", "arc", "line", "sLine"].map((object)=>{
            //CDraw[object].prototype.rotation = {rad:0};
            CDraw[object].prototype.shapeName = object;
            /*
            CDraw[object].prototype.GCParams = {
                shadow: [0, 0, "transparent", 0],
            }
            */
        })
        this.B = context;
        this.allChildren = [];
        let animFrame = ()=>{
            CDraw.clearCanvas(this.B); 
            this.allChildren.map((child) =>{
                this.B.save();
                CDraw.stylesAndComposites.draw(child, this.B)
                CDraw.rotate(child, this.B);
                child.draw(this.B);
                CDraw.stylesAndComposites.restore(this.B);
                this.B.restore();
            });
        requestAnimationFrame(animFrame)
        //console.log("all", this.allChildren)
        }
        animFrame();
        this.add = (child)=>{
            child.indexInScene = this.allChildren.length;
            this.allChildren.push(child);
            //console.log(this.allChildren[child.indexInScene].indexInScene);
        }
        this.remove = (child)=>{ 
            //child.indexInScene = this.allChildren.indexOf(child);
            this.allChildren.splice(child.indexInScene,1);
        }
        this.getOpaquePixels= (B, startX, limitX, startY, limitY, callback)=>{
        var arr_opaq_pos = [];  
	    var imD = B.getImageData(startX, startY, limitX, limitY);   
    	var _width = imD.width*4;   
	    var allPixels = imD.data;   
	    var length = allPixels.length;
	    var rP = 0; var gP=0; var bP=0; 
        for(pos=0; pos <= length -4; pos+=4) {
		    var posX = (pos - Math.floor(pos/_width)*_width)/4;
		    var posY = Math.floor(pos/_width);
            rP = allPixels[pos];
		    gP = allPixels[pos+1]
		    bP = allPixels[pos+2] 
		    aP = allPixels[pos+3];
		    
		    if(aP>250)arr_opaq_pos.push({x: posX, y: posY})
        }//EO for
        callback( arr_opaq_pos );
        }// EO getOpaquePixels
    
    }//EO useScene
    static clearCanvas= function(B){
        B.clearRect(0, 0, B.canvas.width, B.canvas.height)
    }
    static setCanvasStyle= function(a, settings){
        if(settings.type == "background"){
            a.width = a.parentNode.scrollWidth;
            a.height = a.parentNode.scrollHeight;
            //bad fixrs
            a.style.zIndex = -100;
            a.parentNode.style.overflow =
            (a.parentNode!=document.body?"hidden":0);
        }
        a.style.position = settings.position;
        if(settings.pinToTop ){
            if( a.style.position == "absolute" ||
            a.style.position == "relative"){
            a.style.top = 0+"%";
            a.style.left = 0+"%";
            }
            if( a.style.position == "static"){
            a.style.marginLeft = 0;
            a.style.marginTop = 0;
            }
        }//EO if
    }
    

}//EO CDraw
        
        
        
      
