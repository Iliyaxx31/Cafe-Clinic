<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cafe Clinic — proje hafızası ve çalışma kuralları

Son inceleme: **2026-09-26**. Bu belge mevcut yerel kaynak kodun incelenmesine dayanır; canlı sunucunun doğrulanmış durumu değildir. Yeni bir sohbetin başında bu dosyayı oku, sonra görevle ilgili kaynak dosyalarını kontrol et. Kaynak kod değişmişse bu belgeyi de güncelle.

## 1. Kullanıcının isteği ve değişiklik kaydı kuralı

- Kullanıcı Türkçe iletişim kuruyor. İlk görev, projeyi ayrıntılı anlamak ve kalıcı proje rehberi oluşturmaktı. Güncel görev: kullanıcının belirttiği ürünlerin fiyatlarını müşteri menüsünde ve personel `/menu` ekranında aynı yapmak. **Fiyatı belirtilmeyen ürünlere kesinlikle dokunma.** Kullanıcı bulunan hata/gereksiz kodları bildirmeyi istedi; genel temizlik istemedi.
- Kullanıcı önce deploy'u bekletti, ardından `https://github.com/Iliyaxx31/Cafe-Clinic.git` hedefini verip **“inceleme deploy et”** diyerek yeniden yetkilendirdi. `.git.zip` teşhisinden sonra **“sen yap”** diyerek düzeltme ve gönderimi onayladı. Hedef `origin/main`; canlı hosting yöntemi bilinmiyor. Güncel gönderim sonucu için en son günlük kaydına bak.
- **Veritabanı yok. Ana kafenin fiyatları admin panelinden elle değiştiriliyor ve JSON dosyasında saklanıyor.** Kullanıcı ayrıca istemedikçe veritabanı eklemeyi veya mimariyi değiştirmeyi görevin parçası sayma.
- Kullanıcı `agent.md` / `agend.md` adlarını kullandı. Standart ve zaten mevcut giriş noktası olan **`AGENTS.md` tek proje hafızasıdır**. Ayrı, birbiriyle çelişen hafıza dosyaları üretme. `CLAUDE.md` zaten yalnızca `@AGENTS.md` içeriyor.
- **Yaptığın her proje değişikliğini bu dosyanın sonundaki değişiklik günlüğüne kaydet.** Tarihi, değişen dosyaları, neyi/neden değiştirdiğini, davranışa etkisini, doğrulama sonucunu ve kalan işi yaz. İlgili mimari bölümü de güncel tut; yalnızca günlüğe eklemek yeterli değildir.
- Yapılan değişiklik ile tespit edilen fakat düzeltilmeyen sorunu birbirinden ayır. Test etmediğin özelliğe “çalışıyor” deme. Kişisel müşteri bilgilerini, gerçek şifreleri, hash değerlerini veya bot tokenlarını bu belgeye kopyalama.
- Fiyat, ürün ve sipariş JSON'larını örnek veri sanıp sıfırlama. Özellikle `data/orders.json` müşteri bilgileri içeriyor.
- Üstteki Next.js talimat bloğunu koru. Kod yazmadan önce kurulu sürümün `node_modules/next/dist/docs/` rehberini kontrol et. İlk incelemede `node_modules` yoktu; bu rehber okunamadı. Paket sürümünü kontrol etmeden yeni Next.js API'lerini uygulama.

## 2. Projenin amacı ve teknoloji

Tek Next.js uygulaması içinde üç farklı bölüm var:

1. **Cafe Clinic Amol:** Farsça müşteri menüsü, sepet, adresli sipariş, sipariş takibi ve admin yönetimi.
2. **`/menu`:** Türkçe/Farsça personel hesap panosu. Kendi statik menü dosyasını kullanıyor, yalnızca seçilen ürünlerin toplamını hesaplıyor.
3. **Dr. Kord diş kliniği:** Dijital kartvizit, iletişim bağlantıları ve hizmet tanıtım sayfaları. Ayrı alan adı aynı uygulamada middleware ile bu sayfalara yönleniyor.

Teknik yapı:

- JavaScript/JSX, Next.js App Router (`app/`); TypeScript veya ayrı backend projesi yok.
- `package.json` ve `package-lock.json`: **Next.js 14.1.1**, **React/React DOM 18.2.0**. Başlangıçtaki genel sürüm uyarısını, projenin Next.js 16 kullandığı şeklinde yorumlama.
- Tailwind CSS: manifestte `^3.4.0`, lock dosyasında `3.4.19`; global CSS v3 `@tailwind` direktiflerini kullanıyor.
- Etkileşimler React state/effect ile; animasyonlar Framer Motion, Tailwind ve bileşen içi `style jsx` ile yapılıyor. İkonlar çoğunlukla `react-icons`.
- Sunucu kalıcılığı Node `fs` üzerinden JSON okuma/yazma. `mysql2`, `redis`, `ioredis` paket listesinde var ama uygulama kaynaklarında aktif bağlantı/kullanım yok. Bunların bulunması veritabanı kurulu olduğu anlamına gelmez.
- `bcrypt` admin parola kontrolünde, `crypto-js` tarayıcıdaki müşteri bilgilerini şifreleme amacıyla kullanılıyor. `socket.io` için tamamlanmamış bir sunucu denemesi var; gerçek ekran güncellemeleri polling ile.
- `jsconfig.json`: `@/*` proje köküne işaret ediyor. `@/app/...` geçerli; `@/json/...` otomatik olarak `app/json/...` anlamına gelmez.
- Arayüz çoğunlukla Farsça; RTL birçok sayfa/bileşende ayrı tanımlanmış. Kök HTML `lang="fa"`, fakat genel `dir="rtl"` yok. Kod yorumları ve bazı hata metinleri Türkçe.

## 3. Dosya ve sayfa haritası

