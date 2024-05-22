import ReactMarkdown, { Components, Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import styled from 'styled-components'
import Link from 'next/link'
import { Ref } from 'react'

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
  // Ensure public assets served from the same domain (currently only PDFs) are opened in a new tab
  // This prevents unwanted behavior where Next.js tries to preload data for URLs that are outside of the Next.js app.
  a: ({
    href, target, ref, rel, children,
  }) => (
    <Link
      href={href as string}
      target={href?.endsWith('.pdf') ? '_blank' : target}
      rel={rel}
      ref={ref as Ref<HTMLAnchorElement>}
    >
      {children}
    </Link>
  ),
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
