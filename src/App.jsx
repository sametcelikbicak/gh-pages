import { useEffect, useState } from "react";

const quickSteps = [
  "GitHub hesabı oluştur veya giriş yap.",
  "Yerelde web siteni hazırla.",
  "Projeyi bir GitHub deposuna gönder.",
  "Pages ayarlarından yayın kaynağını seç.",
  "Verilen bağlantıyı test edip paylaş.",
];

const prerequisites = [
  {
    title: "GitHub hesabı",
    text: "Projeyi saklamak ve GitHub Pages özelliğini açmak için gerekir.",
  },
  {
    title: "Hazır site dosyaları",
    text: "HTML, CSS, JavaScript ya da React gibi bir teknolojiyle hazırlanmış site.",
  },
  {
    title: "Git bilgisi",
    text: "En azından depo oluşturma, commit atma ve push gönderme seviyesinde olması yeterli.",
  },
];

const methods = [
  {
    title: "Statik dosya yükleme",
    text: "Sadece HTML, CSS ve JS kullanıyorsan en kolay yöntemdir. `index.html` kökte durur ve doğrudan yayınlanır.",
  },
  {
    title: "Framework ile derleme",
    text: "Angular, React, Vue veya benzeri bir araç kullanıyorsan önce build alır, çıkan dosyaları yayınlarsın.",
  },
  {
    title: "Kullanıcı sayfası",
    text: "`kullaniciadi.github.io` isimli özel depo ile ana profil siteni yayınlayabilirsin.",
  },
];

const setupSteps = [
  {
    title: "1. Projeyi oluştur",
    body:
      "Siteni yerelde hazırla. React kullanıyorsan `npm create vite@latest` gibi bir araçla proje başlatabilir, ardından içeriklerini geliştirebilirsin.",
  },
  {
    title: "2. Git deposu başlat",
    body:
      "Eğer `npm create vite@latest` komutu sonrası git oluşmamış ise veya kendin oluşturmak istersen terminalde proje klasöründe `git init` çalıştır.",
  },
  {
    title: "3. GitHub deposu aç",
    body:
      "GitHub üzerinde yeni bir repository oluştur. İstersen public yap, çünkü GitHub Pages rehber senaryolarında bu en yaygın akıştır.",
  },
  {
    title: "4. Değişiklikleri kaydet ve uzak bağlantıyı ekleyip gönder",
    body:
      "İlk olarak yaptığımız düzenlemeleri kayıt altına almak için `git add .` komutu ile commit listemize ekleyip `git commit -m \"Initial commit\"` ile ilk commit’i oluştur. Yereldeki projeyi GitHub’a bağlamak için `git remote add origin ...` komutunu kullan ve `git push -u origin main` ile gönder.",
  },
  {
    title: "5. Pages ayarını aç",
    body:
      "Repository içinden Settings > Pages bölümüne gir. Yayın kaynağı olarak branch ve klasör seçimi yap.",
  },
    {
    title: "6. GitHub Actions ile otomatik deploy",
    body:
      "Proje ana klasöründe `.github/workflows/deploy.yml` dosyasını oluşturup içine verilen workflow kodunu yapıştır. Repo adına göre `vite.config.js` içindeki `base` değerini düzenle.",
  },
];

const deployOptions = [
  {
    title: "Statik HTML için branch yayını",
    detail:
      "Sadece düz `index.html` yapısında bir proje kullanıyorsan `main` branch ve `/root` yayını yeterli olabilir.",
  },
  {
    title: "Framework projesinde build çıktısı",
    detail:
      "React ve Vite gibi araçlarda doğrudan kaynak kod değil, build sonucu oluşan statik çıktı yayınlanmalıdır.",
  },
  {
    title: "GitHub Actions kullan",
    detail:
      "En güvenilir yöntem budur. Her push sonrası proje otomatik build edilir ve GitHub Pages’e deploy edilir.",
  },
];

const reactNotes = [
  {
    title: "Vite `base` ayarı",
    text: "GitHub Pages altında asset yollarının bozulmaması için Vite yapılandırmasında `base` değeri repo adına göre tanımlanmalıdır. Örneğin repo adı `my-project` ise değer `'/my-project/'` olmalıdır.",
  },
  {
    title: "Build klasörü",
    text: "React projesi doğrudan kaynak dosyalarla değil, build sonrası oluşan statik çıktılarla yayınlanır.",
  },
  {
    title: "İstemci tarafı yönlendirme",
    text: "Birden fazla route kullanılacaksa 404 ve yeniden yükleme davranışı için ek önlem düşünülmelidir. Bu rehber, sade bir tek sayfa SPA kullandığı için daha güvenlidir.",
  },
];

