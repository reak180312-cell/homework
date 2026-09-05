// Assembles index.html + styles.css + app.js into one self-contained page for hosting.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const html = read('index.html');
const css = read('styles.css');
const js = read('app.js');

// Body content only: the artifact host supplies doctype/html/head/body.
let body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
body = body.replace(/\s*<script src="app\.js"><\/script>\s*/, '\n');

const out = `<title>Homework</title>
<style>
${css.trim()}
</style>
${body.trim()}

<script>
${js.trim()}
</script>
`;

const dest = process.argv[2] || path.join(root, 'homework-web.html');
fs.writeFileSync(dest, out);
console.log(`${dest}  ${(out.length / 1024).toFixed(1)} KB`);
