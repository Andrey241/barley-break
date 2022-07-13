let cells = [];
let incement = 100;
if (localStorage.getItem("save")) {
	document.querySelector("[data-clear]").removeAttribute("disabled");
}
function createGame(cellSize = 100) {
	if (window.screen.availWidth < 433) {
		cellSize = 50;
	} else {
		document.querySelector("[data-inc]").removeAttribute("disabled");
	}
	const field = document.querySelector(".field"),
		cell = document.querySelectorAll(".cell");

	function addSize() {
		field.style.width = `${4 * cellSize}px`;
		field.style.height = `${4 * cellSize}px`;
		const cell = document.querySelectorAll(".cell");
		cell.forEach((item) => {
			item.style.width = `${cellSize}px`;
			item.style.height = `${cellSize}px`;
		});
	}

	empty = {
		value: 0,
		top: 0,
		left: 0,
		i: 0,
	};
	if (cells.length == 0) {
		cells.push(empty);
	}

	console.log(cells);
	function move(i) {
		const cell = cells[i],
			leftDiff = Math.abs(empty.left - cell.left),
			topDiff = Math.abs(empty.top - cell.top);

		if (leftDiff + topDiff > 1) {
			return;
		}

		//const cell = document.createElement("div");
		cell.element.style.left = `${cellSize * empty.left}px`;
		cell.element.style.top = `${cellSize * empty.top}px`;

		const emptyLeft = empty.left,
			emptyTop = empty.top;

		empty.left = cell.left;
		empty.top = cell.top;

		cell.left = emptyLeft;
		cell.top = emptyTop;

		const isFinished = cells.every((cell) => {
			return cell.value === cell.top * 4 + cell.left;
		});
		if (isFinished) {
			alert("win");
		}
		let promise = new Promise((resolve, reject) => {
			resolve(moveSound());
		});

		promise.then(() => {
			moveSound();
		});
	}

	const numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

	if (cells.length == 1) {
		for (let i = 1; i <= 15; i++) {
			const cell = document.createElement("div"),
				value = numbers[i - 1] + 1;

			cell.className = "cell";
			cell.innerHTML = value;

			const left = i % 4,
				top = (i - left) / 4;

			cell.setAttribute("i", i);

			cells.push({
				value,
				left,
				top,
				element: cell,
				i,
			});

			cell.style.left = `${cellSize * left}px`;
			cell.style.top = `${cellSize * top}px`;

			field.append(cell);

			cell.addEventListener("click", () => {
				move(cells[i].i);
			});
		}
	} else {
		for (let i = 1; i <= 15; i++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			cell.innerHTML = cells[i].value;
			cell.style.left = `${cellSize * cells[i].left}px`;
			cell.style.top = `${cellSize * cells[i].top}px`;
			field.append(cell);
		}
	}

	addSize();
}
createGame();
//sounds

function moveSound() {
	var audio = new Audio();
	audio.src = "https://andrey241.github.io/barley-break/audio/move.mp3";
	audio.play();
}

function changeSetting() {
	var audio = new Audio();
	audio.src = "https://andrey241.github.io/barley-break/audio/change.mp3";
	audio.play();
}

//buttons

const buttons = document.querySelectorAll("button");
buttons.forEach((item) => {
	item.addEventListener("click", (e) => {
		console.log(e.target.getAttributeNames()[0]);
		switch (e.target.getAttributeNames()[0]) {
			case "data-save":
				save();
				break;
			case "data-load":
				load();
				break;
			case "data-clear":
				clearSave();
				break;
			case "data-inc":
				inc();
				break;
			case "data-dec":
				dec();
				break;
			case "data-res":
				location.reload();
				break;
			default:
				break;
		}
	});
});

function save() {
	console.log(cells);
	localStorage.setItem("save", true);
	localStorage.setItem("cells", JSON.stringify(cells));
	console.log(localStorage.getItem("cells"));

	document.querySelector("[data-clear]").removeAttribute("disabled");

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});

	promise.then(() => {
		changeSetting();
	});
}

function load() {
	clearField();
	cells = JSON.parse(localStorage.getItem("cells"));
	createGame();
	let i = 1;

	document.querySelectorAll(".cell").forEach((item) => {
		item.setAttribute("i", i);
		i++;
	});

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}

function clearSave() {
	localStorage.clear();
	document.querySelector("[data-clear]").setAttribute("disabled", "disabled");

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}

function clearField() {
	document.querySelectorAll(".cell").forEach((item) => {
		item.remove();
	});
}

function inc() {
	cells = [];
	clearField();
	incement += 50;
	createGame(incement);
	document.querySelector("[data-dec]").toggleAttribute("disabled");

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}

function dec() {
	cells = [];
	clearField();
	incement -= 50;
	createGame(incement);
	if (incement === 100) {
		document.querySelector("[data-dec]").toggleAttribute("disabled");
	}

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}