const commonMistakes = [
  {
    title: "404 hatası",
    text: "Yanlış branch seçilmiş olabilir ya da React projesinde yönlendirme için ek yapılandırma gerekebilir.",
  },
  {
    title: "Boş sayfa",
    text: "Asset yolları yanlış olabilir. Vite kullanıyorsan `base` ayarı depo adına göre düzenlenmelidir.",
  },
  {
    title: "Güncelleme görünmüyor",
    text: "Tarayıcı önbelleği veya GitHub Pages’in birkaç dakikalık yayın gecikmesi buna neden olabilir.",
  },
];

const commandBlocks = [
  {
    title: "Proje başlatma",
    code: `npm create vite@latest my-site -- --template react\ncd my-site\nnpm install\nnpm run dev`,
  },
  {
    title: "Vite base ayarı",
    code: `import { defineConfig } from "vite"\nimport react from "@vitejs/plugin-react"\n\nexport default defineConfig({\n  base: "/depo-adi/",\n  plugins: [react()],\n})`,
  },
  {
    title: "GitHub'a gönderme",
    code: `git init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/kullaniciadi/depo-adi.git\ngit push -u origin main`,
  },
  {
    title: "Yayın kontrolü",
    code: 'GitHub > Settings > Pages > Source: GitHub Actions',
  },
];

