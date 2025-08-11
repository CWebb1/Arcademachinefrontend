<script>
	import { createEventDispatcher } from 'svelte';

	export let direction = 'next'; // 'next' or 'prev'
	export let disabled = false;

	const dispatch = createEventDispatcher();

	function handleClick() {
		if (!disabled) {
			dispatch('click');
		}
	}

	$: icon = direction === 'next' ? '▶' : '◀';
</script>

<button 
	class="nav-button {direction}" 
	{disabled}
	on:click={handleClick}
>
	{icon}
</button>

<style>
	.nav-button {
		background: linear-gradient(145deg, #ff6b35, #f7931e);
		border: none;
		color: #fff;
		font-size: 3em;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 8px 16px rgba(255, 107, 53, 0.3);
	}

	.nav-button:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow: 0 12px 24px rgba(255, 107, 53, 0.5);
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		transform: none;
	}

	@media (max-width: 768px) {
		.nav-button {
			width: 60px;
			height: 60px;
			font-size: 2em;
		}
	}
</style>