| Yol | Sorumluluk |
| --- | --- |
| `app/layout.jsx` | Global CSS, yerel fontlar, kafe SEO metadata, sosyal paylaşım görselleri, JSON-LD işletme bilgisi. |
| `app/page.jsx` → `/` | Müşteri menüsü; ayarlar, bakım ekranı, elektrik filtresi, kategoriler, sepet state'i, giriş animasyonu, duyuru, tam ekran. |
| `app/admin/login/page.jsx` | Admin giriş formu; başarılı girişte `/admin/dashboard`. |
| `app/admin/dashboard/page.jsx` | Fiyat/ad/açıklama düzenleme, ürün/kategori ekleme-silme, duyuru ve elektrik kesintisi ayarı. |
| `app/admin/orders/page.jsx` | Siparişleri listeleme, durum değiştirme ve silme. 3 saniyede bir yenilenir. Dashboard içinde bu sayfaya bağlantı bulunmuyor; rota mevcut. |
| `app/track/[id]/page.jsx` | Müşteri takip ekranı; 5 saniyede bir sipariş sorgulama, durum adımları, ürün ekleme, kafeyi arama. |
| `app/track/[id]/AddItemsModal.jsx` | Güncel ana menüden mevcut siparişe yeni ürün/adet ekleme. |
| `app/menu/page.jsx` | Bağımsız, koyu pembe/neon tasarımlı personel hesap ekranı; dil ve kategori seçimi, toplam, temizleme. |
| `app/menu/data.json` | Yalnızca `/menu` ekranının import ettiği statik iki dilli ürünler ve gömülü fiyatlar. |
| `app/kartvizitMevaredQR/page.jsx` | Diş kliniği kartviziti; SVG logo, telefon, harita, Instagram, kafe ve hizmet bağlantıları. |
| `app/kartvizitMevaredQR/merhaba/page.jsx` | Kod içine yazılmış 10 diş kliniği hizmeti, açıklama modalları. Escape/arka plana tıklama ile kapanır. |
| `app/kartvizitMevaredQR/layout.jsx` | Kliniğin başlığı ve yerleşimi; ayrıca `html/body` üretiyor (aşağıdaki mevcut sorunlara bak). |
| `middleware.js` | Klinik alan adı rewrite işlemi; diğer hostlarda admin ve `/staff` cookie kontrolü. |
| `app/api/**/route.js` | Next.js içindeki API uçları. Ayrıntılar aşağıda. |
| `app/lib/fileLock.js` | Admin menü/fiyat yazımlarını aynı süreçte sıraya alan yardımcı. |
| `app/json/` | Ana ürünler, fiyatlar, duyuru ve bazı eski/bağlantısız JSON dosyaları. |
| `data/` | Aktif siparişler ve uygulama ayarları. `app/json/` ile karıştırma. |
| `public/` | Ürün görselleri, logolar, faviconlar, bildirim sesi ve video. |
| `app/fonts/` | Vazirmatn, Rubik, El Messiri TTF dosyaları; `next/font/local` kullanılıyor. |

Başlıca bileşenler (`app/components/`):

- `Header.jsx`, `Footer.jsx`: kafe marka/iletişim alanları.
- `Navbar.jsx` → `Kategori.jsx`: kategori seçimi; indeks ve bazı Farsça kategori adlarına göre ikon eşleşmesi.
- `Produc.jsx`: ürün kartı, görsel, fiyat sunumu ve adet artırma/azaltma. Dosyanın adı gerçekten `Produc`, `Product` değil.
- `Cart.jsx`: sepet düzenleme, müşteri formu, yerel bilgi saklama, sipariş POST isteği ve takip sayfasına geçiş.
- `IntroScreen.jsx`: dokunarak açılan giriş katmanı. `app/page.jsx` tam ekran isteğini ve ses hazırlığını yapıyor.
- `CoffeeCupButton.jsx`: sabit sepet düğmesi, adet rozeti ve SVG/CSS animasyonları.
- `NoticeModal.jsx`: duyuruyu yükler; giriş tetiklendikten yaklaşık 2 saniye sonra aktif ve metinli duyuruyu gösterir.
- `PowerOutageModal.jsx`: mevcut sayfalarda kullanılmayan eski bileşen; aktif elektrik filtresi ana sayfanın içinde.

## 4. Verilerin gerçek kaynakları ve şemaları

| Dosya | Kullanım / şema |
| --- | --- |
| `app/json/data.json` | Ana menü: `{ cafeName, categories: [{ id, name, items: [{ id, name, description, img }] }] }`. İncelenen mevcut isimler string. |
| `app/json/price.json` | Ana fiyat kaynağı: ürün ID'sinin string anahtarına karşılık fiyat string'i. Örnek: `{ "1": "120", "18": "75.000" }`. |
| `data/settings.json` | `{ maintenanceMode, maintenanceMessage, powerOutageMode }`. İlk incelemede iki mod da false. |
| `app/json/notice.json` | `{ active, text }`; admin duyuru formu burayı değiştirir. İlk incelemede aktifti. Metin değişebilir. |
| `data/orders.json` | Aktif sipariş dizisi. Gerçek müşteri alanları var; içeriği raporlara kopyalama. |
| `app/menu/data.json` | Ayrı menü: kategori/ürün adları `{ tr, fa }`; her üründe `price` gömülü. Admin fiyat dosyasına bağlı değil. |
| `app/json/power.json` | Eski elektrik kesintisi ürün listesi. Ana sayfa bunu okumuyor; kod içindeki isim listesi kullanılıyor. |
| `app/json/orders.json` | İlk incelemede boş dizi; mevcut sipariş API'leri bu dosyayı kullanmıyor. |
| `login-attempts.json` | Eski giriş denemesi verisi; mevcut login kodunda okuma/yazma veya rate limit bağlantısı bulunmadı. |

2026-09-26 veri kontrolü: ana menü **7 kategori / 66 ürün**, fiyat dosyası **66 anahtar**, ayrı `/menu` verisi de **7 kategori / 66 ürün**. Ana menüde yinelenen ürün ID'si, eksik/fazladan fiyat anahtarı veya bulunamayan ürün görseli yoktu. Sayılar bir anlık durumdur; yeni ürünlerden sonra güncelle.

Kategoriler sırasıyla kahve, soğuk kahve, shake, çay/bitki çayı, soğuk içecek, sıcak içecek, kek/kurabiye. ID'ler ardışık olmak zorunda değil. Ana menü ürün ID'leri bütün kategoriler boyunca ortak kimliktir; fiyatlar ve sepet bu ID'lere bağlı.

Sipariş şeması:

```text
{
  id: number,                         // Date.now()
  items: [{ id, name, quantity, price, total }],
  total: number,
  customerName, customerPhone, customerAddress,
  note: string | null,
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled",
  createdAt: ISO tarih,
  updatedAt?: ISO tarih               // ürün eklenince
}
```

### Fiyat güncelleme akışı ve birim konusu

