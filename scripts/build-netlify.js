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

const apiUrl = process.env.VITE_API_URL || process.env.REACT_APP_BACKEND_URL || 'https://multiport-backend-gutv.onrender.com';
if (apiUrl) {
  const bundlePath = path.join(dist, 'static.js', 'bundle.js');
  let bundle = fs
    .readFileSync(bundlePath, 'utf8')
    .replaceAll('https://multivista.preview.emergentagent.com', apiUrl.replace(/\/$/, ''));

  bundle = bundle
    .replaceAll("const EMERGENT_AUTH_URL = 'https://auth.emergentagent.com';", "const EMERGENT_AUTH_URL = '';")
    .replace(
      /const handleLogin = \(\) => \{[\s\S]*?\r?\n  \};\r?\n  const modules =/,
      "const handleLogin = () => {\n    window.dispatchEvent(new Event('multivista:open-auth'));\n  };\n  const modules =",
    )
    .replaceAll('children: "Login with Google"', 'children: "Sign In"')
    .replaceAll('children: user.name', 'children: user.name || user.email')
    .replace(
      /const checkAuth = async \(\) => \{[\s\S]*?\n  const processSession = async sessionId => \{/,
      "const checkAuth = async () => {\n    const token = window.localStorage.getItem('multivista_auth_token');\n    if (!token) {\n      setLoading(false);\n      return;\n    }\n    try {\n      axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].defaults.headers.common.Authorization = `Bearer ${token}`;\n      const response = await axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get(`${API}/auth/me`, {\n        headers: { Authorization: `Bearer ${token}` }\n      });\n      setUser(response.data.user);\n    } catch (error) {\n      window.localStorage.removeItem('multivista_auth_token');\n      delete axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].defaults.headers.common.Authorization;\n      console.log('Not authenticated');\n    } finally {\n      setLoading(false);\n    }\n  };\n  const processSession = async sessionId => {",
    )
    .replace(
      /const logout = async \(\) => \{[\s\S]*?\r?\n  \};\r?\n  if \(loading\) \{/,
      "const logout = async () => {\n    window.localStorage.removeItem('multivista_auth_token');\n    delete axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].defaults.headers.common.Authorization;\n    setUser(null);\n  };\n  if (loading) {",
    )
    .replace(
      /const profileId = response\.data\.id;\r?\n\s+sonner__WEBPACK_IMPORTED_MODULE_15__\.toast\.success\('Profile created! Please complete payment to activate\.'\);\r?\n\r?\n\s+\/\/ Step 2: Create payment order/,
      "const profileId = response.data.id || response.data.data?.id;\n      sonner__WEBPACK_IMPORTED_MODULE_15__.toast.success('Profile created!');\n      if (!Razorpay || RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID') {\n        navigate('/matrimonial');\n        return;\n      }\n\n      // Step 2: Create payment order",
    );

  fs.writeFileSync(bundlePath, bundle);

  const htmlPath = path.join(dist, 'index.html');
  const html = fs
    .readFileSync(htmlPath, 'utf8')
    .replace(/const apiUrl = ['"][^'"]*['"];/, `const apiUrl = '${apiUrl.replace(/\/$/, '')}';`);
  fs.writeFileSync(htmlPath, html);

  console.log(`Configured frontend API URL: ${apiUrl}`);
} else {
  console.warn('VITE_API_URL/REACT_APP_BACKEND_URL is not set; bundle API URL was not changed.');
}

console.log('Built Netlify static site in dist');
