const limit = 50;
// Arrow func to add animation and click event to navigation bar 
const navBar = document.getElementById('nav-bar')
const list = document.getElementsByClassName("nav-list")[0];
const doNavBarClickEvent = () => {
    if(list.classList.length == 1){
    list.classList.add('ignore')
    navBar.style.transform = 'rotateZ(0deg)'
    }
    else{
    list.classList.remove('ignore')
    navBar.style.transform = 'rotateZ(90deg)'
    }
    navBar.style.animationName = "rotateNavBar";
    navBar.style.animationDelay = '0s';
    navBar.style.animationDuration = '0.5s';
    navBar.style.animationTimingFunction = 'linear';
    navBar.style.transitionProperty = 'transform';
}
navBar.addEventListener('click', doNavBarClickEvent);
// function to find capital amount in existing HTML
function findAmount(value){
    let str = '';
    for(let i=value.length; i>=0; i--){
        if(value.charAt(i) == '.') return str;
        str = value.charAt(i)+str;
    }
}
// function to return money format of given string
function toMoneyFormat(value){
    let output = '';
    let i = 4;
    for(let n=value.length-1; n>-1; n--){
        i--;
        if(i!=0){
        output = value.charAt(n)+output;
        }
        else{
            output = ','+output;
            output = value.charAt(n)+output;
            i=3;
        }
    }
    return output;
}
// Resetting values of products to zero.
const resetValues = () => {
    const outputs = document.getElementsByClassName('output');
    const totals = document.getElementsByClassName('total');
    let limit = outputs.length;
    for(let i=0; i<limit; i++){
        outputs[i].textContent = 0;
        totals[i].textContent = 'Rs.0'
    }
    const items = document.getElementsByTagName('tr'); 
    while(items.length>1){
        items[1].remove();
    }
    const pay = document.getElementById('payment')
    pay.firstChild.textContent = "Rs.0"
}
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetValues);

// To capture the plus & minus buttons in cards
const pluslist = document.getElementsByClassName('sign-plus');
const minuslist = document.getElementsByClassName('sign-minus');

// segregating buttons based plus & minus
const coffeePlus = pluslist[0];
const coffeeMinus = minuslist[0];
const teaPlus = pluslist[1];
const teaMinus = minuslist[1];
const blackCoffeePlus = pluslist[2];
const blackCoffeeMinus = minuslist[2];
const gingerTeaPlus = pluslist[3];
const gingerTeaMinus = minuslist[3];
const greenTeaPlus = pluslist[4];
const greenTeaMinus = minuslist[4];
const lemonBalmTeaPlus = pluslist[5];
const lemonBalmTeaMinus = minuslist[5];
const filterCoffeePlus = pluslist[6];
const filterCoffeeMinus = minuslist[6];
const greenCoffeePlus = pluslist[7];
const greenCoffeeMinus = minuslist[7];
const peppermintPlus = pluslist[8];
const peppermintMinus = minuslist[8];

// returns actual name for products by class name
function toActualName(name){
    let words = name.split('-');
    if(words.length == 1)  return name[0].toUpperCase() + name.slice(1).toLowerCase();
    let output = '';
    words.forEach(element => {
        output += element[0].toUpperCase() + element.slice(1).toLowerCase() + " ";
    });
    return output.trim();
}
// it return class name for products by Actual name
function toClassName(name){
    let output = '';
    for(let i=0; i<name.length; i++){
        if(name.charAt(i) != '-'){
        output += name.charAt(i);
        }
    }
    return output.toLowerCase();
}
// to update total billing button 
function updateTotal(){
        const getBillTable = document.getElementById('bill');
        const  list = getBillTable.getElementsByTagName('tr');
        let sum = 0;
        if(list.length>1){
            for(let i=1; i<list.length; i++){
                let b = list[i].getElementsByTagName('td');
                let amount = Number(findAmount(b[3].textContent));
                sum += amount;
            }
            sum = String(sum)
            if(sum.length>3){
                sum = toMoneyFormat(sum)
            }
        }
            let n = document.getElementById('payment');
            n.firstChild.textContent = `Total : Rs.${sum}`;
}
// to update the billing table
function updateBill(count, price, capture){
            const rowBlock = document.getElementById(toClassName(capture.classList[1]));
            const datalist = rowBlock.getElementsByTagName('td');
            let quantity = count/2;
            datalist[1].textContent = count;
            datalist[2].textContent = quantity;
            datalist[3].textContent = `Rs.${count*price}`
}

