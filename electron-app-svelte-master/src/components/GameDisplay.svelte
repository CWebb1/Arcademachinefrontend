<script>
	import { createEventDispatcher } from 'svelte';
	import GameImage from './GameImage.svelte';

	export let game = '';


	const dispatch = createEventDispatcher();

	function getGameName(path) {
		if (!path) return '';
		const fileName = path.split(/[/\\]/).pop();
		return fileName.replace(/\.exe$/i, '');
	}

	function handleLaunch() {
		dispatch('launch', game);
	}
</script>

<div class="game-display">
	<GameImage gamePath={game} />
	
	<h2 class="game-title">{getGameName(game)}</h2>
	
</div>

<style>
	.game-display {
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
		padding: 2em;
		border-radius: 20px;
		border: 2px solid #ff6b35;
		box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
		min-width: 400px;
		backdrop-filter: blur(10px);
	}

	.game-title {
		color: #fff;
		font-size: 2em;
		margin: 0.5em 0;
		text-transform: uppercase;
		letter-spacing: 2px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.game-counter {
		color: #ff6b35;
		font-size: 1.2em;
		font-weight: bold;
		margin: 1em 0;
	}

	.launch-button {
		background: linear-gradient(145deg, #00ff88, #00cc6a);
		border: none;
		color: #000;
		font-size: 1.5em;
		font-weight: bold;
		padding: 1em 3em;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 8px 16px rgba(0, 255, 136, 0.3);
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.launch-button:hover {
		transform: scale(1.05);
		box-shadow: 0 12px 24px rgba(0, 255, 136, 0.5);
	}

	@media (max-width: 768px) {
		.game-display {
			min-width: 300px;
		}
	}
</style>
