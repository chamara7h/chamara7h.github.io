/* Website-only enhancements. Quarto owns navigation, listings, and rendering. */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('wes-site') || document.querySelector('.reveal')) return;

  const main = document.querySelector('main#quarto-document-content');
  if (!main) return;
  if (!main.querySelector('.hero, .about-page, .page-intro')) {
    main.classList.add('detail-page');
  }

  // Preserve the document TOC in a compact, keyboard-accessible disclosure.
  const toc = document.querySelector('#quarto-margin-sidebar #TOC');
  if (toc) {
    const disclosure = document.createElement('details');
    disclosure.className = 'article-toc';
    const summary = document.createElement('summary');
    summary.textContent = 'On this page';
    disclosure.append(summary, toc);
    const heading = main.querySelector(':scope > .hero-section, :scope > #title-block-header');
    if (heading) heading.after(disclosure);
    else main.prepend(disclosure);
    const sidebar = document.querySelector('#quarto-margin-sidebar');
    if (sidebar) sidebar.remove();
  }

  // Enhance native List.js filtering, including existing category links.
  for (const [id, list] of Object.entries(window['quarto-listings'] || {})) {
    const listing = document.getElementById(id);
    const controls = listing?.querySelector('.listing-actions-group');
    if (!controls) continue;
    const search = controls.querySelector('input.search');
    if (search) {
      search.placeholder = 'Search titles or descriptions';
      search.setAttribute('aria-label', 'Search this collection');
    }
    const categories = [...new Set(list.items.flatMap(item =>
      [...item.elm.querySelectorAll('.listing-category')].map(el => el.textContent.trim())
    ))].sort();
    const select = document.createElement('select');
    select.className = 'form-select listing-topic-filter';
    select.setAttribute('aria-label', 'Filter by topic');
    select.add(new Option('All topics', ''));
    categories.forEach(category => select.add(new Option(category, category)));
    controls.append(select);
    const count = document.createElement('span');
    count.className = 'listing-result-count';
    count.setAttribute('role', 'status');
    controls.append(count);
    const update = () => {
      const n = list.matchingItems.length;
      count.textContent = `${n} ${n === 1 ? 'item' : 'items'}`;
    };
    list.on('updated', update);
    if (search) search.addEventListener('input', () => list.search(search.value));
    const filterCategory = () => {
      if (!select.value) list.filter();
      else list.filter(item => [...item.elm.querySelectorAll('.listing-category')]
        .some(el => el.textContent.trim() === select.value));
      update();
    };
    select.addEventListener('change', filterCategory);
    listing.addEventListener('click', event => {
      const category = event.target.closest('.listing-category');
      if (!category) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      select.value = category.textContent.trim();
      filterCategory();
    }, true);
    update();
  }

  if (document.getElementById('field')) {
    const script = document.createElement('script');
    // Resolve relative to this script for root and subdirectory hosting alike.
    const ownScript = [...document.scripts].find(s => /\/assets\/site\.js(?:\?|$)/.test(s.src));
    script.src = new URL('forecast-field.js', ownScript.src).href;
    document.body.append(script);
  }
});
