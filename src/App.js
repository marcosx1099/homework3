import React, { useState, useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import './App.css';

import Gameboard from './components/Gameboard';
import Keyboard from './components/Keyboard';

import textfile from "./sgb-words.txt";

const keys = [
	'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
	'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
	'z', 'x', 'c', 'v', 'b', 'n', 'm',
]

function App() {
	const WORD_COUNT = 6;
	const WORD_LENGTH = 5;
	const [board, setBoard] = useState([]);
	const [r, setR] = useState(0);
	const [c, setC] = useState(0);
	const [shakeRow, setShakeRow] = useState(-1);
	const word = useRef("");
	const word_list = useRef([]);
	const [message, setMessage] = useState("");
	const game_over = useRef(false);


	useEffect(() => {
		loadWords();
		initBoard();


	}, []);


	const loadWords = () => {
		fetch(textfile)
			.then((response) => response.text())
			.then((textContent) => {
				// select random word
				word_list.current = textContent.split('\n').map(row => row.toUpperCase());
				word.current = word_list.current[Math.floor(Math.random() * word_list.current.length)];
				console.log("word", word.current);
			});
	}

	const initBoard = () => {
		let b = [];
		for (var i = 0; i < WORD_COUNT; i++) {
			let row = [];
			for (var j = 0; j < WORD_LENGTH; j++) {
				row.push({ key: i * WORD_COUNT + j, ch: '', state: 'empty', flip: 'front' });
			}
			b.push(row);
		}

		setBoard(b);
	}

	const onKeyPressed = (k) => {
		if (!keys.includes(k)) {
			if (k == 'backspace') {
				onKeyBack();
			}
			if (k == 'enter') {
				onKeyEnter();
			}
			return;
		}
		if (game_over.current) {
			showMessage("Game Over");
			return;
		};

		if (c >= WORD_LENGTH)
			return;

		let b = [...board];
		b[r][c].ch = k;
		b[r][c].state = 'selected';

		setC(c + 1);
		setBoard(b);
	}

	const onKeyBack = () => {
		let b = [...board];
		if (c > 0) {
			b[r][c - 1].ch = '';
			b[r][c - 1].state = 'empty';

			setC(c - 1);

			setBoard(b);
		}
	}

	const onShakeRow = (row) => {
		setShakeRow(row);
		setTimeout(function () {
			setShakeRow(-1);
		}, 820);
	}

	const onKeyEnter = () => {
		// check correct
		let b = [...board];

		if (c < b[r].length) {
			// show message "no enough"
			showMessage("No Enough Letters");
			onShakeRow(r);
			return;
		}

		let w = "";

		for (var j = 0; j < b[r].length; j++) {
			const ch = b[r][j].ch.toUpperCase();
			w += ch;
		}

		if (!word_list.current.includes(w)) {
			showMessage("Not in word list")
			onShakeRow(r);
			return;
		}

		for (var j = 0; j < b[r].length; j++) {
			const ch = b[r][j].ch.toUpperCase();
			if (ch == word.current[j]) // correct spot
				b[r][j].state = 'correct';
			else if (word.current.includes(ch))
				b[r][j].state = 'present';
			else
				b[r][j].state = 'absent';
		}

		// make animation
		var rr = r;
		var jj = 0;

		function makeAnimate() {
			let b = [...board];
			b[rr][jj].flip = 'back';
			setBoard(b);
			jj++;

			if (jj >= b[rr].length)
				clearInterval(animation);
		}

		setTimeout(makeAnimate, 100);
		var animation = setInterval(makeAnimate, 300);

		// update row/column
		setC(0);
		if (r < b.length) {
			setR(r + 1);
		}
		setBoard(b);

		if (w == word.current) // Game Win
		{
			// Game is win
			showMessage("You win");
			game_over.current = true;
			return;
		}

		if (r == b.length - 1) {
			showMessage("You loose");
			game_over.current = true;
		}
	}

	const showMessage = (msg) => {
		setMessage(msg);
		setTimeout(function () {
			setMessage('');
		}, 2000);
	}

	return (
		<KeyboardEventHandler
			handleKeys={['all']}
			onKeyEvent={(key, e) => onKeyPressed(key)} className="App">
			<div className={message == '' ? '' : "show"} id="toast-container">{message}</div>
			<header>
				<div className="title">Wordle</div>
			</header>
			<KeyboardEventHandler
				handleKeys={['all']}
				onKeyEvent={(key, e) => onKeyPressed(key)} />
			<Gameboard board={board} shakeRow={shakeRow} />
			<Keyboard onKeyPressed={onKeyPressed} r={r} game={board} />

		</KeyboardEventHandler>
	);
}

export default App;
