/* dashed outlines are the biases */
/* line colors are weights */  
/* output neurons filled color and weights shows whether the neuron is activated or not*/ 

class Visualizer{
    static drawNetwork(ctx, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin*2;
        const height = ctx.canvas.height - margin*2;

        const levelHeight = height/network.levels.length;

        /*drawing multiple levels by finding the length of */ 
        for(let i=network.levels.length-1 ; i>=0; i--){
            const a = lerp(
                height - levelHeight,
                0,
                network.levels.length ==1 ? 0.5 : i/(network.levels.length-1)
            );
            /*levelTop is the distance of level from top of the canvas*/ 
            const levelTop = top + a;

            // ctx.setLineDash([7,3]);
            Visualizer.drawLevel(
                ctx,
                network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i==network.levels.length-1
                ? ['F', 'L', 'R', 'B']
                : [] 
            );
        }      
        
    }

    static drawLevel(ctx,level, left,top,width,height,outputLabels){
        const right = left+width;
        const bottom = top+height;
        const{inputs, outputs,weights,biases} = level;
        const nodeRadius = 18;
        /*drawing lines between neurons*/ 
        for(let i=0; i<inputs.length; i++){
            for(let j=0; j<outputs.length; j++){
                 ctx.beginPath();
                 ctx.lineWidth = 2;
                 /*setting RGBA color to lines according to the weigths of outputs neuron*/                
                 ctx.strokeStyle = getRGBA(weights[i][j]);
                 ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left,right),
                    bottom
                 );
                 ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left,right),
                    top
                 );
                 ctx.stroke();
            }
        }
        /* drawing neurons */ 
        for(let i=0; i<inputs.length; i++){
            const x = Visualizer.#getNodeX(inputs, i, left,right);
            ctx.beginPath();
            ctx.arc(x,bottom, nodeRadius,0,Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill(); 

            ctx.beginPath();
            ctx.arc(x,bottom, nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill(); 
        }
        for(let i=0; i<outputs.length; i++){
            const x = Visualizer.#getNodeX(outputs, i, left,right);
            /*creating neurons*/ 
            ctx.beginPath();
            ctx.arc(x,top, nodeRadius,0,Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill(); 

            ctx.beginPath();
            ctx.arc(x,top, nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill(); 

            /*for creating biases outline on neurons*/ 
            ctx.beginPath();
            ctx.lineWidth =2;
            ctx.arc(x,top,nodeRadius*0.8, 0, Math.PI*2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseLine = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = `${1.2*nodeRadius}px Arial`;
                ctx.fillText(outputLabels[i],x,top+nodeRadius*0.38);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.38);
            }


        }

    }

    static #getNodeX(nodes, index, left, right){
        return  lerp(
            left,
            right,
            nodes.length ==1 ? 0.5 : index/(nodes.length-1)
        );
    }

}