1. Admin dashboard, `POST /api/admin` → `action: "getData"` ile ürün ve fiyatları getirir.
2. Fiyat input'undan çıkılınca (`onBlur`) `updatePrice` çalışır. Bütün yeni fiyat haritası `action: "updatePrices", data: { prices }` ile gönderilir.
3. API, `writeFileSafe` üzerinden `app/json/price.json` dosyasını yazar.
4. Ana sayfa ve siparişe ürün ekleme modalı `GET /api/menu` ile bu dosyayı okur. Zaten açık olan ana menü fiyatları periyodik olarak yenilemez.
5. **`/menu` bu zincirin parçası değildir.** Kendi JSON'u statik import edildiğinden admin değişikliği oraya otomatik yansımaz.

2026-09-26 fiyat görevlerinde ilk listede 8, ikinci listede 11 ve sonradan buzlu latte olmak üzere toplam 20 istenen ürün iki dosyada birlikte güncellendi (ayrıntılar günlükte). Diğer ürünlerde önceden var olan farklar korunuyor; “iki menünün tamamı eşitlendi” deme. Kullanıcının 120/100 vb. değerleri mevcut kısa fiyat formatında string olarak saklandı; çayın mevcut `.000` biçimi korunarak `85.000` yazıldı. Para birimi/gösterim/hesaplama kodu değiştirilmedi.

**Mevcut fiyat gösterimi ile aritmetiği aynı sanma:** `Produc.jsx`, string içinde `000` yoksa `.000` ekliyor (`"110"` → `"110.000"`). Ana sepet ve ekleme modalı ise ham değeri `parseFloat` ile sayıya çeviriyor (`"110"` → 110; `"75.000"` → 75) ve toplamları تومان etiketiyle gösteriyor. `/menu` ilk noktadan öncesini sayı kabul ediyor ve **₺** gösteriyor. Amaçlanan para birimi/ölçek ileride fiyat işi yapılırken netleştirilmeli; bu incelemede dönüştürme yapılmadı.

## 5. Müşteri ve admin akışları

### Ana menü ve elektrik/bakım modları

- Önce `/api/settings` yüklenir; istek hatasında bakım kapalı varsayılır. Bakım açıksa menü yerine bakım mesajı görünür ve ana menü isteği yapılmaz.
- Normal akışta `/api/menu` yüklenir. Kategori state'i indeks, sepet state'i ürün nesneleri dizisidir. Sepetin kendisi localStorage'a yazılmaz.
- Elektrik kesintisi açıksa `isNoPowerItem` içindeki **12 sabit Farsça isim parçası** üzerinden ürünler filtrelenir; boş kategoriler çıkarılır. Kullanıcı tam menüyü açıp filtreye geri dönebilir.
- Bu filtre stok/yetki engeli değildir: tam menüden sipariş verilebilir, API de elektrik veya bakım moduna göre siparişi reddetmiyor.
- Dashboard elektrik anahtarını gösterir. Bakım ayarı API ve JSON'da var, mevcut dashboard'da bakım düzenleme kontrolü yok.
- Adminin yeni ürün modalındaki “isme büyük E ekleyin” açıklaması güncel filtre koduyla uyumsuzdur; ana sayfa E işaretine bakmıyor. `stripMarker` da E kaldırmıyor, yalnızca nesne isimlerden `fa/tr` seçiyor.
- 2026-09-26 tarihinde kullanıcının isteğiyle soğuk içeceklerdeki 7 ürün adının sonundaki eski ` E` işaretleri kaldırıldı. Elektrik filtresi isim parçası eşleşmesi kullandığından bu işaretlere ihtiyaç duymuyor. Personel `/menu` adlarında zaten E yoktu. Admin modalının eski E açıklaması kodda hâlâ duruyor.

### Sepet ve takip

- Sepet düğmesine basınca `localStorage.lastOrderId` sorgulanır. Önceki sipariş completed/cancelled değilse yeni sepet yerine `/track/<id>` açılır.
- Form isim, İran formatında 11 haneli `09...` telefon ve en az 5 karakter adres ister. Not opsiyonel. Çevrim içi ödeme entegrasyonu yok.
- `Cart.jsx` müşteri bilgilerini `customerName`, `customerPhone`, `customerAddress` anahtarlarıyla CryptoJS AES kullanarak localStorage'da tutar. Kaydetme varsayılan olarak açık; yazarken de kaydeder. Ayrı temizleme düğmesi vardır. Kutuyu kapatmak önceki verileri kendiliğinden silmez.
- Sipariş oluşturulduğunda ID localStorage'a yazılır ve tarayıcı takip sayfasına gider.
- Takip ve admin ekranları sırasıyla 5/3 saniye polling yapar; ikisinde de manuel yenileme vardır.
- Ürün ekleme yalnızca `pending` ve `preparing` durumlarında UI ve PATCH API tarafından kabul edilir. Diğer durumlarda kapanır.
- PATCH aynı ürün ID'sinin adedini artırırken eski birim fiyatını kullanır; yeni ürün satırında gönderilen fiyatı kullanır. Satır toplamları ve sipariş toplamı yeniden hesaplanır, `updatedAt` eklenir.

### Admin işlemleri

- Giriş `ADMIN_USERNAME` ve bcrypt `ADMIN_PASSWORD_HASH` ile kontrol edilir; başarılı durumda 24 saatlik `admin_auth` cookie'si yazılır.
- Ad, açıklama ve fiyat `onBlur` ile kaydolur. Ürün eklerken ID mevcut tüm ürünlerin en büyük ID'si + 1, başlangıç fiyatı `"0"`, varsayılan görsel `/da.jpg`.
- Yeni kategori ID'si max kategori ID + 1; boş `items` ile oluşturulur.
- Ürün silme hem ürünü hem fiyat anahtarını siler. Kategori silme dashboard'dan tüm menüyü `updateData` ile yazar; o kategorideki fiyat anahtarlarını temizlemez.
- Admin sipariş ekranı durum değiştirir ve siparişi kalıcı siler. Sunucu durum geçiş sırası uygulamıyor; dropdown tüm durumları sunuyor.

## 6. API sözleşmeleri

