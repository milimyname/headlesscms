import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
	// Redirect if already logged in
	if (!locals.pb.authStore.isValid) throw redirect(303, '/login');

	return {
		user: structuredClone(locals.pb.authStore.model)
	};
};
