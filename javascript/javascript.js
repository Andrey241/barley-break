let off = document.querySelector("[data-offSound]");
let on = document.querySelector("[data-on]");
let empty = {};
let cells = [];
let saveCell = [];
let sound = {
	move: "https://andrey241.github.io/barley-break/audio/move.mp3",
	change: "https://andrey241.github.io/barley-break/audio/change.mp3",
	enabled: true,
};
let incement = 100;

if (localStorage.getItem("save")) {
	document.querySelector("[data-clear]").removeAttribute("disabled");
	document.querySelector("[data-load]").removeAttribute("disabled");
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

	function move(i) {
		const cell = cells[i],
			leftDiff = Math.abs(empty.left - cell.left),
			topDiff = Math.abs(empty.top - cell.top);

		if (leftDiff + topDiff > 1) {
			return;
		}

		cell.element.style.left = `${cellSize * empty.left}px`;
		cell.element.style.top = `${cellSize * empty.top}px`;

		const emptyLeft = empty.left,
			emptyTop = empty.top;

		empty.left = cell.left;
		empty.top = cell.top;
		empty.i = i;

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
			saveCell.push({
				element: cell,
			});

			cell.style.left = `${cellSize * left}px`;
			cell.style.top = `${cellSize * top}px`;

			cell.setAttribute("data-left", (cellSize * left) / 100);
			cell.setAttribute("data-top", (cellSize * top) / 100);

			field.append(cell);

			cell.addEventListener("click", () => {
				move(i);
			});
		}
	} else {
		console.log("else");
		for (let i = 1; i <= 15; i++) {
			const cell = document.createElement("div");
			cells[i].element = cell;
			cell.className = "cell";
			cell.innerHTML = cells[i].value;
			cell.style.left = `${cellSize * cells[i].left}px`;
			cell.style.top = `${cellSize * cells[i].top}px`;
			field.append(cell);
			cell.addEventListener("click", () => {
				move(i);
			});
		}
	}

	addSize();
}
createGame();
//sounds

function moveSound() {
	var audio = new Audio();
	sound.enabled ? (audio.src = sound.move) : null;
	audio.play();
}

function changeSetting() {
	var audio = new Audio();
	sound.enabled ? (audio.src = sound.change) : null;
	audio.play();
}

//buttons

const buttons = document.querySelectorAll("button");
buttons.forEach((item) => {
	item.addEventListener(
		"click",
		(e) => {
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
				case "data-off":
					soundOff();
					break;
				default:
					break;
			}
		},
		{ capture: true }
	);
});

function soundOff() {
	sound.enabled = !sound.enabled;

	document.querySelector("[data-off] p").innerHTML = sound.enabled
		? "sound on"
		: "sound off";

	off.classList.toggle("d-none");
	on.classList.toggle("d-none");
	document.querySelector("[data-off]").classList.toggle("btn-dark");

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}

function save() {
	saveCell.push(empty);
	const cell = document.querySelectorAll(".cell");

	cell.forEach((item, index) => {
		let obj = {
			value: +item.innerHTML,
			i: index + 1,
			left: +item.getAttribute("data-left"),
			top: +item.getAttribute("data-top"),
		};
		saveCell.push(obj);
	});

	localStorage.setItem("save", true);

	let cellsElement = [];
	cellsElement.push(
		cells.map((item) => {
			return {
				element: item.element,
			};
		})
	);
	console.log(cellsElement);
	localStorage.setItem("cellsElement", JSON.stringify(cellsElement));
	localStorage.setItem("cells", JSON.stringify(cells));
	localStorage.setItem("empty", JSON.stringify(empty));
	document.querySelector("[data-clear]").removeAttribute("disabled");
	document.querySelector("[data-load]").removeAttribute("disabled");

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
	// empty = ;

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

	createGame();
	empty = JSON.parse(localStorage.getItem("empty"));
	let cellsElement = JSON.parse(localStorage.getItem("cellsElement"));
	console.log(cellsElement);
}

function clearSave() {
	localStorage.clear();
	document.querySelector("[data-clear]").setAttribute("disabled", "disabled");
	document.querySelector("[data-load]").setAttribute("disabled", "disabled");
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
	let count = 0;
	const interval = setInterval(() => {
		let promise = new Promise((resolve, reject) => {
			resolve(changeSetting());
		});
		promise.then(() => {
			changeSetting();
		});
		cells = [];
		incement += 1;
		clearField();
		createGame(incement);
		count++;
		if (count == 25) {
			clearInterval(interval);
		}
	}, 25);

	document.querySelector("[data-dec]").removeAttribute("disabled");

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}

function dec() {
	let count = 0;
	const interval = setInterval(() => {
		let promise = new Promise((resolve, reject) => {
			resolve(changeSetting());
		});
		promise.then(() => {
			changeSetting();
		});
		cells = [];
		clearField();
		incement -= 1;
		createGame(incement);
		count++;
		if (count == 25) {
			clearInterval(interval);
		}
	}, 25);

	if (incement <= 125) {
		document.querySelector("[data-dec]").toggleAttribute("disabled");
	}

	let promise = new Promise((resolve, reject) => {
		resolve(changeSetting());
	});
	promise.then(() => {
		changeSetting();
	});
}
