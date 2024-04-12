import ReactMarkdown, { Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'

const optionsForRehypeExternalLinks = { rel: ['noreferrer'], target: '_blank' }

function Markdown({ children, className }: Readonly<Options>) {
  return (
    <ReactMarkdown className={className} rehypePlugins={[[rehypeExternalLinks, optionsForRehypeExternalLinks]]}>
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
