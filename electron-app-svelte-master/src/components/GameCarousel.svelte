<script>
	import { createEventDispatcher } from 'svelte';
	import GameCard from './GameCard.svelte';
	import NavigationButton from './NavigationButton.svelte';

	export let games = [];
	export let currentGameIndex = 0;

	const dispatch = createEventDispatcher();

	function nextGame() {
		if (games.length > 0) {
			const newIndex = (currentGameIndex + 1) % games.length;
			dispatch('gameChanged', newIndex);
		}
	}

	function prevGame() {
		if (games.length > 0) {
			const newIndex = currentGameIndex === 0 ? games.length - 1 : currentGameIndex - 1;
			dispatch('gameChanged', newIndex);
		}
	}

	function launchGame() {
		dispatch('launchGame', games[currentGameIndex]);
	}

	// Get the games to display (previous, current, next)
	$: displayGames = getDisplayGames(games, currentGameIndex);

	function getDisplayGames(gamesList, index) {
		if (gamesList.length === 0) return [];

		const prevIndex = index === 0 ? gamesList.length - 1 : index - 1;
		const nextIndex = (index + 1) % gamesList.length;

		return [
			{ game: gamesList[prevIndex], position: 'left', index: prevIndex, id: `${prevIndex}-left` },
			{ game: gamesList[index], position: 'center', index, id: `${index}-center` },
			{ game: gamesList[nextIndex], position: 'right', index: nextIndex, id: `${nextIndex}-right` }
		];
	}

	function handleCardClick(gameIndex) {
		if (gameIndex === currentGameIndex) {
			// Launch if clicking current game
			launchGame();
		} else {
			// Navigate to clicked game
			dispatch('gameChanged', gameIndex);
		}
	}
</script>

<div class="carousel-container">

	<NavigationButton 
		direction="prev" 
		disabled={games.length <= 1}
		on:click={prevGame}
	/>
	
	<div class="games-display">
	   {#each displayGames as { game, position, index, id } (id)}
			<GameCard 
				gameData={game}
				{position}
				isActive={position === 'center'}
				on:click={() => handleCardClick(index)}
			/>
		{/each}
	</div>
	
	<NavigationButton 
		direction="next" 
		disabled={games.length <= 1}
		on:click={nextGame}
	/>
</div>

<!-- TODO: should this be its own component?  -->
<div class="game-info">
	<div class="game-counter">
		{currentGameIndex + 1} / {games.length}
	</div>
	<button class="launch-button" on:click={launchGame}>
		LAUNCH GAME
	</button>
<div class="instructions">
	<p>← → Navigate | Enter/Space Launch</p>
</div>

</div>

<style>
    	.instructions {
		text-align: center;
		margin-top: 2em;
		color: #ccc;
		font-size: 1.1em;
	}
	.carousel-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2em;
		margin: 2em 0;
	}

	.games-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;
		min-height: 300px;
		perspective: 1000px;
	}

	.game-info {
		text-align: center;
		margin-top: 2em;
	}

	.game-counter {
		color: #ff6b35;
		font-size: 1.2em;
		font-weight: bold;
		margin-bottom: 1em;
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
		.carousel-container {
			flex-direction: column;
			gap: 1em;
		}
		
		.games-display {
			gap: 0.5em;
		}
	}
</style>
