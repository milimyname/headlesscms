<script>
	import Nav from '$lib/ui/nav.svelte';
	import { ChevronRight, Minus } from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { postContentStore, postIdStore, twenedTransformXStore } from '$lib/stores/custom';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let twenedTransformX = tweened(0, {
		duration: 500,
		easing: cubicInOut
	});
	let isAsideOpen = false;

	$: if (isAsideOpen) $twenedTransformX = 0;
	else $twenedTransformX = 15;

	$: $twenedTransformXStore = $twenedTransformX;

	export let data;
</script>

<div class="flex h-auto">
	{#if isAsideOpen}
		<div class=" {!$page.url.pathname.includes('post') && 'h-screen'}">
			<aside
				style={`transform: translateX(-${$twenedTransformX}rem); width: ${
					$twenedTransformX > 10 ? '0' : '15rem'
				}rem`}
				class=" h-full rounded-e-2xl bg-slate-200 px-5 py-20"
			>
				<ul class="sticky top-10 flex flex-col gap-2">
					{#each data.posts as post, i}
						<li>
							<button
								on:click={() => {
									$postContentStore = post.content;
									goto(`/post/${post.id}`);
								}}
							>
								{i + 1}. {post.title}
							</button>
						</li>
					{/each}
				</ul>
			</aside>
		</div>
	{/if}

	{#if !isAsideOpen}
		<button
			style={`transform: translateX(${-$twenedTransformX + 15}rem)`}
			class="fixed left-2 top-1/2 z-50"
			on:click={() => (isAsideOpen = true)}
		>
			<ChevronRight class="text-gray-500 transition-colors hover:text-black" />
		</button>
	{:else}
		<button
			style={`transform: translateX(${-$twenedTransformX + 15}rem)`}
			class="fixed left-2 top-1/2 z-50"
			on:click={() => (isAsideOpen = false)}
		>
			<Minus
				class="translate-x-[0rem] rotate-90 text-gray-500 transition-colors hover:text-black"
			/>
		</button>
	{/if}

	<div class=" w-full flex-1 px-10">
		<Nav />
		<slot />
	</div>
</div>
