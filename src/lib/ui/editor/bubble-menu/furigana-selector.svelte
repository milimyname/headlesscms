<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { Check } from 'lucide-svelte';

	export let editor: Editor;
	export let isOpen: boolean;
</script>

<div class="relative">
	<button
		type="button"
		class="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
		on:click={() => {
			isOpen = !isOpen;
		}}
	>
		<p class="text-base">ふ</p>
		<p class="underline decoration-stone-400 underline-offset-4">Furigana</p>
	</button>
	{#if isOpen}
		<form
			on:submit={(e) => {
				e.preventDefault();
				const input = e.target[0].value;
				if (input && editor.state.selection && !editor.state.selection.empty) {
					const { from, to } = editor.state.selection;
					const selectedText = editor.state.doc.textBetween(from, to);

					// Create attributes for the Furigana node
					const furiganaAttrs = {
						baseText: selectedText,
						furiganaText: input
					};

					// Insert the Furigana node
					editor.chain().focus().deleteRange({ from, to }).insertFurigana(furiganaAttrs).run();
				}
				isOpen = false;
			}}
			class="animate-in fade-in slide-in-from-top-1 fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl"
		>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				autofocus
				type="text"
				placeholder="Enter Furigana"
				class="flex-1 bg-white p-1 text-sm outline-none"
			/>
			<button
				class="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
			>
				<Check class="h-4 w-4" />
			</button>
		</form>
	{/if}
</div>
