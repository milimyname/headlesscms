import { Node } from '@tiptap/core';

const Furigana = Node.create({
	name: 'furigana',
	content: 'inline*',
	group: 'inline',
	inline: true,
	atom: true,
	attrs: {
		baseText: { default: '' },
		furiganaText: { default: '' }
	},
	addAttributes() {
		return {
			baseText: {
				default: ''
			},
			furiganaText: {
				default: ''
			}
		};
	},
	parseHTML() {
		return [
			{
				tag: 'ruby',
				getAttrs: (element) => {
					// Ensure that element is an HTMLElement
					if (!(element instanceof HTMLElement)) return null;

					const rt = element.querySelector('rt');
					let baseText = '';

					// Iterate over child nodes to construct the base text
					element.childNodes.forEach((child) => {
						// Append text content directly
						if (child.nodeType === 3) baseText += child.textContent;
						else if (child instanceof HTMLElement && child.nodeName !== 'RT') {
							// Remove every html tag except for 'RT' and ruby its content
							baseText += child.outerHTML.replace(/<(\w+)[^>]*>(.*?)<\/\1>/g, '$2');
						}
					});

					const furiganaText = rt?.textContent ?? '';
					return { baseText, furiganaText };
				}
			}
		];
	},
	renderHTML({ node, HTMLAttributes }) {
		const { baseText = '', furiganaText = '' } = node.attrs;
		return ['ruby', HTMLAttributes, baseText, ['rt', {}, furiganaText]];
	},
	addCommands() {
		return {
			insertFurigana:
				(attrs) =>
				({ tr, state, dispatch }) => {
					const { selection } = state;
					const { from, to } = selection;

					const node = state.schema.nodes.furigana.create(attrs);
					console.log('inserting furigana', node);

					const transaction = tr.replaceRangeWith(from, to, node);

					if (dispatch) dispatch(transaction);

					return true;
				}
		};
	}
});

export default Furigana;
