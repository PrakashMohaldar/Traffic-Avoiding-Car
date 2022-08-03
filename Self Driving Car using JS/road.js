class Road{
    constructor(x, width, lanecount=3){
        this.x = x;
        this.width = width;
        this.lanecount = lanecount;

        this.left =  x - this.width/2;
        this.right = x + this.width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft = {x:this.left, y:this.top};
        const topRight = {x:this.right, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const bottomRight = {x:this.right, y:this.bottom};
        
        this.borders = [
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }

    /*for placing car at the center of lane*/
    posatlanecenter(laneindex){
        if(laneindex>=1 && laneindex<=this.lanecount){
            const lanewidth = this.width/this.lanecount;
            return (this.left + ((laneindex-1)*lanewidth) + lanewidth/2);    
        }
        else{
            return this.posatlanecenter(this.lanecount);
        }
    }
    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
        /*for creating multiple lane*/
        for(let i=1; i<=this.lanecount-1; i++){
            const pos = lerp(this.left, this.right, i/this.lanecount);

        //    if(i>0 && i<this.lanecount){
        //     ctx.setLineDash([20,20]);
        //    }
        //    else{
        //     ctx.setLineDash([]);
        //    }
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(pos,this.top);
            ctx.lineTo(pos, this.bottom);
            ctx.stroke();
            /*strokes the subpath with current stroke style*/
        }


        ctx.setLineDash([]);  
        this.borders.forEach(b=>{
            ctx.beginPath();
            ctx.moveTo(b[0].x,b[0].y);
            ctx.lineTo(b[1].x,b[1].y);
            ctx.stroke();
        });
    }
}