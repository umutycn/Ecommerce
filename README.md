# Modern Ecommerce Frontend

Bu proje, React ve Vite ile geliştirilmiş modern bir e-ticaret arayüzüdür. Uygulama; ürün listeleme, gelişmiş filtreleme, favori yönetimi, sepet işlemleri, kupon sistemi ve sipariş özeti gibi temel akışları kapsar.

## 1. Proje Özeti

Uygulamanın temel amacı, kullanıcıya hızlı ve anlaşılır bir ürün keşif ve satın alma deneyimi sunmaktır.

Öne çıkan modüller:
- Ürün listeleme ve kart görünümü
- Arama, filtreleme ve sıralama
- Favori ekleme/çıkarma
- Sepet yönetimi (adet artırma/azaltma, silme, temizleme)
- Demo kupon kuralları
- Sipariş özeti kırılımı (ara toplam, indirim, kargo, genel toplam)
- Loading/empty/error ekran standardizasyonu

## 2. Kullanılan Teknolojiler

- React 18
- React Router DOM 6
- Vite 5
- Tailwind CSS 3
- React Hot Toast

## 3. Kurulum

### Gereksinimler
- Node.js 18+
- npm 9+

### Adımlar
1. Bağımlılıkları kurun:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Üretim derlemesi alın:

```bash
npm run build
```

4. Derlemeyi önizleyin:

```bash
npm run preview
```

## 4. NPM Scriptleri

- `npm run dev`: Vite geliştirme sunucusunu başlatır.
- `npm run build`: Üretim derlemesi oluşturur.
- `npm run preview`: Derleme çıktısını lokal olarak önizler.

## 5. Uygulama Akışları

### 5.1 Ana Sayfa (Ürün Listeleme)

Ana sayfada ürün listesi aşağıdaki kriterlerle yönetilir:
- Metin arama
- Kategori filtresi
- Fiyat aralığı filtresi
- Minimum puan filtresi
- Stokta olanlar filtresi
- Sadece favoriler filtresi
- Sıralama (popülerlik, fiyat, puan)

Filtreler URL query parametreleri ile senkron çalışır. Sayfa yenilense dahi seçili filtreler korunur.

### 5.2 Arama Önerisi (Autocomplete)

Arama kutusu aşağıdaki davranışları içerir:
- Yazarken öneri listesi
- Klavye ile gezinme (`ArrowUp`, `ArrowDown`)
- `Enter` ile öneri seçme
- `Escape` ile liste kapatma

### 5.3 Favoriler

Her ürün kartında favori butonu bulunur.
- Favoriye ekle/çıkar işlemi kart üzerinden yapılır.
- Favoriler `localStorage` üzerinde saklanır.
- Ana sayfada `Sadece Favoriler` filtresi ile görüntülenebilir.

### 5.4 Sepet

Sepet sayfasında:
- Ürün adet artırma/azaltma
- Ürün silme
- Sepeti tamamen temizleme

işlemleri mevcuttur.

### 5.5 Kupon Sistemi (Demo)

Desteklenen kupon kodları:
- `WELCOME10`: yüzde 10 indirim
- `SAVE150`: 150 TL indirim (minimum 2000 TL)
- `MEGA20`: yüzde 20 indirim (minimum 5000 TL, maksimum 1200 TL indirim)

Ek kurallar:
- Uygulanan kupon `localStorage` üzerinde saklanır.
- Sepet tutarı kupon şartının altına düşerse kupon kayıtlı kalır fakat indirim uygulanmaz.

### 5.6 Sipariş Özeti Kırılımı

Sipariş özeti satırları:
- Ara Toplam
- Kupon İndirimi
- Kargo
- Genel Toplam

Kargo kuralı:
- `3000 TL` ve üzeri ücretsiz
- altı için sabit kargo bedeli uygulanır

### 5.7 Durum Ekranları

Uygulamada loading/empty/error ekranları ortak bileşen ile standardize edilmiştir.

Kullanım alanları:
- Ana sayfa ürün yükleme hatası
- Ana sayfa boş sonuç
- Sepet boş durumu

## 6. Ekran Görüntüleri

Bu repoda henüz uygulama ekran görüntüsü dosyaları ayrı bir klasörde tutulmamaktadır.

README içine ekran görüntüsü eklemek için önerilen yapı:

```text
docs/
	screenshots/
		home.png
		cart.png
```

Örnek Markdown kullanımı:

```md
![Ana Sayfa](docs/screenshots/home.png)
![Sepet Sayfası](docs/screenshots/cart.png)
```

Not:
- Ürün görselleri `src/img/` altındadır; bunlar uygulama içi ürün kartları için kullanılır.
- README ekran görüntüleri için ayrı bir klasör kullanmak bakım açısından daha sağlıklıdır.

## 7. Veri ve Kalıcılık

### 6.1 Ürün Verisi
- Ürün mock verileri: `src/data/demoProducts.js`
- Ürün görselleri: `src/img/`

### 6.2 LocalStorage Anahtarları
- `modern-shop-cart`: Sepet verisi
- `favoriteProductIds`: Favori ürün ID listesi
- `appliedCouponCode`: Uygulanan kupon kodu

## 8. Dosya Yapısı (Özet)

```text
src/
	components/
		Navbar.jsx
		ProductCard.jsx
		ProductSkeleton.jsx
		StateView.jsx
	context/
		CartContext.jsx
	data/
		demoProducts.js
	hooks/
		useLocalStorage.js
	pages/
		Home.jsx
		Cart.jsx
	img/
		...urun gorselleri...
```

## 9. Geliştirme Notları

- Filtre state'i tek bir obje altında yönetilir (`productQuery`).
- Query-string senkronu sayesinde paylaşılabilir filtreli URL üretilebilir.
- Görseller lokal dosyalardan beslendiği için dış URL erişim sorunları minimize edilmiştir.
- Kart görselleri kutuya sığacak şekilde ölçeklenir (`object-contain`).

## 10. Olası Sonraki Adımlar

- Gerçek backend API entegrasyonu
- Ürün detay sayfasının veriyle bağlanması
- E2E test senaryoları (arama, sepet, kupon)
- Kullanıcı oturumu ve sipariş geçmişi modülü
- Admin paneli (ürün/stock yönetimi)

## 11. Lisans

Bu proje kişisel ve eğitim amaçlı kullanım için hazırlanmıştır. İhtiyaca göre lisans dosyası (`LICENSE`) ekleyebilirsiniz.