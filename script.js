const displayEl = document.getElementById("display");
const startBtnEl = document.getElementById("start-btn");
const strictBtnEl = document.getElementById("strict-btn");
const onBtnEl = document.getElementById("on-btn");

//light buttons
const lightBtns = document.querySelectorAll(".light-btns");
const onColors = ["red", "green", "yellow", "blue"];
const offColors = ["rgb(209, 0, 0)", "rgb(0, 97, 0)", "rgb(204, 204, 0)", "rgb(0, 0, 167)"];

let isOn = false;
let count = 0;
let hasStarted = false;
let isStrict = false;
const steps = [];
const stepsInput = [];
const btnHandlers = []
const inputHandlers = [];
let timerAcc = 0;
let repeatAnimTimer = null;
let isUserTurn = false;

const sounds = [
    new Audio('https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-1.mp3'),
    new Audio('https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-2.mp3'),
    new Audio('https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-3.mp3'),
    new Audio('https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-4.mp3')
];



onBtnEl.addEventListener('click', () => {
    isOn = !isOn;

    isOn ? displayEl.textContent = "--" : displayEl.textContent = "";

   

    count = 0;
    hasStarted = false;
    isStrict = false;
    steps.length = 0;;
    stepsInput.length = 0;
    btnHandlers.length = 0;
    inputHandlers.length = 0;
    timerAcc = 0;

    clearTimeout(repeatAnimTimer)

})

startBtnEl.addEventListener('click', () => {
    if(isOn){
        hasStarted = !hasStarted;

        if(hasStarted){

            const blink = setInterval(() => {

            displayEl.textContent === "--" ? displayEl.textContent = "" : displayEl.textContent = "--";

            }, 200);

        
            setTimeout(() => {
                clearInterval(blink);
                generateStep();
            }, 2000);

            

        }
        

    }
})

strictBtnEl.addEventListener('click', () => {
    isStrict = !isStrict;
})

const addBtnsListeners = () => {
    
    lightBtns.forEach((btn, index) => {

        const handler = (e) => {
            if(!isUserTurn) return;
            stepsInput.push(index + 1);
            
            checkSequence();

        }

        const handler2 = () => {
            if(!isUserTurn) return;
            btn.style.backgroundColor = onColors[index];

            sounds[index].currentTime = 0;
            sounds[index].play();
        }

        const handler3 = () => {
            if(!isUserTurn) return;
            btn.style.backgroundColor = offColors[index];
        }

        btnHandlers[index] = handler;
        inputHandlers[index] = [handler2, handler3];

        btn.addEventListener('click', handler)

        btn.addEventListener('mousedown', handler2);

        btn.addEventListener('mouseup', handler3)
    })

}

const generateStep = () => {

    const randomStep = Math.floor((Math.random() * 4) + 1);

    steps.push(randomStep);

    animateSteps();
}

const animateSteps = async () => {
    isUserTurn = false

    if(repeatAnimTimer !== null) {
        clearTimeout(repeatAnimTimer);
        repeatAnimTimer = null;
    };
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for(let i = 0; i < steps.length; i++){

        await sleep(700);
        
            if(steps[i] === 1){
                lightBtns[0].style.backgroundColor = onColors[0];

                sounds[0].currentTime = 0;
                sounds[0].play();
                
            } else if(steps[i] === 2){
                lightBtns[1].style.backgroundColor = onColors[1];

                sounds[1].currentTime = 0;
                sounds[1].play();

            } else if(steps[i] === 3){
                lightBtns[2].style.backgroundColor = onColors[2];

                sounds[2].currentTime = 0;
                sounds[2].play();
            } else {
                lightBtns[3].style.backgroundColor = onColors[3];

                sounds[3].currentTime = 0;
                sounds[3].play();
            }

            await sleep(500);

             lightBtns.forEach((curr, index) => {

                lightBtns[index].style.backgroundColor = offColors[index];
            })

            sounds.forEach((sound, index) => {
                sound.pause();
            })
    
    }

        isUserTurn = true;
        
        if(inputHandlers.length !== 0) clearEventListeners(); 
        addBtnsListeners();


        

         repeatAnimTimer = setTimeout(() => {
            if(stepsInput.length === 0){
                animateSteps()
            }
        
    }, 4000);
}

const clearEventListeners = () => {
    lightBtns.forEach((btn, index) => {
        btn.removeEventListener('click', btnHandlers[index]);

        btn.removeEventListener('mousedown', inputHandlers[index][0]);
        btn.removeEventListener('mouseup', inputHandlers[index][1]);
    });

    
}

const checkSequence = () => {
    const lengthInput = stepsInput.length;
    
    const original = steps.slice(0, lengthInput);

    let isCorrect = stepsInput.every((stepI, index) => stepI === original[index]);


    if(isCorrect){
       if(lengthInput === steps.length){
            count++;
            displayEl.textContent = count;
            stepsInput.length = 0;
            timerAcc = 0;
            generateStep();
       }
    } else {
        timerAcc = 0;
        mistakeResets();
    }

    
}

const mistakeResets = async () => {
    if(isStrict) {
        count = 0;
        steps.length = 0;
        stepsInput.length = 0;
        timerAcc = 0;
        await mistakeAnimation();
        
    } else {
        stepsInput.length = 0;
        await mistakeAnimation();
    }

    
}

const mistakeAnimation = async () => {
    
    const blink = setInterval(() => {
        displayEl.textContent === "!!" ? displayEl.textContent = "" : displayEl.textContent = "!!"
    }, 300);

    setTimeout(() => {
        clearInterval(blink);
        if(isStrict){
            displayEl.textContent = count;
            generateStep();
    
        }else{
            displayEl.textContent = count;
            animateSteps();
        }
    }, 2000)


}