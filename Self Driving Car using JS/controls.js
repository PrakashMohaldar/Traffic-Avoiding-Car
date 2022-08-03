class Controls{
    constructor(type){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        /*to provide listening events to car otherwise traffic vehicle 
        overwrites the listening events*/
        switch(type){
            case "KEYS":
             this.addkeyboardlisteners();
             break;
            
            case "DUMMY":
                this.forward = true;
                break;
        }

    }   
/*with old syntax of funciton here "this" would have refered to 
the object of the function*/
/*whereas using fat arrow funciton here "this" is refereing to constructor object
not as a function object*/
    addkeyboardlisteners(){
        document.onkeydown = (e)=>{
            switch(e.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;

            }
        }
        document.onkeyup = (e) =>{
            switch(e.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}