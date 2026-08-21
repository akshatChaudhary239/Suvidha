
const fs = require("fs");
const path = require("path");
const configPath = path.join("apps", "web", "src", "lib", "config.ts");
if (!fs.existsSync(path.dirname(configPath))) fs.mkdirSync(path.dirname(configPath), {recursive: true});
fs.writeFileSync(configPath, "export const API_URL = process.env.NEXT_PUBLIC_API_URL || \"http://localhost:5000\";\n");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("http://localhost:5000")) {
    let relativePath = path.relative(path.dirname(filePath), configPath).replace(/\\/g, "/");
    if (!relativePath.startsWith(".")) relativePath = "./" + relativePath;
    relativePath = relativePath.replace(/\.ts$/, "");
    
    content = "import { API_URL } from \"" + relativePath + "\";\n" + content;
    content = content.replace(/"http:\/\/localhost:5000([^"`]*)"/g, "`\${API_URL}$1`");
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`\${API_URL}$1`");
    
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
  }
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join("apps", "web", "src"));

