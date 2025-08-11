<script>
	export let title = "ARCADE MACHINE";
</script>

<div class="arcade-header">
	<h1>{title}</h1>
</div>

<style>
	.arcade-header {
		text-align: center;
		margin-bottom: 2em;
	}

	.arcade-header h1 {
		font-size: 3em;
		color: #ff6b35;
		text-shadow: 0 0 20px #ff6b35, 0 0 40px #ff6b35;
		animation: glow 2s ease-in-out infinite alternate;
		margin: 0;
		letter-spacing: 4px;
	}

	@keyframes glow {
		from { text-shadow: 0 0 20px #ff6b35, 0 0 40px #ff6b35; }
		to { text-shadow: 0 0 30px #ff6b35, 0 0 60px #ff6b35, 0 0 80px #ff6b35; }
	}

	@media (max-width: 768px) {
		.arcade-header h1 {
			font-size: 2em;
		}
	}
</style>
