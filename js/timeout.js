var timeoutData = {
	value: 0;
}

function startTimeout() {
	timeoutData.value = 0;
}

function runWithTimeout(function, timeout) {
	timeoutData.value += timeout;
	startTimeout(function(), timeoutData.value);
}