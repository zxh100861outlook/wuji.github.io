const contentEl = document.getElementById('content');
const mainEl    = document.getElementById('main');

// ── 从标题文字生成锚点 id（与 marked 默认行为一致）──
function slugify(text) {
  return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
}

// ── 根据渲染后的内容生成页内目录 ──
function buildTOC() {
  const headings = contentEl.querySelectorAll('h2, h3');
  if (headings.length < 2) return;

  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.innerHTML = '<strong>目录</strong>';
  const ul = document.createElement('ul');

  headings.forEach(h => {
    // 确保标题有 id
    if (!h.id) h.id = slugify(h.textContent);
    const li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : '';
    li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
    ul.appendChild(li);
  });

  toc.appendChild(ul);
  contentEl.insertBefore(toc, contentEl.firstChild);
}

// ── 加载并渲染 md 文件 ──
async function loadDoc(file, anchor) {
  contentEl.innerHTML = '<p style="color:#888;text-align:center;">加载中...</p>';
  hideSidebar();

  try {
    const res = await fetch('docs/' + file);
    if (!res.ok) throw new Error('文件未找到');
    const md = await res.text();
    contentEl.innerHTML = marked.parse(md);
    buildTOC();

    if (anchor) {
      // 等 DOM 稳定后跳转
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (e) {
    contentEl.innerHTML = `<p style="color:#a05050;">无法加载文档：${e.message}</p>`;
  }
}

// ── 加载文章侧边栏 ──
async function loadArticles(anchor) {
  try {
    const res = await fetch('docs/articles.json');
    const list = await res.json();

    // 构建两栏布局（避免重复创建）
    if (!mainEl.querySelector('.two-col')) {
      mainEl.innerHTML = '';
      const sidebar = document.createElement('aside');
      sidebar.className = 'sidebar';
      sidebar.innerHTML = '<strong class="sidebar-title">文章列表</strong>';

      const ul = document.createElement('ul');
      list.forEach(item => {
        const li = document.createElement('li');
        // 侧边栏链接同时更新 hash，方便分享
        li.innerHTML = `<a href="#" onclick="navigate('${item.file}','${item.anchor}');return false;">${item.title}</a>`;
        ul.appendChild(li);
      });
      sidebar.appendChild(ul);

      const wrapper = document.createElement('div');
      wrapper.className = 'two-col';
      wrapper.appendChild(sidebar);
      wrapper.appendChild(contentEl);
      mainEl.appendChild(wrapper);
    }

    loadDoc('articles.md', anchor);
  } catch (e) {
    loadDoc('articles.md', anchor);
  }
}

// ── 离开文章页时恢复单栏 ──
function hideSidebar() {
  if (!mainEl.querySelector('.two-col')) return;
  mainEl.innerHTML = '';
  mainEl.appendChild(contentEl);
}

function toggleMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}

// ── 导航函数：更新 hash 并直接加载 ──
function navigate(file, anchor) {
  console.log('[navigate]', file, anchor);
  const hash = anchor ? `${file}/${anchor}` : file;
  history.pushState(null, '', '#' + hash);
  if (file === 'articles.md') {
    loadArticles(anchor);
  } else {
    loadDoc(file, anchor);
  }
}

// ── 解析 URL hash 决定初始页面 ──
function loadFromHash() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (!hash) { loadDoc('home.md'); return; }

  const slashIdx = hash.indexOf('/');
  const file   = slashIdx === -1 ? hash : hash.slice(0, slashIdx);
  const anchor = slashIdx === -1 ? null  : hash.slice(slashIdx + 1);

  // 纯锚点（无 .md）：如果页面已有内容就滚动，否则当作文章锚点加载
  if (!file.endsWith('.md')) {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 页面还没内容，先加载文章再跳锚点
      loadArticles(hash);
    }
    return;
  }

  if (file === 'articles.md') {
    loadArticles(anchor);
  } else {
    loadDoc(file, anchor);
  }
}

// 监听 hash 变化（浏览器前进/后退）
window.addEventListener('hashchange', loadFromHash);

// 初始加载
loadFromHash();