| Uç / yöntem | Davranış | Mevcut erişim kontrolü |
| --- | --- | --- |
| `GET /api` | `{ data, prices }`; menü dosyalarını okur. `/api/menu` ile aynı kod. | Açık |
| `GET /api/menu` | `{ data, prices }`; ana menü ve ekleme modalının kaynağı. | Açık |
| `POST /api/admin/login` | `{ username, password }`; başarıda cookie ve `{ success: true }`. | Parola kontrolü |
| `POST /api/admin` | `{ action, data }`; aşağıdaki işlemler. | `admin_auth` değeri kontrol edilir |
| `GET /api/settings` | Ayarlar; okuma/parse hatasında modlar kapalı varsayılan. | Açık |
| `POST /api/settings` | JSON body mevcut ayarlara merge edilerek yazılır. | Admin cookie |
| `GET /api/notice` | Duyuru nesnesi. | Açık |
| `POST /api/notice` | Body duyuru dosyasının tamamının yerini alır. | **Kontrol yok** |
| `GET /api/orders` | Tüm siparişler. | Admin cookie |
| `POST /api/orders` | `{ items, total, customerName, customerPhone, customerAddress, note }`; `{ success, orderId }`. | Müşteriye açık |
| `PUT /api/orders` | `{ orderId, status }`; bulunan siparişin durumunu yazar. | Admin cookie |
| `GET /api/orders/[id]` | Tek siparişin tüm nesnesi; yoksa 404. | **ID dışında kontrol yok** |
| `PATCH /api/orders/[id]` | `{ newItems: [{ id, name, quantity, price }] }`; `{ success, order }`. | **Sahiplik kontrolü yok**; durum kontrolü var |
| `DELETE /api/orders/[id]` | Sipariş kaydını dosyadan kaldırır. | Admin cookie |
| `GET /api/socket` | Socket.IO başlatma denemesi; boş 200 yanıt. | Açık |

`/api/admin` action payload'ları:

```text
getData       → data gerekmez
updatePrices  → data: { prices }
updateData    → data: { data: <tüm menü nesnesi> }
addItem       → data: { categoryId, newItem }
updateItem    → data: { categoryId, itemId, updatedItem }
deleteItem    → data: { categoryId, itemId }
addCategory   → data: { newCategory }
```

API karşılaştırmalarının çoğu strict ID eşitliği kullanıyor; menü/kategori ID'leri ve `PUT orderId` sayısal tipini koru. Dinamik rota ID'leri `parseInt` ile sayıya çevriliyor.

## 7. Entegrasyonlar, host yönlendirmesi ve ortam değişkenleri

### Bale bildirimleri

Yeni sipariş ve mevcut siparişe ürün ekleme API'leri, yapılandırılmışsa `https://tapi.bale.ai/bot<TOKEN>/sendMessage` adresine bildirim gönderiyor. Ürünler, toplam ve müşteri bilgileri iletiliyor. `BALE_BOT_TOKEN` ve en az bir chat ID gereklidir. Bildirim fetch'leri await edilmiyor; hata yalnızca loglanıyor. Kod incelemesi sırasında dış mesaj gönderilmedi. Sipariş testi planlarken bu yan etkiyi hesaba kat.

### Ortam değişkenleri

| Değişken | Kullanım |
| --- | --- |
| `ADMIN_USERNAME` | Admin kullanıcı adı. |
| `ADMIN_PASSWORD_HASH` | bcrypt parola hash'i; eksikse login 500 döndürür. |
| `BALE_BOT_TOKEN` | Opsiyonel Bale bot tokenı. |
| `BALE_CHAT_ID` | Birinci bildirim alıcısı. |
| `BALE_CHAT_MH_ID` | İkinci opsiyonel alıcı. |
| `BALE_CHAT_ARIYAA_ID` | Üçüncü opsiyonel alıcı. |
| `NEXT_PUBLIC_STORAGE_SECRET` | Tarayıcı AES anahtarı; yoksa kodda sabit fallback var. `NEXT_PUBLIC_` nedeniyle gizli sunucu anahtarı değildir. |
| `NODE_ENV` | Production'da login cookie'sinin `secure` bayrağı. |

İlk incelemede kökte `.env*` dosyası yoktu. Değer uydurma; gerçek değerleri bu belgeye yazma. `.gitignore` ortam dosyalarını dışlıyor.

### Alan adları

- Kafe SEO/bağlantılarının ana adresi `https://www.cafe-clinic-amol.ir`.
- Host tam olarak `dr-korddentalclinic.ir` veya `www.dr-korddentalclinic.ir` olduğunda middleware, statik dosyalar ve zaten klinik öneki taşıyan yollar dışındaki yolların önüne `/kartvizitMevaredQR` ekler. `/` kliniğin kartvizitine, `/merhaba` hizmetlere rewrite edilir; tarayıcı URL'si değiştirilmez.
- Bu klinik dalı admin kontrollerinden önce döner ve `/api` için ayrı istisna içermez. Host davranışını değiştirirken yalnızca kafe ana sayfasını test etmek yeterli değildir.
- Diğer hostlarda `/admin/*` login haricinde admin cookie kontrolünden geçer.
- `/staff` koruması yazılmış, fakat `app/staff` ve `/api/staff/login` yok. **`/menu` için bu koruma uygulanmıyor.**

## 8. Mevcut tutarsızlıklar ve teknik sınırlar

Bunlar kaynak incelemesi bulgularıdır; ilk görevde düzeltilmedi. Kullanıcının sonraki isteğine göre ilgili olanı ele al.

