<script>
  import { onMount } from 'svelte';
  import GameCard from './GameCard.svelte';
  import NavigationButton from './NavigationButton.svelte';
  import CarouselControls from './CarouselControls.svelte';
  
  export let games = [];
  
  let activeIndex = 0;
  
  // Handle keyboard navigation
  onMount(() => {
    const handleKeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Enter') {
        launchGame();
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
  
  function goToNext() {
    if (games.length === 0) return;
    activeIndex = (activeIndex + 1) % games.length;
  }
  
  function goToPrev() {
    if (games.length === 0) return;
    activeIndex = (activeIndex - 1 + games.length) % games.length;
  }

  function launchGame() {
    if (games[activeIndex]) {
      window.electronAPI.openExePath(games[activeIndex].path);
    }
  }
</script>

<div class="carousel">
  <NavigationButton direction="prev" onClick={goToPrev} />
  
  <div class="games-container">
    {#each games as game, index}
      <GameCard
        {game}
        {index}
        isActive={index === activeIndex}
        on:click={() => activeIndex = index}
      />
    {/each}
  </div>
  
  <NavigationButton direction="next" onClick={goToNext} />
</div>

<CarouselControls 
  {activeIndex} 
  totalGames={games.length} 
  onLaunch={launchGame} 
/>

<style>
  .carousel {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 2em 0;
  }

  .games-container {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 20px;
    flex: 1;
    justify-content: center;
  }
</style>