// function to perform plus event in cards and billing table 
const doPlusEvent = (event) =>{
    const capture = event.target.parentNode.parentNode;
    const QuantitySection = capture.getElementsByClassName('output')[0];
    const AmountSection = capture.getElementsByClassName('total')[0];
    let count = Number(QuantitySection.textContent)
    let price = Number(findAmount(capture.querySelector('p').textContent))
    if(count < limit){
        QuantitySection.textContent = ++count;
        AmountSection.textContent = `Rs.${count*price}`;
        if(count == 1){
            let values = [toActualName(capture.classList[1]), 1, 0.5, AmountSection.textContent]
            const fragment = document.createDocumentFragment();
            const newRow = document.createElement('tr');
            newRow.id = toClassName(capture.classList[1]);
            for(let i=0; i<4; i++){
                let newData = document.createElement('td');
                newData.textContent = values[i];
                newRow.append(newData);
            }
            fragment.append(newRow);
            const tbody = document.querySelector('tbody');
            tbody.append(fragment);
        }
        else{
            updateBill(count, price, capture)
        }
        updateTotal();
    }
}
// function to perform minus event in image card and billing table 
const doMinusEvent = (event) =>{
    const capture = event.target.parentNode.parentNode;
    const QuantitySection = capture.getElementsByClassName('output')[0];
    const AmountSection = capture.getElementsByClassName('total')[0];
    let count = Number(QuantitySection.textContent)
    let price = Number(findAmount(capture.querySelector('p').textContent))
    if(count > 0){
        QuantitySection.textContent = --count;
        AmountSection.textContent = `Rs.${count*price}`;
        if(count == 0){
            const body = document.getElementById(toClassName(capture.classList[1]));
            body.remove();
        }
        else{
            updateBill(count, price, capture)
        }
        updateTotal();
    }
}

// To add Event Listeners to the Buttons
coffeePlus.addEventListener('click', doPlusEvent);
coffeeMinus.addEventListener('click', doMinusEvent);
teaPlus.addEventListener('click', doPlusEvent);
teaMinus.addEventListener('click', doMinusEvent);
blackCoffeePlus.addEventListener('click', doPlusEvent);
blackCoffeeMinus.addEventListener('click', doMinusEvent);
gingerTeaPlus.addEventListener('click', doPlusEvent);
gingerTeaMinus.addEventListener('click', doMinusEvent);
greenTeaPlus.addEventListener('click', doPlusEvent);
greenTeaMinus.addEventListener('click', doMinusEvent);
lemonBalmTeaPlus.addEventListener('click', doPlusEvent);
lemonBalmTeaMinus.addEventListener('click', doMinusEvent);
filterCoffeePlus.addEventListener('click', doPlusEvent);
filterCoffeeMinus.addEventListener('click', doMinusEvent);
greenCoffeePlus.addEventListener('click', doPlusEvent);
greenCoffeeMinus.addEventListener('click', doMinusEvent);
peppermintPlus.addEventListener('click', doPlusEvent);
peppermintMinus.addEventListener('click', doMinusEvent);
// function to capture payment button & do pay event by storing products details in session storage
const payBtn = document.getElementById('payment')
const payEvent = () => {
    let total = 'Rs.'+findAmount(payBtn.textContent)
    sessionStorage.setItem('total', total)
    const bills = document.getElementById('bill');
    const rows = bills.getElementsByTagName('tr');
    for(let i=1; i<rows.length; i++){
        const data = rows[i].getElementsByTagName('td');
        let key = 'item'+i;
        sessionStorage.setItem('length', rows.length);
        sessionStorage.setItem(key, data[0].textContent);
        sessionStorage.setItem(key+' packs', data[1].textContent);
        sessionStorage.setItem(key+' amt', data[3].textContent);
    }
}
payBtn.addEventListener('click', payEvent);