1. **Kurulum/config ayrışması:** Hem `next.config.js` hem `.mjs`, hem `postcss.config.js` hem `.mjs` var. JS Next config görsel optimizasyonunu kapatıyor ve sıkıştırma açıyor; MJS `reactCompiler: true` içeriyor. PostCSS JS Tailwind v3, MJS ise kurulu listede bulunmayan `@tailwindcss/postcss` kullanıyor. Hangisinin etkin olduğunu çalıştırmadan varsayma; paket yükseltmesi yapılmış kabul etme.
2. **Lint bağımlılıkları eksik:** `lint` script'i `eslint`; `eslint.config.mjs` dosyası `eslint/config` ve `eslint-config-next/core-web-vitals` import ediyor. Bu iki paket manifestte ve mevcut lock'ta yok. Lint'in başarılı çalıştığı doğrulanmadı.
3. **Sabit oturum işareti:** Yetki kontrolü imzalı/rastgele sunucu oturumu yerine cookie değerinin sabit `authenticated` string'i olmasına dayanıyor. `httpOnly` ve diğer cookie bayrakları bu değeri güvenilir bir oturum yapmaz.
4. **Çıkış işlemi:** Dashboard `document.cookie` ile HttpOnly cookie'yi silmeye çalışıyor; sunucu logout endpoint'i yok. Login sayfasına yönlendirme gerçek oturum sonlandırma olarak kabul edilmemeli.
5. **API doğrulama/erişim eksikleri:** Notice POST kimlik doğrulamıyor. Tek sipariş GET/PATCH sahiplik doğrulamıyor; ID `Date.now()` tabanlı. Sipariş POST ürün/fiyat/toplamı sunucudaki menüden doğrulayıp hesaplamıyor, istemciden alıyor. PATCH de ürün kimliği/fiyat/adet doğrulamasını yeterli yapmıyor. PUT durum değerlerini whitelist ile doğrulamıyor; bulunamayan ID için de success dönebiliyor.
6. **JSON eşzamanlı yazım sınırı:** `writeFileSafe` yalnızca aynı süreçteki yazımları sıraya alır; tüm read-modify-write işlemini veya ayrı worker'ları kilitlemez, atomik rename/transaction değildir. Sadece admin menü/fiyat API'si bunu kullanıyor. Sipariş, ayar ve duyuruda doğrudan `fs.writeFile` var; eşzamanlı istekler değişiklik kaybedebilir. Bazı okuma hataları sessizce boş sipariş dizisine dönüşüyor.
7. **Kalıcı disk ihtiyacı:** Bu uygulama runtime'da `app/json` ve `data` dosyalarına yazar. Yazılabilir ve kalıcı sunucu diski gerekir; salt statik export, geçici serverless disk veya paylaşılmayan çoklu instance mevcut saklama modeliyle eşdeğer değildir. Hosting/deploy yapılandırması bu kopyada yok; canlı ortam bilinmiyor.
8. **Fiyat ölçeği ve ayrı menü:** Bölüm 4'teki gösterim/hesap ve `/menu` ayrımını koruyarak çalış. Fiyat değiştirirken otomatik 1000 ile çarpma veya TL/Toman dönüşümü varsayma.
9. **Eski elektrik bileşeni:** `PowerOutageModal.jsx` içindeki `@/json/power.json` import'u mevcut alias/dizin yapısında yanlış hedefe gidiyor. Bileşen aktif ağaçtan import edilmiyor; ana sayfa kendi sabit listesini kullanıyor. Admin E açıklaması da eski davranışı tarif ediyor.
10. **Dashboard state:** `selectedCategory` ayrı nesne referansı tutuyor; `fetchData()` onu her zaman yeni menü nesnesiyle eşitlemiyor. Ürün ekleme/silme sonrasında seçili listenin eski kalması olası. Kategori silme fiyat anahtarlarını temizlemiyor; başlangıç verisinde yetim anahtar bulunmadı.
11. **Socket.IO tamamlanmamış:** Route, yeni Web `Response` üzerinde `res.socket?.server` arıyor; bununla çalışan Node socket sunucusu kurulmuş sayılmaz. İstemci socket bağlantısı yok. API'lerde `global.io` varsa emit deneniyor; ekranların mevcut mekanizması polling.
12. **Layout ve SEO:** Klinik nested layout'unda kök layout'a ek `html/body` var. Kafe `metadataBase` ayrı export edilmiş, `metadata` nesnesine eklenmemiş. Robots dosyalarında farklı alan adı/eski `/site/admin/` yolu var; public `robots.txt` yok. Sitemap sadece kafe kökünü listeliyor. Bunların sunulan çıktısı runtime'da doğrulanmadı.
13. **Görsel/sunum ayrıntıları:** Metadata'nın referans verdiği `/favicon-16x16.png` public dosyaları arasında yok. `backdrop-blur-xs`, `shadow-2xs`, `text-shadow-lg` gibi sınıfların mevcut Tailwind v3 karşılıkları doğrulanmalı. Sepet düğmesinde `cup-jigigle` sınıfı ile tanımlı `.cup-jiggle` adı farklı.
14. **Hata ve yenileme davranışı:** Bazı dashboard kaydetmeleri HTTP hatasını kontrol etmiyor; sepet sipariş fetch'inde try/finally yok. Ayarlar/fiyat/duyuru ana sayfada periyodik yenilenmiyor. Menü GET route'larında explicit dynamic/no-cache ayarı yok; production cache davranışı fiyat testi sırasında doğrulanmalı.
15. **Metinler hesaplama değildir:** Duyuru metninde indirimden söz edilmesi otomatik indirim uygulanacağı anlamına gelmez; sepet hesaplamasında indirim motoru yok. Kafe çalışma saatleri footer ve SEO bilgisinde farklı yazılmış.
16. **İki menü birebir aynı katalog değil:** Fiyat görevi sırasında aynı ID'nin her zaman aynı ürünü temsil etmediği doğrulandı. ID 11 ana menüde buzlu Arabica latte, personelde ballı latte; ID 73 ana menüde buzlu mocha, personelde buzlu Arabica latte; ID 47 ana menüde masala çayı, personelde sıcak süt; ID 49 ana menüde karak çayı, personelde ballı tarçınlı süt. Personelin 16/17 çay ürünleri ana menüde 47/49; ana menünün 75/76 süt ürünleri personelde 47/49. Gelecekte bütün fiyatları körlemesine ID üzerinden kopyalama; isimleri de eşleştir. Bu görevde değişen 8 ürünün isim/ID eşleşmesi doğrulandı.
17. **İstenmeyen fiyat farkları korundu:** Aynı ürünü temsil eden ID'lerde ana/personel fiyatları arasında en az şu mevcut farklar var: Arabica espresso (3) 170/160, single Arabica espresso (4) 150/140, espresso macchiato (62) 140/130, Arabica espresso shake (34) 295/270, ananas mocktail (21) 185/145, nar mocktail (22) 210/200. Bunlar kullanıcının fiyat listesinde olmadığı için değiştirilmedi.

## 9. Geliştirme ve doğrulama

Manifestteki komutlar:

```sh
npm ci
npm run dev
npm run build
npm start
npm run lint
```

`npm ci` bağımlılık kurulumudur; build/lint uyumluluğunun kanıtı değildir. İlk incelemede bağımlılık yüklenmedi, `node_modules` ve `.next` yoktu; sonradan geliştirme ortamı kuruldu. Node/npm komutları makinede mevcut. Unit/e2e test dosyası veya test script'i bulunmadı. Klasör ilk incelemede Git çalışma ağacı değildi; sonradan `.git` oluşturuldu ve `origin` GitHub reposuna bağlandı. Arşiv içeren eski yerel geçmiş yedek dalda tutulur; bu yedek dalı veya `--all` ile bütün dalları GitHub'a push etme.

