/** Normalize TipTap HTML; null when empty placeholder. */
export function normalizeBatchNotesHtml(html: string | null | undefined): string | null {
  const trimmed = (html ?? '').trim();
  if (
    !trimmed ||
    trimmed === '<p></p>' ||
    trimmed === '<p><br></p>' ||
    trimmed === '<p><br class="ProseMirror-trailingBreak"></p>'
  ) {
    return null;
  }
  return trimmed;
}
