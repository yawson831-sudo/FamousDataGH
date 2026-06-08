const form = document.getElementById("buyForm");
const popup = document.getElementById("popup");

const ADMIN_PIN = "2200";
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000; // 10 mins

let attempts =
parseInt(localStorage.getItem("attempts")) || 0;

let lockedUntil =
parseInt(localStorage.getItem("lockedUntil")) || 0;

/* Popup Function */
function showPopup(title, message, color){

popup.innerHTML = `
<h3>${title}</h3>
<p>${message}</p>
`;

popup.style.background = color;
popup.classList.add("show");

setTimeout(()=>{
popup.classList.remove("show");
},3000);
}

/* Form Submit */
form.addEventListener("submit", function(e){

e.preventDefault();

const now = Date.now();

/* Check lock */
if(now < lockedUntil){

const mins =
Math.ceil((lockedUntil - now)/60000);

showPopup(
"🔒 Locked",
`Too many wrong PIN attempts.<br>
Try again in ${mins} minute(s).`,
"#ff4444"
);

return;
}

/* Get form values */
const phone =
form.querySelector("input").value;

const network =
form.querySelectorAll("select")[0].value;

const bundle =
form.querySelectorAll("select")[1].value;

/* Fake SMS-style admin approval */
const pin = prompt(
`📩 New Order Request

Network: ${network}
Bundle: ${bundle}
Phone: ${phone}

Enter Admin PIN`
);

/* If cancel clicked */
if(pin === null){
showPopup(
"❌ Cancelled",
"Transaction cancelled.",
"#ff8800"
);
return;
}

/* Correct PIN */
if(pin === ADMIN_PIN){

attempts = 0;

localStorage.setItem(
"attempts",
attempts
);

showPopup(
"✅ Approved",
`Data purchase for
${phone} approved.`,
"#00c851"
);

form.reset();

}else{

attempts++;

localStorage.setItem(
"attempts",
attempts
);

/* Lock after 3 tries */
if(attempts >= MAX_ATTEMPTS){

lockedUntil =
Date.now() + LOCK_TIME;

localStorage.setItem(
"lockedUntil",
lockedUntil
);

showPopup(
"🔒 PIN Locked",
"3 wrong attempts.<br>Locked for 10 minutes.",
"#ff4444"
);

}else{

showPopup(
"❌ Wrong PIN",
`${MAX_ATTEMPTS - attempts}
attempt(s) left.`,
"#ff4444"
);
}
}
});

/* Smooth animation on load */
window.addEventListener("load", ()=>{

document.body.style.opacity = "1";

});