İlgili kod değiştiğinde uygun kontroller:

- Fiyat/ürün: doğru JSON kaynağı, ID-fiyat eşleşmesi, admin onBlur kaydı, ana menüde yeni okuma ve aritmetik/gösterim tutarlılığı.
- Sipariş: oluşturma → takip → admin durum güncelleme → izin verilen durumda ekleme; delivering/completed/cancelled için eklemenin reddi. Test verisini gerçek kayıtlara karıştırma, Bale yan etkisini hesaba kat.
- Modlar: bakım, elektrik filtresi ve tam menüye geçiş; ayarların yalnızca sunum mu yoksa API engeli mi olduğu.
- Yönlendirme: kafe hostu, klinik hostu, statik dosyalar, API'ler ve admin giriş akışı.
- Arayüz: mobil/masaüstü, Farsça RTL ve `/menu` Türkçe LTR, font/görsel yolları.
- JSON yazımı: mevcut kullanıcı verisini koru, dosyaları UTF-8 tut, JSON parse kontrolü yap.

Her görev sonunda çalıştırılan kontrolleri ve çalıştırılamayanların nedenini günlüğe yaz. Sadece belge değişikliğinde bağımlılık kurmak veya uygulama testi eklemek gerekmez.

## 10. Değişiklik günlüğü

### 2026-09-26 — İlk proje incelemesi ve kalıcı hafıza

- **Talep:** Projeyi ayrıntılı oku/anla; gelecekteki sohbetlerin kullanacağı rehberi oluştur; sonraki tüm değişiklikleri buraya kaydet.
- **Değişen dosya:** Yalnızca `AGENTS.md`. Mevcut Next.js talimat bloğu korunarak proje rehberi ve bu günlük eklendi. `CLAUDE.md` yönlendirmesi zaten vardı; değiştirilmedi.
- **Eklenen bilgiler:** Mimari, sayfa/bileşen haritası, aktif JSON kaynakları, admin fiyat akışı, API payload'ları, sipariş durumları, bağımsız personel menüsü, klinik host yönlendirmesi, ortam değişkenleri, Bale, bilinen tutarsızlıklar ve doğrulama rehberi.
- **Uygulama etkisi:** Kod, paketler, fiyatlar, ürünler, ayarlar ve siparişler değiştirilmedi. Dış servise bildirim gönderilmedi.
- **Doğrulama:** Kaynaklar ve import/kullanım referansları incelendi. Paket/lock sürümleri karşılaştırıldı. Ana menüde 66 benzersiz ürün ID'sinin tamamının fiyatı ve görseli bulundu; fazla fiyat anahtarı yok. JSON dosyaları parse edildi. Yeni belge içindeki dosya referansları ve mevcut Next.js talimat bloğu kontrol edildi.
- **Çalıştırılmayanlar:** Build, lint ve tarayıcı testi; yerel bağımlılıklar kurulu değil ve görev yalnızca inceleme/belgeleme. Canlı sunucu davranışı doğrulanmadı.
- **Sonraki adım:** Kullanıcı bu sohbetin asıl geliştirme amacını açıklayacak. Yukarıdaki bulgular otomatik düzeltme talebi değildir.

### 2026-09-26 — İstenen 8 ürünün iki menüde fiyat güncellemesi

- **Talep:** Double espresso 120, single espresso 105, Robusta latte 190, klasik cappuccino 200, toz cappuccino 185 ve tüm kurabiyeler 100. Diğer fiyatlara kesinlikle dokunmama; hata/gereksiz kod bulgularını bildirme. Kullanıcı deploy'u sonraya bıraktı.
- **Değişen dosyalar:** `app/json/price.json`, `app/menu/data.json`, `AGENTS.md`.
- **Eşleştirme:** Double espresso, müşteri menüsünde `اسپرسو` (ID 1, `/coffee/double.png` görseli); single espresso ayrı ID 2. Kurabiyeler yalnızca aşağıdaki üç çeşit; ev yapımı kek ID 72 kapsam dışı ve değişmedi.

| ID | Ürün | Önce müşteri | Önce personel | Yeni iki menü |
| --- | --- | --- | --- | --- |
| 1 | Double espresso / اسپرسو | 110 | 110 | 120 |
| 2 | Single espresso / اسپرسو سینگل | 95 | 95 | 105 |
| 7 | Robusta latte / لاته روبوستا | 170 | 170 | 190 |
| 64 | Klasik cappuccino / کاپوچینو کلاسیک | 180 | 180 | 200 |
| 52 | Toz cappuccino / کاپوچینو پودری | 160 | 160 | 185 |
| 69 | Çikolatalı kurabiye / کوکی شکلاتی | 70 | 80 | 100 |
| 70 | Diyet kurabiye / کوکی رژیمی | 65 | 80 | 100 |
| 71 | Beyaz kurabiye / وایت کوکی | 70 | 80 | 100 |

- **Davranış:** Mevcut fiyat saklama/gösterim biçimi korundu; yalnızca 8 fiyat alanı, her iki dosyada güncellendi. İsim, ID, kategori, görsel, ürün adedi veya uygulama kodu değiştirilmedi. Personel ekranı hâlâ kendi statik JSON'unu kullanıyor; otomatik fiyat senkronizasyonu eklenmedi.
- **Doğrulama:** Değişiklik öncesi JSON içerikleriyle karşılaştırılarak her dosyada tam 8 fiyatın değiştiği, hedeflerin eşit olduğu ve diğer tüm JSON alanlarının aynı kaldığı kontrol edildi. 129 kaynak/varlık dosyasının SHA-256 karşılaştırmasında yalnızca bu üç dosya değişti. Build/tarayıcı testi yapılmadı; bu görevde veri ve belge karşılaştırması yapıldı. İşlem sırasında başlangıçta olmayan `node_modules` ve `.next` klasörlerinin oluştuğu gözlendi; bunları bu görevde asistan oluşturmadı, hash karşılaştırmasında üretilen klasörler dışlandı. Buradan build'in başarılı olduğu sonucu çıkarılmadı.
- **Bulgular:** Önceden var olan farklı ürün kimlikleri/fiyatları bölüm 8'e eklendi. Kullanılmayan elektrik bileşeni, tekrarlı config dosyaları ve erişim kontrolü eksikleri önceki incelemede zaten kayıtlı; bu görevde düzeltilmedi.
- **Deploy:** Yapılmadı; kullanıcının açık bekleme isteği var. Sonraki yayınlamada canlı sunucudaki güncel fiyatlara yalnızca bu hedef değişiklikleri uygulamak gerekir; yerel JSON'un tamamını körlemesine kopyalayıp diğer canlı fiyatları veya siparişleri ezme. `/menu` statik import kullandığı için yayına yansıması build/deploy gerektirir.

