<script lang="ts">
	import { spring } from 'svelte/motion';

	let heightSpring = spring(50, { stiffness: 0.1, damping: 0.5 });
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

		if ($heightSpring < 90) event.preventDefault();
		else return;

		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		lastY = clientY;
		lastTime = performance.now();
		const moveEvent = event.touches ? 'touchmove' : 'mousemove';
		const endEvent = event.touches ? 'touchend' : 'mouseup';

		window.addEventListener(moveEvent, handleMove);
		window.addEventListener(endEvent, endDrag);

		drawerElement.classList.add('touch-none');
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

		// console.log({ velocity: Math.abs(velocity), snapThreshold, $heightSpring });

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

	$: if ($heightSpring === 0) drawerElement.scrollTop = 0;
</script>

<button class="ready rounded-md bg-slate-300 p-4" on:click={() => ($heightSpring = 50)}>
	Open Drawer
</button>

<div
	bind:this={drawerElement}
	style="height: {$heightSpring}dvh; max-height: 98dvh; "
	use:clickOutside={() => ($heightSpring = 0)}
	on:mousedown={startDrag}
	on:touchstart={startDrag}
	role="button"
	tabindex="0"
	class="fixed bottom-0 flex w-screen select-none items-center justify-center overflow-y-auto rounded-t-[10px] bg-black text-white"
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
	<button
		class="sticky right-4 top-4 h-8 w-8 self-start rounded-full bg-white font-bold text-black"
		on:click={() => ($heightSpring = 0)}
	>
		X
	</button>
</div>
