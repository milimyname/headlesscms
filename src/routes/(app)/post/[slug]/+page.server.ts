import { defaultEditorContent } from '$lib/ui/editor/default-content.js';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const currentPost = await locals.pb.collection('posts').getOne(params.slug);

	return { post: currentPost };
};

// /** @type {import('./$types').Actions} */
// export const actions = {
// 	createDefaultPost: async ({ locals }) => {
// 		// Create a new default post in the database
// 		const defaultPost = await locals.pb.collection('posts').create({
// 			content: defaultEditorContent,
// 			draft: true,
// 			userId: locals.pb.authStore.model?.id
// 		});

// 		// Redirect to the new post
// 		redirect(300, `/post/${defaultPost.id}`);
// 	}
// };