### 2026-09-26 — Geliştirme sunucusunda eski fiyat bildiriminin kontrolü

- **Bildirim:** Kullanıcı `npm run dev` sonrasında espressoyu hâlâ 110 gördüğünü söyledi.
- **Kontrol:** İki yerel JSON'da ID 1 fiyatı 120. Çalışan Next.js 14.1.1 geliştirme sunucusu bu proje klasöründen port 3000'de çalışıyor. `GET http://localhost:3000/api/menu` 200 döndü ve istenen sekiz fiyatın tamamı güncel bulundu.
- **Tarayıcı doğrulaması:** Yeni açılan `http://localhost:3000/` müşteri menüsünde espresso `120.000`, single `105.000`, Robusta latte `190.000`, klasik cappuccino `200.000` görüldü. `http://localhost:3000/menu` personel ekranında sekiz hedef fiyatın tamamı doğrulandı (espresso 120, single 105, latte 190, klasik 200, toz 185, üç kurabiye 100).
- **Sonuç:** Eski 110 bu yerel sunucuda yeniden üretilemedi. Kullanıcının baktığı sekme/adres doğrulanmadığı için kesin önbellek veya yanlış host teşhisi konulmadı. Ana sayfa fiyatları ilk yüklemede state'e alır; zaten açık sekmenin kendiliğinden yeni JSON'u alması garanti değildir. Yerel adresi açıp tam yenileme önerildi. Canlı site deploy edilmediği için yerel değişiklikleri içerdiği varsayılmamalı.
- **Değişiklik:** Yalnızca bu doğrulama kaydı `AGENTS.md` içine eklendi. Fiyatlara veya uygulama koduna tekrar müdahale edilmedi; deploy yapılmadı. Artık yerel API ve tarayıcı kontrolü yapılmış durumda; önceki kayıttaki “tarayıcı testi yapılmadı” bilgisi o görevin tarihçesidir.

### 2026-09-26 — İkinci fiyat listesi: 11 ürün

- **Talep:** Yeni listedeki fiyatları müşteri menüsünde ve personel `/menu` ekranında değiştir; belirsiz isimleri sor. Kullanıcı açıkça sıcak ve buzlu Americano için Robusta'yı doğruladı; Arabica fiyatları aynı kalacak.
- **Değişen dosyalar:** `app/json/price.json`, `app/menu/data.json`, `AGENTS.md`.

| Ürün | Müşteri ID | Personel ID | Önce (iki menü) | Yeni (iki menü) |
| --- | --- | --- | --- | --- |
| Cortado Robusta / کورتادو روبوستا | 28 | 28 | 150 | 170 |
| Americano Robusta / آمریکانو روبوستا | 5 | 5 | 130 | 140 |
| Buzlu Americano Robusta / آیس آمریکانو روبوستا | 8 | 8 | 140 | 150 |
| Çikolatalı moka / موکا | 46 | 46 | 195 | 220 |
| Fındıklı moka / موکای فندقی | 32 | 32 | 200 | 225 |
| Çay / چای | 18 | 18 | 75.000 | 85.000 |
| Karamel macchiato / کارامل ماکیاتو | 57 | 57 | 190 | 210 |
| Buzlu karamel macchiato / آيس كارامل ماكياتو | 54 | 54 | 205 | 220 |
| Sıcak çikolata / هات چاکلت | 51 | 51 | 180 | 200 |
| Masala çayı / چای ماسالا | 47 | 16 | 170 | 190 |
| Karak çayı / چای کرک (personelde چای کاراک) | 49 | 17 | 180 | 200 |

- **Eşleştirme:** Çikolatalı moka, açıklamasında çikolata/espresso yazan sıcak `موکا` ürünü olarak eşleştirildi; buzlu moka değişmedi. Masala ve Karak isim üzerinden farklı ID'lere uygulandı; personelde ID 47/49 olan sütlerin fiyatlarına dokunulmadı. Çay, mevcut dosya biçimi korunarak `85.000` yazıldı; mevcut hesaplama 85 olarak parse eder.
- **Doğrulama:** Başlangıç JSON'larına yalnızca hedef alanlar uygulanıp sonuçla karşılaştırıldı: her dosyada tam 11 fiyat değişti; diğer bütün fiyatlar/alanlar ve ilk listenin fiyatları korundu. Çalışan `http://localhost:3000/api/menu` yanıtında 11 hedef fiyat doğrulandı. Açık `/menu` tarayıcı sekmesinde tümü kategorisi üzerinden 11 yeni fiyat ve önceki espresso/kurabiye fiyatları görüldü. Build yapılmadı; uygulama kodu değişmedi.
- **Deploy:** Kullanıcının önceki bekleme talebi geçerli; yayınlama yapılmadı.

### 2026-09-26 — Soğuk içecek adlarındaki E işaretlerinin kaldırılması

- **Talep:** Soğuk içecekler bölümünde görünen E harflerini sil.
- **Değişen dosyalar:** `app/json/data.json`, `AGENTS.md`.
- **Değişiklik:** ID 20 (موهیتو), 21 (ماکتیل آناناس), 22 (ماکتیل انار), 43 (لمون چرى), 44 (باریستا  اسپشال), 60 (آیس چاکلت), 61 (آیس وایت) adlarından yalnızca sondaki ` E` kaldırıldı. Bunlar eski elektrik kesintisi işaretleriydi; mevcut filtre bunlara bakmıyor. `/menu` isimlerinde E bulunmadığından personel verisi değiştirilmedi. Geçmiş sipariş kayıtlarına müdahale edilmedi.
- **Doğrulama:** JSON önce/sonra karşılaştırmasında yalnızca bu 7 isim değişti. Ana fiyat ve personel menü dosyalarının SHA-256 değerleri aynı kaldı. Yerel `/api/menu` yanıtında yedi isim de E olmadan doğrulandı. Uygulama kodu değişmedi; build yapılmadı.
- **Deploy:** Yapılmadı; bekleme talebi geçerli.

