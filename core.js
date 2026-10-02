(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ArchiveCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const NAME = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\/[A-Za-z0-9_.-]{1,100}$/;
  const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
  const MAX_RECORDS = 10000;
  const key = id => String(id).toLowerCase();
  function parseRepoInput(value) {
    let name = String(value).trim();
    if (name.startsWith('https://')) {
      const url = safeURL(name,true);
      if (!url) throw new Error('공개 github.com 저장소 URL이 필요합니다.');
      const u = new URL(url);
      if (u.search || u.hash) throw new Error('쿼리·프래그먼트 없이 저장소 URL을 입력하세요.');
      name = u.pathname.replace(/^\//,'').replace(/\/$/,'');
    }
    name = name.replace(/\.git$/,'');
    if (!NAME.test(name)) throw new Error('owner/repo 또는 https://github.com/owner/repo 형식이 필요합니다.');
    return name;
  }
  function parseRepoList(raw) {
    if (typeof raw !== 'string' || raw.length > 1000000) throw new Error('입력 길이 제한 초과');
    const unique=new Map(),invalid=[];
    let duplicates=0;
    for(const value of raw.split(/[\n,\s]+/).filter(Boolean)){
      try{const id=parseRepoInput(value);if(unique.has(key(id)))duplicates++;else unique.set(key(id),id);}catch(e){invalid.push({input:value,error:e.message});}
    }
    if(unique.size>500)throw new Error('API 조회는 한 번에 최대 500개입니다. 더 큰 모음은 JSON으로 가져오세요.');
    return {names:[...unique.values()],invalid,duplicates};
  }
  const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  function text(v, max, field, nullable = false) {
    if (nullable && v == null) return null;
    if (typeof v !== 'string' || v.length > max) throw new Error(field + ': 문자열 형식 또는 길이 오류');
    return v;
  }
  function date(v, field, nullable = false) {
    if (nullable && v == null) return null;
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(v) || !Number.isFinite(Date.parse(v))) throw new Error(field + ': ISO UTC 날짜 필요');
    return v;
  }
  function safeURL(value, githubOnly = false) {
    if (typeof value !== 'string' || value.length > 2048) return null;
    try {
      const u = new URL(value);
      if (u.protocol !== 'https:' || u.username || u.password || (githubOnly && u.hostname !== 'github.com')) return null;
      return u.href;
    } catch { return null; }
  }
  function repoURL(name) { if (!NAME.test(name)) throw new Error('저장소 이름 형식 오류'); return 'https://github.com/' + name; }
  function licenseLabel(r) {
    if (!r.license_spdx || r.license_spdx === 'NOASSERTION') return '별도 확인 필요';
    return r.license_display || r.license_spdx;
  }
  function normalizeRepo(api, starredAt, collectedAt, curated = {}, collection = 'stars') {
    if (!plain(api) || api.private !== false || !NAME.test(api.full_name)) throw new Error('공개 저장소 응답 형식 오류');
    const [owner, name] = api.full_name.split('/');
    const spdx = api.license?.spdx_id || null;
    return {
      id: api.full_name, name, owner, collection,
      description_original: api.description == null ? null : text(api.description, 3000, 'description'),
      summary_ko: curated.summary_ko || '한국어 요약 검토 대기 · 원문 설명을 확인하세요.',
      use_case: curated.use_case || '사용 상황은 README 검토 후 추가할 수 있습니다.',
      category: curated.category || '미분류', tags: curated.tags || (api.topics || []).slice(0, 12),
      language: api.language || '미확인', license_spdx: spdx,
      license_display: curated.license_display || spdx,
      license_note: curated.license_note || (!spdx ? 'API에 라이선스 식별 정보가 없습니다. 원문 LICENSE 확인 필요.' : spdx === 'NOASSERTION' ? 'GitHub API가 라이선스를 식별하지 못했습니다. 원문 조건 확인 필요.' : 'GitHub API의 SPDX 분류. 실제 적용 범위는 원문 LICENSE에서 확인하세요.'),
      stars: api.stargazers_count, pushed_at: api.pushed_at, updated_at: api.updated_at,
      starred_at: starredAt || null, checked_at: collectedAt,
      repo_url: repoURL(api.full_name), docs_url: safeURL(curated.docs_url) || repoURL(api.full_name) + '#readme',
      readme_url: safeURL(curated.readme_url, true) || repoURL(api.full_name) + '#readme',
      readme_sha: curated.readme_sha || null, review_note: curated.review_note || 'README 원문 미검토. API 메타데이터만 수집된 항목입니다.',
      reviewed_at: curated.reviewed_at || null, recommendation_reason: curated.recommendation_reason || null,
      archived: api.archived === true, metadata_verified: true
    };
  }
  function validateRepo(v) {
    if (!plain(v) || !NAME.test(v.id)) throw new Error('저장소 ID 오류');
    const [owner, name] = v.id.split('/');
    if (v.owner !== owner || v.name !== name || !['stars','recommendation','local'].includes(v.collection)) throw new Error('작성자/이름/컬렉션 불일치');
    const r = {id: v.id, owner, name, collection: v.collection};
    for (const [key, max] of Object.entries({summary_ko:600,use_case:600,category:60,language:60,license_note:1500,review_note:1500})) r[key] = text(v[key],max,key);
    for (const [key, max] of Object.entries({description_original:3000,license_spdx:100,license_display:100,readme_sha:40,recommendation_reason:600})) r[key] = text(v[key],max,key,true);
    if (r.readme_sha && !/^[a-f0-9]{40}$/.test(r.readme_sha)) throw new Error('README SHA 오류');
    if (!Array.isArray(v.tags) || v.tags.length > 12) throw new Error('태그 오류');
    r.tags = v.tags.map(t => text(t,60,'tag'));
    if (!Number.isSafeInteger(v.stars) || v.stars < 0) throw new Error('별 수 오류');
    r.stars = v.stars;
    for (const key of ['pushed_at','updated_at','starred_at','reviewed_at']) r[key] = date(v[key],key,true);
    r.checked_at = date(v.checked_at,'checked_at');
    r.repo_url = repoURL(v.id);
    if (safeURL(v.repo_url,true)?.replace(/\/$/,'') !== r.repo_url) throw new Error('저장소 URL 불일치');
    for (const key of ['docs_url','readme_url']) { r[key] = safeURL(v[key],key === 'readme_url'); if (!r[key]) throw new Error('안전하지 않은 URL'); }
    r.archived = v.archived === true; r.metadata_verified = v.metadata_verified === true;
    return r;
  }
  function validateSnapshot(v) {
    if (!plain(v) || v.schema_version !== 1 || v.account !== 'alibowbow' || !Array.isArray(v.repositories) || v.repositories.length > MAX_RECORDS) throw new Error('스냅샷 형식 오류');
    const repos = v.repositories.map(validateRepo);
    if (new Set(repos.map(r=>r.id.toLowerCase())).size !== repos.length) throw new Error('중복 저장소');
    const pages = v.pages;
    if (!Array.isArray(pages) || !pages.length || pages.length > 101 || pages[pages.length-1].count !== 0) throw new Error('페이지 끝 수집 기록 없음');
    pages.forEach((p,i)=>{ if (p.page !== i+1 || !Number.isInteger(p.count) || p.count<0 || p.count>100 || p.url !== `https://api.github.com/users/alibowbow/starred?per_page=100&page=${i+1}`) throw new Error('페이지 기록 오류'); });
    const starCount = repos.filter(r=>r.collection === 'stars').length;
    if (pages.reduce((n,p)=>n+p.count,0) !== starCount) throw new Error('Stars 개수와 페이지 기록 불일치');
    return {schema_version:1,account:'alibowbow',collected_at:date(v.collected_at,'collected_at'),pages:pages.map(p=>({...p})),repositories:repos};
  }
  function select(repos, state, saved = {}) {
    const q = String(state.query || '').normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const result = repos.filter(r=>{
      if (state.collection === 'stars' && r.collection !== 'stars') return false;
      const local=saved[key(r.id)] || saved[r.id];
      if (state.collection === 'saved' && local?.saved !== true) return false;
      if (state.collection === 'recommendation' && r.collection !== 'recommendation') return false;
      if (state.category && state.category !== 'all' && r.category !== state.category) return false;
      if (state.language && state.language !== 'all' && r.language !== state.language) return false;
      if (state.license && state.license !== 'all' && licenseLabel(r) !== state.license) return false;
      const hay = [r.id,r.summary_ko,r.use_case,r.description_original,r.category,...r.tags,...(local?.user_tags||[]),r.language,licenseLabel(r),local?.note || ''].join(' ').normalize('NFKC').toLocaleLowerCase();
      return q.every(part=>hay.includes(part));
    });
    const name = (a,b)=>a.name.localeCompare(b.name,'en',{sensitivity:'base'}) || a.id.localeCompare(b.id);
    result.sort((a,b)=>state.sort==='name'?name(a,b):state.sort==='stars'?(b.stars-a.stars || name(a,b)):((Date.parse(b.pushed_at)||0)-(Date.parse(a.pushed_at)||0) || name(a,b)));
    return result;
  }
  function validateImport(v) {
    if (!plain(v) || v.schema_version !== 1 || v.type !== 'repository-atlas-saved' || !Array.isArray(v.entries) || v.entries.length>MAX_RECORDS) throw new Error('지원하는 저장 모음 JSON이 아닙니다. 최대 10,000개.');
    if (Object.keys(v).some(k=>!['schema_version','type','exported_at','entries'].includes(k))) throw new Error('지원하지 않는 최상위 필드');
    date(v.exported_at,'exported_at');
    const seen = new Set();
    return v.entries.map(e=>{
      if (!plain(e) || Object.keys(e).some(k=>!['repo','note','saved_at','user_tags'].includes(k))) throw new Error('항목 형식 오류');
      const r = validateRepo(e.repo);
      if (seen.has(r.id.toLowerCase())) throw new Error('JSON에 중복 저장소가 있습니다.'); seen.add(r.id.toLowerCase());
      // Imported records can never assert GitHub star status or editorial verification.
      r.collection = 'local'; r.starred_at = null; r.reviewed_at = null; r.readme_sha = null; r.metadata_verified=false;
      r.review_note = '가져온 JSON의 사용자 작성 내용 · README 원문 미검증'; r.recommendation_reason = null;
      const user_tags=validateTags(e.user_tags || []);
      return {repo:r,note:text(e.note,4000,'note'),user_tags,saved_at:date(e.saved_at,'saved_at')};
    });
  }
  function parseImport(raw) {
    if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > MAX_IMPORT_BYTES) throw new Error('JSON은 최대 10MB입니다.');
    try { return validateImport(JSON.parse(raw)); } catch(e) { throw new Error('가져오기 실패: '+e.message); }
  }
  async function collectStars(fetchImpl, progress = ()=>{}) {
    const repositories = [], pages = [], seen = new Set();
    try {
    for (let page=1;page<=101;page++) {
      const url = `https://api.github.com/users/alibowbow/starred?per_page=100&page=${page}`;
      progress(page,repositories.length);
      const controller = new AbortController();
      const timer = setTimeout(()=>controller.abort(),15000);
      let response, rows;
      try {
        response = await fetchImpl(url,{method:'GET',credentials:'omit',cache:'no-store',headers:{Accept:'application/vnd.github.star+json'},signal:controller.signal});
        if (!response.ok) throw new Error(response.status===403 || response.status===429 ? `GitHub API 제한 또는 접근 오류 (${response.status}). 잠시 후 재시도하세요.` : `GitHub 응답 오류 (${response.status})`);
        rows = await response.json();
      } finally {clearTimeout(timer);}
      if (!Array.isArray(rows) || rows.length>100) throw new Error('GitHub 페이지 형식 오류');
      pages.push({page,count:rows.length,url});
      if (!rows.length) return {repositories,pages,collected_at:new Date().toISOString()};
      for (const row of rows) {
        const api = row.repo || row;
        if (api.private !== false || !NAME.test(api.full_name)) throw new Error('비공개 또는 잘못된 응답: 갱신 취소');
        const id = api.full_name.toLowerCase();
        if (seen.has(id)) throw new Error('페이지 사이 중복 감지: 목록이 바뀌었을 수 있습니다. 다시 갱신하세요.');
        seen.add(id);
        repositories.push({api,starred_at:row.repo ? date(row.starred_at,'starred_at',true) : null});
      }
    }
    throw new Error('페이지 한도 초과: 부분 목록은 저장하지 않습니다.');
    } catch(e) {e.partial={pages:pages.length,count:repositories.length};throw e;}
  }
  function validateTags(tags){if(!Array.isArray(tags)||tags.length>20)throw new Error('개인 태그는 최대 20개입니다.');return [...new Set(tags.map(t=>text(t,60,'user_tag').trim()).filter(Boolean))];}
  function mergeSaved(current, incoming, canonicalRepos) {
    const merged=Object.assign(Object.create(null),current);
    const canonical=new Map(canonicalRepos.map(r=>[key(r.id),r]));
    for(const e of incoming){const id=key(e.repo.id),old=merged[id];merged[id]={repo:canonical.get(id)||e.repo,note:old?.note || e.note || '',user_tags:validateTags([...(old?.user_tags||[]),...(e.user_tags||[])].slice(0,20)),saved:true,saved_at:old?.saved_at || e.saved_at};}
    if(Object.keys(merged).length>MAX_RECORDS)throw new Error('기기 모음은 최대 10,000개입니다.');return merged;
  }
  async function fetchPublicRepo(fetchImpl,name){const id=parseRepoInput(name),url='https://api.github.com/repos/'+id;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetchImpl(url,{method:'GET',credentials:'omit',cache:'no-store',headers:{Accept:'application/vnd.github+json'},signal:controller.signal});if(!r.ok)throw new Error(r.status===404?'공개 저장소 없음 · 비공개 항목은 수집하지 않습니다.':r.status===403||r.status===429?'API 제한/접근 오류 ('+r.status+')':'API 오류 ('+r.status+')');return validateRepo(normalizeRepo(await r.json(),null,new Date().toISOString(),{},'local'));}finally{clearTimeout(timer);}}
  return {safeURL,repoURL,licenseLabel,normalizeRepo,validateRepo,validateSnapshot,select,parseImport,validateImport,collectStars,MAX_IMPORT_BYTES,MAX_RECORDS,key,parseRepoInput,parseRepoList,validateTags,mergeSaved,fetchPublicRepo};
});
