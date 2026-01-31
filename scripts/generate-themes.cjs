const fs = require("fs");
const path = require("path");

const registry = require("../tweakcn-registry.json");

const outputDir = path.join(__dirname, "../src/styles/themes");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Variables that should be output directly (not wrapped in color function)
const directVars = [
  "radius",
  "font-sans",
  "font-mono",
  "font-serif",
  "shadow-color",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
  "letter-spacing",
  "spacing",
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
  "tracking-normal",
  "tracking-tighter",
  "tracking-tight",
  "tracking-wide",
  "tracking-wider",
  "tracking-widest",
];

function generateCssVars(vars) {
  return Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

// Generate themes config for TypeScript
const themesConfig = [];

// Generate CSS for each theme
for (const theme of registry.items) {
  const { name, title, cssVars } = theme;

  if (!cssVars || !cssVars.light || !cssVars.dark) {
    console.warn(`Skipping ${name}: missing light/dark variants`);
    continue;
  }

  // Add to themes config
  themesConfig.push({
    name,
    title,
    primaryLight: cssVars.light.primary || "oklch(0.5 0.2 260)",
    primaryDark: cssVars.dark.primary || "oklch(0.6 0.2 260)",
    fontSans:
      cssVars.light["font-sans"] ||
      cssVars.theme?.["font-sans"] ||
      "Inter, sans-serif",
  });

  // Generate CSS file
  const css = `/* ${title} Theme - Auto-generated from tweakcn */

/* Light mode */
[data-theme="${name}-light"] {
${generateCssVars(cssVars.light)}
}

/* Dark mode */
[data-theme="${name}-dark"] {
${generateCssVars(cssVars.dark)}
}
`;

  fs.writeFileSync(path.join(outputDir, `${name}.css`), css);
  console.log(`Generated: ${name}.css`);
}

// Generate index.css that imports all themes
const indexCss = registry.items
  .filter((t) => t.cssVars?.light && t.cssVars?.dark)
  .map((t) => `@import "./${t.name}.css";`)
  .join("\n");

fs.writeFileSync(path.join(outputDir, "index.css"), indexCss);
console.log("Generated: index.css");

// Generate TypeScript config
const tsConfig = `// Auto-generated theme configuration from tweakcn
export interface ThemeConfig {
  name: string;
  title: string;
  primaryLight: string;
  primaryDark: string;
  fontSans: string;
}

export const themes: ThemeConfig[] = ${JSON.stringify(themesConfig, null, 2)};

// Sort themes alphabetically by title
export const sortedThemes = [...themes].sort((a, b) => a.title.localeCompare(b.title));

export const themeNames = themes.map(t => t.name);

// Generate all theme values for next-themes (name-light and name-dark variants)
export const allThemeValues = themes.flatMap(t => [\`\${t.name}-light\`, \`\${t.name}-dark\`]);
`;

fs.writeFileSync(path.join(__dirname, "../src/lib/themes-config.ts"), tsConfig);
console.log("Generated: themes-config.ts");

console.log(`\nTotal themes: ${themesConfig.length}`);