### 2026-09-26 — Buzlu latte fiyatı 200

- **Talep:** Ice latte fiyatını 200 yap; iki menüde birlikte güncelleme kuralı geçerli.
- **Değişen dosyalar:** `app/json/price.json`, `app/menu/data.json`, `AGENTS.md`.
- **Değişiklik:** ID 10, müşteri menüsünde `آیس لاته روبوستا`, personelde `Buzlu Latte / آیس لاته`: iki dosyada da `180` → `200`. Arabica latte ve diğer ürünler değişmedi.
- **Doğrulama:** JSON önce/sonra karşılaştırması her dosyada yalnızca ID 10 fiyatının değiştiğini doğruladı. Çalışan yerel `/api/menu` yanıtında ID 10 fiyatı `200`. Build yapılmadı; uygulama kodu değişmedi.
- **Deploy:** Yapılmadı; kullanıcının bekleme talebi geçerli.

<!-- Gelecek değişikliklerde aynı yapıyla tarihli kayıt ekle; önceki kayıtları silme. -->

### 2026-09-26 — GitHub gönderimini engelleyen büyük arşiv teşhisi

- **Talep:** Deploy sırasında bahsedilen `.git.zip` dosyasını bul ve sorunu teşhis et.
- **Güncel Git durumu:** İlk incelemeden farklı olarak çalışma klasöründe artık `.git` ve `origin=https://github.com/Iliyaxx31/Cafe-Clinic.git` var. Yerel `main` HEAD `3c07d22`, uzaktaki `main` `2fd0031`. Bu teşhis öncesinde çalışma ağacı temizdi; beş yerel commit uzakta yoktu. Bunlar önceki asistan fiyat düzenlemelerinden sonra oluşmuş Git işlemleridir.
- **Asıl engel:** `c9297cc` commit'i `.git.zip` dosyasını eklemiş. Blob `1925662277e7b9de3c2f4799d09314cd95633a39`, boyut **545538455 bayt (~520.27 MiB)**. Dosya mevcut çalışma ağacında ve HEAD ağacında yok, ancak gönderilecek commit geçmişinde hâlâ mevcut. GitHub normal Git gönderiminde 100 MiB üzerindeki dosyaları reddeder; yalnızca dosyayı sonradan silmek veya ignore eklemek geçmişteki blob'u kaldırmaz. Hata konsolu erişilebilir değildi; yerel Git nesnesi ve uzak dal kontrolü somut engeli doğruladı.
- **Ek bulgular:** Son `3c07d22` commit'i adı kaldırmadan söz etse de yalnızca `.gitignore` dosyasını değiştiriyor. Bu dosyada 10 NUL baytı var; UTF-16/UTF-8 karışmış ekleme izleri nedeniyle Git onu binary olarak gösteriyor. `AGENTS.md` içinde commit edilmiş `<<<<<<< HEAD`, `=======`, `>>>>>>> ...` işaretleri vardı; Git index'inde çözülmemiş merge kaydı yoktu.
- **Bu teşhiste yapılan değişiklik:** Yalnızca `AGENTS.md`: boş karşı tarafı olan çatışma işaretleri kaldırılıp tüm rehber korundu; mevcut yetki/durum ve bu teşhis kaydedildi. `.gitignore`, fiyatlar, kaynak kod ve Git geçmişi değiştirilmedi. Push yapılmadı.
- **Çözüm yolu:** Mevcut çalışma ve yerel geçmiş yedeklenerek, uzak `main` tabanına yalnızca amaçlanan fiyat/isim/belge değişiklikleri temiz commit olarak taşınabilir. Böylece arşivli yerel commit zinciri gönderilmez ve uzaktaki geçmişe force push gerekmez. Alternatif geçmiş filtrelemesi dikkatle yapılmalı; gerçek `.git` klasörünü körlemesine silme. `.gitignore` da sonraki düzeltmede düzgün UTF-8 ve ayrı `.git.zip` satırıyla onarılmalı.
- **Doğrulama:** `git rev-list --objects --all`, `git cat-file -s`, `git ls-tree`, `git ls-remote`, yerel/uzak commit karşılaştırması ve `.gitignore` bayt kontrolü. Limit kaynağı: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github

### 2026-09-26 — Büyük arşiv engelinin ve JSON çatışmalarının onarılması

- **Yetki:** Kullanıcı teşhisten sonra “sen yap” diyerek düzeltme ve GitHub gönderimini istedi.
- **Yedek:** Önceki HEAD `3c07d22`, yerel `backup/before-publish-repair-20260926-215925` dalında korunuyor. Beş değişen dosyanın onarım öncesi kopyaları `C:/Users/Green/Desktop/Cafe-Clinic-repair-backup-20260926-215925` altında. Yedek dal arşivli geçmiş içerir; GitHub'a gönderilmemeli.
- **Onarım:** `app/json/data.json` ve `app/menu/data.json` içinde sonradan commit edilmiş merge işaretleri temizlendi; bu sohbetin güncel fiyatları ve E'siz isimleri seçildi. `.gitignore` içindeki NUL baytları temizlenerek UTF-8 yazıldı ve `.git.zip` ayrı satırda dışlandı. Fiyat/ürün dosyaları uzak `main` tabanıyla karşılaştırıldı: yalnızca 20 istenen fiyat (her menüde) ve yedi isim değişikliği var. Diğer fiyatlar, siparişler ve ayarlar korundu.
- **Git yöntemi:** Yedek korunarak `main` uzak `origin/main` üzerine soft reset ile yeniden kurulacak; çalışma dosyaları silinmeden yalnızca beş ilgili dosya temiz commit'e alınacak. Büyük arşivli eski yerel commit zinciri yeni main'in atası olmayacak. Force push gerekmez.
- **Doğrulama:** Node JSON parse ve deep equality karşılaştırmaları başarılı; hedef dışı alanlar uzak sürümle aynı. `git diff --check` başarılı, `git check-ignore .git.zip` başarılı. Uygulama kodu değişmedi; production build yapılmadı.
- **Gönderim durumu:** Temiz commit hazırlanıyor; push sonucu sonraki kayda eklenecek. GitHub'a kod gönderimi ile canlı hosting deploy'u aynı işlem olarak varsayılmamalı.
