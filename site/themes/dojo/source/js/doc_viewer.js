webpackJsonp([0],{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var MarkdownIt = __webpack_require__(33);
var hljs = __webpack_require__(9);
var h = __webpack_require__(5);
var docs_1 = __webpack_require__(2);
var hash_1 = __webpack_require__(3);
hljs.registerLanguage('html', __webpack_require__(89));
hljs.registerLanguage('nginx', __webpack_require__(90));
hljs.registerLanguage('javascript', __webpack_require__(19));
hljs.registerLanguage('typescript', __webpack_require__(20));
function createGitHubLink(id, page) {
    var docSet = docs_1.getDocSet(id);
    var url = docs_1.getProjectUrl(id.project);
    return h('a.source-link', {
        title: 'View page source',
        href: url + "/blob/" + docSet.branch + "/" + page
    });
}
exports.createGitHubLink = createGitHubLink;
function createLinkItem(content, id) {
    var text;
    var classes = [];
    if (typeof content === 'string') {
        text = content;
    }
    else {
        text = content.textContent;
        for (var i = 0; i < content.classList.length; i++) {
            classes.push(content.classList[i]);
        }
    }
    return h('li', {}, h('a', {
        href: hash_1.createHash(id),
        title: text,
        className: classes.join(' ')
    }, h('span', {}, text)));
}
exports.createLinkItem = createLinkItem;
function addHeadingIcons(heading) {
    var existing = heading.querySelector('.heading-icons');
    if (existing != null) {
        return existing.childNodes[1];
    }
    var container = h('span.heading-icons', {}, [h('span'), h('span')]);
    var icons = container.childNodes[1];
    var content = heading.textContent;
    heading.textContent = '';
    heading.appendChild(document.createTextNode(content));
    heading.appendChild(container);
    heading.classList.add('has-heading-icons');
    return icons;
}
exports.addHeadingIcons = addHeadingIcons;
function createSlugifier() {
    var cache = Object.create(null);
    return function (str) {
        var slug = str
            .toLowerCase()
            .replace(/[^A-Za-z0-9_ ]/g, '')
            .replace(/\s+/g, '-');
        if (cache[slug]) {
            var i = 1;
            var next = slug + "-" + i;
            while (cache[next]) {
                i++;
                next = slug + "-" + i;
            }
            slug = next;
        }
        cache[slug] = true;
        return slug;
    };
}
exports.createSlugifier = createSlugifier;
function renderMarkdown(text, context) {
    if (!markdown) {
        markdown = new MarkdownIt({
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return ('<pre><code class="hljs language-' +
                            lang +
                            '">' +
                            hljs.highlight(lang, str, true).value +
                            '</code></pre>');
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
                return '<pre><code class="hljs">' + str + '</code></pre>';
            },
            html: true
        });
        markdown.renderer.rules.table_open = function () {
            return '<table class="table is-bordered">';
        };
        markdown.renderer.rules.thead_open = function (tokens, idx) {
            var i = idx + 2;
            var token = tokens[i];
            var empty = true;
            while (token && token.type !== 'tr_close') {
                var token2 = tokens[i + 2];
                if (token.type !== 'th_open' ||
                    !token2 ||
                    token2.type !== 'th_close') {
                    empty = false;
                    break;
                }
                var token1 = tokens[i + 1];
                if (token1.type !== 'inline' || token1.children.length > 0) {
                    empty = false;
                    break;
                }
                i += 3;
                token = tokens[i];
            }
            return "<thead" + (empty ? ' class="is-hidden"' : '') + ">";
        };
        markdown.renderer.rules.blockquote_open = function (tokens, idx) {
            var token = tokens[idx + 2].children[0];
            var warning = '⚠️';
            var info = '💡';
            var deprecated = '👎';
            if (token.content.indexOf(warning) === 0) {
                token.content = token.content
                    .replace(warning, '')
                    .replace(/^\s*/, '');
                return ('<blockquote class="warning"><div>' +
                    '<span class="fa fa-warning" aria-hidden="true">' +
                    '</span></div>');
            }
            else if (token.content.indexOf(info) === 0) {
                token.content = token.content
                    .replace(info, '')
                    .replace(/^\s*/, '');
                return ('<blockquote class="info"><div>' +
                    '<span class="fa fa-lightbulb-o" aria-hidden="true">' +
                    '</span></div>');
            }
            else if (token.content.indexOf(deprecated) === 0) {
                token.content = token.content
                    .replace(deprecated, '')
                    .replace(/^\s*/, '');
                return ('<blockquote class="deprecated"><div>' +
                    '<span class="fa fa-thumbs-o-down" aria-hidden="true">' +
                    '</span></div>');
            }
            return '<blockquote>';
        };
        var defaultLinkRender_1 = markdown.renderer.rules.link_open ||
            (function (tokens, idx, options, _env, self) {
                return self.renderToken(tokens, idx, options);
            });
        markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            var hrefIdx = tokens[idx].attrIndex('href');
            var hrefToken = tokens[idx].attrs[hrefIdx];
            var _a = tslib_1.__read(hrefToken[1].split('#'), 2), file = _a[0], hash = _a[1];
            var docSetId = docs_1.getCurrentDocSetId();
            var _b = env.info, page = _b.page, type = _b.type;
            if (!file) {
                hrefToken[1] = hash_1.createHash(tslib_1.__assign({ page: page,
                    type: type, section: hash }, docSetId));
            }
            else if (!/\/\//.test(file)) {
                if (type !== 'api' || file.indexOf('api:') !== 0) {
                    if (/\.md$/.test(file)) {
                        var cleanFile = file.replace(/^\.\//, '');
                        var pageBase = '';
                        if (page.indexOf('/') !== -1) {
                            pageBase = page.slice(0, page.lastIndexOf('/') + 1);
                        }
                        hrefToken[1] = hash_1.createHash(tslib_1.__assign({ page: pageBase + cleanFile, section: hash, type: type }, docSetId));
                    }
                    else {
                        hrefToken[1] = createGitHubLink(docSetId, file);
                    }
                }
            }
            return defaultLinkRender_1(tokens, idx, options, env, self);
        };
        markdown.renderer.rules.heading_open = function (tokens, idx, _options, env) {
            var token = tokens[idx];
            var content = tokens[idx + 1].content;
            var id = env.slugify(content);
            return "<" + token.tag + " id=\"" + id + "\">";
        };
    }
    if (!context.slugify) {
        context.slugify = context.slugify || createSlugifier();
    }
    return markdown.render(text, context);
}
exports.renderMarkdown = renderMarkdown;
function renderMenu(id, type, maxDepth) {
    if (maxDepth === void 0) { maxDepth = 3; }
    var docSet = docs_1.getDocSet(id);
    var pageNames = type === 'api' ? docSet.apiPages : docSet.pages;
    var cache = type === 'api' ? docSet.apiCache : docSet.pageCache;
    var menu = h('ul.menu-list', { menuDepth: maxDepth });
    try {
        for (var pageNames_1 = tslib_1.__values(pageNames), pageNames_1_1 = pageNames_1.next(); !pageNames_1_1.done; pageNames_1_1 = pageNames_1.next()) {
            var pageName = pageNames_1_1.value;
            var page = cache[pageName];
            var root = void 0;
            try {
                root = createNode(page.element.querySelector('h1'));
            }
            catch (error) {
                root = {
                    level: 1,
                    element: h('li'),
                    children: []
                };
            }
            var headingTags = [];
            for (var i = 2; i <= maxDepth; i++) {
                headingTags.push("h" + i);
            }
            var headings = page.element.querySelectorAll(headingTags.join(','));
            var stack = [[root]];
            var children = void 0;
            for (var i = 0; i < headings.length; i++) {
                var heading = headings[i];
                var newNode = createNode(heading);
                var level = newNode.level;
                if (level === stack[0][0].level) {
                    stack[0].unshift(newNode);
                }
                else if (level > stack[0][0].level) {
                    stack.unshift([newNode]);
                }
                else {
                    while (stack[0][0].level > level) {
                        children = stack.shift().reverse();
                        stack[0][0].children = children;
                    }
                    if (level === stack[0][0].level) {
                        stack[0].unshift(newNode);
                    }
                    else {
                        stack.unshift([newNode]);
                    }
                }
            }
            while (stack.length > 1) {
                children = stack.shift().reverse();
                stack[0][0].children = children;
            }
            var project = id.project, version = id.version;
            var pageId = { project: project, version: version, page: pageName, type: type };
            var li = createLinkItem(page.title, pageId);
            if (root.children.length > 0) {
                li.appendChild(renderSubMenu(root.children, pageId));
            }
            menu.appendChild(li);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (pageNames_1_1 && !pageNames_1_1.done && (_a = pageNames_1.return)) _a.call(pageNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return menu;
    var e_1, _a;
}
exports.renderMenu = renderMenu;
function renderDocPage(text, pageName, id) {
    text = filterGhContent(text);
    var html = renderMarkdown(text, {
        info: { page: pageName, type: docs_1.DocType.docs }
    });
    var element = h('div', { innerHTML: html });
    var h1 = element.querySelector('h1');
    if (!h1) {
        return element;
    }
    var icons = addHeadingIcons(h1);
    var link = createGitHubLink(id, pageName);
    link.classList.add('edit-page');
    icons.appendChild(link);
    element.insertBefore(h1, element.firstChild);
    return element;
}
exports.renderDocPage = renderDocPage;
function renderSubMenu(children, pageId) {
    var ul = h('ul');
    try {
        for (var children_1 = tslib_1.__values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var child = children_1_1.value;
            var heading = child.element;
            var li = createLinkItem(heading, tslib_1.__assign({}, pageId, { section: heading.id }));
            if (child.children.length > 0) {
                li.appendChild(renderSubMenu(child.children, pageId));
            }
            ul.appendChild(li);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return ul;
    var e_2, _a;
}
function createNode(heading) {
    var level = parseInt(heading.tagName.slice(1), 10);
    return { level: level, element: heading, children: [] };
}
function filterGhContent(text) {
    var markers = [
        ['<!-- vim-markdown-toc GFM -->', '<!-- vim-markdown-toc -->'],
        ['<!-- start-github-only -->', '<!-- end-github-only -->']
    ];
    return markers.reduce(function (text, marker) {
        var chunks = [];
        var start = 0;
        var left = text.indexOf(marker[0]);
        var right = 0;
        while (left !== -1) {
            chunks.push(text.slice(start, left));
            right = text.indexOf(marker[1], left);
            if (right === -1) {
                break;
            }
            start = right + marker[1].length;
            left = text.indexOf(marker[0], start);
        }
        if (right !== -1) {
            chunks.push(text.slice(start));
        }
        return chunks.join('');
    }, text);
}
var markdown;


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hash_1 = __webpack_require__(3);
var DocType;
(function (DocType) {
    DocType["api"] = "api";
    DocType["docs"] = "docs";
})(DocType = exports.DocType || (exports.DocType = {}));
function getCurrentPageId(includeSection) {
    if (includeSection === void 0) { includeSection = true; }
    var docSetId = getCurrentDocSetId();
    var _a = hash_1.parseHash(), type = _a.type, page = _a.page, section = _a.section;
    if (!type || !(type in DocType)) {
        throw new Error("Missing or invalid doc type: " + type);
    }
    if (!page) {
        throw new Error('Missing page name');
    }
    var docSet = getDocSet(docSetId);
    var pageNames = type === DocType.api ? docSet.apiPages : docSet.pages;
    if (!pageNames) {
        throw new Error("No pages of type \"" + type + "\"");
    }
    if (pageNames.indexOf(page) === -1) {
        throw new Error("Invalid page: " + page);
    }
    var project = docSetId.project, version = docSetId.version;
    var id = { project: project, version: version, type: type, page: page };
    if (includeSection) {
        id.section = section;
    }
    return id;
}
exports.getCurrentPageId = getCurrentPageId;
function getCurrentDocSetId() {
    var _a = hash_1.parseHash(), project = _a.project, version = _a.version;
    if (!project || !docSets[project]) {
        throw new Error("Missing or invalid project: " + project);
    }
    if (!version) {
        throw new Error("Missing version");
    }
    var projectDocs = docSets[project];
    var realVersion = resolveVersion({ project: project, version: version });
    if (!projectDocs.versions[realVersion]) {
        throw new Error("Invalid version: " + version);
    }
    return { project: project, version: realVersion };
}
exports.getCurrentDocSetId = getCurrentDocSetId;
function getDocSet(id) {
    if (!isValidDocSetId(id)) {
        throw new Error('getDocSet called with invalid ID');
    }
    var project = docSets[id.project];
    var version = resolveVersion(id);
    return project.versions[version];
}
exports.getDocSet = getDocSet;
function getDefaultDocSetId() {
    return {
        project: 'core',
        version: docSets['core'].latest
    };
}
exports.getDefaultDocSetId = getDefaultDocSetId;
function getDefaultPageId(docSetId, type) {
    if (type === void 0) { type = DocType.docs; }
    var docSet = getDocSet(docSetId);
    var project = docSetId.project, version = docSetId.version;
    if (!type || !(type in DocType)) {
        throw new Error("Invalid doc type: " + type);
    }
    var page = type === DocType.api ? docSet.apiPages[0] : docSet.pages[0];
    return { project: project, version: version, page: page, type: type };
}
exports.getDefaultPageId = getDefaultPageId;
function getDocVersionUrl(id) {
    if (!isValidDocSetId(id)) {
        throw new Error('Invalid docSet');
    }
    var projectDocs = docSets[id.project];
    var version = resolveVersion(id);
    var dv = projectDocs.versions[version];
    if (dv.url) {
        return dv.url;
    }
    return projectDocs.url + "/tree/" + dv.branch;
}
exports.getDocVersionUrl = getDocVersionUrl;
function getDocBaseUrl(id) {
    if (!isValidDocSetId(id)) {
        throw new Error('Invalid docSet');
    }
    var projectDocs = docSets[id.project];
    var version = resolveVersion(id);
    var dv = projectDocs.versions[version];
    if (dv.docBase) {
        return dv.docBase;
    }
    var url = projectDocs.url.replace(/\/\/github\./, '//raw.githubusercontent.');
    return url + "/" + dv.branch + "/";
}
exports.getDocBaseUrl = getDocBaseUrl;
function isValidDocSetId(id) {
    var project = id.project, version = id.version;
    if (!project || !docSets[project]) {
        return false;
    }
    if (!version) {
        return false;
    }
    var realVersion = resolveVersion({ project: project, version: version });
    if (!docSets[project].versions[realVersion]) {
        return false;
    }
    return true;
}
exports.isValidDocSetId = isValidDocSetId;
function isValidPageId(id) {
    if (!isValidDocSetId(id)) {
        return false;
    }
    var _a = id, type = _a.type, page = _a.page;
    if (!type || !(type in DocType)) {
        return false;
    }
    if (!page) {
        return false;
    }
    return true;
}
exports.isValidPageId = isValidPageId;
function getLatestVersion(project) {
    var docSet = docSets[project];
    var version = docSet.latest;
    if (!version) {
        var versions = Object.keys(docSet.versions).sort(compareVersions);
        version = versions[versions.length - 1];
    }
    return version;
}
exports.getLatestVersion = getLatestVersion;
function getNextVersion(project) {
    var docSet = docSets[project];
    var version = docSet.next;
    if (!version) {
        var versions = Object.keys(docSet.versions).sort(compareVersions);
        var latest = getLatestVersion(project);
        var idx = versions.indexOf(latest);
        if (idx !== -1 && versions[idx + 1]) {
            version = versions[idx + 1];
        }
    }
    return version;
}
exports.getNextVersion = getNextVersion;
function getProjects() {
    return Object.keys(docSets);
}
exports.getProjects = getProjects;
function getVersions(project) {
    if (!docSets[project]) {
        throw new Error("Invalid project: " + project);
    }
    return Object.keys(docSets[project].versions).sort(compareVersions);
}
exports.getVersions = getVersions;
function getProjectLogo(project) {
    if (!docSets[project]) {
        throw new Error("Invalid project: " + project);
    }
    return docSets[project].logo;
}
exports.getProjectLogo = getProjectLogo;
function getProjectUrl(project) {
    if (!docSets[project]) {
        throw new Error("Invalid project: " + project);
    }
    return docSets[project].url;
}
exports.getProjectUrl = getProjectUrl;
function resolveVersion(id) {
    if (id.version === 'latest') {
        return getLatestVersion(id.project);
    }
    if (id.version === 'next') {
        return getNextVersion(id.project);
    }
    return id.version;
}
function compareVersions(a, b) {
    var aParts = a.split('.').map(function (part) { return Number(part) || 0; });
    var bParts = b.split('.').map(function (part) { return Number(part) || 0; });
    var length = Math.max(aParts.length, bParts.length);
    for (var i = 0; i < length; i++) {
        var diff = aParts[i] - bParts[i];
        if (diff !== 0) {
            return diff;
        }
    }
    return aParts.length - bParts.length;
}


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(22);
module.exports = __webpack_require__(23);


/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var PromisePolyfill = __webpack_require__(24);
var h = __webpack_require__(5);
var docs_1 = __webpack_require__(2);
var api_1 = __webpack_require__(32);
var markdown_1 = __webpack_require__(10);
var hash_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(91);
var global = window;
if (!global.Promise) {
    global.Promise = PromisePolyfill;
}
var viewer;
var content;
var messageModal;
var ignoreScroll = false;
var scrollState = Object.create(null);
var menuHighlightDelay = 20;
window.addEventListener('hashchange', processHash);
if (!location.hash) {
    hash_1.updateHash(tslib_1.__assign({}, docs_1.getDefaultDocSetId(), { type: docs_1.DocType.docs }));
    processHash();
}
var ready = new Promise(function (resolve) {
    window.addEventListener('load', resolve);
});
ready.then(function () {
    viewer = dom_1.queryExpected('.page-docs');
    content = dom_1.queryExpected('.docs-content');
    messageModal = dom_1.queryExpected('.message-modal');
    dom_1.place(content, function (content) {
        var menuTimer;
        content.addEventListener('scroll', function () {
            var ignoring = ignoreScroll;
            ignoreScroll = false;
            if (ignoring) {
                return;
            }
            if (menuTimer) {
                clearTimeout(menuTimer);
            }
            menuTimer = setTimeout(function () {
                menuTimer = undefined;
                updateHashFromContent();
            }, menuHighlightDelay);
        });
    });
    processHash();
});
function loadDocSet(id) {
    var docSet = docs_1.getDocSet(id);
    if (docSet.ready) {
        return Promise.resolve(docSet);
    }
    showMessage('', '', 'loading');
    var docBase = docs_1.getDocBaseUrl(id);
    var cache = (docSet.pageCache = Object.create(null));
    return fetch(docBase + "README.md")
        .then(function (response) { return response.text(); })
        .then(function (readme) {
        var logo = docs_1.getProjectLogo(id.project);
        renderPage(readme, 'README.md', id, logo);
        var matcher = /^<!--\s+doc-viewer-config\s/m;
        if (matcher.test(readme)) {
            var result = matcher.exec(readme);
            var index = result.index;
            var start = readme.indexOf('{', index);
            var end = readme.indexOf('-->', index);
            var data = readme.slice(start, end).trim();
            return JSON.parse(data);
        }
        return null;
    })
        .then(function (config) {
        if (config) {
            try {
                for (var _a = tslib_1.__values(Object.keys(config)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    var prop = key;
                    docSet[prop] = config[prop];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        var pageNames = (docSet.pages = ['README.md'].concat(docSet.pages || []));
        docSet.ready = Promise.all(pageNames.filter(function (name) { return name !== 'README.md'; }).map(function (name) {
            return fetch(docBase + name)
                .then(function (response) { return response.text(); })
                .then(function (text) { return renderPage(text, name, id); });
        })).then(function () {
            docSet.menu = markdown_1.renderMenu(id, docs_1.DocType.docs);
        });
        if (docSet.api) {
            docSet.apiReady = fetch(docBase + docSet.api)
                .then(function (response) {
                return response.json();
            })
                .then(function (data) {
                api_1.renderApiPages(id, data);
                docSet.apiMenu = markdown_1.renderMenu(id, docs_1.DocType.api, 4);
            });
        }
        return docSet;
        var e_1, _c;
    });
    function renderPage(text, name, id, logo) {
        return ready.then(function () {
            var element = markdown_1.renderDocPage(text, name, id);
            var h1 = element.querySelector('h1');
            var title = (h1 && h1.textContent) || id.project;
            if (logo && h1) {
                var logoImg = h('img.logo', { src: logo });
                h1.insertBefore(logoImg, h1.firstChild);
            }
            cache[name] = { name: name, element: element, title: title };
        });
    }
}
function showPage(type, name, section) {
    var docSet = docs_1.getDocSet(docs_1.getCurrentDocSetId());
    var page = getPage(docSet, type, name);
    dom_1.place(dom_1.queryExpected('.docs-content', document.body), function (content) {
        if (content.children.length > 0) {
            content.removeChild(content.children[0]);
        }
        content.appendChild(page.element);
        ignoreScroll = true;
        if (section) {
            var header = document.querySelector("#" + section);
            if (header) {
                header.scrollIntoView();
            }
        }
        else {
            content.scrollTop = 0;
        }
    });
}
function getPage(docSet, type, name) {
    if (!name) {
        var pageNames = type === docs_1.DocType.api ? docSet.apiPages : docSet.pages;
        name = pageNames[0];
    }
    return type === docs_1.DocType.api
        ? docSet.apiCache[name]
        : docSet.pageCache[name];
}
function showMenu(type) {
    type = type || docs_1.DocType.docs;
    var docSet = docs_1.getDocSet(docs_1.getCurrentDocSetId());
    var menu = dom_1.queryExpected('.docs-menu .menu');
    dom_1.place(menu, function (menu) {
        var menuList = menu.querySelector('.menu-list');
        if (menuList) {
            menu.removeChild(menuList);
        }
        var docMenu = type === docs_1.DocType.api ? docSet.apiMenu : docSet.menu;
        menu.appendChild(docMenu);
    });
}
function processHash() {
    try {
        var docSetId_1 = docs_1.getCurrentDocSetId();
        loadDocSet(docSetId_1)
            .then(function (docSet) {
            var type = hash_1.parseHash().type;
            var ready = type === docs_1.DocType.api ? docSet.apiReady : docSet.ready;
            ready
                .then(function () {
                var pageId = docs_1.getCurrentPageId();
                var project = pageId.project, version = pageId.version, type = pageId.type, page = pageId.page, section = pageId.section;
                if (viewer) {
                    viewer.setAttribute('data-doc-type', type);
                }
                else {
                    console.warn('missing .viewer');
                }
                var container = document.querySelector('.docs-content');
                if (container) {
                    container.setAttribute('data-doc-project', project);
                    container.setAttribute('data-doc-version', version);
                }
                else {
                    console.warn('missing .docs-content');
                }
                showMenu(type);
                showPage(type, page, section);
                hideMessage();
            })
                .catch(function (error) {
                var _a = hash_1.parseHash(), type = _a.type, page = _a.page;
                if (page) {
                    throw error;
                }
                hash_1.updateHash(hash_1.createHash(docs_1.getDefaultPageId(docSetId_1, type || docs_1.DocType.docs)), hash_1.HashEvent.rename);
                processHash();
            })
                .catch(function (error) {
                var type = hash_1.parseHash().type;
                type = type in docs_1.DocType ? type : docs_1.DocType.docs;
                var newHash = hash_1.createHash(tslib_1.__assign({}, docSetId_1, { type: type }));
                showError(error, newHash);
            });
        })
            .catch(function (error) {
            var newHash = hash_1.createHash(tslib_1.__assign({}, docSetId_1, { type: docs_1.DocType.docs }));
            showError(error, newHash);
        });
    }
    catch (error) {
        if (!location.hash.slice(1)) {
            hash_1.updateHash(hash_1.createHash(tslib_1.__assign({}, docs_1.getDefaultDocSetId(), { type: docs_1.DocType.docs })), hash_1.HashEvent.rename);
            processHash();
        }
        else {
            var project = hash_1.parseHash().project;
            if (docs_1.getProjects().indexOf(project) !== -1) {
                var version = docs_1.getLatestVersion(project);
                hash_1.updateHash(hash_1.createHash({ project: project, version: version, type: docs_1.DocType.docs }), hash_1.HashEvent.rename);
                processHash();
            }
            else {
                showError(error);
            }
        }
    }
    function showError(error, newHash) {
        console.error(error);
        showMessage('Oops...', h('span', {}, [
            'The URL hash ',
            h('code', {}, location.hash),
            " isn't valid. Click ",
            h('a', { href: "" + (newHash || '#') }, 'here'),
            ' to open the default doc set.'
        ]), 'error');
    }
}
function showMessage(heading, message, type) {
    if (type === void 0) { type = ''; }
    if (!messageModal) {
        return console.warn("missing .message-modal. Message: " + message);
    }
    var messageHeadingNode = messageModal.querySelector('.message-heading');
    var content = messageModal.querySelector('.message-content');
    if (!messageHeadingNode) {
        return console.warn('missing .message-heading');
    }
    if (!content) {
        return console.warn('missing .message-content');
    }
    messageHeadingNode.textContent = heading;
    content.innerHTML = '';
    if (typeof message === 'string') {
        content.textContent = message;
    }
    else {
        content.appendChild(message);
    }
    messageModal.classList.add('is-active');
    messageModal.setAttribute('data-message-type', type);
}
function hideMessage() {
    dom_1.place(messageModal, function (messageModal) {
        messageModal.classList.remove('is-active');
    });
}
function updateHashFromContent() {
    var pageId = docs_1.getCurrentPageId(false);
    var pageHash = hash_1.createHash(pageId);
    if (pageHash !== scrollState.pageHash) {
        var content_1 = document.querySelector('.docs-content');
        var menu = document.querySelector('.docs-menu .menu-list');
        var depth = menu.menuDepth || 3;
        var tags = [];
        for (var i = 1; i < depth; i++) {
            tags.push("h" + (i + 1));
        }
        scrollState.pageHash = pageHash;
        scrollState.headings = content_1.querySelectorAll(tags.join(','));
    }
    var viewportTop = content.offsetTop + content.scrollTop;
    var headings = scrollState.headings;
    var above;
    for (var i = 1; i < headings.length; i++) {
        var heading = headings[i];
        var headingTop = getOffsetTop(heading);
        if (headingTop > viewportTop) {
            above = headings[i - 1];
            break;
        }
    }
    if (!above) {
        above = headings[headings.length - 1];
    }
    hash_1.updateHash({
        project: pageId.project,
        version: pageId.version,
        type: viewer.getAttribute('data-doc-type'),
        page: pageId.page,
        section: above.id
    }, hash_1.HashEvent.scroll);
    function getOffsetTop(element) {
        var top = element.offsetTop;
        while ((element = element.offsetParent) &&
            element !== content) {
            top += element.offsetTop;
        }
        return top;
    }
}


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var docs_1 = __webpack_require__(2);
function createHash(id) {
    var parts = [id.project, id.version, id.type];
    if (docs_1.isValidPageId(id)) {
        parts.push(id.page);
        if (id.section) {
            parts.push(id.section);
        }
    }
    return '#' + parts.map(encodeURIComponent).join('/');
}
exports.createHash = createHash;
function parseHash() {
    var hash = location.hash.slice(1);
    var _a = tslib_1.__read(hash
        .split('/')
        .map(function (part) { return decodeURIComponent(part); }), 5), project = _a[0], version = _a[1], type = _a[2], page = _a[3], section = _a[4];
    return { project: project, version: version, type: type, page: page, section: section };
}
exports.parseHash = parseHash;
function updateHash(newHash, event) {
    if (event === void 0) { event = HashEvent.nav; }
    var hash = typeof newHash === 'string' ? newHash : createHash(newHash);
    if (location.hash === hash) {
        return;
    }
    var state = { event: event };
    if (event === HashEvent.rename) {
        history.replaceState(state, '', hash);
    }
    else if (event === HashEvent.nav ||
        (!history.state || history.state.event !== event)) {
        history.pushState(state, '', hash);
    }
    else {
        history.replaceState(state, '', hash);
    }
}
exports.updateHash = updateHash;
var HashEvent;
(function (HashEvent) {
    HashEvent["nav"] = "nav";
    HashEvent["rename"] = "rename";
    HashEvent["scroll"] = "scroll";
})(HashEvent = exports.HashEvent || (exports.HashEvent = {}));


/***/ }),

/***/ 31:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var h = __webpack_require__(5);
var hljs = __webpack_require__(9);
var docs_1 = __webpack_require__(2);
var hash_1 = __webpack_require__(3);
var markdown_1 = __webpack_require__(10);
var preferredSignatureWidth = 60;
hljs.registerLanguage('typescript', __webpack_require__(20));
hljs.registerLanguage('javascript', __webpack_require__(19));
function renderApiPages(docSetId, data) {
    var docSet = docs_1.getDocSet(docSetId);
    var pages = (docSet.apiPages = []);
    var cache = (docSet.apiCache = Object.create(null));
    var modules = getExports(data);
    var apiIndex = createApiIndex(data);
    var slugIndex = {};
    var pageIndex = {};
    var linksToResolve = [];
    var nameRefs = Object.create(null);
    try {
        for (var modules_1 = tslib_1.__values(modules), modules_1_1 = modules_1.next(); !modules_1_1.done; modules_1_1 = modules_1.next()) {
            var module_1 = modules_1_1.value;
            if (getExports(module_1).length === 0 && !hasComment(module_1)) {
                continue;
            }
            var renderHeading = getHeadingRenderer(markdown_1.createSlugifier());
            var name_1 = module_1.name.replace(/^"/, '').replace(/"$/, '');
            pages.push(name_1);
            pageIndex[module_1.id] = name_1;
            var element = h('div');
            var page = (cache[name_1] = { name: name_1, title: name_1, element: element });
            var context = {
                page: page,
                renderHeading: renderHeading,
                api: data,
                apiIndex: apiIndex,
                slugIndex: slugIndex,
                docSetId: docSetId,
                linksToResolve: linksToResolve,
                nameRefs: nameRefs
            };
            renderModule(module_1, 1, context);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (modules_1_1 && !modules_1_1.done && (_a = modules_1.return)) _a.call(modules_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var linksToResolve_1 = tslib_1.__values(linksToResolve), linksToResolve_1_1 = linksToResolve_1.next(); !linksToResolve_1_1.done; linksToResolve_1_1 = linksToResolve_1.next()) {
            var _b = linksToResolve_1_1.value, link = _b.link, id = _b.id;
            var type = apiIndex[id];
            if (id === -1) {
                continue;
            }
            var module_2 = findModule(id, apiIndex);
            if (module_2 === type) {
                link.href = hash_1.createHash(tslib_1.__assign({ page: pageIndex[module_2.id], type: docs_1.DocType.api }, docSetId));
            }
            else {
                link.href = hash_1.createHash(tslib_1.__assign({ page: pageIndex[module_2.id], section: slugIndex[type.id], type: docs_1.DocType.api }, docSetId));
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (linksToResolve_1_1 && !linksToResolve_1_1.done && (_c = linksToResolve_1.return)) _c.call(linksToResolve_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var e_1, _a, e_2, _c;
}
exports.renderApiPages = renderApiPages;
function getContainingModule(reflection) {
    while (reflection && reflection.kindString !== 'External module') {
        reflection = reflection.parent;
    }
    return reflection;
}
function getReflectionIdForName(name, context, _module) {
    var nameRefs = context.nameRefs;
    if (!(name in nameRefs)) {
        var reflection = findReflectionByName(name, context.api);
        nameRefs[name] = reflection ? reflection.id : -1;
    }
    return nameRefs[name];
}
function findReflectionByName(name, reflection) {
    var head = name;
    var dot = head.indexOf('.');
    if (dot !== -1) {
        head = head.slice(0, dot);
    }
    if (isContainerReflection(reflection)) {
        try {
            for (var _a = tslib_1.__values(reflection.children), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                var childName = child.name.replace(/^"|"$/g, '');
                if (childName === head) {
                    if (head !== name) {
                        var tail = name.slice(dot + 1);
                        return findReflectionByName(tail, child);
                    }
                    else {
                        return child;
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return;
    var e_3, _c;
}
function renderModule(module, level, context) {
    var renderHeading = context.renderHeading, slugIndex = context.slugIndex, page = context.page;
    var heading = renderHeading(level, module, context);
    slugIndex[module.id] = heading.id;
    if (hasComment(module)) {
        page.element.appendChild(renderComment(module.comment, module, context));
    }
    var exports = getExports(module);
    var global = exports.filter(function (ex) { return ex.name === '__global'; })[0];
    if (global) {
        renderHeading(level, 'Globals', context);
        try {
            for (var _a = tslib_1.__values(global.children.slice().sort(nameSorter)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                renderProperty(child, level + 1, context);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    var classes = exports
        .filter(function (ex) { return ex.kindString === 'Class'; })
        .sort(nameSorter);
    try {
        for (var classes_1 = tslib_1.__values(classes), classes_1_1 = classes_1.next(); !classes_1_1.done; classes_1_1 = classes_1.next()) {
            var cls = classes_1_1.value;
            renderClass(cls, level + 1, context);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (classes_1_1 && !classes_1_1.done && (_d = classes_1.return)) _d.call(classes_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    var interfaces = exports
        .filter(function (ex) { return ex.kindString === 'Interface'; })
        .sort(nameSorter);
    try {
        for (var interfaces_1 = tslib_1.__values(interfaces), interfaces_1_1 = interfaces_1.next(); !interfaces_1_1.done; interfaces_1_1 = interfaces_1.next()) {
            var iface = interfaces_1_1.value;
            renderInterface(iface, level + 1, context);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (interfaces_1_1 && !interfaces_1_1.done && (_e = interfaces_1.return)) _e.call(interfaces_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    var functions = exports
        .filter(function (ex) { return ex.kindString === 'Function'; })
        .sort(nameSorter);
    try {
        for (var functions_1 = tslib_1.__values(functions), functions_1_1 = functions_1.next(); !functions_1_1.done; functions_1_1 = functions_1.next()) {
            var func = functions_1_1.value;
            renderFunction(func, level + 1, context);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (functions_1_1 && !functions_1_1.done && (_f = functions_1.return)) _f.call(functions_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    var constants = exports
        .filter(function (ex) { return ex.kindString === 'Object literal'; })
        .sort(nameSorter);
    try {
        for (var constants_1 = tslib_1.__values(constants), constants_1_1 = constants_1.next(); !constants_1_1.done; constants_1_1 = constants_1.next()) {
            var constant = constants_1_1.value;
            renderValue(constant, level + 1, context);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (constants_1_1 && !constants_1_1.done && (_g = constants_1.return)) _g.call(constants_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    var e_4, _c, e_5, _d, e_6, _e, e_7, _f, e_8, _g;
}
function renderClass(cls, level, context) {
    var renderHeading = context.renderHeading, slugIndex = context.slugIndex, page = context.page;
    var heading = renderHeading(level, cls, context);
    slugIndex[cls.id] = heading.id;
    var declaration = "class " + cls.name;
    if (isGenericReflection(cls)) {
        var typeParams = cls.typeParameter
            .map(function (param) { return typeParameterToString(param); })
            .join(', ');
        declaration += "<" + typeParams + ">";
    }
    if (cls.extendedTypes) {
        var types = cls.extendedTypes
            .map(function (type) { return typeToString(type); })
            .join(', ');
        declaration += " extends " + types;
    }
    if (cls.implementedTypes) {
        var types = cls.implementedTypes
            .map(function (type) { return typeToString(type); })
            .join(', ');
        declaration += " implements " + types;
    }
    var formatted = formatDeclaration(declaration);
    var html = hljs.highlight('typescript', formatted, true).value;
    context.page.element.appendChild(h('pre', {}, h('code.hljs.lang-typescript', { innerHTML: html })));
    if (hasComment(cls)) {
        page.element.appendChild(renderComment(cls.comment, getContainingModule(cls), context));
    }
    var exports = getExports(cls);
    var properties = exports
        .filter(function (ex) { return ex.kindString === 'Property' || ex.kindString === 'Accessor'; })
        .sort(nameSorter);
    try {
        for (var properties_1 = tslib_1.__values(properties), properties_1_1 = properties_1.next(); !properties_1_1.done; properties_1_1 = properties_1.next()) {
            var property = properties_1_1.value;
            renderProperty(property, level + 1, context);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (properties_1_1 && !properties_1_1.done && (_a = properties_1.return)) _a.call(properties_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    var constructors = exports.filter(function (ex) { return ex.kindString === 'Constructor'; });
    try {
        for (var constructors_1 = tslib_1.__values(constructors), constructors_1_1 = constructors_1.next(); !constructors_1_1.done; constructors_1_1 = constructors_1.next()) {
            var ctor = constructors_1_1.value;
            renderMethod(ctor, level + 1, context);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (constructors_1_1 && !constructors_1_1.done && (_b = constructors_1.return)) _b.call(constructors_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    var methods = exports
        .filter(function (ex) { return ex.kindString === 'Method'; })
        .sort(nameSorter);
    try {
        for (var methods_1 = tslib_1.__values(methods), methods_1_1 = methods_1.next(); !methods_1_1.done; methods_1_1 = methods_1.next()) {
            var method = methods_1_1.value;
            renderMethod(method, level + 1, context);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (methods_1_1 && !methods_1_1.done && (_c = methods_1.return)) _c.call(methods_1);
        }
        finally { if (e_11) throw e_11.error; }
    }
    var e_9, _a, e_10, _b, e_11, _c;
}
function isGenericReflection(type) {
    return type.typeParameter != null;
}
function isContainerReflection(type) {
    return type.children != null;
}
function typeParameterToString(param) {
    if (param.type) {
        return param.name + " extends " + typeToString(param.type);
    }
    else {
        return param.name;
    }
}
function renderMethod(method, level, context) {
    renderFunction(method, level, context);
}
function renderParent(types, relationship, context) {
    try {
        for (var types_1 = tslib_1.__values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
            var type = types_1_1.value;
            var p = h('p.api-metadata', {}, [
                h('span.api-label', {}, relationship + ": ")
            ]);
            p.appendChild(renderType(type, context));
            context.page.element.appendChild(p);
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (types_1_1 && !types_1_1.done && (_a = types_1.return)) _a.call(types_1);
        }
        finally { if (e_12) throw e_12.error; }
    }
    var e_12, _a;
}
function renderInterface(iface, level, context) {
    var renderHeading = context.renderHeading, slugIndex = context.slugIndex, page = context.page;
    var heading = renderHeading(level, iface, context);
    slugIndex[iface.id] = heading.id;
    var declaration = "interface " + iface.name;
    if (isGenericReflection(iface)) {
        var typeParams = iface.typeParameter
            .map(function (param) { return typeParameterToString(param); })
            .join(', ');
        declaration += "<" + typeParams + ">";
    }
    if (iface.extendedTypes) {
        var types = iface.extendedTypes
            .map(function (type) { return typeToString(type); })
            .join(', ');
        declaration += " extends " + types;
    }
    if (iface.implementedTypes) {
        var types = iface.implementedTypes
            .map(function (type) { return typeToString(type); })
            .join(', ');
        declaration += " implements " + types;
    }
    var formatted = formatDeclaration(declaration);
    var html = hljs.highlight('typescript', formatted, true).value;
    context.page.element.appendChild(h('pre', {}, h('code.hljs.lang-typescript', { innerHTML: html })));
    if (hasComment(iface)) {
        page.element.appendChild(renderComment(iface.comment, getContainingModule(iface), context));
    }
    if (iface.indexSignature) {
        renderHeading(level + 1, 'Index signature', context);
        var sig = iface.indexSignature;
        renderSignatures(sig, iface, context);
    }
    if (iface.signatures) {
        renderHeading(level + 1, 'Call signatures', context);
        renderSignatures(iface.signatures, iface, context);
    }
    var exports = getExports(iface);
    var properties = exports
        .filter(function (ex) { return ex.kindString === 'Property'; })
        .sort(nameSorter);
    try {
        for (var properties_2 = tslib_1.__values(properties), properties_2_1 = properties_2.next(); !properties_2_1.done; properties_2_1 = properties_2.next()) {
            var property = properties_2_1.value;
            renderProperty(property, level + 1, context);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (properties_2_1 && !properties_2_1.done && (_a = properties_2.return)) _a.call(properties_2);
        }
        finally { if (e_13) throw e_13.error; }
    }
    var constructors = exports.filter(function (ex) { return ex.kindString === 'Constructor'; });
    try {
        for (var constructors_2 = tslib_1.__values(constructors), constructors_2_1 = constructors_2.next(); !constructors_2_1.done; constructors_2_1 = constructors_2.next()) {
            var ctor = constructors_2_1.value;
            renderMethod(ctor, level + 1, context);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (constructors_2_1 && !constructors_2_1.done && (_b = constructors_2.return)) _b.call(constructors_2);
        }
        finally { if (e_14) throw e_14.error; }
    }
    var methods = exports
        .filter(function (ex) { return ex.kindString === 'Method'; })
        .sort(nameSorter);
    try {
        for (var methods_2 = tslib_1.__values(methods), methods_2_1 = methods_2.next(); !methods_2_1.done; methods_2_1 = methods_2.next()) {
            var method = methods_2_1.value;
            renderMethod(method, level + 1, context);
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (methods_2_1 && !methods_2_1.done && (_c = methods_2.return)) _c.call(methods_2);
        }
        finally { if (e_15) throw e_15.error; }
    }
    var e_13, _a, e_14, _b, e_15, _c;
}
function renderProperty(property, level, context) {
    var page = context.page, renderHeading = context.renderHeading, slugIndex = context.slugIndex;
    var heading = renderHeading(level, property, context);
    slugIndex[property.id] = heading.id;
    if (property.inheritedFrom) {
        renderParent([property.inheritedFrom], Relationship.Inherited, context);
    }
    var typeString;
    var access = { canRead: false, canWrite: false };
    var comment;
    if (property.kindString === 'Accessor') {
        if (property.getSignature) {
            access.canRead = true;
            var sig = property.getSignature[0];
            typeString = typeToString(sig.type);
            if (hasComment(sig)) {
                comment = sig.comment;
            }
        }
        if (property.setSignature) {
            access.canWrite = true;
            var sig = property.setSignature[0];
            if (!typeString) {
                typeString = typeToString(sig.parameters[0].type);
            }
            if (!comment && hasComment(sig)) {
                comment = sig.comment;
            }
        }
    }
    else {
        access.canRead = true;
        access.canWrite = true;
        comment = property.comment;
        typeString = typeToString(property.type);
    }
    var text = property.name + ": " + formatSignature(typeString);
    var codeP = renderCode(text);
    if (!access.canRead) {
        var code = codeP.childNodes[0];
        var tag = h('span.tag.is-primary', {}, 'write only');
        code.insertBefore(tag, code.firstChild);
    }
    else if (!access.canWrite) {
        var code = codeP.childNodes[0];
        var tag = h('span.tag.is-primary', {}, 'read only');
        code.insertBefore(tag, code.firstChild);
    }
    page.element.appendChild(codeP);
    if (comment) {
        page.element.appendChild(renderComment(comment, getContainingModule(property), context));
    }
}
function renderFunction(func, level, context) {
    var renderHeading = context.renderHeading, slugIndex = context.slugIndex, page = context.page;
    var heading = renderHeading(level, func, context);
    slugIndex[func.id] = heading.id;
    renderSignatures(func.signatures, func, context);
    try {
        for (var _a = tslib_1.__values(func.signatures), _b = _a.next(); !_b.done; _b = _a.next()) {
            var signature = _b.value;
            if (hasComment(signature)) {
                page.element.appendChild(renderComment(signature.comment, getContainingModule(func), context));
                break;
            }
        }
    }
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_16) throw e_16.error; }
    }
    var e_16, _c;
}
function renderSignatures(signatures, parent, context) {
    var page = context.page;
    try {
        for (var signatures_1 = tslib_1.__values(signatures), signatures_1_1 = signatures_1.next(); !signatures_1_1.done; signatures_1_1 = signatures_1.next()) {
            var sig = signatures_1_1.value;
            var text = signatureToString(sig);
            var formatted = formatSignature(text);
            var html = hljs.highlight('typescript', formatted, true).value;
            page.element.appendChild(h('pre', {}, [h('code.hljs.lang-typescript', { innerHTML: html })]));
        }
    }
    catch (e_17_1) { e_17 = { error: e_17_1 }; }
    finally {
        try {
            if (signatures_1_1 && !signatures_1_1.done && (_a = signatures_1.return)) _a.call(signatures_1);
        }
        finally { if (e_17) throw e_17.error; }
    }
    var parameters = signatures.reduce(function (params, sig) {
        return params.concat(sig.parameters || []);
    }, []);
    if (parameters.length > 0) {
        renderParameterTable(parameters, parent, context);
    }
    var e_17, _a;
}
function renderParameterTable(parameters, parent, context) {
    var page = context.page;
    var params = parameters.filter(function (param) {
        return hasComment(param) || param.defaultValue;
    });
    if (params.length > 0) {
        var rows = params.map(function (param) {
            var comment;
            if (hasComment(param)) {
                comment = renderComment(param.comment, getContainingModule(parent), context);
            }
            return [param.name, comment || '', param.defaultValue || ''];
        });
        var header = ['Parameter', 'Description', 'Default'];
        if (!rows.some(function (row) { return Boolean(row[2]); })) {
            header.pop();
            rows.forEach(function (row) { return row.pop(); });
        }
        page.element.appendChild(h('p', {}, [createTable(header, rows)]));
    }
}
function renderValue(value, level, context) {
    var page = context.page, renderHeading = context.renderHeading, slugIndex = context.slugIndex;
    var heading = renderHeading(level, value, context);
    slugIndex[value.id] = heading.id;
    if (hasComment(value)) {
        page.element.appendChild(renderComment(value.comment, value, context));
    }
    if (value.kindString === 'Object literal') {
        var parts = value.children.map(function (child) {
            if (child.name) {
                return child.name + ": " + child.defaultValue;
            }
            return child.defaultValue;
        });
        var type = typeToString(value.type);
        var text = value.name + ": " + type + " = {\n\t" + parts.join(',\n\t') + "\n}";
        page.element.appendChild(renderCode(text));
    }
}
function renderComment(comment, module, context) {
    var page = context.page, linksToResolve = context.linksToResolve;
    var element = h('p', { innerHTML: commentToHtml(comment, page.name) });
    var links = element.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf('api:') === 0) {
            var link = links[i];
            var name_2 = link.href.slice('api:'.length);
            var id = getReflectionIdForName(name_2, context, module);
            linksToResolve.push({ link: link, id: id });
        }
    }
    return element;
}
function commentToHtml(comment, pageName) {
    var parts = [];
    if (comment.shortText) {
        parts.push(renderText(comment.shortText, pageName));
    }
    if (comment.text) {
        parts.push(renderText(comment.text, pageName));
    }
    if (comment.returns) {
        var returns = comment.returns[0].toLowerCase() + comment.returns.slice(1);
        parts.push(renderText("Returns " + returns, pageName));
    }
    return parts.join('');
}
function renderText(text, pageName) {
    text = text.replace(/\[\[(.*?)(?:\|(.*?))?]]/g, function (_match, p1, p2) {
        var name = p2 || p1;
        if (!p2 && (p1.indexOf('.') !== -1 || p1.indexOf('/') !== -1)) {
            var lastDot = p1.lastIndexOf('.');
            var lastSlash = p1.lastIndexOf('/');
            name = p1.slice(Math.max(lastDot, lastSlash) + 1);
        }
        if (/^https?:\/\//.test(p1)) {
            return "[" + name + "](" + p1 + ")";
        }
        else {
            return "[" + name + "](api:" + p1 + ")";
        }
    });
    return markdown_1.renderMarkdown(text, {
        info: { page: pageName, type: docs_1.DocType.api }
    });
}
function renderCode(text, language) {
    if (language === void 0) { language = 'typescript'; }
    var html = hljs
        .highlight(language, text, true)
        .value.replace(/\n/g, '<br>')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return h('pre', {}, [h("code.hljs.lang-" + language, { innerHTML: html })]);
}
function createSourceLink(source, context) {
    if (source.fileName[0] === '/') {
        return;
    }
    var link = markdown_1.createGitHubLink({
        project: context.docSetId.project,
        version: context.docSetId.version
    }, "src/" + source.fileName + "#L" + source.line);
    link.title = source.fileName + "#L" + source.line;
    return link;
}
function signatureToString(signature, isParameter) {
    if (isParameter === void 0) { isParameter = false; }
    if (signature.name === '__index') {
        var param = signature.parameters[0];
        return "[" + param.name + ": " + typeToString(param.type) + "]: " + typeToString(signature.type);
    }
    else {
        var name_3 = signature.name;
        if (name_3 === '__call') {
            name_3 = '';
        }
        var text = "" + name_3;
        if (isGenericReflection(signature)) {
            var typeParams = signature.typeParameter
                .map(function (param) { return typeParameterToString(param); })
                .join(', ');
            text += "<" + typeParams + ">";
        }
        text += '(';
        if (signature.parameters) {
            var params = signature.parameters.map(function (param) {
                var optional = param.flags.isOptional ? '?' : '';
                return "" + param.name + optional + ": " + typeToString(param.type);
            });
            text += params.join(', ');
        }
        text += ")";
        if (signature.kindString !== 'Constructor signature') {
            var sep = isParameter ? ' => ' : ': ';
            text += "" + sep + typeToString(signature.type);
        }
        return text;
    }
}
function typeToString(type) {
    if (isStringLiteralType(type)) {
        return "'" + type.value + "'";
    }
    else if (isUnionType(type)) {
        var strings = type.types.map(typeToString);
        return strings.join(' | ');
    }
    else if (isArrayType(type)) {
        return typeToString(type.elementType) + "[]";
    }
    else if (isReflectionType(type)) {
        var d = type.declaration;
        if (d.kindString === 'Type literal') {
            if (d.children) {
                var parts = d.children.map(function (child) {
                    return child.name + ": " + typeToString(child.type || child.kindString);
                });
                return "{ " + parts.join(', ') + " }";
            }
            else if (d.signatures) {
                return signatureToString(d.signatures[0], true);
            }
            else if (d.name === '__type') {
                return '{ ... }';
            }
        }
    }
    else if (isReferenceType(type)) {
        var str = type.name;
        if (type.typeArguments) {
            var args = type.typeArguments.map(function (arg) {
                return typeToString(arg);
            });
            str += "<" + args.join(', ') + ">";
        }
        return str;
    }
    else if (isIntrinsicType(type)) {
        return type.name;
    }
    else if (isTypeParameterType(type)) {
        if (type.constraint) {
            return type.name + "<" + typeToString(type.constraint) + ">";
        }
        else {
            return type.name;
        }
    }
    else if (isUnknownType(type)) {
        return type.name;
    }
    return type.type;
}
function isStringLiteralType(type) {
    return type.type === 'stringLiteral';
}
function isUnionType(type) {
    return type.type === 'union';
}
function isArrayType(type) {
    return type.type === 'array';
}
function isReflectionType(type) {
    return type.type === 'reflection';
}
function isReferenceType(type) {
    return type.type === 'reference';
}
function isIntrinsicType(type) {
    return type.type === 'intrinsic';
}
function isTypeParameterType(type) {
    return type.type === 'typeParameter';
}
function isUnknownType(type) {
    return type.type === 'unknown';
}
function renderType(type, context) {
    if (type.type === 'stringLiteral') {
        return h('span.type-literal', {}, type.value);
    }
    else if (type.type === 'union') {
        return h('span.type-union', {}, type.types.map(renderType));
    }
    else if (type.type === 'array') {
        var node = renderType(type.elementType, context);
        node.classList.add('type-array');
        return node;
    }
    else if (type.type === 'reflection') {
        var d = type.declaration;
        if (d.kindString === 'Type literal') {
            if (d.children) {
                var parts = d.children.map(function (child) {
                    var typeNode = renderType(child.type, context);
                    return h('span', {}, [
                        h('span.type-label', {}, child.name),
                        typeNode
                    ]);
                });
                return h('span.type-list', {}, parts);
            }
            else if (d.signatures) {
                return h('span.type-signature', {
                    innerHTML: signatureToString(d.signatures[0], true)
                });
            }
        }
    }
    var returnType = h('span');
    if (type.type === 'reference' && type.id != null) {
        var link = h('a', {}, type.name);
        returnType.appendChild(link);
        context.linksToResolve.push({
            link: link,
            id: type.id
        });
    }
    else {
        returnType.appendChild(document.createTextNode(type.name));
    }
    if (type.typeArguments) {
        var args = type.typeArguments.map(function (arg) {
            return renderType(arg, context);
        });
        returnType.appendChild(h('span.type-list.type-arg', {}, args));
    }
    return returnType;
}
function findModule(id, index) {
    var declaration = index[id];
    while (declaration && declaration.kindString !== 'External module') {
        declaration = declaration.parent;
    }
    return declaration;
}
function getExports(reflection) {
    if (!reflection.children) {
        return [];
    }
    var exports = [];
    try {
        for (var _a = tslib_1.__values(reflection.children), _b = _a.next(); !_b.done; _b = _a.next()) {
            var child = _b.value;
            if (child.name === '_global') {
                exports.push(child);
            }
            if (child.flags.isExported) {
                var source = child.sources[0].fileName;
                if (!/^_/.test(child.name) && !/node_modules\//.test(source)) {
                    exports.push(child);
                }
            }
        }
    }
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_18) throw e_18.error; }
    }
    return exports;
    var e_18, _c;
}
function getHeadingRenderer(slugify) {
    return function (level, content, context) {
        var classes = [];
        var type;
        if (typeof content !== 'string') {
            type = content.kindString;
        }
        else if (content === 'Call signatures') {
            type = 'Function';
        }
        if (type) {
            classes.push('is-type');
        }
        if (type === 'Method' || type === 'Function') {
            classes.push('is-type-callable');
        }
        else if (type === 'Property' || type === 'Accessor') {
            classes.push('is-type-property');
        }
        else if (type === 'Constructor') {
            classes.push('is-type-constructor');
        }
        else if (type === 'Class') {
            classes.push('is-type-class');
        }
        else if (type === 'Interface') {
            classes.push('is-type-interface');
        }
        else if (type === 'Object literal') {
            classes.push('is-type-value');
        }
        var text = typeof content === 'string'
            ? content
            :
                content.name.replace(/^"|"$/g, '');
        var className = classes.join(' ');
        var heading = h("h" + level, { className: className, id: slugify(text) }, text);
        var sourceLink;
        if (typeof content !== 'string' && content.sources) {
            sourceLink = createSourceLink(content.sources[0], context);
        }
        if (sourceLink) {
            var icons = markdown_1.addHeadingIcons(heading);
            icons.appendChild(sourceLink);
        }
        context.page.element.appendChild(heading);
        return heading;
    };
}
function createTable(headings, rows) {
    return h('table.table.is-bordered', {}, [
        h('thead', {}, [
            h('tr', {}, [headings.map(function (heading) { return h('th', {}, heading); })])
        ]),
        h('tbody', {}, rows.map(function (row) {
            return h('tr', {}, row.map(function (content) {
                if (typeof content === 'string') {
                    return h('td', { innerHTML: content });
                }
                else {
                    return h('td', {}, content);
                }
            }));
        }))
    ]);
}
function hasComment(reflection) {
    var comment = reflection.comment;
    return comment && (comment.text || comment.shortText);
}
function createApiIndex(data) {
    var index = {};
    try {
        for (var _a = tslib_1.__values(data.children), _b = _a.next(); !_b.done; _b = _a.next()) {
            var child = _b.value;
            child.parent = data;
            walkTree(child);
        }
    }
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_19) throw e_19.error; }
    }
    return index;
    function walkTree(data) {
        index[data.id] = data;
        if (data.children) {
            try {
                for (var _a = tslib_1.__values(data.children), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    child.parent = data;
                    walkTree(child);
                }
            }
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_20) throw e_20.error; }
            }
        }
        var e_20, _c;
    }
    var e_19, _c;
}
function nameSorter(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}
function formatDeclaration(text) {
    if (text.length <= preferredSignatureWidth) {
        return text;
    }
    return formatSignature(text);
}
function formatSignature(text) {
    if (text.length <= preferredSignatureWidth) {
        return text;
    }
    var output = [text];
    var input = [];
    var changed = true;
    while (output.some(function (line) { return line.length > preferredSignatureWidth; }) &&
        changed) {
        input = output;
        output = [];
        changed = false;
        var _loop_1 = function () {
            var text_1 = input.shift();
            if (text_1.length <= preferredSignatureWidth) {
                output.push(text_1);
            }
            else {
                var range = findSplitCandidate(text_1);
                if (range) {
                    var indent_1 = getIndent(text_1);
                    output.push(text_1.slice(0, range[0]));
                    output.push.apply(output, tslib_1.__spread(splitList(text_1, range[0], range[1]).map(function (line) {
                        return indent_1 + "    " + line;
                    })));
                    output.push("" + indent_1 + text_1.slice(range[1]));
                    changed = true;
                }
                else {
                    output.push(text_1);
                }
            }
        };
        while (input.length > 0) {
            _loop_1();
        }
    }
    return output.join('\n');
}
function findSplitCandidate(text) {
    var width = 0;
    var best;
    var hasGroups = true;
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var end = i;
        if (char === '(' || char === '{' || char === '<') {
            end = findGroupEnd(text, i + 1);
        }
        if (end > i) {
            hasGroups = true;
            if (canSplit(text, i + 1, end)) {
                if (!best || end - i > width) {
                    if (text[i + 1] === ' ') {
                        best = [i + 2, end - 1];
                    }
                    else {
                        best = [i + 1, end];
                    }
                    width = end - i;
                }
            }
        }
    }
    if (!best && hasGroups) {
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            var end = i;
            if (char === '(' || char === '{' || char === '<') {
                end = findGroupEnd(text, i + 1);
            }
            if (end > i) {
                if (!best || end - i > width) {
                    if (text[i + 1] === ' ') {
                        best = [i + 2, end - 1];
                    }
                    else {
                        best = [i + 1, end];
                    }
                    width = end - i;
                }
            }
        }
    }
    return best;
}
function findGroupEnd(text, start) {
    var depth = 1;
    for (var i = start; i < text.length; i++) {
        var char = text[i];
        if (char === '(' || char === '{' || char === '<') {
            depth++;
        }
        else if (char === ')' ||
            char === '}' ||
            (char === '>' && text[i - 1] !== '=')) {
            depth--;
        }
        if (depth === 0) {
            return i;
        }
    }
    return -1;
}
function canSplit(text, start, end) {
    var depth = 0;
    for (var i = start; i < end; i++) {
        var char = text[i];
        if (char === '(' || char === '{' || char === '<') {
            depth++;
        }
        else if (char === ')' ||
            char === '}' ||
            (char === '>' && text[i - 1] !== '=')) {
            depth--;
        }
        else if (char === ',' && depth === 0) {
            return true;
        }
    }
    return false;
}
function splitList(text, start, end) {
    var depth = 0;
    var partStart = start;
    var parts = [];
    for (var i = start; i < end; i++) {
        var char = text[i];
        if (char === '(' || char === '{' || char === '<') {
            depth++;
        }
        else if (char === ')' ||
            char === '}' ||
            (char === '>' && text[i - 1] !== '=')) {
            depth--;
        }
        else if (char === ',' && depth === 0) {
            parts.push(text.slice(partStart, i + 1));
            partStart = i + 2;
        }
    }
    parts.push(text.slice(partStart, end));
    return parts;
}
function getIndent(text) {
    var textStart = text.search(/\S/);
    if (textStart !== -1) {
        return text.slice(0, textStart);
    }
    return '';
}
var Relationship;
(function (Relationship) {
    Relationship["Extends"] = "Extends";
    Relationship["Inherited"] = "Inherited from";
})(Relationship || (Relationship = {}));


/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function place(node, modifier) {
    if (node) {
        modifier(node);
    }
}
exports.place = place;
function queryExpected(selector, root) {
    if (root === void 0) { root = document; }
    var node = root.querySelector(selector);
    if (!node) {
        console.warn("missing " + selector);
    }
    return node;
}
exports.queryExpected = queryExpected;


/***/ })

},[21]);
//# sourceMappingURL=doc_viewer.js.map