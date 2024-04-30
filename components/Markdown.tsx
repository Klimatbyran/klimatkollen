import ReactMarkdown, { Components, Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import styled from 'styled-components'
import Link from 'next/link'

import {
  H1, H2, H3, Paragraph, ParagraphBold, ParagraphItalic,
} from './Typography'
import { ListItem, OrderedList, UnorderedList } from './shared'

const optionsForRehypeExternalLinks = { rel: ['noreferrer'], target: '_blank' }

const defaultComponents: Partial<Components> = {
  p: styled(Paragraph)`
    &:last-child {
      margin-bottom: 0;
    }
  `,
  // Workaround to inherit styles and just change the HTML element
  strong: styled(ParagraphBold).attrs({ as: 'strong' })``,
  em: styled(ParagraphItalic).attrs({ as: 'em' })``,
  a: Link as Components['a'],
  h1: H1,
  h2: H2,
  h3: H3,
  ol: OrderedList,
  ul: UnorderedList,
  li: ListItem,
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
