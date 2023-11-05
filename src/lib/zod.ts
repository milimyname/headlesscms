import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().min(3).max(32),
	password: z.string().min(8).max(32)
});


export const profileData = z.object({
	username: z.string().min(3).max(32).optional(),
	email: z.string().email().optional(),
	avatar: z.string().url().optional()
});


export const feedbacksSchema = z.object({
	name: z.string(),
	description: z.string().max(1000),
	device: z.string(),
	userId: z.string()
});

