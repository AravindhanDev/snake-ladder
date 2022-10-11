const body = document.querySelector("body")
const reset = document.getElementById("reset")
const roll = document.getElementById("roll")
const result = document.getElementById("result")
const comments = document.getElementById("comments")
const bestplay = document.getElementById("bestplay")
let currentPosition = getCurrentPosition()
let leastAttempt = getLeastAttempt()
let attemptHistory = getAttemptHistory()
const ladderPoints = [
	{ from: 15, to: 47 },
	{ from: 21, to: 98 },
	{ from: 50, to: 91 },
	{ from: 66, to: 85 }
]
const snakePoints = [
	{ from: 19, to: 6 },
	{ from: 44, to: 35 },
	{ from: 52, to: 12 },
	{ from: 61, to: 20 },
	{ from: 87, to: 34 },
	{ from: 99, to: 84 }
]

document.addEventListener("keydown", (e) => e.key === "r" && handleReset())

window.addEventListener("load", () => {
	setCurrentPosition(currentPosition)
	setLeastAttempt(leastAttempt)
	setAttemptHistory(attemptHistory)
	if (attemptHistory !== 0) {
		bestplay.classList.remove("d-none")
		bestplay.textContent = `Best Play (Least Attempt) - ${attemptHistory}`
	}
	updateElementPos(currentPosition)
	if (currentPosition === 0) {
		roll.disabled = true
	}
})

reset.addEventListener("click", handleReset)

roll.addEventListener("click", handleDiceRoll)

function handleDiceRoll() {
	document.getElementById(currentPosition).scrollIntoView()
	let diceValue = Math.round(Math.random() * 5) + 1
	result.textContent = diceValue
	if (currentPosition + diceValue > 100) return
	leastAttempt++
	setLeastAttempt(leastAttempt)
	removeCurrentPos(currentPosition)
	// updating
	currentPosition = getCurrentPosition() + diceValue
	setCurrentPosition(currentPosition)
	//updating
	updateElementPos(currentPosition)
	if (
		checkIfSnakeExist(currentPosition + 1) !== -1 ||
		checkIfSnakeExist(currentPosition + 2) !== -1
	) {
		playSound("snakenext")
	}
	if (currentPosition > 50) {
		comments.textContent = "You are half way done 😊"
	}
	gameOver()
	let ladderIndex = checkIfLadderExist(currentPosition)
	let snakeIndex = checkIfSnakeExist(currentPosition)
	showLadderImprovement(ladderIndex)
	showSnakeBitten(snakeIndex)
	roll.disabled = true
	roll.textContent = "WAIT"
	setTimeout(() => {
		roll.disabled = false
		roll.textContent = "ROLL"
	}, 1000)
	playSound("move")
	document.getElementById(currentPosition).scrollIntoView()
}

function gameOver() {
	if (currentPosition === 100) {
		setTimeout(() => {
			window.scrollTo(0, 0)
		}, 0)
		if (getAttemptHistory() !== 0) {
			if (leastAttempt < getAttemptHistory()) {
				setAttemptHistory(leastAttempt)
				attemptHistory = getAttemptHistory()
			}
		} else {
			setAttemptHistory(leastAttempt)
			attemptHistory = getAttemptHistory()
		}
		if (attemptHistory !== 0) {
			bestplay.classList.remove("d-none")
			bestplay.textContent = `Best Play (Least Attempt) - ${attemptHistory}`
		}
		playSound("success")
		comments.textContent = "WELL PLAYED 👏"
		comments.style.color = "#fff"
		bestplay.style.color = "#fff"
		body.style.background = "#59CE8F"
		roll.disabled = true
	}
}

