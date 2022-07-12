const field = document.querySelector(".field"),
	cellSize = 100,
	cells = [];
empty = {
	value: 0,
	top: 0,
	left: 0,
};
cells.push(empty);

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

	moveSound();
}

const numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

for (let i = 1; i <= 15; i++) {
	const cell = document.createElement("div"),
		value = numbers[i - 1] + 1;
	cell.className = "cell";
	cell.innerHTML = value;

	const left = i % 4,
		top = (i - left) / 4;

	cells.push({
		value,
		left,
		top,
		element: cell,
	});

	cell.style.left = `${cellSize * left}px`;
	cell.style.top = `${cellSize * top}px`;

	field.append(cell);

	cell.addEventListener("click", () => {
		move(i);
	});
}

function moveSound() {
	var audio = new Audio();
	audio.preload = "auto";
	audio.src = "../audio/move.mp3";
	audio.play();
}
