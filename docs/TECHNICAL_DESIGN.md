# ⚙️ Technical Design — EventX

## 🗂️ Architecture

User <-> React Frontend <-> Smart Wallet (Passkey) <-> Soroban Smart Contract <-> Stellar Blockchain

markdown
Kopyala
Düzenle

## 📌 Components

### 1️⃣ Smart Contracts
- **TicketNFT**
  - Mint: Etkinlik oluşturunca belirlenen miktarda NFT bilet basılır.
  - Transfer: Kullanıcılar bilet devredebilir.
  - Revoke: Organizasyon iptal ederse geri alınır.
- **SecondaryMarket**
  - Bilet devri ve satış bedeli + komisyon.
- **RefundModule**
  - Etkinlik iptali → Otomatik refund.

### 2️⃣ Frontend
- Passkey login
- Etkinlik listesi & bilet satın alma
- QR kod üretimi (bilet detayında)
- QR check-in (organizatör için scanner)
- İkinci el satış ekranı

### 3️⃣ Backend / Automation
- **Launchtube**
  - Bilet devri, refund otomasyonu.
- **Horizon API**
  - Blockchain transaction durumu izleme.

## ✅ Data Flow
1. Kullanıcı Passkey ile giriş yapar.
2. Etkinlik seçer, bilet satın alır → NFT mint.
3. Bilet QR olarak telefonda saklanır.
4. İkinci el satmak isterse: Smart contract üzerinden transfer.
5. Organizasyon iptal ederse: RefundModule devreye girer, para iade.

## 📂 Deployment
- Contracts → Soroban SDK ile Stellar testnet’e deploy edilir.
- Frontend → Vercel/Netlify (sadece demo için)
- Wallet/Passkey → Soroban örnek SDK & Smart Wallet Docs kullan.

## 🔐 Security Notes
- Passkey ile kimlik doğrulama, private key yok.
- Smart contract üzerinde her adım otomatik.
- Launchtube ile işlem maliyetleri minimize.

---

## ✅ Conclusion
EventX, Soroban Smart Contract, Passkey Smart Wallet ve Stellar blockchain özelliklerini kullanarak gerçek hayatta sık rastlanan bilet dolandırıcılığı sorununu çözer. İkinci el bilet satışı ve refund otomasyonu ile sektördeki boşluğu doldurur.

---

