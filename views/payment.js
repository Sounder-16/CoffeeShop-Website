const date = new Date()
// function to return month in words
const getMonth = ()=>{
switch((date.getMonth())%12+1){
    case 1: return 'Jan'
    case 2: return 'Feb'
    case 3: return 'Mar'
    case 4: return 'Apr'
    case 5: return 'May'
    case 6: return 'Jun'
    case 7: return 'Jul'
    case 8: return 'Aug'
    case 9: return 'Sep'
    case 10: return 'Oct'
    case 11: return 'Nov'
    case 12: return "Dec"
}
}
// to generate random text for receipt ID
function getRandomText(){
    const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let output = ''
    for(let i=0; i<8; i++){
        output += array[Math.floor(Math.random()*26)]
    }
    return output;
}
// to create documnet fragment for receipt ID, issueDate & Amount. And storing
const fragment = document.createDocumentFragment();
const dateSegment = document.createElement('div')
const dateTime = `${getMonth()} ${date.getDate()}, ${date.getFullYear()} /\t${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
dateSegment.textContent = dateTime;
dateSegment.style.fontWeight = 'bolder';
dateSegment.style.fontSize = '1.2rem'
fragment.append(dateSegment)
const target = document.getElementsByClassName('head')[0]
target.appendChild(dateSegment);
// to set issueDate 
const dates = document.getElementById('date');
const setDate = document.createElement('p')
setDate.textContent = `${date.getDate()}-${(date.getMonth())%12+1}-${date.getFullYear()}`
dates.append(setDate)
// to set receipt ID
const receipt = document.getElementById('receipt');
const setReceipt = document.createElement('p')
setReceipt.textContent = `${date.getFullYear()}${(date.getMonth())%12+1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${getRandomText()}`
receipt.append(setReceipt)
// to set Amount
const amount = document.getElementById('amount')
const total = document.createElement('p')
total.textContent = sessionStorage.getItem('total') == 'Rs.0'? 'Rs.0 (No item is selected)':sessionStorage.getItem('total')
amount.append(total)
// to capture form inputs
const submitBtn = document.getElementsByClassName('forms')[0];
const uname = document.getElementById('fullname')
const mobile = document.getElementById('phone')
const mail = document.getElementById('mail')
const street = document.getElementById('street')
const city = document.getElementById('location')
const pincode = document.getElementById('pincode')
const state = document.getElementById('state-option')
// to set Error & styles for specific input with revelant message
function setError(error, message){
    const errorSection = error.parentNode.getElementsByClassName('msg')[0]
    errorSection.classList.add('error')
    errorSection.textContent = message
    error.classList.remove('success')
    error.classList.add('error-border')
}
// to set Success Styles
function setSuccess(section){
    const successSection = section.parentNode.getElementsByClassName('msg')[0]
    successSection.classList.remove('error')
    section.classList.remove('error-border')
    successSection.textContent = '';
    section.classList.add('success')
}
// function to evaluate the input data from form in proper format
function validateFormDatas(){
    const userName = uname.value.trim();
    const userMobile = mobile.value.trim();
    const userMail = mail.value.trim();
    const userStreet = street.value.trim();
    const userCity = city.value.trim();
    const userPincode = pincode.value.trim();
    let success = true;
    if(userName.length == 0){
        setError(uname, 'User Name cannot be Empty')
        success = false;
    }
    else{
        setSuccess(uname)
    }
    if(userMobile.length == 0){
        setError(mobile, 'Mobile Number cannot be Empty')
        success = false;
    }
    else if(userMobile.length != 10){
        setError(mobile, 'Invalid Mobile Number')
        success = false;
    }
    else{
        setSuccess(mobile)
    }
    if(!userMail.includes('@') || !userMail.includes('.com') || userMail.indexOf('@') == 0 || userMail.indexOf('.com') !== userMail.length-4 || userMail.indexOf('.com')-userMail.indexOf('@') == 1){
        setError(mail, 'Invalid Email Address');
        success = false;
    }
    else{
        setSuccess(mail);
    }
    if(userStreet.length == 0){
        success = false;
        setError(street, 'Door no. & Street cannot be Empty')
    }
    else{
        setSuccess(street)
    }
    if(userCity.length == 0){
        success = false;
        setError(city, 'City cannot be Empty')
    }
    else{
        setSuccess(city)
    }
    if(userPincode.length == 0){
        success = false; 
        setError(pincode, 'Pincode cannot be Empty')
    }
    else if(userPincode.length != 6){
        setError(pincode, 'Invalid Pincode')
        success = false;
    }
    else{
        setSuccess(pincode)
    }
    return success;
}

// sessionStorage.setItem('reference-id', setReceipt.textContent);
// sessionStorage.setItem('date', setDate.textContent);
// to proceed the form if validateFormData function return true or stops
const evaluateForm = (event) => {
    // if form submission fails then form action will be restricted.
    if(!validateFormDatas()){
    event.preventDefault();
    }
    else{
        // if the form submission succeeds then all required data will be seggregated & converted to JS Object
        // this JS Object will be stringified to JSON and will be POSTed using json-server API in data.json file
        const userName = uname.value.trim();
        const userMobile = mobile.value.trim();
        const userMail = mail.value.trim();
        const userStreet = street.value.trim();
        const userCity = city.value.trim();
        const userPincode = pincode.value.trim();
        const length = sessionStorage.getItem('length');
        let items= [];
        for(let i=1; i<length; i++){
            const item = {
                product: sessionStorage.getItem('item'+i),
                quantity: sessionStorage.getItem('item'+i+' packs'),
                amount: sessionStorage.getItem('item'+i+' amt')
            }
            items = [...items, item];
        }
        const order = {
            refId: setReceipt.textContent,
            userName : userName,
            mobile: userMobile,
            email: userMail,
            amount: sessionStorage.getItem('total'),
            issueDate: setDate.textContent,
            items: items,
            address: {
                doorNo_Street : userStreet,
                city: userCity,
                pincode : userPincode,
                state: state.value.trim()
            }
        }
        // code for adding the order in data.json file.
        const addItems = async () => {
            try{
                const PATH = 'http://localhost:3500/orders';
                await fetch(PATH, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(order)
            });
            }
            catch(err){
                console.log(err.name, err.message);
            }
        }
        addItems()
    }
}
submitBtn.addEventListener('submit', evaluateForm);
const totalAmount = amount.querySelector('p');

// this code is to disable or enable inputs in form
// because the user may straight enter to payment.html. Within Product purchase in index page it's impossible to make a BOM(Bill of Materials).
function checkForm(){
if(totalAmount.textContent.length == 0 || totalAmount.textContent.includes('Rs.0')){
    uname.disabled = true;
    mobile.disabled = true;
    street.disabled = true;
    city.disabled = true;
    pincode.disabled = true;
    state.disabled = true;
}
}
checkForm();

// to disable the browser back button
// this prevent the user from moving to payment page when payment gets succeed.
function stopBack(){
    window.history.forward();
}
setTimeout("stopBack()", 0)
window.onunload = function () {null}
