const URL = "http://localhost:4000";
const socket = io.connect(URL);

const elemButton = document.getElementById("buttonSend");
const elemInput = document.getElementById("sendInput");
elemInput.addEventListener("keydown", sendDataByInput);

function sendDataByInput(e) {
	let inputValue = e.target.value
	if (e.keyCode == 13 && inputValue.trim().length > 0) {
		console.log(inputValue, 'button')
		sendText(inputValue)
		e.target.value = ''
	} else if (e.keyCode == 13) {
		console.error('enter text')
	}
}

function sendData() {
	let inputValue = elemInput.value
	if (inputValue.trim().length > 0) {
		console.log(inputValue, 'input')
		sendText(inputValue)
		elemInput.value = ''
	} else {
		console.error('enter text')
	}
}

function sendText(value) {
	socket.emit('data', value)
}


socket.on("connect_error", (err) => {
	console.log(`connect_error due to ${err.message}`);
});