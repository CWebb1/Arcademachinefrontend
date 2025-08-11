<script>
	import { onMount, onDestroy } from 'svelte';
	import ArcadeHeader from './components/ArcadeHeader.svelte';
	import GameCarousel from './components/GameCarousel.svelte';
	import LoadingState from './components/LoadingState.svelte';

	let games = [];
	let currentGameIndex = 0;
	let isLoading = true;

	onMount(async () => {
		await loadGames();
		setupGamesWatcher();
	});

	onDestroy(() => {
		// Clean up the listener when component is destroyed
		if (window.electronAPI?.removeGamesUpdatedListener) {
			window.electronAPI.removeGamesUpdatedListener();
		}
	});

	async function loadGames() {
		try {
			games = await window.electronAPI.getGamesFromFolder();
			isLoading = false;
		} catch (error) {
			console.error('Failed to load games:', error);
			isLoading = false;
		}
	}

	function setupGamesWatcher() {
		// Listen for games folder changes
		window.electronAPI.onGamesUpdated((event, updatedGames) => {
			console.log('Games updated:', updatedGames);
			const previousGameCount = games.length;
			games = updatedGames;
			
			// Adjust current index if games were removed
			if (currentGameIndex >= games.length && games.length > 0) {
				currentGameIndex = games.length - 1;
			} else if (games.length === 0) {
				currentGameIndex = 0;
			}
			
			// Show notification if games were added/removed
			if (previousGameCount !== games.length) {
				const action = games.length > previousGameCount ? 'added' : 'removed';
				console.log(`Game ${action}! Total games: ${games.length}`);
			}
		});
	}

	function handleGameChanged(event) {
		currentGameIndex = event.detail;
	}

	function handleLaunchGame(event) {
		const gameData = event.detail;
		if (gameData && gameData.exePath) {
			window.electronAPI.openExePath(gameData.exePath);
		}
	}

	// Handle keyboard controls
	function handleKeydown(event) {
		if (games.length === 0) return;
		
		switch(event.key) {
			case 'ArrowLeft':
				currentGameIndex = currentGameIndex === 0 ? games.length - 1 : currentGameIndex - 1;
				break;
			case 'ArrowRight':
				currentGameIndex = (currentGameIndex + 1) % games.length;
				break;
			case 'Enter':
			case ' ':
				if (games[currentGameIndex]) {
					window.electronAPI.openExePath(games[currentGameIndex].exePath);
				}
				break;
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="app-container" on:keydown={handleKeydown} tabindex="0" role="application" aria-label="Arcade Game Launcher">
	<main>

		<LoadingState {isLoading} hasGames={games.length > 0} />
		
		{#if !isLoading && games.length > 0}
			<ArcadeHeader />
			
			<GameCarousel 
				{games} 
				{currentGameIndex}
				on:gameChanged={handleGameChanged}
				on:launchGame={handleLaunchGame}
			/>
		{/if}
	</main>
</div>

<style>
	.app-container {
		background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
		color: #fff;
		min-height: 100vh;
		padding: 2em;
		font-family: 'Courier New', monospace;
		outline: none;
		overflow: hidden;
	}

	main {
		width: 100%;
		height: 100%;
	}
</style>