import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { OverflowNode } from '@lexical/overflow'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from 'lexical'

import { AutocompleteNode } from '@/registry/default/editor/nodes/autocomplete-node'
import { CollapsibleContainerNode } from '@/registry/default/editor/nodes/collapsible-container-node'
import { CollapsibleContentNode } from '@/registry/default/editor/nodes/collapsible-content-node'
import { CollapsibleTitleNode } from '@/registry/default/editor/nodes/collapsible-title-node'
import { FigmaNode } from '@/registry/default/editor/nodes/embeds/figma-node'
import { TweetNode } from '@/registry/default/editor/nodes/embeds/tweet-node'
import { YouTubeNode } from '@/registry/default/editor/nodes/embeds/youtube-node'
import { EmojiNode } from '@/registry/default/editor/nodes/emoji-node'
import { EquationNode } from '@/registry/default/editor/nodes/equation-node'
import { ExcalidrawNode } from '@/registry/default/editor/nodes/excalidraw-node'
import { ImageNode } from '@/registry/default/editor/nodes/image-node'
import { InlineImageNode } from '@/registry/default/editor/nodes/inline-image-node'
import { KeywordNode } from '@/registry/default/editor/nodes/keyword-node'
import { LayoutContainerNode } from '@/registry/default/editor/nodes/layout-container-node'
import { LayoutItemNode } from '@/registry/default/editor/nodes/layout-item-node'
import { MentionNode } from '@/registry/default/editor/nodes/mention-node'
import { PageBreakNode } from '@/registry/default/editor/nodes/page-break-node'
import { PollNode } from '@/registry/default/editor/nodes/poll-node'

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    MentionNode,
    PageBreakNode,
    ImageNode,
    InlineImageNode,
    EmojiNode,
    KeywordNode,
    ExcalidrawNode,
    PollNode,
    LayoutContainerNode,
    LayoutItemNode,
    EquationNode,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
    AutoLinkNode,
    FigmaNode,
    TweetNode,
    YouTubeNode,
    AutocompleteNode,
  ]
