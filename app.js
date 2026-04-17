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
async function loadArticles() {
  try {
    const res = await fetch('docs/articles.json');
    const list = await res.json();

    // 构建两栏布局
    mainEl.innerHTML = '';
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = '<strong class="sidebar-title">文章列表</strong>';

    const ul = document.createElement('ul');
    list.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" onclick="loadDoc('${item.file}','${item.anchor}');return false;">${item.title}</a>`;
      ul.appendChild(li);
    });
    sidebar.appendChild(ul);

    const wrapper = document.createElement('div');
    wrapper.className = 'two-col';
    wrapper.appendChild(sidebar);
    wrapper.appendChild(contentEl);
    mainEl.appendChild(wrapper);

    // 默认加载整篇文章
    loadDoc('articles.md');
  } catch (e) {
    loadDoc('articles.md');
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

// 默认加载首页
loadDoc('home.md');
