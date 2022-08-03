const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 350;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0]

if(localStorage.getItem("bestBrain")){

  for(let i=0; i<cars.length; i++){
    /*by doing this every car will act like best car*/ 
    /* each car will have same behaviour and movement and will overlap each other*/ 
    cars[i].brain  = JSON.parse(
      localStorage.getItem("bestBrain"));

      /*mutating every car except 1st car*/ 
      if(i!=0){
        NeuralNetwork.mutate(cars[i].brain, 0.1);
      }
  }

}


const traffic = [
  new Car(road.posatlanecenter(2),-100,30,50, "DUMMY",2),
  new Car(road.posatlanecenter(2),-300,30,50, "DUMMY",2),
  new Car(road.posatlanecenter(3),-300,30,50, "DUMMY",2),
  new Car(road.posatlanecenter(1),-500,30,50, "DUMMY",2),
  new Car(road.posatlanecenter(2),-500,30,50, "DUMMY",2),
  new Car(road.posatlanecenter(3),-700,30,50, "DUMMY",2),
  new Car(road.posatlanecenter(1),-700,30,50, "DUMMY",2)
];

/*to store the best car's brain*/ 
function save(){
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard(){
  localStorage.removeItem("bestBrain");
  console.log("removed");
}

function generateCars(N){
  const cars = [];
  for(let i=1; i<=N; i++){
    cars.push(new Car(road.posatlanecenter(2),100,30,50,"AI"))
  }
  return cars;
}

function animate(time){

  for(let i=0; i<traffic.length; i++){
    /*empty array is passed so that traffic cars do not interact with other stuff*/ 
    traffic[i].move(road.borders,[]);
  }

  /*adding traffic as input so that car interacts with traffic*/ 
  for(let i=0; i<cars.length; i++){
    cars[i].move(road.borders,traffic);
  }
  /* we want to focus on the best car one which goes up in other words
  one which has minimum y*/ 


  /*fitness function*/ 
  bestCar=cars.find(
    c=>c.y==Math.min(
        ...cars.map(c=>c.y)
    ));


    carCanvas.height =  window.innerHeight;
    networkCanvas.height =  window.innerHeight;

    carCtx.save();
    carCtx.translate(0 ,-bestCar.y + (carCanvas.height*0.7));
    road.draw(carCtx);

    for(let i=0; i<traffic.length; i++){
      traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha = 0.2;
    for(let i=0; i<cars.length; i++){
      cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"blue",true);


   carCtx.restore();

  //  networkCtx.lineDashOffset = -time/50
  /*sensor offset is given as input and output is the returned from trained levels of neuron*/  
   Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
    /*just like set interval but is better and calls animate 
    function at rate of 60 times per sec that is 60hz*/  
}
animate();


