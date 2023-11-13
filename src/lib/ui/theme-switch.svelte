<script lang="ts">
	import { browser } from '$app/environment';
	import { createLocalStorageStore } from '$lib/stores/localStorage.js';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { Check, Monitor, Moon, Sun } from 'lucide-svelte';

	const theme = createLocalStorageStore('theme', 'system');

	const {
		elements: { trigger, menu },
		builders: { createMenuRadioGroup }
	} = createDropdownMenu({
		preventScroll: false
	});

	const {
		elements: { radioGroup, radioItem }
	} = createMenuRadioGroup({
		value: theme,
		onValueChange({ next }) {
			const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

			if (next === 'dark') {
				document.documentElement.classList.add('dark-theme');
				document.documentElement.style.colorScheme = 'dark';
			} else if (next === 'light') {
				document.documentElement.classList.remove('dark-theme');
				document.documentElement.style.colorScheme = 'light';
			} else if (darkThemeMq.matches) {
				document.documentElement.classList.add('dark-theme');
				document.documentElement.style.colorScheme = 'dark';
			}

			return next;
		}
	});
</script>

{#if browser}
	<button
		type="button"
		class="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100"
		use:melt={$trigger}
		aria-label="Update dimensions"
	>
		{#if $theme === 'system'}
			<Monitor class="square-5" />
		{:else if $theme === 'dark'}
			<Moon class="square-5" />
		{:else if $theme === 'light'}
			<Sun class="square-5" />
		{/if}
		<span class="sr-only">Open Dropdown menu</span>
	</button>
{/if}

<div
	class="z-[999999] min-w-[200px] rounded-md border border-stone-200 bg-white p-2"
	use:melt={$menu}
>
	<div class="w-full" use:melt={$radioGroup}>
		<button
			class="flex w-full items-center gap-2 rounded-[5px] p-2 data-[highlighted]:bg-stone-100"
			use:melt={$radioItem({ value: 'system' })}
		>
			<Monitor class="square-4" />
			System
			{#if $theme === 'system'}
				<Check class="square-4 ml-auto" />
			{/if}
		</button>
		<button
			class="flex w-full items-center gap-2 rounded-[5px] p-2 data-[highlighted]:bg-stone-100"
			use:melt={$radioItem({ value: 'dark' })}
		>
			<Moon class="square-4" />
			Dark
			{#if $theme === 'dark'}
				<Check class="square-4 ml-auto" />
			{/if}
		</button>
		<button
			class="flex w-full items-center gap-2 rounded-[5px] p-2 data-[highlighted]:bg-stone-100"
			use:melt={$radioItem({ value: 'light' })}
		>
			<Sun class="square-4" />
			Light
			{#if $theme === 'light'}
				<Check class="square-4 ml-auto" />
			{/if}
		</button>
	</div>
</div>
