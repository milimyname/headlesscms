<script lang="ts">
	import { spring } from 'svelte/motion';

	let height = spring(50, { stiffness: 0.1, damping: 0.5 });
	let startPos = 0;
	let fullHeight = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let drawerElement: HTMLDivElement;

	function startDrag(event) {
		// Check if the event target is an input or other interactive element
		if (
			event.target.tagName === 'INPUT' ||
			event.target.tagName === 'TEXTAREA' ||
			event.target.isContentEditable
		)
			return;

		event.preventDefault(); // Now we prevent default only for non-interactive elements

		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		startPos = clientY;
		lastY = clientY;
		lastTime = performance.now();
		fullHeight = $height;

		const moveEvent = event.touches ? 'touchmove' : 'mousemove';
		const endEvent = event.touches ? 'touchend' : 'mouseup';

		window.addEventListener(moveEvent, handleMove);
		window.addEventListener(endEvent, endDrag);

		drawerElement.classList.add('touch-none');
	}

	function handleMove(event) {
		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		const now = performance.now();
		const dy = clientY - startPos;
		const deltaY = clientY - lastY;
		const deltaTime = now - lastTime;

		velocity = deltaY / deltaTime;

		lastY = clientY;
		lastTime = now;

		// log velocity to 2 decimal places
		// console.log('Velocity: ' + Math.round(velocity * 100) / 100);

		const dragRatio = (dy / window.innerHeight) * 100;
		$height = Math.max(0, Math.min(100, fullHeight - dragRatio));
	}

	function endDrag() {
		['mousemove', 'mouseup', 'touchmove', 'touchend'].forEach((event) => {
			window.removeEventListener(event, handleMove);
			window.removeEventListener(event, endDrag);
		});

		// Determine snap based on velocity
		const snapThreshold = 1.5;

		if (Math.abs(velocity) > snapThreshold) fullHeight = velocity > 0 ? 0 : 100;
		else {
			// Existing snap logic
			if ($height >= 75) fullHeight = 95;
			else if ($height < 75 && $height > 25) fullHeight = 50;
			else fullHeight = 0;
		}

		console.log({ velocity: Math.abs(velocity), snapThreshold, height: $height, fullHeight });

		$height = fullHeight;

		drawerElement.classList.remove('touch-none');
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

	$: if ($height === 0) drawerElement.scrollTop = 0;
</script>

<button class="ready" on:click={() => ($height = 50)}> Open Drawer </button>

<div
	bind:this={drawerElement}
	style="height: {$height}vh; max-height: 98dvh; "
	use:clickOutside={() => ($height = 0)}
	on:mousedown={startDrag}
	on:touchstart={startDrag}
	role="button"
	tabindex="0"
	class="fixed bottom-0 flex w-screen select-none items-center justify-center overflow-y-auto
    rounded-t-[10px] bg-black text-white"
>
	<div class="mx-auto h-full max-w-md p-5">
		<h2 class="mb-4 font-medium">Drawer for Svelte.</h2>
		{#each Array(10) as a}
			<p class="mb-2 text-gray-600">
				This component can be used as a Dialog replacement on mobile and tablet devices.
			</p>
			<p class="mb-2 text-gray-600">
				It comes unstyled, has gesture-driven animations, and is made by <a
					href="https://emilkowal.ski/"
					class="underline"
					target="_blank">Emil Kowalski</a
				>.
			</p>
			<p class="mb-8 text-gray-600">
				It uses <a
					href="https://www.radix-ui.com/docs/primitives/components/dialog"
					class="underline"
					target="_blank">Radix's Dialog primitive</a
				>
				under the hood and is inspired by
				<a
					href="https://twitter.com/devongovett/status/1674470185783402496"
					class="underline"
					target="_blank">this tweet.</a
				>
			</p>
			<h2 class="mb-4 font-medium">Drawer for Svelte.</h2>
			<p class="mb-2 text-gray-600">
				This component can be used as a Dialog replacement on mobile and tablet devices.
			</p>
		{/each}
	</div>
</div>
