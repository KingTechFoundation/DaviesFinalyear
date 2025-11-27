
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(targetDir);
let fixedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Regex to match imports like: from "package@1.2.3" or from 'package@1.2.3'
    // It captures the package name before the @version
    // We need to be careful not to match scoped packages like @radix-ui/react-slot correctly.
    // The pattern seems to be: anything followed by @version at the end of the string inside quotes.

    // Example: "sonner@2.0.3" -> "sonner"
    // Example: "@radix-ui/react-slot@1.1.2" -> "@radix-ui/react-slot"

    const regex = /from\s+['"]([^'"]+)@\d+\.\d+\.\d+['"]/g;

    if (regex.test(content)) {
        const newContent = content.replace(regex, (match, packageName) => {
            return `from "${packageName}"`;
        });

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`Fixed: ${file}`);
            fixedCount++;
        }
    }
});

console.log(`Finished. Fixed ${fixedCount} files.`);
