<script lang="ts">
	import Github from './github.svelte';
	import ThemeSwitch from './theme-switch.svelte';
</script>

<div
	class="fixed bottom-0 z-[9999] flex w-full justify-between border-t border-stone-200 bg-white
	px-4 py-4 sm:bottom-[unset] sm:top-0 sm:border-none sm:bg-transparent"
>
	<a
		href="https://github.com/tglide/novel-svelte"
		target="_blank"
		class="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100"
	>
		<Github />
	</a>
	<ThemeSwitch />
</div>
