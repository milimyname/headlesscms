<script lang="ts">
	import { browser } from '$app/environment';
	import { superForm } from 'sveltekit-superforms/client';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data;
	let disabledPasswordConstraint = false;

	// Client API:
	const { form, errors, constraints, enhance } = superForm(data.form);

	function gotoAuthProvider() {
		if (browser) {
			document.cookie = `state=${data.authProviderState}`;
			document.cookie = `codeVerifier=${data.codeVerifier}`;
		}

		window.location.href = data.authProviderRedirect || '';
	}
</script>

<form
	use:enhance
	method="POST"
	action="?/login"
	class="flex h-full w-full flex-col gap-24 p-10 md:gap-0"
>
	<div class="tex flex items-center justify-between">
		<a href="/signup">Sign up</a>
		<a href="/" class="self-end">
			<img
				src="/taijobi.png"
				class="h-10 w-10 rounded-full shadow-logo sm:h-12 sm:w-12"
				alt="Logo"
			/>
		</a>
	</div>
	<div class="flex flex-col items-center justify-center gap-5 md:flex-1">
		<div class="text-center">
			<h1 class="text-3xl font-medium">Log in to ur account</h1>
			<p>Oppss... it’s been a while. U need to log in</p>
		</div>
		<fieldset class="flex w-full flex-col md:w-2/3">
			<label for="name" class="hidden">Email or username</label>
			<input
				type="text"
				name="email"
				placeholder="Email or username"
				class="
                    block
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}<span
					transition:slide={{ delay: 0, duration: 300, easing: quintOut, axis: 'y' }}
					class="mt-1 select-none text-sm text-red-400">{$errors.email}</span
				>{/if}
		</fieldset>
		<fieldset class="flex w-full flex-col md:w-2/3">
			<label for="password" class="hidden">Password</label>
			<input
				type="password"
				name="password"
				placeholder="Password"
				class="
					block
					rounded-md
					border-gray-300
					shadow-sm
					focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
				"
				aria-invalid={$errors.password ? 'true' : undefined}
				bind:value={$form.password}
				{...!disabledPasswordConstraint ? $constraints.password : {}}
			/>

			{#if $errors.password}<span
					transition:slide={{ delay: 0, duration: 300, easing: quintOut, axis: 'y' }}
					class="mt-1 select-none text-sm text-red-400">{$errors.password}</span
				>{/if}
		</fieldset>
		<button
			type="submit"
			class="text-md w-full rounded-md bg-black py-2 font-medium text-white shadow-lg transition duration-200 visited:-translate-x-4 hover:bg-gray-700 active:translate-y-1 active:shadow-sm md:w-2/3"
			>Log in</button
		>
		<p class="text-xs">
			Forgot ur password?
			<button
				formaction="?/requestPasswordReset"
				on:click={() => (disabledPasswordConstraint = true)}
				class="font-medium underline">Let’s reset it</button
			>.
		</p>
		<button
			on:click={gotoAuthProvider}
			class="text-md flex w-full items-center justify-center rounded-md border-2 border-black py-2 font-medium text-black shadow-lg transition duration-200 visited:-translate-x-4 active:translate-y-1 active:shadow-sm md:w-2/3"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"
				><path
					d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"
				/></svg
			>
		</button>

		<button
			on:click={() => {
				$form.email = 'kj@mili-my.name';
				$form.password = '12345678';
			}}
			class="text-md flex w-full items-center justify-center rounded-md border-2 border-black py-2 font-medium text-black shadow-lg transition duration-200 visited:-translate-x-4 active:translate-y-1 active:shadow-sm md:w-2/3"
		>
			Mili's Account
		</button>
	</div>
</form>
