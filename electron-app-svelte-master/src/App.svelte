<script>
let exe1Path = '';
let exe2Path = '';

async function chooseExe1() {
	exe1Path = await window.electronAPI.chooseExe();
}
async function chooseExe2() {
	exe2Path = await window.electronAPI.chooseExe();
}

function openExe1() {
	if (exe1Path) window.electronAPI.openExePath(exe1Path);
}
function openExe2() {
	if (exe2Path) window.electronAPI.openExePath(exe2Path);
}
</script>

<main>
	<h2>EXE 1</h2>
	<button on:click={chooseExe1}>Choose EXE 1</button>
	<span>{exe1Path ? exe1Path : 'No file chosen'}</span>
	<button on:click={openExe1} disabled={!exe1Path}>Open EXE 1</button>
	
	<h2>EXE 2</h2>
	<button on:click={chooseExe2}>Choose EXE 2</button>
	<span>{exe2Path ? exe2Path : 'No file chosen'}</span>
	<button on:click={openExe2} disabled={!exe2Path}>Open EXE 2</button>
	
</main>

<style>
main {
	text-align: center;
	padding: 1em;
	max-width: 400px;
	margin: 0 auto;
}

h2 {
	color: #ff3e00;
	text-transform: uppercase;
	font-size: 2em;
	font-weight: 100;
	margin: 1em 0 0.5em 0;
}

button {
	margin: 0.5em;
	padding: 0.5em 1em;
	font-size: 1em;
	cursor: pointer;
}

button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

span {
	display: block;
	margin: 0.5em;
	font-size: 0.9em;
	color: #666;
	word-break: break-all;
}

@media (min-width: 640px) {
	main {
		max-width: none;
	}
}
</style>