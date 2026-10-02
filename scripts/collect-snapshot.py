#!/usr/bin/env python3
"""Read public GitHub metadata only; atomically build the bundled snapshot. No token."""
import datetime
import json
import pathlib
import subprocess
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]


def get(url, accept="application/vnd.github+json"):
    req = urllib.request.Request(url, headers={"User-Agent": "repository-atlas-public-snapshot", "Accept": accept})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def main():
    curation = json.loads((ROOT / "data/curation.json").read_text())
    rows, pages, seen = [], [], set()
    for page in range(1, 102):
        url = f"https://api.github.com/users/alibowbow/starred?per_page=100&page={page}"
        items = get(url, "application/vnd.github.star+json")
        if not isinstance(items, list) or len(items) > 100:
            raise ValueError("Invalid API page")
        pages.append({"page": page, "count": len(items), "url": url})
        if not items:
            break
        for item in items:
            repo = item.get("repo", item)
            if repo.get("private") is not False:
                raise ValueError("Non-public response: aborted without writing")
            name = repo["full_name"].lower()
            if name in seen:
                raise ValueError("Duplicate across pages: retry the complete collection")
            seen.add(name)
            rows.append({"api": repo, "starred_at": item.get("starred_at") if "repo" in item else None})
    else:
        raise ValueError("Pagination limit exceeded")
    recommendations = []
    for name, cur in curation.items():
        if cur.get("recommendation_reason") and name.lower() not in seen:
            api = get("https://api.github.com/repos/" + name)
            if api.get("private") is not False:
                raise ValueError("Recommendation is not public")
            recommendations.append(api)
    payload = {"rows": rows, "pages": pages, "recommendations": recommendations,
               "curation": curation, "collected_at": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")}
    # README review dates and blob hashes remain editorial provenance, never overwritten by an API refresh.
    code = r"""
const fs=require('fs'), C=require('./core.js');
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const repos=input.rows.map(x=>C.normalizeRepo(x.api,x.starred_at,input.collected_at,input.curation[x.api.full_name]));
repos.push(...input.recommendations.map(api=>C.normalizeRepo(api,null,input.collected_at,input.curation[api.full_name],'recommendation')));
const s=C.validateSnapshot({schema_version:1,account:'alibowbow',collected_at:input.collected_at,pages:input.pages,repositories:repos});
const json=JSON.stringify(s,null,2);
fs.writeFileSync('data/snapshot.json.tmp',json+'\n');
fs.writeFileSync('data/snapshot.js.tmp','window.REPO_ATLAS_SNAPSHOT = '+json+';\n');
fs.renameSync('data/snapshot.json.tmp','data/snapshot.json');
fs.renameSync('data/snapshot.js.tmp','data/snapshot.js');
console.log('Public stars:',input.rows.length,'Recommendations:',input.recommendations.length,'Collected:',s.collected_at);
"""
    subprocess.run(["node", "-e", code], cwd=ROOT, input=json.dumps(payload), text=True, check=True)


if __name__ == "__main__":
    main()
