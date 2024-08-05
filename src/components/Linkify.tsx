import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import { UserLinkWithTooltip } from "./UserLinkWithTooltip";
type Props = {
  children: React.ReactNode;
};

export function Linkify({ children }: Props) {
  return (
    <LinkifyUserName>
      <LinkiFyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkiFyHashtag>
    </LinkifyUserName>
  );
}

function LinkifyUrl({ children }: Props) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUserName({ children }: Props) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkiFyHashtag({ children }: Props) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
