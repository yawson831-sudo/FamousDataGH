const form = document.getElementById("buyForm");
const popup = document.getElementById("popup");

const ADMIN_PIN = "2200";
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000; // 10 mins

let attempts =
parseInt(localStorage.getItem("attempts")) || 0;

let lockedUntil =
parseInt(localStorage.getItem("lockedUntil")) || 0;

form.addEventListener("submit", function(e){
e.preventDefault();

const now = Date.now();

/* Check if locked */
if(now < lockedUntil){

const minutesLeft =
Math.ceil((lockedUntil - now) / 60000);

popup.innerHTML = `
<h3>🔒 Locked</h3>
<p>Too many wrong PIN attempts.<br>
Try again in ${minutesLeft} min(s).</p>
`;

popup.style.background = "#ff4444";
popup.classList.add("show");

setTimeout(()=>{
popup.classList.remove("show");
popup.style.background = "#00c851";
},3000);

return;
}

const phoneNumber =
form.querySelector("input").value;

const network =
form.querySelectorAll("select")[0].value;

const bundle =
form.querySelectorAll("select")[1].value;

/* SMS-style admin prompt */
const smsMessage =
`📩 New Order Request

Network: ${network}
Bundle: ${bundle}
Phone: ${phoneNumber}

Enter Admin PIN to approve`;

const pin = prompt(smsMessage);

/* Correct PIN */
if(pin === ADMIN_PIN){

attempts = 0;
localStorage.setItem(
"attempts",
attempts
);

popup.innerHTML = `
<h3>✅ Approved</h3>
<p>Transaction approved successfully.</p>
`;

popup.style.background = "#00c851";
popup.classList.add("show");

setTimeout(()=>{
popup.classList.remove("show");
},3000);

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

popup.innerHTML = `
<h3>🔒 PIN Locked</h3>
<p>3 wrong attempts.<br>
Locked for 10 minutes.</p>
`;

}else{

popup.innerHTML = `
<h3>❌ Wrong PIN</h3>
<p>${MAX_ATTEMPTS - attempts}
attempt(s) left.</p>
`;
}

popup.style.background = "#ff4444";
popup.classList.add("show");

setTimeout(()=>{
popup.classList.remove("show");
popup.style.background = "#00c851";
},3000);
}
});
