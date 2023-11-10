import { pocketbase } from '$lib/pocketbase';
import { addToast } from '$lib/ui/toasts.svelte';
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';
import { subscribePostIdStore } from '$lib/utils';

const uploadKey = new PluginKey('upload-image');

const UploadImagesPlugin = () =>
	new Plugin({
		key: uploadKey,
		state: {
			init() {
				return DecorationSet.empty;
			},
			apply(tr, set) {
				set = set.map(tr.mapping, tr.doc);
				// See if the transaction adds or removes any placeholders
				const action = tr.getMeta(this as any);
				if (action && action.add) {
					const { id, pos, src } = action.add;

					const placeholder = document.createElement('div');
					placeholder.setAttribute('class', 'img-placeholder');
					const image = document.createElement('img');
					image.setAttribute('class', 'opacity-40 rounded-lg border border-stone-200');
					image.src = src;
					placeholder.appendChild(image);
					const deco = Decoration.widget(pos + 1, placeholder, {
						id
					});
					set = set.add(tr.doc, [deco]);
				} else if (action && action.remove) {
					set = set.remove(
						set.find(null as any, null as any, (spec) => spec.id == action.remove.id)
					);
				}
				return set;
			}
		},
		props: {
			decorations(state) {
				return this.getState(state);
			}
		}
	});

export default UploadImagesPlugin;

function findPlaceholder(state: EditorState, id: any) {
	const decos = uploadKey.getState(state);
	const found = decos.find(null, null, (spec: any) => spec.id == id);
	return found.length ? found[0].from : null;
}

export async function startImageUpload(file: File, view: EditorView, pos: number) {
	// check if the file is an image
	if (!file.type.includes('image/')) {
		addToast({
			data: {
				text: 'File type not supported.',
				type: 'error'
			}
		});
		return;

		// check if the file size is less than 20MB
	} else if (file.size / 1024 / 1024 > 20) {
		addToast({
			data: {
				text: 'File size too big (max 20MB).',
				type: 'error'
			}
		});

		return;
	}

	// A fresh object to act as the ID for this upload
	const id = {};

	// Replace the selection with a placeholder
	const tr = view.state.tr;
	if (!tr.selection.empty) tr.deleteSelection();

	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => {
		tr.setMeta(uploadKey, {
			add: {
				id,
				pos,
				src: reader.result
			}
		});
		view.dispatch(tr);
	};

	const src = await handleImageUpload(file);

	const imageUrl = src?.src;
	const imageTitle = src?.title;

	const { schema } = view.state;

	const newPos = findPlaceholder(view.state, id);
	// If the content around the placeholder has been deleted, drop
	// the image
	if (newPos == null) return;

	// Otherwise, insert it at the placeholder's position, and remove
	// the placeholder

	// When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
	// the image locally
	const imageSrc = typeof imageUrl === 'object' ? reader.result : imageUrl;

	const node = schema.nodes.image.create({ src: imageSrc, title: imageTitle });
	const transaction = view.state.tr
		.replaceWith(pos, pos, node)
		.setMeta(uploadKey, { remove: { id } });
	view.dispatch(transaction);
}

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Example function to upload an image to PocketBase
export const handleImageUpload = async (file: File) => {
	try {
		// Create a new FormData object
		const formData = new FormData();
		// Append the file with the key 'file', the key might need to be adjusted based on your collection's field
		formData.append('files', file);

		const postId = subscribePostIdStore();

		// PocketBase collection name should be replaced with the actual name of the collection you're uploading to
		const createdRecord = await pocketbase.collection('posts').update(postId, formData);

		const filename = createdRecord.files.at(-1);
		// Assuming the API returns the full URL or the relative path to access the image
		// Adjust the following line to use the actual property where the image URL is stored
		const imageUrl = pocketbase.files.getUrl(createdRecord, filename);

		// Return the URL to the uploaded image
		return {
			src: imageUrl,
			title: filename
		};
	} catch (error) {
		addToast({
			data: {
				text: error.message,
				type: 'error'
			}
		});
		// Handle the error case by returning null or another appropriate value
		return null;
	}
};
