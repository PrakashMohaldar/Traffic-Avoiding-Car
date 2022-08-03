class Car{
    //for defining geometry of car
    constructor(x,y,width,height, controlType, maxSpeed=3 ){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed=0;
        this.acceleration=0.2; 
        this.maxspeed =maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType == "AI";
        /*remember in normal polar coordinate system angle 0 lies in +ve x axis*/
        /*here angle zero lies in +ve y-axis*/

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.raycount,6,4]
            );
            /*if controlsType is not DUMMY equip the sensors 
            otherwise remove it*/
        }

        this.controls = new Controls(controlType);
    }

    move = (roadBorders, traffic)=>{

        /*update is private function i.e. it is accessible within Car class only */
        /*but move() is a public function accessible to outside files to*/
        /**/
        if(this.damaged == false){
            this.#update(); 
            this.polygon = this.#createPolygon();
            this.damaged  = this.#accessDamage(roadBorders,traffic);
        }

        if(this.sensor){
            this.sensor.motion(roadBorders,traffic);
            const offsets = this.sensor.readings.map(
                 elem => elem==null? 0 : 1-elem.offset 
                /*if sensors are far away 0 is offset*/
                /*if sensors are close offset value returned is close to 1*/ 
                );

                /*final output of all neural levels will be stored in "outputs"*/
                const outputs = NeuralNetwork.feedForward(offsets, this.brain );

                if(this.useBrain){
                    this.controls.forward = outputs[0];
                    this.controls.left = outputs[1];
                    this.controls.right = outputs[2];
                    this.controls.reverse = outputs[3];
                }
        }

     }

/*to check whether car is damaged or not*/ 
#accessDamage(roadBorders,traffic){
    for(let i=0; i<roadBorders.length; i++){
        if(polysIntersect(this.polygon, roadBorders[i])){
            return true;
        }
    }
    for(let i=0; i<traffic.length; i++){
        if(polysIntersect(this.polygon, traffic[i].polygon)){
            return true;
        }
    }

    return false;
}

       /*finding corner points of car for colision detection*/
       #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        // rad is hypotenous from center of car to its vertex
        // this.angle is the angle from vertical axis of computer screen
        // _______
        // |     /|
        // |    / |
        // |alp/  | car
        // |  /   |
        // |_/____|
        // multiple shapes can be created using by changing these values below
        points.push({
            x: this.x - Math.sin(this.angle - alpha)*rad,
            y: this.y - Math.cos(this.angle - alpha)*rad
        });/*top right*/

        points.push({
            x: this.x - Math.sin(this.angle + alpha)*rad,
            y: this.y - Math.cos(this.angle + alpha)*rad
        });/*top left*/
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        });/*bottom left*/
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        });/*bottom right*/

        return points;
    
     }

     #update = function(){
    /*for moving forward and backward*/
        /*0,0 index is at top left in canvas*/
        if(this.controls.forward){
            this.speed += this.acceleration;
            /*speed is increasing at rate of 0.2*/
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        if(this.speed>this.maxspeed){
            this.speed = this.maxspeed;
        }
        if(this.speed < (-this.maxspeed)/2){
            this.speed = -this.maxspeed/2;
        }
        if(this.speed>0){
            this.speed -= this.friction;
        }
        if(this.speed<0){
            this.speed += this.friction;
        }
        /*still even if speed has small value it will keep
        moving due to friction*/
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0;
        }

        if(this.speed!=0){
            const flip = (this.speed>0)?1:-1;
               /*for rotating left and right*/
               if(this.controls.right){
                   this.angle -= 0.03*flip;
               }
               if(this.controls.left){
                   this.angle += 0.03*flip;
               }

        }
       

        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed; 
     }

   
    // for displaying the car
    draw(ctx, carcolor, drawSensor = false){
        // ctx.save();/*saves canvas state in stact*/
        // ctx.translate(this.x,this.y);/*moves canvas origin to new location*/
        // ctx.rotate(this.angle);
        // ctx.beginPath();/*resets the current path*/
        // ctx.fillRect(
        //     - this.width/2,
        //     /*canvas origin is at x,y now*/
        //      - this.height/2,
        //     this.width,
        //     this.height
        // );
        // ctx.restore();

        if(this.damaged){
            ctx.fillStyle="gray";
        }
        else{
            ctx.fillStyle = carcolor;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        /*using if coz for traffic cars we dont want this.sensor.draw*/ 
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }

    }
}