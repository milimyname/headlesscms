export const defaultEditorContent = {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Untitled' }]
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a default post. You can edit it or delete it.'
				}
			]
		}
	]
};
