const MAX_FILES = 12;
const MAX_CHARS_PER_FILE = 500;
const MAX_TOTAL_CHARS = 4500;

const includeMatchers = [
  /^readme\.md$/i,
  /^package\.json$/i,
  /(^|\/)(server|app|index)\.js$/i,
  /^src\/(App|main|index)\.[jt]sx?$/i,
  /(^|\/)routes\/.+\.[jt]sx?$/i,
  /(^|\/)controllers\/.+\.[jt]sx?$/i,
  /(^|\/)models\/.+\.[jt]sx?$/i,
  /(^|\/)services\/.+\.[jt]sx?$/i,
  /(^|\/)middleware\/.+\.[jt]sx?$/i,
  /^server\/(routes|controllers|models|services|middleware)\/.+\.[jt]sx?$/i,
  /^client\/src\/(pages|components)\/.+\.[jt]sx?$/i,
  /^src\/(pages|components)\/.+\.[jt]sx?$/i,
];

const excludeMatchers = [
  /(^|\/)node_modules\//i,
  /(^|\/)(dist|build|coverage)\//i,
  /(^|\/)\.git\//i,
  /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/i,
  /\.(png|jpe?g|gif|svg|pdf|zip|ico|webp)$/i,
];

const priorityMatchers = [
  /^readme\.md$/i,
  /^package\.json$/i,
  /(^|\/)(server|app|index)\.js$/i,
  /(^|\/)routes\//i,
  /(^|\/)controllers\//i,
  /(^|\/)models\//i,
  /^src\/(App|main|index)\.[jt]sx?$/i,
  /(^|\/)pages\//i,
  /(^|\/)components\//i,
  /(^|\/)(services|middleware)\//i,
];

const parseGitHubUrl = (repositoryUrl) => {
  let url;

  try {
    url = new URL(repositoryUrl);
  } catch (error) {
    const invalid = new Error('Enter a valid GitHub repository URL');
    invalid.statusCode = 400;
    throw invalid;
  }

  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
    const invalid = new Error('Only public github.com repository URLs are supported');
    invalid.statusCode = 400;
    throw invalid;
  }

  const [owner, repoWithSuffix] = url.pathname.split('/').filter(Boolean);
  const repo = repoWithSuffix?.replace(/\.git$/i, '');

  if (!owner || !repo) {
    const invalid = new Error('GitHub URL must include an owner and repository name');
    invalid.statusCode = 400;
    throw invalid;
  }

  return { owner, repo };
};

const githubFetchJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'InitPhase-Change-Impact-MVP',
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || 'Unable to fetch repository data from GitHub');
    error.statusCode = response.status === 404 ? 404 : 502;
    throw error;
  }

  return data;
};

const shouldInclude = (path) => includeMatchers.some((matcher) => matcher.test(path));
const shouldExclude = (path) => excludeMatchers.some((matcher) => matcher.test(path));

const getPriority = (path) => {
  const index = priorityMatchers.findIndex((matcher) => matcher.test(path));
  return index === -1 ? priorityMatchers.length : index;
};

const classifyFile = (path) => {
  if (/readme\.md$/i.test(path)) return 'docs';
  if (/package\.json$/i.test(path)) return 'config';
  if (/(^|\/)routes\//i.test(path)) return 'route';
  if (/(^|\/)controllers\//i.test(path)) return 'controller';
  if (/(^|\/)models\//i.test(path)) return 'model';
  if (/(^|\/)pages\//i.test(path)) return 'frontend page';
  if (/(^|\/)components\//i.test(path)) return 'component';
  if (/(^|\/)services\//i.test(path)) return 'service';
  if (/(^|\/)middleware\//i.test(path)) return 'middleware';
  return 'source';
};

const fetchRawFile = async ({ owner, repo, branch, path }) => {
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${path.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(rawUrl, {
    headers: { 'User-Agent': 'InitPhase-Change-Impact-MVP' },
  });

  if (!response.ok) {
    return '';
  }

  return response.text();
};

const createExcerpt = (content) => {
  const lines = content
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim())
    .map((line) => (line.length > 180 ? `${line.slice(0, 180)}...` : line));

  let excerpt = '';

  for (const line of lines) {
    if (excerpt.length + line.length + 1 > MAX_CHARS_PER_FILE) break;
    excerpt += `${line}\n`;
  }

  return excerpt.trim();
};

const fetchRepositorySnapshot = async (repositoryUrl) => {
  const { owner, repo } = parseGitHubUrl(repositoryUrl);
  const repoData = await githubFetchJson(`https://api.github.com/repos/${owner}/${repo}`);
  const defaultBranch = repoData.default_branch || 'main';
  const treeData = await githubFetchJson(`https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`);

  const selected = (treeData.tree || [])
    .filter((item) => item.type === 'blob' && item.path)
    .filter((item) => !shouldExclude(item.path) && shouldInclude(item.path))
    .sort((a, b) => getPriority(a.path) - getPriority(b.path) || a.path.localeCompare(b.path))
    .slice(0, MAX_FILES);

  const files = [];
  let totalChars = 0;

  for (const item of selected) {
    if (totalChars >= MAX_TOTAL_CHARS) break;

    const content = await fetchRawFile({ owner, repo, branch: defaultBranch, path: item.path });
    const remainingChars = MAX_TOTAL_CHARS - totalChars;
    const truncated = createExcerpt(content).slice(0, remainingChars);

    totalChars += truncated.length;
    files.push({
      path: item.path,
      type: classifyFile(item.path),
      size: item.size || content.length || 0,
      content: truncated,
    });
  }

  if (files.length === 0) {
    const error = new Error('No supported project files were found in this repository');
    error.statusCode = 400;
    throw error;
  }

  return {
    repositoryName: `${owner}/${repo}`,
    defaultBranch,
    files,
  };
};

module.exports = {
  fetchRepositorySnapshot,
  parseGitHubUrl,
};
