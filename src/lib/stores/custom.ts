import { writable } from 'svelte/store';
import type { JSONContent } from '@tiptap/core';

export const postIdStore = writable<string>('');
export const postContentStore = writable<JSONContent>();
export const twenedTransformXStore = writable<number>(0);
