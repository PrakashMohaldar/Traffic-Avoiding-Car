class NeuralNetwork{
    constructor(neuronCounts){
        this.levels = [];
        /*each levels array contains two arrays outputs neuron and input neuron*/
        /*output neurons acts as givenInputs for next levels input neuron*/ 
        for(let i=0; i<neuronCounts.length-1; i++){
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]));
        }
    }

    /*function just to connect levels*/
    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(givenInputs,network.levels[0]);
        /*feeding output of previous level as input of this level*/
          for(let i=1; i<network.levels.length; i++){
            outputs = Level.feedForward(outputs, network.levels[i]);
          } 
          
          return outputs;
    }
    /*giving random value to weights and biases according to amount*/ 
    static mutate(network, amount=1){
        network.levels.forEach((level)=>{
            for(let i=0; i<level.biases.length; i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0; i<level.weights.length; i++){
                for(let j=0; j<level.weights[i].length; j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }

}


class Level{
    constructor(inputCount, outputCount){

        /*creating neurons array*/ 
        this.inputs = new Array(inputCount);
        //inputs are provided by sensors
        this.outputs = new Array(outputCount);
        // output will be computed by weights and biases of input
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i=0; i<inputCount; i++){
            this.weights[i]  = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    /*setting random weights and biases*/
    static #randomize(level){
        for(let i=0; i<level.inputs.length; i++){
            for(let j=0; j<level.outputs.length; j++){
                level.weights[i][j] = Math.random()*2-1 ;
            }
        }
         
        for(let i=0; i<level.biases.length; i++){
            level.biases[i] = Math.random()*2-1;
        }
    }

    /*returns the output neuron array according to given inputs signals*/ 
    static feedForward(givenInputs, level){
        /*level is just input and output neurons with random values */ 
        for(let i=0; i<level.inputs.length; i++){
            level.inputs[i] = givenInputs[i];
        }

        for(let i=0; i<level.outputs.length; i++){
            let sum =0;
            for(let j=0; j<level.inputs.length; j++){
                sum += level.inputs[j]*level.weights[j][i];
            }

            /* weight*sensorInput + bias = 0 */ 
            if(sum > level.biases[i]){
                level.outputs[i] = 1;
                /*neuron gets activated*/
            }
            else{
                level.outputs[i]=0;
            }
        }

        return level.outputs
    }

     
}