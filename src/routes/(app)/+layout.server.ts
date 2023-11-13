import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
	// Redirect if already logged in
	if (!locals.pb.authStore.isValid) throw redirect(303, '/login');

	const posts = await locals.pb.collection('posts').getFullList({
		fields: 'id, title, content',
		filter: `userId="${locals.pb.authStore.model?.id}"`,
		sort: '-created'
	});

	return {
		posts,
		user: structuredClone(locals.pb.authStore.model)
	};
};
