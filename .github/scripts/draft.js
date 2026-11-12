// Release draft body for .github/workflows/release-draft.yml.
// Called from actions/github-script with its github, context, core, and exec objects.
import {readFileSync} from 'node:fs';

export const START_MARKER = '<!-- dino-nest:changes:start -->';
export const END_MARKER = '<!-- dino-nest:changes:end -->';

const CATEGORIES = [
  {title: 'Features', types: ['feat']},
  {title: 'Bug Fixes', types: ['fix']},
  {title: 'Performance', types: ['perf']},
  {title: 'Documentation', types: ['docs']},
  {title: 'Maintenance', types: ['chore', 'refactor', 'style', 'test', 'build', 'ci']},
];
const OTHER_TITLE = 'Other Changes';
const SUBJECT_PATTERN = /^(\w+)(?:\([^)]*\))?(!)?:\s*(.+)$/;

export function parseTag(tag) {
  return /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag)?.slice(1).map(Number);
}

export function compareTags(left, right) {
  const [leftParts, rightParts] = [parseTag(left), parseTag(right)];
  return (
    leftParts
      .map((part, index) => part - rightParts[index])
      .find((difference) => difference !== 0) ?? 0
  );
}

// Takes one "<hash> <subject>" line of git log output.
export function parseCommit(line) {
  const separator = line.indexOf(' ');
  const hash = line.slice(0, separator);
  const subject = line.slice(separator + 1);
  const match = SUBJECT_PATTERN.exec(subject);
  if (!match) return {hash, type: null, breaking: false, title: subject};
  return {hash, type: match[1], breaking: Boolean(match[2]), title: match[3]};
}

function packageVersion() {
  return JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
}

export function nextTag(latestTag, commits) {
  const [major, minor, patch] = parseTag(latestTag);
  if (commits.some((commit) => commit.breaking)) return `v${major + 1}.0.0`;
  if (commits.some((commit) => commit.type === 'feat')) return `v${major}.${minor + 1}.0`;
  return `v${major}.${minor}.${patch + 1}`;
}

export function changesSection(commits) {
  const known = CATEGORIES.flatMap((category) => category.types);
  const groups = [
    ...CATEGORIES.map(({title, types}) => ({
      title,
      commits: commits.filter((commit) => types.includes(commit.type)),
    })),
    {title: OTHER_TITLE, commits: commits.filter((commit) => !known.includes(commit.type))},
  ].filter((group) => group.commits.length > 0);

  const lines = groups.flatMap((group, index) => [
    ...(index > 0 ? [''] : []),
    `### ${group.title}`,
    '',
    ...group.commits.map((commit) => `- ${commit.title} (${commit.hash})`),
  ]);

  return [
    START_MARKER,
    "## What's Changed",
    '',
    ...(lines.length > 0 ? lines : ['- No changes']),
    END_MARKER,
  ].join('\n');
}

// Only the marked section is rewritten. Notes written around it stay.
export function replaceSection(body, section) {
  const startIndex = body.indexOf(START_MARKER);
  const endIndex = body.indexOf(END_MARKER);
  if (startIndex !== -1 && endIndex > startIndex)
    return body.slice(0, startIndex) + section + body.slice(endIndex + END_MARKER.length);
  return [section, body].filter(Boolean).join('\n\n');
}

export default async function updateReleaseDraft({github, context, core, exec}) {
  const {owner, repo} = context.repo;
  const releases = await github.paginate(github.rest.repos.listReleases, {
    owner,
    repo,
    per_page: 100,
  });
  const publishedTags = releases
    .filter((release) => !release.draft && !release.prerelease && parseTag(release.tag_name))
    .map((release) => release.tag_name)
    .sort((left, right) => compareTags(right, left));
  const latestTag = publishedTags[0];

  const {stdout} = await exec.getExecOutput(
    'git',
    ['log', '--no-merges', '--format=%h %s', latestTag ? `${latestTag}..HEAD` : 'HEAD'],
    {silent: true},
  );
  const commits = stdout.split('\n').filter(Boolean).map(parseCommit);
  // Before the first release there is no tag to count up from, so the draft takes the
  // version already written in package.json.
  const computedTag = latestTag ? nextTag(latestTag, commits) : `v${packageVersion()}`;
  if (!parseTag(computedTag)) {
    core.setFailed(`package.json version is not major.minor.patch: ${computedTag}`);
    return;
  }
  const since = latestTag ? `since ${latestTag}` : 'for the first release';

  const drafts = releases.filter((release) => release.draft);
  if (drafts.length > 1)
    core.warning(`Found ${drafts.length} drafts. Updating only the newest one.`);
  const draft = drafts[0];

  // Keep a version typed into the draft when it is ahead of what the commits call for.
  const tag =
    draft && parseTag(draft.tag_name) && compareTags(draft.tag_name, computedTag) > 0
      ? draft.tag_name
      : computedTag;

  const body = replaceSection(draft?.body ?? '', changesSection(commits));

  if (draft) {
    const name = !draft.name || draft.name === draft.tag_name ? tag : draft.name;
    await github.rest.repos.updateRelease({
      owner,
      repo,
      release_id: draft.id,
      tag_name: tag,
      name,
      body,
      draft: true,
    });
    core.notice(`Updated draft ${tag} with ${commits.length} changes ${since}.`);
  } else {
    await github.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: tag,
      body,
      draft: true,
      target_commitish: 'main',
    });
    core.notice(`Created draft ${tag} with ${commits.length} changes ${since}.`);
  }
}
