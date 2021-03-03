import { Response } from 'node-fetch';

interface Pagination {
  last: number;
  prev?: number;
  current: number;
  next: number;
  first?: number;
  total: number | null;
}

export function getPagination(response: Response) {
  const linksStr = response.headers.get('Link');
  const pagination: Partial<Pagination> = {};
  //var link, url, rel, m, page;
  if (linksStr == undefined) {
    return undefined;
  }
  const links = linksStr.split(',');
  const total = response.headers.get('X-Total-Count');

  for (let i = 0, len = links.length; i < len; i++) {
    const link = links[i].replace(/(^\s*|\s*$)/, '');
    const [url, rel] = link.split(';');
    const m = url.match(/page=(\d+)/);
    const page = m && parseInt(m[1], 10);
    if (rel.match(/last/)) {
      pagination.last = page!;
    } else if (rel.match(/next/)) {
      pagination.next = page!;
    } else if (rel.match(/prev/)) {
      pagination.prev = page!;
    } else if (rel.match(/first/)) {
      pagination.first = page!;
    }
  }

  pagination.last = Math.max(
    pagination.last || 0,
    (pagination.prev && pagination.prev + 1) || 0
  );
  pagination.current = pagination.next
    ? pagination.next - 1
    : pagination.last || 1;
  pagination.total = total ? parseInt(total, 10) : null;

  return pagination as Pagination;
}