const workflowBlock = `name: Deploy Vite site to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

const publishingChecklist = [
  "Depo adı doğru mu?",
  "Ana sayfa dosyası `index.html` olarak erişilebilir mi?",
  "Vite içindeki `base` değeri `'/depo-adi/'` olarak ayarlandı mı?",
  "React kullanıyorsan build çıktın hazır mı?",
  "Pages ayarlarında kaynak olarak `GitHub Actions` seçildi mi?",
  "Yayın linki açılıyor mu?",
];

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{renderInlineCode(text)}</p>
    </div>
  );
}

function renderInlineCode(text) {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }

    return part;
  });
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.5 14.6A7.5 7.5 0 0 1 9.4 5.5a8 8 0 1 0 9.1 9.1Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.09.68-.22.68-.49 0-.24-.01-1.03-.01-1.86-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.74 0 0 .85-.28 2.78 1.05A9.42 9.42 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.93-1.33 2.78-1.05 2.78-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.36 8.48H2.24V21h3.12V8.48ZM3.8 3C2.8 3 2 3.83 2 4.86 2 5.88 2.8 6.7 3.8 6.7c1.02 0 1.82-.82 1.82-1.84C5.62 3.83 4.82 3 3.8 3Zm17.2 10.33c0-3.78-2-5.54-4.67-5.54-2.15 0-3.12 1.2-3.66 2.05V8.48H9.56c.04.9 0 12.52 0 12.52h3.11v-6.99c0-.37.03-.74.14-1 .3-.74.98-1.5 2.12-1.5 1.5 0 2.11 1.14 2.11 2.8V21H21v-7.67Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.9 3H22l-6.76 7.73L23 21h-6.08l-4.77-6.23L6.7 21H3.58l7.23-8.26L1.38 3h6.23l4.31 5.67L18.9 3Zm-1.06 16.16h1.68L6.7 4.75H4.9l12.94 14.41Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.58 7.19a2.94 2.94 0 0 0-2.07-2.08C17.68 4.6 12 4.6 12 4.6s-5.68 0-7.51.51A2.94 2.94 0 0 0 2.42 7.2 30.3 30.3 0 0 0 2 12a30.3 30.3 0 0 0 .42 4.81 2.94 2.94 0 0 0 2.07 2.08c1.83.51 7.51.51 7.51.51s5.68 0 7.51-.51a2.94 2.94 0 0 0 2.07-2.08A30.3 30.3 0 0 0 22 12a30.3 30.3 0 0 0-.42-4.81ZM10.2 15.04V8.96L15.6 12l-5.4 3.04Z" />
    </svg>
  );
}

function StackOverflowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.67 20.25v-6h2v8h-16v-8h2v6h12Zm-10.1-1.5h8.2v-2h-8.2v2Zm.2-4.54 8.02 1.68.42-1.96-8.02-1.68-.42 1.96Zm1.05-3.93 7.42 3.46.85-1.82-7.43-3.46-.84 1.82Zm2.08-3.77 6.3 5.04 1.25-1.56-6.3-5.04-1.25 1.56Zm4.06-4.76-1.63 1.16 4.67 6.57 1.63-1.16-4.67-6.57Z" />
    </svg>
  );
}

function App() {
  const [theme, setTheme] = useState("dark");
  const [copyState, setCopyState] = useState("idle");
  const socialLinks = [
    { label: "GitHub", href: "https://github.com/sametcelikbicak", icon: <GithubIcon /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sametcelikbicak/", icon: <LinkedinIcon /> },
    { label: "X", href: "https://x.com/sametcelikbicak", icon: <XIcon /> },
    { label: "YouTube", href: "https://www.youtube.com/@sametcelikbicak", icon: <YoutubeIcon /> },
    { label: "Stack Overflow", href: "https://stackoverflow.com/users/10509056/samet-%c3%87el%c4%b0kbi%c3%87ak", icon: <StackOverflowIcon /> },
  ];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleCopyWorkflow() {
    try {
      await navigator.clipboard.writeText(workflowBlock);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand">
            <div className="brand-mark">GP</div>
          <div>
              <strong>GitHub Pages Rehberi</strong>
              <p>React SPA ile hazırlanan anlatım sitesi</p>
            </div>
          </div>
          <div className="topbar-actions">
            <a href="#rehber" className="ghost-button">
              Rehbere Geç
            </a>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Temayi ${theme === "light" ? "dark" : "light"} moda al`}
              aria-pressed={theme === "dark"}
            >
              <span className="theme-toggle-track" aria-hidden="true">
                <span className={`theme-toggle-state theme-toggle-state-${theme}`}>
                  {theme === "light" ? <SunIcon /> : <MoonIcon />}
                </span>
              </span>
            </button>

          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1>GitHub Pages ile ücretsiz web sitesi yayınlamayı adım adım öğren.</h1>
            <p>
              Bu tek sayfalık React uygulaması, sıfırdan başlayıp bir projeyi
              GitHub’a yükleme ve GitHub Pages üzerinden yayınlama sürecini sade,
              net ve öğretici bir dille anlatır.
            </p>

            <div className="hero-actions">
              <a href="#adimlar" className="primary-button">
                Adımları İncele
              </a>
              <a href="#komutlar" className="secondary-button">
                Komutları Gör
              </a>
            </div>

            <ul className="quick-steps">
              {quickSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <aside className="hero-card">
            <p className="card-label">Özet Akış</p>
            <div className="timeline">
              {["Hazırla", "Commit Et", "Push Gönder", "Pages Aç", "Yayınla"].map(
                (item, index) => (
                  <div className="timeline-item" key={item}>
                    <span>{index + 1}</span>
                    <p>{item}</p>
                  </div>
                ),
              )}
            </div>

            <div className="stats">
              <div>
                <strong>1 repo</strong>
                <span>ile yayın başlar</span>
              </div>
              <div>
                <strong>5 temel adım</strong>
                <span>ile süreç tamamlanır</span>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main>
        <section className="panel" id="rehber">
          <SectionTitle
            eyebrow="Başlangıç"
            title="GitHub Pages nedir?"
            text="GitHub Pages, GitHub üzerinde tuttuğun statik web dosyalarını ücretsiz olarak yayına almanı sağlayan bir barındırma hizmetidir."
          />

          <div className="three-column-grid">
            {prerequisites.map((item) => (
              <article className="info-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{renderInlineCode(item.text)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-panel">
          <div className="panel soft">
            <SectionTitle
              eyebrow="Yöntemler"
              title="Hangi senaryoda hangi yaklaşımı kullanmalısın?"
              text="GitHub Pages aynı hizmet olsa da yayınlama biçimi projenin yapısına göre değişir."
            />

            <div className="stack-list">
              {methods.map((method) => (
                <article className="stack-card" key={method.title}>
                  <h3>{method.title}</h3>
                  <p>{renderInlineCode(method.text)}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="panel emphasis">
            <p className="mini-title">Doğru mental model</p>
            <h3>GitHub Pages bir sunucu tarafı uygulaması çalıştırmaz.</h3>
            <p>
              Yani PHP, Node.js backend ya da veritabanı mantığı değil; derlenmiş
              veya doğrudan servis edilebilen statik içerikler yayınlanır. Rehber
              boyunca bu mantığı korumak hataları ciddi ölçüde azaltır.
            </p>
          </div>
        </section>

        <section className="panel" id="adimlar">
          <SectionTitle
            eyebrow="Kurulum"
            title="Adım adım yayın süreci"
            text="İlgili adımları sırası ile takip edip süreci tamamlayabilirsin."
          />

          <div className="steps-grid">
            {setupSteps.map((step) => (
              <article className="step-card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{renderInlineCode(step.body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel accent">
          <SectionTitle
            eyebrow="Deploy"
            title="Yayınlama seçenekleri"
            text="GitHub Pages içinde en çok karşılaşılan yayın modelleri aşağıdadır. React ve Vite projelerinde en güvenli yol GitHub Actions ile deploy etmektir."
          />

          <div className="deploy-grid">
            {deployOptions.map((option) => (
              <article className="deploy-card" key={option.title}>
                <h3>{option.title}</h3>
                <p>{renderInlineCode(option.detail)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <SectionTitle
            eyebrow="React Detayı"
            title="React projesi yayınlarken dikkat edilmesi gerekenler"
            text="GitHub Pages ile React birlikte sorunsuz çalışır; fakat birkaç küçük yapılandırma detayı yayın kalitesini doğrudan etkiler."
          />

          <div className="three-column-grid">
            {reactNotes.map((item) => (
              <article className="info-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{renderInlineCode(item.text)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <SectionTitle
            eyebrow="Workflow"
            title="GitHub Actions ile otomatik deploy"
            text="Aşağıdaki workflow dosyasını `.github/workflows/deploy.yml` olarak ekleyebilirsin. Sadece repo adına göre `vite.config.js` içindeki `base` değerini düzenlemen yeterlidir."
          />

          <div className="code-stack">
            <article className="code-card">
              <div className="code-header code-header-actions">
                <span>.github/workflows/deploy.yml</span>
                <button
                  type="button"
                  className="copy-button"
                  onClick={handleCopyWorkflow}
                  aria-label="GitHub Actions workflow kodunu kopyala"
                >
                  {copyState === "copied" ? "Kopyalandı" : copyState === "error" ? "Hata" : "Kopyala"}
                </button>
              </div>
              <pre>
                <code>{workflowBlock}</code>
              </pre>
            </article>
          </div>
        </section>

        <section className="split-panel" id="komutlar">
          <div className="panel">
            <SectionTitle
              eyebrow="Terminal"
              title="En çok kullanılan komutlar"
              text="Aşağıdaki kod blokları, temel komut akışlarını içerir."
            />

            <div className="code-stack">
              {commandBlocks.map((block) => (
                <article className="code-card" key={block.title}>
                  <div className="code-header">
                    <span>{block.title}</span>
                  </div>
                  <pre>
                    <code>{block.code}</code>
                  </pre>
                </article>
              ))}
            </div>
          </div>

          <div className="panel checklist">
            <p className="mini-title">Kontrol listesi</p>
            <h3>Yayın öncesi son doğrulama</h3>
            <ul>
              {publishingChecklist.map((item) => (
                <li key={item}>{renderInlineCode(item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <SectionTitle
            eyebrow="Sorun Giderme"
            title="En sık yapılan hatalar"
            text="Yeni başlayanlar çoğunlukla birkaç tekrar eden noktada takılır. Bunları önden bilmek zaman kazandırır."
          />

          <div className="three-column-grid">
            {commonMistakes.map((mistake) => (
              <article className="warning-card" key={mistake.title}>
                <h3>{mistake.title}</h3>
                <p>{renderInlineCode(mistake.text)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-panel">
          <div>
            <span className="pill light">Hazır mısın?</span>
            <h2>Bu rehberi takip ederek kendi siteni bugün yayına alabilirsin.</h2>
            <p className="cta-copy">
              İstersen bu SPA’yı doğrudan temel alıp kendi içeriklerinle
              özelleştirebilir, ardından GitHub Pages üzerinde canlıya
              çıkarabilirsin.
            </p>
          </div>
          <a href="#rehber" className="primary-button">
            Baştan Oku
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="social-links" aria-label="Sosyal baglantilar">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="social-link"
              aria-label={item.label}
              target="_blank"
              rel="noreferrer"
            >
              {item.icon}
            </a>
          ))}
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Samet ÇELİKBIÇAK. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;
