const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');

function copyRecursive(source, target) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

copyRecursive(path.join(root, 'index.html'), path.join(dist, 'index.html'));
copyRecursive(path.join(root, 'static.js'), path.join(dist, 'static.js'));

const apiUrl = (process.env.VITE_API_URL || process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
const bundlePath = path.join(dist, 'static.js', 'bundle.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

// Replace hardcoded backend URLs
bundle = bundle
  .replaceAll('https://multivista.preview.emergentagent.com', apiUrl)
  .replace(/const BACKEND_URL = "[^"]*";/g, `const BACKEND_URL = "${apiUrl}";`)
  .replaceAll("const EMERGENT_AUTH_URL = 'https://auth.emergentagent.com';", "const EMERGENT_AUTH_URL = '';")
  .replaceAll('children: "Login with Google"', 'children: "Sign In"')
  .replaceAll('children: user.name', 'children: user.name || user.email');

// Patch login button to open custom auth modal
bundle = bundle.replace(
  /const handleLogin = \(\) => \{[\s\S]*?\r?\n  \};\r?\n  const modules =/,
  "const handleLogin = () => {\n    window.dispatchEvent(new Event('multivista:open-auth'));\n  };\n  const modules ="
);

// Inject axios interceptor to attach JWT token to every request
const axiosAnchor = 'var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");';
if (bundle.includes(axiosAnchor) && !bundle.includes('interceptors.request.use')) {
  bundle = bundle.replace(
    axiosAnchor,
    axiosAnchor + '\n' +
    'axios__WEBPACK_IMPORTED_MODULE_2__["default"].interceptors.request.use(function(cfg){' +
    'var t=window.localStorage.getItem("multivista_auth_token");' +
    'if(t){cfg.headers=cfg.headers||{};cfg.headers["Authorization"]="Bearer "+t;}' +
    'return cfg;});'
  );
}

fs.writeFileSync(bundlePath, bundle);

// Patch index.html to use same-origin for auth modal API calls
const htmlPath = path.join(dist, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8')
  .replace(/const apiUrl = [^;]+;/, `const apiUrl = window.location.origin;`);
fs.writeFileSync(htmlPath, html);

console.log(`Built Netlify static site. API URL: ${apiUrl || 'same-origin'}`);
