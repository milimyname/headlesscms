<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { Editor } from '$lib/index.js';
	import { pocketbase } from '$lib/pocketbase';
	import { postIdStore } from '$lib/stores/custom';
	import { createLocalStorageStore } from '$lib/stores/localStorage.js';
	createLocalStorageStore;

	export let data;

	let saveStatus = 'Saved';

	$: $postIdStore = data.post.id;
</script>

<main class="flex justify-center sm:px-4 sm:pt-[15vh]">
	<Editor
		onUpdate={(e) => {
			saveStatus = 'Unsaved';
		}}
		onDebouncedUpdate={async (e) => {
			saveStatus = 'Saving...';

			await pocketbase.collection('posts').update($postIdStore, {
				content: e?.getJSON(),
				html: e?.getHTML()
			});

			saveStatus = 'Saved';
		}}
	>
		<div
			class="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400"
		>
			{saveStatus}
		</div>
	</Editor>
</main>
