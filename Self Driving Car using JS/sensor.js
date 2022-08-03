/*Implementing ray casting*/ 

class Sensor{
    constructor(car){
        this.car = car;
        this.raycount =5;
        this.raylength = 100;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }
   motion(roadBorders,traffic){
       this.#castRays();
        this.readings = [];
        /*reading will store the intersection points x, y and offset of each ray*/
        for(let i=0; i<this.rays.length; i++){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders,traffic)
            );
        }
    }
/*taking single ray and giving nearest intersection point */
    #getReading(ray, roadBorders,traffic){
      let touches = [];
      
      for(let i=0; i<roadBorders.length; i++){
        /*finding intersection point and offset value and storing to touches array*/
        const touch = getIntersection(ray[0],ray[1],roadBorders[i][0], roadBorders[i][1]);
        if(touch){
            touches.push(touch);
        }
      }

      for(let i=0; i<traffic.length; i++){
        const poly = traffic[i].polygon;
        for(let j=0; j<poly.length; j++){
            const value = getIntersection(ray[0], ray[1], poly[j], poly[(j+1)%poly.length])
            if(value){
                touches.push(value);
              }
        }
      }
    

      if(touches.length==0){
        return null;
      }else{
        /*creating a new offsets array and finding intersection point
        in "touches" array which have minimum offset value*/
        const offsets = touches.map(elem => elem.offset);
        const minOffset = Math.min(...offsets);
        /*returning the minimum of touches coz we want to find the
        coordinates of nearest intersection point from the center of box
        and avoid the other intersection point in same ray which are far */
        return touches.find(elem => elem.offset == minOffset );
      }
    }

    #castRays(){
        this.rays = [];
        for(let i=0; i<this.raycount; i++){
            /*for getting each */
            const rayAngle = lerp(this.raySpread/2,
                                    -this.raySpread/2,
                                    (this.raycount==1) ?  0.5  :  i/(this.raycount-1)
                                    ) + this.car.angle;
            //    \  |  /
            //     \+|-/
            //      \|/

            /*beginning and ending of a ray*/
            const start = {
                x: this.car.x,
                y: this.car.y
            };
            const end = {
                x: this.car.x - Math.sin(rayAngle)*this.raylength,
                y: this.car.y - Math.cos(rayAngle)*this.raylength
            };
            this.rays.push([start,end]);
        }
    }

    
    draw(ctx){
        for(let i=0; i<this.raycount; i++){
            let end = this.rays[i][1];/*storing the end points for now*/
            if(this.readings[i]){
                end = this.readings[i];  
                /*storing the interesection points in ray*/
            }

            ctx.beginPath();
            ctx.lineWidth =2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x , this.rays[i][0].y);
            ctx.lineTo(end.x , end.y); 
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth =2;
            ctx.strokeStyle = "black";
            ctx.moveTo(end.x , end.y);
            ctx.lineTo(this.rays[i][1].x , this.rays[i][1].y); 
            ctx.stroke();
        }
    }
}