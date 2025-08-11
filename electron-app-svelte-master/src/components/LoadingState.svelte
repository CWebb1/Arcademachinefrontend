<script>
	export let isLoading = false;
	export let hasGames = false;
</script>

{#if isLoading}
	<div class="loading">
		<h2>Loading Games...</h2>
		<div class="loading-spinner">🎮</div>
	</div>
{:else if !hasGames}
	<div class="no-games">
		<h2>No Games Found</h2>
		<p>Place your games in the Desktop/Games folder</p>
		<div class="folder-icon">📁</div>
	</div>
{/if}

<style>
	.loading, .no-games {
		text-align: center;
		padding: 4em 2em;
	}

	.loading h2, .no-games h2 {
		color: #ff6b35;
		font-size: 2.5em;
		margin-bottom: 1em;
	}

	.no-games p {
		font-size: 1.2em;
		color: #ccc;
		margin-bottom: 1em;
	}

	.loading-spinner {
		font-size: 3em;
		animation: spin 2s linear infinite;
	}

	.folder-icon {
		font-size: 4em;
		opacity: 0.5;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
