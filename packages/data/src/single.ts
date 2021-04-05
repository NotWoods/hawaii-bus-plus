import { Repository } from './repository';

export async function getSingle<
  Repo extends Partial<Repository>,
  Id extends string,
  Value
>(
  repo: Repo,
  load: (this: Repo, ids: Iterable<Id>) => Promise<Map<Id, Value>>,
  id: Id,
) {
  const map = await load.call(repo, [id]);
  return map.get(id);
}
