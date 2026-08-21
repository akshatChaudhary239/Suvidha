
const fs = require("fs");
const path = require("path");
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("\"use client\"")) {
        let lines = content.split("\n");
        let useClientIndex = lines.findIndex(l => l.trim() === "\"use client\";");
        let importApiUrlIndex = lines.findIndex(l => l.includes("import { API_URL }"));
        
        if (useClientIndex > 0 && importApiUrlIndex >= 0 && importApiUrlIndex < useClientIndex) {
          lines.splice(useClientIndex, 1);
          lines.unshift("\"use client\";");
          fs.writeFileSync(fullPath, lines.join("\n"));
          console.log("Fixed", fullPath);
        }
      }
    }
  }
}
walk(path.join("apps", "web", "src"));

