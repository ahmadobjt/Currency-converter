//we are using currency api
const BASE_URL = "https://api.exchangerate-api.com/v4/latest"; 
const dropdowns=document.querySelectorAll(".dropdown select");
const Btn=document.querySelector("form button[type='submit']");
const fromCurr=document.querySelector(".from select");
const toCurr=document.querySelector(".to select");
const msg=document.querySelector(".msg");
const swapBtn=document.querySelector("#swapBtn");

//populate dropdowns once
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption=document.createElement("option");
        newOption.innerText=currCode;
        newOption.value=currCode;
        if(select.name==="from" && currCode==="USD") {
            newOption.selected="selected";
        }else if(select.name==="to" && currCode==="PKR") {
            newOption.selected="selected";
        } 
        select.append(newOption);
    }
    select.addEventListener("change",(evt)=> {
        updateFlag(evt.target);
    });
}

//swap currencies & flags
swapBtn.addEventListener("click",()=> {
    let tempVal=fromCurr.value;
    fromCurr.value=toCurr.value;
    toCurr.value=tempVal;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    //refreshing rates after swapping
    updateExchangeRate();
});


const updateExchangeRate = async()=> {
    let amount=document.querySelector(".amount input");
    let amtVal=amount.value;
    if (amtVal==="" || amtVal <= 0) {
        amtVal=1;
        amount.value="1";
    }

    msg.innerText = "Fetching rate...";

    // console.log(fromCurr.value,toCurr.value);
    try {
        const URL = `${BASE_URL}/${fromCurr.value}`;
        console.log(URL);
        let response=await fetch(URL);
        let data=await response.json();
        let rate=data.rates[toCurr.value];
        let finalAmount=(amtVal*rate).toFixed(2);
        msg.innerText=`${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    }catch(err) {
        msg.innerText = "Failed to fetch rate. Try again.";
    }
   
}

const updateFlag = (element)=> {
    let currcode=element.value;
    let countryCode=countryList[currcode];
    let newSrc=`https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src=newSrc;
}

Btn.addEventListener("click",(evt)=> {
    evt.preventDefault();
    updateExchangeRate(); 
});

window.addEventListener("load",()=> {
    updateExchangeRate();
});


