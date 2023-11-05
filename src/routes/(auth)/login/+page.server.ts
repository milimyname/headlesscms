import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/zod';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	// Redirect if already logged in
	if (locals.pb.authStore.isValid) throw redirect(303, '/');
	// Server API:
	const form = await superValidate(loginSchema);

	

	const authMethods = await locals.pb?.collection('users').listAuthMethods();
	if (!authMethods) {
		return {
			authProviderRedirect: '',
			authProviderState: ''
		};
	}

	const redirectURL = `${url.origin}/auth/oauth2-redirect`;
	const googleAuthProvider = authMethods.authProviders[0];
	const authProviderRedirect = `${googleAuthProvider.authUrl}${redirectURL}`;
	const state = googleAuthProvider.state;
	const codeVerifier = googleAuthProvider.codeVerifier;

	// Always return { form } in load and form actions.
	return { form, authProviderRedirect, authProviderState: state, codeVerifier };
};

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

		// Convenient validation check:
		if (!form.valid)
			// Again, always return { form } and things will just work.
			return fail(400, { form });

		// Auth with pb
		try {
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
			if (!locals.pb.authStore.model?.verified) {
				locals.pb.authStore.clear();
				form.errors.email = ['Email is not verified. Check ur email inbox.'];
				return { form };
			}
		} catch (_) {
			form.errors.email = ['Invalid email or password.'];
			return { form };
		}

		throw redirect(303, '/');
	},
	requestPasswordReset: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

		// Send password reset email
		try {
			await locals.pb.collection('users').requestPasswordReset(form.data.email);
		} catch (_) {
			form.errors.email = ['Invalid email.'];
			return { form };
		}

		throw redirect(303, '/');
	}
};
