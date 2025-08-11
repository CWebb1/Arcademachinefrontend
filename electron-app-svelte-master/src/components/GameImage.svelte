<script>
	export let gameData = null;
	export let size = 'large'; // 'large' or 'small'


	function getGameName(gameData) {

		if (!gameData.gameName) return '';

		return gameData.gameName;
	}

	function getGameImage(gameData) {

		if (!gameData.customImage) return '';

		// Only use custom image (PNG, JPG, JPEG)
		return `file://${gameData.customImage}`.replace(/\\/g, '/');

	}

	function handleImageError(event) {
		event.target.style.display = 'none';
	}

	$: containerClass = `game-image-container ${size}`;
	$: imageSrc = getGameImage(gameData);
    $: altText = getGameName(gameData);
</script>

<div class={containerClass}>
	{#if imageSrc}
		<img 
			src={imageSrc}
			alt={altText}
			on:error={handleImageError}
		/>
	{/if}
	<div class="game-placeholder">
		{#if !imageSrc}
            <p>img not found</p>
        {/if}
	</div>
</div>

<style>             
	.game-image-container {
		position: relative;
		margin: 0 auto 1em;
		border-radius: 15px;
		overflow: hidden;
		border: 3px solid #ff6b35;
		transition: all 0.3s ease;
	}

	.game-image-container.large {
		width: 200px;
		height: 200px;
	}

	.game-image-container.small {
		width: 120px;
		height: 120px;
		border-width: 2px;
	}

	.game-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.game-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #2a2a3e, #3a3a5e);
		z-index: -1;
		transition: all 0.3s ease;
	}

	.game-image-container.large .game-placeholder {
		font-size: 4em;
	}

	.game-image-container.small .game-placeholder {
		font-size: 2.5em;
	}
</style>
