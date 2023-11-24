<script lang="ts">
	import Nav from '$lib/ui/nav.svelte';
	import { postContentStore } from '$lib/stores/custom';
	import { goto } from '$app/navigation';
	import { spring } from 'svelte/motion';

	export let data;

	let heightSpring = spring(50, { stiffness: 0.1, damping: 0.5 });
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let drawerElement: HTMLDivElement;
	let isAsideOpen = false;

	function startDrag(event) {
		// Check if the event target is an input or other interactive element
		if (
			event.target.tagName === 'INPUT' ||
			event.target.tagName === 'TEXTAREA' ||
			event.target.isContentEditable
		)
			return;

		// if ($heightSpring < 90) event.preventDefault();
		// else return;

		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		lastY = clientY;
		lastTime = performance.now();
		const moveEvent = event.touches ? 'touchmove' : 'mousemove';
		const endEvent = event.touches ? 'touchend' : 'mouseup';

		window.addEventListener(moveEvent, handleMove);
		window.addEventListener(endEvent, endDrag);

		drawerElement?.classList.add('touch-none');
	}

	function handleMove(event) {
		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		const now = performance.now();
		const deltaY = clientY - lastY;
		const deltaTime = now - lastTime;

		velocity = deltaY / deltaTime;

		lastY = clientY;
		lastTime = now;

		const dragRatio = ((deltaY * 5) / window.innerHeight) * 100;
		$heightSpring = Math.max(0, Math.min(98, $heightSpring - dragRatio));
	}

	function endDrag() {
		['mousemove', 'mouseup', 'touchmove', 'touchend'].forEach((event) => {
			window.removeEventListener(event, handleMove);
			window.removeEventListener(event, endDrag);
		});

		// Determine snap based on velocity
		const snapThreshold = 1.5;

		if (Math.abs(velocity) > snapThreshold) $heightSpring = velocity > 0 ? 0 : 100;
		else {
			if ($heightSpring >= 75) $heightSpring = 95;
			else if ($heightSpring < 75 && $heightSpring > 25) $heightSpring = 50;
			else $heightSpring = 0;
		}

		drawerElement?.classList.remove('touch-none');
	}

	// The clickOutside action
	function clickOutside(node: Node, callback: () => void) {
		const handleClick = (event) => {
			// Check if the clicked element or any of its parents have the class 'ready'
			if (event.target.closest('.ready')) return;

			// Check if the click was outside the node
			if (!node.contains(event.target)) callback();
		};

		// Add event listener to the document
		document.addEventListener('click', handleClick);

		return {
			destroy() {
				document.removeEventListener('click', handleClick);
			}
		};
	}

	$: if ($heightSpring === 0 && drawerElement) {
		drawerElement.scrollTop = 0;
		isAsideOpen = false;
	}
</script>

<div class="flex h-auto w-full">
	{#if isAsideOpen}
		<div
			bind:this={drawerElement}
			style="height: {$heightSpring}dvh; max-height: 98dvh; "
			use:clickOutside={() => ($heightSpring = 0)}
			on:mousedown={startDrag}
			on:touchstart={startDrag}
			role="button"
			tabindex="0"
			class="fixed bottom-0 z-[2000] flex w-full select-none items-center justify-center overflow-y-auto rounded-t-[10px] bg-slate-200"
		>
			<div class=" h-full p-5">
				<button class="sticky left-1/2 top-5 z-50 w-full">
					<div class="mx-auto h-2 w-[10vw] rounded-full bg-black" />
				</button>

				<ul class="sticky top-10 flex w-full flex-col gap-2 px-5 py-20">
					{#each data.posts as post, i}
						<li>
							<button
								on:click={() => {
									$heightSpring = 0;

									$postContentStore = post.content;
									goto(`/post/${post.id}`);
								}}
							>
								{i + 1}. {post.title}
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<button
				class="fixed bottom-4 right-4 z-10 h-8 w-8 self-start rounded-full bg-white font-bold text-black"
				on:click={() => {
					$heightSpring = 0;
					setTimeout(() => {
						isAsideOpen = false;
					}, 300);
				}}
			>
				X
			</button>
		</div>
	{/if}

	{#if !isAsideOpen}
		<button
			on:mousedown={startDrag}
			on:touchstart={startDrag}
			class="ready fixed bottom-2 left-1/2 z-50 -translate-x-1/2"
			on:click={() => {
				$heightSpring = 75;
				isAsideOpen = true;
			}}
		>
			<div class="mx-auto h-2 w-[10vw] rounded-full bg-black" />
		</button>
	{/if}

	<div class=" w-full flex-1 px-10">
		<Nav />
		<slot />
	</div>
</div>
