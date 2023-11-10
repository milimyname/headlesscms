export const defaultEditorContent = {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Introducing Headlesscms' }]
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: ' is a Notion-style WYSIWYG editor with AI-powered autocompletion. Built with '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://tiptap.dev/',
								target: '_blank',
								class:
									'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
							}
						}
					],
					text: 'Tiptap'
				},
				{ type: 'text', text: ' + ' },
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://sdk.vercel.ai/docs',
								target: '_blank',
								class:
									'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
							}
						}
					],
					text: 'Vercel AI SDK'
				},
				{ type: 'text', text: ". Ported From Steven Tey's " },
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://github.com/steven-tey/novel',
								target: '_blank',
								class:
									'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
							}
						}
					],
					text: 'Novel'
				},
				{ type: 'text', text: ' project.' }
			]
		}
	]
};
