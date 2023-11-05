import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ locals, url, cookies }) => {
	const redirectURL = `${url.origin}/auth/oauth2-redirect`;
	const expectedState = cookies.get('state');
	const codeVerifier = cookies.get('codeVerifier');

	const query = new URLSearchParams(url.search);
	const state = query.get('state');
	const code = query.get('code');

	const authMethods = await locals.pb.collection('users').listAuthMethods();
	if (!authMethods?.authProviders) {
		console.log('no auth methods');
		throw redirect(303, '/login');
	}
	const provider = authMethods.authProviders[0];
	if (!provider) {
		console.log('Provider not found');
		throw redirect(303, '/login');
	}

	if (expectedState !== state) {
		console.log('state does not match expected', expectedState, state);
		throw redirect(303, '/login');
	}

	try {
		const { meta, record } = await locals.pb
			.collection('users')
			.authWithOAuth2Code(provider.name, code || '', codeVerifier, redirectURL);

		// Update user's profile
		await locals.pb.collection('users').update(record.id, {
			oauth2ImageUrl: meta.avatarUrl,
			avatar: null
		});
	} catch (err) {
		console.log('Error logging in with 0Auth user - ', err);
	}

	throw redirect(303, '/');
};
