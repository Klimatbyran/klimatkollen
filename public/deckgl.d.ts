// Fixme revisit, remove exceptions and refactor!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as DeckTypings from '@danmarshall/deckgl-typings'

declare module 'deck.gl' {
  // eslint-disable-next-line no-shadow
  export namespace DeckTypings {}
}
