const path = require('path');
const fs = require('fs');
module.exports =
    class MathsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
            this.params = this.HttpContext.path.params;
            this.done = false;
        }
        get(){
            //return html doc de maths controller
            if(this.HttpContext.path.queryString == '?'){
                let helpPagePath = path.join(process.cwd(), "wwwroot/helpPages/mathServiceHelp.html");
                let content = fs.readFileSync(helpPagePath);
                this.HttpContext.response.content("text/html", content);
              
            }
            else if(this.HttpContext.path.queryString == '?test'){
                let testPagePath = path.join(process.cwd(), "wwwroot/helpPages/MathsTests/testMathsAPI.html");
                let content = fs.readFileSync(testPagePath);
                this.HttpContext.response.content("text/html", content);
            }
            else{
                let numberOfParameters = this.getNumberOfParams();
                let tabValeur = this.getValeur(numberOfParameters);
                let value = this.doOperation(this.HttpContext.path.params.op ,tabValeur);
                if(!this.done){
                    this.result(value);
                }
                
            }
        
        
        }
        getNumberOfParams(){
            let nbParams = 0;
            if(Object.keys(this.HttpContext.path.params).length > 3){
                error("too many parameters");
            }
            if(this.HttpContext.path.params.op){
                if(this.HttpContext.path.params.x){
                    nbParams++;
                    if(this.HttpContext.path.params.y){
                        nbParams++;
                    }
                    else{
                        this.error("parameter 'y' is missing");
                    }
                }
                else{
                    if(this.HttpContext.path.params.n){
                        nbParams++;
                    }
                    else{
                        this.error("parameter 'x' is missing");
                    }
                }
                
                
            }
            else{
                this.error("parameter 'op' is missing");
            }
            return nbParams;
    
        }
        getValeur(numberOfParameter){
            let tabValeur = [];
            if(numberOfParameter == 2){
                
                this.convertValueParams('x');
                this.convertValueParams('y');
                
                tabValeur.push(parseInt(this.HttpContext.path.params.x));
                tabValeur.push(parseInt(this.HttpContext.path.params.y));
            }
            else if(numberOfParameter == 1){
                this.convertValueParams('n');
                tabValeur.push(parseInt(this.HttpContext.path.params.n));
            }
            return tabValeur;
        }
        convertValueParams(name){
            if(name in this.params){
                let n = this.params[name]
                let value = parseFloat(n);
                if(!isNaN(value)){
                    this.params[name] = value;
                }
            }
        }
        doOperation(op , tabValeur){
            let value = 0;
            
            switch(op){
                case ' ':
                    value = tabValeur[0] + tabValeur[1];
                    break;
                case '-':
                    value= tabValeur[0]-tabValeur[1];
                    break;
                case '*':
                    value = tabValeur[0]*tabValeur[1];
                    break;
                case '/':
                    value = tabValeur[0]/tabValeur[1];
                    break;
                case '%':
                    value = tabValeur[0]%tabValeur[1];
                    break;
                case '!':
                    value = this.factorial(tabValeur[0]);
                    break;
                case 'p':
                    value = this.isPrime(tabValeur[0]);
                    break;
                case"np":
                    value = this.findPrime(tabValeur[0]);
                    break;
                default:
                    this.error("opérateur non valide");
                    break;        
                               
            }
            if(value == Infinity){
                value = "infinity";
            }
            return value;
        }
        result(value){
            this.HttpContext.path.params.value = value;
            this.HttpContext.response.JSON(this.HttpContext.path.params);
        }
        error(message){
            this.done = true;
            this.HttpContext.path.params.error = message;
            this.HttpContext.response.JSON(this.HttpContext.path.params);
        }
        factorial(n){
            if(n===0||n===1){
              return 1;
            }
            return n*this.factorial(n-1);
        }
        isPrime(value) {
            for(var i = 2; i < value; i++) {
                if(value % i === 0) {
                    return false;
                }
            }
            return value > 1;
        }
        findPrime(n){
            let primeNumer = 0;
            for ( let i=0; i < n; i++){
                primeNumer++;
                while (!this.isPrime(primeNumer)){
                    primeNumer++;
                }
            }
            return primeNumer;
        }
    }
    
    