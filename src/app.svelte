<script>
  import { slide } from 'svelte/transition';
  import RegularCss from './regular-css.svelte';
  import ThrowClass from './throw-class.svelte';
  let name = 'world';
  let active = false;
</script>

<h1 class:active class="my-4">Hello, {name}</h1>

{#if active}
  <div transition:slide class="my-4">
    Who are going to create 200 class toggles for every tailwind's atomic class?
    <br>
    Do you think it is realistic?
    <br>
    Or you are using Svelte like Twig?
  </div>
{/if}

<button class="btn" on:click={() => active = !active}>
  Fancy button, or is it? Press it?
</button>

<div class="my-4">
  <RegularCss />
</div>

<ThrowClass />

<style lang="tailwind">
  h1 {
    @apply text-blue-500 font-bold w-44 text-4xl;
    transition: all .2s ease;
  }

  h1.active {
    @apply text-blue-800 bg-blue-200 rounded-lg px-4 py-2;
  }

  .btn {
    @apply py-2 px-4 border-blue-500 bg-blue-300
      rounded-lg text-blue-800 text-xl;
  }
</style>
