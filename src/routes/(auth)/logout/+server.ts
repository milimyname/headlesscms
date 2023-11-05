import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	locals.pb.authStore.clear();

	throw redirect(303, '/login');
};
