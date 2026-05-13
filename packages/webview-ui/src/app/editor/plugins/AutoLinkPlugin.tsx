import {
  AutoLinkPlugin as LexicalAutoLinkPlugin,
  type LinkMatcher,
} from '@lexical/react/LexicalAutoLinkPlugin';

const URL_CANDIDATE_REGEX = /\bhttps?:\/\/[^\s<>"']+/i;
const TRAILING_PUNCTUATION_REGEX = /[),.;:!?]+$/;

const urlMatcher: LinkMatcher = (text) => {
  const match = URL_CANDIDATE_REGEX.exec(text);
  if (!match) {
    return null;
  }

  const url = match[0].replace(TRAILING_PUNCTUATION_REGEX, '');

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
  } catch {
    return null;
  }

  return {
    index: match.index,
    length: url.length,
    text: url,
    url,
  };
};

const MATCHERS: LinkMatcher[] = [urlMatcher];

export function AutoLinkPlugin(): JSX.Element {
  return <LexicalAutoLinkPlugin matchers={MATCHERS} />;
}
