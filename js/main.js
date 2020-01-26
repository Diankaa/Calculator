const calculator = {
    waitingForSecondOperand: false,
    firstOperand: false,
    operator: false,
    operations: [],
    subDisplay: 0,
};

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,

    '*': (firstOperand, secondOperand) => parseFloat(firstOperand) * parseFloat(secondOperand),

    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,

    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,

    '=': (firstOperand, secondOperand) => secondOperand,
};

function initMemory() {
    const journalScreen = document.getElementById('history__journal_content');
    if (journalScreen.innerText === 'Записів журналу ще немає') {
        journalScreen.innerText = '';
    }
    const list = `<p><span class='operation'> ${[...calculator.operations].join(' ')} ${'='} <br></span> <span class="result"> ${calculator.subDisplay}</span> </p>`;
    journalScreen.insertAdjacentHTML('afterbegin', list);
}

function updateMainScreen() {
    const main = document.getElementById('calc__main-screen');
    main.value = calculator.operations.join('');
}

function updateSubScreen() {
    const sub = document.getElementById('calc__sub-screen');
    sub.value = calculator.subDisplay;
}

function inputDigit(e) {
    const target = e.target.value;
    const {
        waitingForSecondOperand,
        subDisplay
    } = calculator;

    if (waitingForSecondOperand) {
        calculator.subDisplay = target;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.subDisplay = subDisplay === 0 ? target : subDisplay + target;
    }
    updateSubScreen();
}

function handleOperator(e) {
    const target = e.target.value;
    const {
        firstOperand,
        operator,
        subDisplay
    } = calculator;
    const inputValue = parseFloat(subDisplay);
    if (operator && calculator.waitingForSecondOperand && calculator.operations.length !== 0 && target !== '=') {
        calculator.operator = target;
        calculator.operations[calculator.operations.length - 1] = target;
        updateMainScreen();
        return;
    }
    if (firstOperand === false) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.subDisplay = +result.toFixed(10);
        calculator.firstOperand = result;
    }
    calculator.waitingForSecondOperand = true;
    calculator.operator = target;
    calculator.operations.push(inputValue);

    if (target !== '=') {
        calculator.operations.push(target);
    } else {
        initMemory();
        calculator.operations = [];
    }
    updateSubScreen();
    updateMainScreen();
}

function getSqrt() {
    calculator.subDisplay = Math.sqrt(calculator.subDisplay);
}

function getPersentage() {
    console.log(calculator.firstOperand);
    console.log(calculator.subDisplay);
    
    
    calculator.subDisplay =  calculator.subDisplay / 100;
}

function getSqr() {
    calculator.subDisplay *= calculator.subDisplay;
}

function getFraction() {
    calculator.subDisplay = 1 / calculator.subDisplay;
}

function getCbrt() {
    calculator.subDisplay **= 3;
}

function setSign() {
    calculator.subDisplay *= -1;
}

function setDot() {
    if (calculator.waitingForSecondOperand === true) return;

    if (!calculator.subDisplay.includes('.')) {
        calculator.subDisplay += '.';
        updateSubScreen();
    }
}

function openHistoryWindows(e) {
    const journalScreen = document.getElementById('history__journal_content');
    const memoryScreen = document.getElementById('history__memory_content');
    const journalTitle = document.querySelector('.journal');
    const memoryTitle = document.querySelector('.memory');

    const {
        target
    } = e;
    if (target.classList.contains('memory')) {
        target.style.borderBottom = '3px solid blue';
        memoryScreen.style.display = 'block';
        journalScreen.style.display = 'none';
        journalTitle.style.borderBottom = 'none';
    } else {
        memoryScreen.style.display = 'none';
        memoryTitle.style.borderBottom = 'none';
        journalScreen.style.display = 'block';
        journalTitle.style.borderBottom = '3px solid blue';
    }
}

function setDel() {
    const {
        subDisplay
    } = calculator;
    if (calculator.subDisplay.length > 0) {
        calculator.subDisplay = subDisplay.slice(0, subDisplay.length - 1);
        if (calculator.subDisplay.length === 0) {
            calculator.subDisplay = 0;
        }
    }
    updateSubScreen();
}

function deleteList() {
    const journalScreen = document.getElementById('history__journal_content');
    journalScreen.innerHTML = 'Записів журналу ще немає';
}

function clearDisplay(e) {
    const target = e.target.value;
    if (target === 'CE') {
        calculator.subDisplay = 0;
    } else if (target === 'C') {
        calculator.operations = [];
        calculator.subDisplay = 0;
    }
    updateMainScreen();
    updateSubScreen();
}

function initFunctions(e) {
    const target = e.target.value;
    switch (target) {
        case ('sqrt'):
            getSqrt();
            break;
        case ('%'):
            getPersentage();
            break;
        case ('sqr'):
            getSqr();
            break;
        case ('1/x'):
            getFraction();
            break;
        case ('cbrt'):
            getCbrt();
            break;
        case ('+-'):
            setSign();
            break;
        default:
            break;
    }
    calculator.waitingForSecondOperand = true;
    updateSubScreen();
    updateMainScreen();
}

function initCalculator() {
    const numbers = [...document.querySelectorAll('.btn-number')];
    const operators = [...document.querySelectorAll('.btn-operator')];
    const func = [...document.querySelectorAll('.btn-func')];
    const decimal = document.querySelector('.btn-decimal');
    const historyTitles = [...document.querySelectorAll('.title')];
    const del = document.querySelector('.btn-delete');
    const clear = [...document.querySelectorAll('.btn-clear')];
    const clearMemory = document.querySelector('.trash');

    numbers.map((el) => el.addEventListener('click', inputDigit));
    operators.map((el) => el.addEventListener('click', handleOperator));
    decimal.addEventListener('click', setDot);
    historyTitles.map((el) => el.addEventListener('click', openHistoryWindows));
    del.addEventListener('click', setDel);
    clearMemory.addEventListener('click', deleteList);
    clear.map((el) => el.addEventListener('click', clearDisplay));
    func.map((el) => el.addEventListener('click', initFunctions));
}

initCalculator();