function showSnakeBitten(snakeIndex) {
	if (snakeIndex !== -1) {
		body.style.background = "#EB1D36"
		comments.style.color = "#fff"
		comments.textContent = "It's Ok BRUH! COME ON 😞"
		playSound("snake")
		roll.disabled = true
		setTimeout(() => {
			window.scrollTo(0, 0)
		}, 0)
		setTimeout(() => {
			window.scrollTo(0, 0)
			removeCurrentPos(currentPosition)
			currentPosition = snakePoints[snakeIndex].to
			setCurrentPosition(currentPosition)
			updateElementPos(currentPosition)
			roll.disabled = false
		}, 1000)
		setTimeout(() => {
			if (currentPosition > 50) {
				comments.textContent = "You are half way done 😊"
			} else {
				comments.textContent = "Snake & Ladder 🐍"
			}
			body.style.background = "rgba(142, 50, 0, 0.3)"
			comments.style.color = "#8e3200"
			bestplay.style.color = "#8e3200"
			document.getElementById(currentPosition).scrollIntoView()
		}, 2000)
	}
}

function showLadderImprovement(ladderIndex) {
	if (ladderIndex !== -1) {
		playSound("ladder")
		comments.textContent = "DEEZ NUTS GOT'EM 👍"
		roll.disabled = true
		window.scrollTo(0, 0)
		setTimeout(() => {
			removeCurrentPos(currentPosition)
			currentPosition = ladderPoints[ladderIndex].to
			setCurrentPosition(currentPosition)
			updateElementPos(currentPosition)
			roll.disabled = false
		}, 1000)
		setTimeout(() => {
			if (currentPosition > 50) {
				comments.textContent = "You are half way done 😊"
			} else {
				comments.textContent = "Snake & Ladder 🐍"
			}
			document.getElementById(currentPosition).scrollIntoView()
		}, 2000)
	}
}

function playSound(name) {
	let audio = new Audio(`sound/${name}.mp3`)
	audio.play()
	if (name === "snakenext") {
		setTimeout(() => {
			audio.currentTime = 0
			audio.pause()
		}, 3000)
	}
}

function handleReset() {
	reset.textContent = "RESETTING ..."
	window.scrollTo(0, 0)
	setTimeout(() => {
		body.style.background = "rgba(142, 50, 0, 0.3)"
		comments.style.color = "#8e3200"
		bestplay.style.color = "#8e3200"
		comments.textContent = "Snake & Ladder 🐍"
		result.textContent = "?"
		removeCurrentPos(currentPosition)
		setCurrentPosition(1)
		setLeastAttempt(0)
		leastAttempt = getLeastAttempt()
		currentPosition = getCurrentPosition()
		roll.disabled = false
		updateElementPos(currentPosition)
		reset.textContent = "RESET"
	}, 1000)
	setTimeout(() => {
		window.scrollTo(0, document.body.scrollHeight)
	}, 2000)
}

function checkIfSnakeExist(currentPosition) {
	for (let i = 0; i < snakePoints.length; i++) {
		if (snakePoints[i].from === currentPosition) return i
	}
	return -1
}

function checkIfLadderExist(currentPosition) {
	for (let i = 0; i < ladderPoints.length; i++) {
		if (ladderPoints[i].from === currentPosition) return i
	}
	return -1
}

function removeCurrentPos(currentPosition) {
	let currentElement = document.getElementById(currentPosition)
	currentElement.classList.remove("active")
	currentElement.lastElementChild.classList.add("d-none")
}

function updateElementPos(currentPosition) {
	let currentElement = document.getElementById(currentPosition)
	currentElement.classList.add("active")
	currentElement.lastElementChild.classList.remove("d-none")
}

function getCurrentPosition() {
	return parseInt(localStorage.getItem("currentPosition")) || 1
}

function setCurrentPosition(pos) {
	localStorage.setItem("currentPosition", pos)
}

function deleteCurrentPosition(pos) {
	localStorage.removeItem("currentPosition")
}

function setLeastAttempt(attempt) {
	localStorage.setItem("leastAttempt", attempt)
}

function deleteLeastAttempt() {
	localStorage.removeItem("leastAttempt")
}

function getLeastAttempt() {
	return parseInt(localStorage.getItem("leastAttempt")) || 0
}

function setAttemptHistory(attempt) {
	localStorage.setItem("attemptHistory", attempt)
}

function deleteLeastAttempt() {
	localStorage.removeItem("attemptHistory")
}

function getAttemptHistory() {
	return parseInt(localStorage.getItem("attemptHistory")) || 0
}
