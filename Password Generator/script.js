// FETCHING ALL JS ITEMS
const copyBtn = document.querySelector("[copy-btn]");
const passDisplay = document.querySelector("[password-display]");
const clickMsg = document.querySelector("[click-msg]");
const passLength = document.querySelector("[pass-length]");
const passSlider = document.querySelector("[pass-slider]");
const uppercase = document.querySelector("#pass-uppercase");
const lowercase = document.querySelector("#pass-lowercase");
const numbers = document.querySelector("#pass-numbers");
const symbols = document.querySelector("#pass-symbols");
const indicator = document.querySelector("[pass-indicator]");
const passGenerator = document.querySelector("[pass-generator]");
const AllCheckboxes = document.querySelectorAll("input[type=checkbox]");


// SET ALL DEFAULT VALUES
let password = "";              // initial password
let passwordLength = 10;        // initial password length
let checkCount = 0;          // initial selected checkboxes
let SymbolsString = '~`!@#$%^&*()-_=+[{]}\|,<.>;/?:' ;
SliderHandler();
SetIndicator("#ccc");



// SET PASSWORD LENGTH AND SLIDER ---> (It just reflect the value of password length on UI)
function SliderHandler(){
    passSlider.value = passwordLength;
    passLength.innerText = passwordLength;

    const max = passSlider.max;
    const min = passSlider.min;
    passSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min) ) + "% 100%";
}


// SET INDICATOR
function SetIndicator(color){
    // color
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


// RANDOM INTEGER GENERATOR
function RndIntGenerator(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function RndNumberGen(){
    return RndIntGenerator(0,9);
}

function RndUppercaseGen(){
    let ch = String.fromCharCode(RndIntGenerator(65,91));
    return ch;
}

function RndLowercaseGen(){
    let ch = String.fromCharCode(RndIntGenerator(97,123));
    return ch;
}

function RndSymbolsGen(){
    let index = RndIntGenerator(0,SymbolsString.length);
    return SymbolsString.charAt(index);
}

//  DETERMINING THE STRENGTH OF THE PASSWORD
function calcStrength(){
    let hasupper = false;
    let haslower = false;
    let hasnumber = false;
    let hassymbol = false;

    if(uppercase.checked) hasupper = true;
    if(lowercase.checked) haslower = true;
    if(numbers.checked) hasnumber = true;
    if(symbols.checked) hassymbol = true;

    if(hasupper && haslower && (hasnumber || hassymbol) && passwordLength>=8){
        SetIndicator("#0f0");
    }
    else if((hasupper || haslower) && (hasnumber || hassymbol) && passwordLength>=6){
        SetIndicator("#ff0");
    }
    else{
        SetIndicator("#f00");
    }
}


// FUNCTION TO SHUFFLE PASSWORD
function ShufflePassword(arr){
    // Fisher Yates Method
    for(let i=arr.length-1;i>0;i--){
        // finding j
        const j = Math.floor(Math.random() * (i+1));
        // swapping
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;  
    }

    let str = "";
    arr.forEach((ele) => (str += ele)) ;
    return str;
}


// COPY GENERATED PASSWORD
async function copyPassword(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);     // this method returns a promise
        clickMsg.innerText = "Copied!";
    }
    catch(e){
        clickMsg.innerText = "Failed!";
    }

    clickMsg.classList.add("action");
    setTimeout(()=>{
        clickMsg.classList.remove("action");
    },2000);
}



// ADDING EVENT LISTENER ON SLIDER
passSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    SliderHandler();
})

// ADDING EVENT LISTENER ON COPY BUTTON
copyBtn.addEventListener('click',async ()=>{
    if(passDisplay.value){
        await copyPassword();
    }
})

// ADDING EVENT LISTENER ON CHECKBOXES ---> (if none of the checkbox is checked then it generates nothing, this function find the number of checkboxes checked)
AllCheckboxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',CheckboxCount); // 'change' --> wheather you click ticked or un-ticked 
})

function CheckboxCount(){
    checkCount = 0;
    AllCheckboxes.forEach((checkbox)=>{
        if(checkbox.checked){
            ++checkCount;
        }
    })
    // special conditiion (suppose you check all checkboxes but give password length 1, so it automatically generatre a password of length 4)
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        SliderHandler();
    }
}

// ADDING EVENT LISTENER FOR GENERATING FINAL PASSWORD
passGenerator.addEventListener('click',()=>{
    // none of the checkboxes are selected
    if(checkCount == 0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        SliderHandler();
    }

    // let's start the journey to generate password
    password = "";
    let funcArr = [];

    if(uppercase.checked)
        funcArr.push(RndUppercaseGen);
    
    if(lowercase.checked)
        funcArr.push(RndLowercaseGen);
    
    if(numbers.checked)
        funcArr.push(RndNumberGen);
    
    if(symbols.checked)
        funcArr.push(RndSymbolsGen);

    // compulsory password
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    // remaining password
    for(let i=0;i<(passwordLength-funcArr.length);++i){
        let randIndex = RndIntGenerator(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffling password
    password = ShufflePassword(Array.from(password));

    // Password on UI 
    passDisplay.value = password;

    // Invokes Password Strength
    calcStrength();
});