# GitHub Pages Rehberi

GitHub Pages kullanımını anlatmak için hazırlanmış React tabanlı tek sayfalık bir rehber uygulamasıdır.

## Çalıştırma

```bash
npm install
npm run dev
```

## Build alma

```bash
npm run build
```

Build çıktısı `dist/` klasöründe oluşur.

## Not

GitHub Pages üzerinde bir proje deposu yayınlıyorsan `base` değerini repo adına göre ayarlaman gerekir. Örnek:

```js
// vite.config.js
export default defineConfig({
  base: "/depo-adi/",
  plugins: [react()],
});
```

React ve Vite projelerinde önerilen yayın yöntemi GitHub Actions ile `dist/` klasörünü deploy etmektir.
