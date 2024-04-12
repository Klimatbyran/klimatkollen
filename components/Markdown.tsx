import ReactMarkdown, { Components, Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import {
  H1, H2, H3, Paragraph, ParagraphBold, ParagraphItalic,
} from './Typography'

const optionsForRehypeExternalLinks = { rel: ['noreferrer'], target: '_blank' }

const defaultComponents: Partial<Components> = {
  p: Paragraph,
  strong: ParagraphBold,
  em: ParagraphItalic,
  h1: H1,
  h2: H2,
  h3: H3,
}

function Markdown({ children, className, components }: Readonly<Options>) {
  return (
    <ReactMarkdown
      className={className}
      components={{ ...defaultComponents, ...components }}
      rehypePlugins={[[rehypeExternalLinks, optionsForRehypeExternalLinks]]}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
