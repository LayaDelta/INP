const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'public', 'js', 'main.js');
const destPath = path.join(__dirname, 'public', 'js', 'admin.js');

let content = fs.readFileSync(srcPath, 'utf8');

content = content.replace(/const btnEs = document.getElementById\('lang-es'\);/g, 
  "const btnEs = document.getElementById('lang-es');\n  const logoutBtn = document.getElementById('logout-btn');\n  if (logoutBtn) {\n    logoutBtn.addEventListener('click', () => {\n      localStorage.removeItem('inp_token');\n      localStorage.removeItem('inp_user');\n      window.location.href = '/auth.html';\n    });\n  }");

content = content.replace(/headers: \{[\s\n]*'Content-Type': 'application\/json'[\s\n]*\}/g, 
  "headers: {\n          'Content-Type': 'application/json',\n          'Authorization': 'Bearer ' + localStorage.getItem('inp_token')\n        }");

content = content.replace(/method: 'DELETE'\n      \}\);/g, 
  "method: 'DELETE',\n        headers: {\n          'Authorization': 'Bearer ' + localStorage.getItem('inp_token')\n        }\n      });");

fs.writeFileSync(destPath, content);
console.log('admin.js created successfully');
