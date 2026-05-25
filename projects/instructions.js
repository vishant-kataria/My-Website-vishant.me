import { neon } from 'https://esm.sh/@neondatabase/serverless@0.10.4';

const sql = neon('postgresql://neondb_owner:npg_cIa6wvDeZfA2@ep-lingering-fog-aoadhkns-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function loadProject(id) {
  try {
    const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
    return rows[0];
  } catch (err) {
    console.error('Failed to load project:', err);
    return null;
  }
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('loading').textContent = 'Error: No project ID provided.';
    return;
  }

  const project = await loadProject(Number(id));
  
  if (!project) {
    document.getElementById('loading').textContent = 'Error: Project not found.';
    return;
  }

  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  document.getElementById('proj-name').textContent = project.name;

  const rawDriveLink = project.drive_link || "";
  const folderName = project.project_path || "my-project";

  // Extract file ID from any Google Drive URL format and build direct download link
  function getDirectDownloadUrl(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=download&confirm=t&id=${match[1]}`;
    }
    return url; // fallback: use as-is
  }

  const directLink = getDirectDownloadUrl(rawDriveLink);

  const cmd1 = `$dir='C:\\vishants_projects\\${folderName}'; New-Item -ItemType Directory -Force -Path $dir | Out-Null; Invoke-WebRequest -Uri '${directLink}' -OutFile "$dir\\project.zip"; Expand-Archive "$dir\\project.zip" -DestinationPath $dir -Force; Remove-Item "$dir\\project.zip"; cd $dir`;
  
  document.getElementById('cmd-1').textContent = cmd1;
  document.getElementById('cmd-2').textContent = `cd C:\\vishants_projects\\${folderName}; npm install`;
  document.getElementById('cmd-3').textContent = `cd C:\\vishants_projects\\${folderName}; ${project.start_cmd || "npm start"}`;

  document.getElementById('open-website-btn').addEventListener('click', () => {
    if (project.local_url) {
      window.open(project.local_url, '_blank', 'noopener');
    } else {
      alert('No local link is set for this project.');
    }
  });
}

// Copy logic
document.querySelectorAll('.cmd-copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = e.target.dataset.target;
    const text = document.getElementById(targetId).textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      const original = e.target.textContent;
      e.target.textContent = 'Copied!';
      e.target.classList.add('copied');
      setTimeout(() => {
        e.target.textContent = original;
        e.target.classList.remove('copied');
      }, 1200);
    });
  });
});

// Theme toggle
const THEME_KEY = "theme_preference";
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙 Dark";
  }
  localStorage.setItem(THEME_KEY, theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeToggle.addEventListener("click", () => {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

applyTheme(getPreferredTheme());
init();
