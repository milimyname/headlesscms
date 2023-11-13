<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import ThemeSwitch from './theme-switch.svelte';
</script>

<div
	class="flex w-full justify-between border-t border-stone-200 bg-white
	px-4 py-4 sm:bottom-[unset] sm:top-0 sm:border-none sm:bg-transparent"
>
	{#if !$page.url.pathname.includes('post')}
		<form action="?/createDefaultPost" method="POST" use:enhance>
			<button
				class="rounded-md border bg-white px-4 py-2 drop-shadow-sm"
				on:click={() => localStorage.setItem('novel__content', '')}
			>
				+ Post
			</button>
		</form>
	{:else}
		<a href="/" class="rounded-md border px-4 py-2 drop-shadow-sm">Go Back</a>
	{/if}

	<ThemeSwitch />
</div>
