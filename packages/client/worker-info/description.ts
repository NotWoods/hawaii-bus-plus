export interface DescriptionPart {
  type: 'text' | 'link';
  value: string;
}

const LINK_REGEX = /(https?:)\s?(\/\/[.a-z/]+)/g;

export function extractLinks(description: string) {
  let descLastIndex = 0;
  const descParts: DescriptionPart[] = [];
  for (const match of description.matchAll(LINK_REGEX)) {
    const end = match.index! + match[0].length;
    const textPart = description.slice(descLastIndex, match.index);
    const linkPart = match[1] + match[2];
    descParts.push(
      { type: 'text', value: textPart },
      { type: 'link', value: linkPart }
    );
    descLastIndex = end;
  }
  descParts.push({
    type: 'text',
    value: description.slice(descLastIndex),
  });
  return descParts;
}
