class CalcController {

    constructor(){
        this._audio = new Audio('click.mp3'); //here load the audio file into an attribute
        this._audioOnOff = false; //set the audio to off
        this._lastOperator = ''; //beggins without nothing
        this._lastNumber = '';//same as above
        this._operation = []; //create an empty array
        this._locale = 'pt-BR'; //use the local configuration of the region and put into an attribute
        this._displayCalcEl = document.querySelector("#display");  //select of the part of the document to show in the display and throw into an attribute
        this._dateEl = document.querySelector("#data"); //same as above, whoever show the data on the display
        this._timeEl = document.querySelector("#hora");// same as above, with the time 
        this._currentDate; //create a variable to put the current date of the year
        this.initialize(); //initialize the principal methods, as the time, load the audio and the functionality of the buttons 
        this.initButtonsEvents(); //initialize the events of the buttons, such as 'drag' and 'click'
        this.initKeyboard();//here initialize the listening of the keyboard
        
    }

    pasteFromClipboard(){ //this is a method that enable paste numbers into the display of the calc

        document.addEventListener('paste', e=>{

          let text = e.clipboardData.getData('Text'); //create the vatiable 'text' whose load the property of 'clipboardData' and take the text of that you have copy into the variable

          this.displayCalc = parseFloat(text); //here take the attribute text and transform to numbers like float

          //console.log(text); 
        });

        
    }

    copyToClipboard(){ //method that copy the text into the display

        let input = document.createElement('input'); //here create an input, then it save in the attribute

        input.value = this.displayCalc; //put the value of the display into the 'input' attribute

        document.body.appendChild(input); //The appendChild() method adds the new child node to the end of the list of children of the specified parent node

        input.select();//select that exactly input 

        document.execCommand("Copy");//execute a command of copy into the document

        input.remove();//after that removes the text copied in the window of the document, otherwise it will show what did you have copied
    }

    initialize(){ //this method loads the principal methods to run the program 

        this.setDisplayDateTime();//set the time into the display

        setInterval(()=>{//here set an interval to show the seconds to

            this.setDisplayDateTime();

        }, 1000);//the time is marked as miliseconds

        this.setLastNumberToDisplay();//method to set the last number what have in the calculator
        this.pasteFromClipboard();//here toogle on the method to paste the text that you want

        document.querySelectorAll('.btn-ac').forEach(btn=>{//here returns all the element of node 

            btn.addEventListener('dblclick', e=>{//here listen a double click to turn on the sound of the buttons on the calculator

                this.toggleAudio();//load the method to turn on the audio

            });

        });

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;//set the attribute of the audio to off, just for the reason to not initialize right away

    }

    playAudio(){

        if(this._audioOnOff){//This 'if' is used to configure the audio to run specifically at the beginning, so that it plays from the beginning when you click the buttons
            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    addEventListenerAll(element, events, fn){   //element: The DOM element to which you want to add event listeners. //events: A string containing one or more space-separated event types (e.g., 'click mouseover').
        //fn: The event handler function to be called when any of the specified events occur.
        //The events.split(' ') method splits the events string into an array of individual event types. It splits the string based on the space character (' '), which separates different event types if multiple events are specified.
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });

    }

    initKeyboard(){//initialize the events of the keyboard

        document.addEventListener('keyup', e=>{//'keyup' it is when you drop the button

            //console.log(e.key);
            this.playAudio();//load the audio

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot('.');
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':    
                case '6':
                case '7':
                case '8':
                case '9': 
                    this.addOperation(parseInt(e.key));
                    break;

                 case 'c':
                    if(e.ctrlKey) this.copyToClipboard();//if you press ctrl+c, it will copy the text that you are selecting
                    break;   
            }
        });

    }

    clearAll(){//method to clean all the display and numbers in the memory of the calculator

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry(){

      this._operation.pop();  //removes the last element in the array and returns it 

      this.setLastNumberToDisplay();
    }

    getLastOperation(){//method to get the las operator 

        return this._operation[this._operation.length-1];


    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){//check which sign it is

        return(['+','-','*','%','/'].indexOf(value) > -1)
         

    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            
            this.calc();

            console.log(this._operation);
        }
    }

    getResult(){

        try{
        //console.log('get result', this._operation);
        return eval(this._operation.join(""));//'eval' evaluates a string of JavaScript code in the context of the current scope and the 'join' to the array
        }catch(e){
            //console.log(e);
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){//if 'this._operation.length' is smaller than 3, grabs the value from position 0 and writes it to the variable as the first item

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){
            
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);
        }
        
        //console.log('lastOperator:', this._lastOperator);
        //console.log('lastNumber:', this._lastNumber);
        let result = this.getResult();


        if(last == '%'){
          result /=  100;
          this._operation = [result];
        }else{

            this._operation = [result];
            
                if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
        
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length-1; i >=0; i--){

           if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }
        } 

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){
        //console.log('A', isNaN(this.getLastOperation()));

        if(isNaN(this.getLastOperation())){ //this if gets the last operation and verify if it is a number or not
            //string
            if(this.isOperator(value)){
                //change the operator
                this.setLastOperation(value);
            }//else if(isNaN(value)){
                //something else
                //console.log(value);
            //}
            else{
 
                this.pushOperation(value);        
                this.setLastNumberToDisplay();
            }
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value);     
            }else{

            //number
            let newValue = this.getLastOperation().toString()+value.toString();
            this.setLastOperation(newValue);

            this.setLastNumberToDisplay();
             }
        }

        
        //console.log(this._operation);
        
    }

    setError(){

        this.displayCalc = "Error";

    }

    addDot(){

        let lastOperation = this.getLastOperation();
        //console.log(lastOperation);

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.');

        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value){

        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':    
            case '6':
            case '7':
            case '8':
            case '9': 

                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){//this method select the parts of the html that you want to use as a button 

       let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e =>{

               let textBtn = btn.className.baseVal.replace("btn-","");

               this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, "mouseup mousedown", e =>{ //here change the pointer of the mouse to select the numbers

                btn.style.cursor = "pointer";

            });

        });

    }
    
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }    

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value; 
    }

    get currentDate(){
        return new Date(); // "Date" is a native class of JS
    }

    set currentDate(value){
        this._currentDate = value;
    }
}