<script>
	import { createEventDispatcher } from 'svelte';
	import GameImage from './GameImage.svelte';

	export let gameData = null;
	export let position = 'center'; // 'left', 'center', 'right'
	export let isActive = false;

	const dispatch = createEventDispatcher();

	function getGameName(gameData) {
		if (!gameData) return '';
		return gameData.gameName || '';
	}

	function handleClick() {
		dispatch('click');
	}

	$: cardClass = `game-card ${position} ${isActive ? 'active' : ''}`;
</script>

<div class={cardClass} on:click={handleClick} on:keydown={() => {}} role="button" tabindex="0" aria-label="Game card for {getGameName(gameData)}">
	<div class="card-content">
		<GameImage {gameData} size={position === 'center' ? 'large' : 'small'} />
		<h3 class="game-name">{getGameName(gameData)}</h3>
	</div>
</div>

<style>
	.game-card {
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-style: preserve-3d;
		user-select: none;
	}

	.card-content {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		border: 2px solid #ff6b35;
		padding: 1.5em;
		text-align: center;
		backdrop-filter: blur(10px);
		transition: all 0.4s ease;
	}

	/* Center game (active) */
	.game-card.center {
		transform: scale(1) translateZ(0);
		opacity: 1;
		z-index: 3;
	}

	.game-card.center .card-content {
		box-shadow: 0 0 40px rgba(255, 107, 53, 0.4);
		border-width: 3px;
	}

	/* Side games */
	.game-card.left,
	.game-card.right {
		transform: scale(0.75) translateZ(-50px);
		opacity: 0.6;
		z-index: 1;
	}

	.game-card.left {
		transform: scale(0.75) translateZ(-50px) rotateY(15deg);
	}

	.game-card.right {
		transform: scale(0.75) translateZ(-50px) rotateY(-15deg);
	}

	.game-card.left .card-content,
	.game-card.right .card-content {
		box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
		border-width: 2px;
	}

	/* Hover effects */
	.game-card:hover {
		transform: scale(0.8) translateZ(-30px);
	}

	.game-card.center:hover {
		transform: scale(1.05) translateZ(10px);
	}

	.game-card:hover .card-content {
		box-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
	}

	.game-name {
		color: #fff;
		font-size: 1.2em;
		margin: 0.5em 0 0 0;
		text-transform: uppercase;
		letter-spacing: 1px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		transition: all 0.3s ease;
	}

	.game-card.center .game-name {
		font-size: 1.5em;
		color: #ff6b35;
	}

	.game-card.left .game-name,
	.game-card.right .game-name {
		font-size: 1em;
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		.game-card.left,
		.game-card.right {
			transform: scale(0.6);
			opacity: 0.4;
		}

		.game-card.left {
			transform: scale(0.6) rotateY(10deg);
		}

		.game-card.right {
			transform: scale(0.6) rotateY(-10deg);
		}

		.card-content {
			padding: 1em;
		}

		.game-name {
			font-size: 0.9em;
		}

		.game-card.center .game-name {
			font-size: 1.2em;
		}
	}
</style>
