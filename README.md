# pdfSanitizer

pdfSanitizer adalah sebuah API sederhana untuk menguji dan membersihkan file PDF dari potensi serangan XSS.

## Fitur

- **testXss**: Menguji apakah file PDF mengandung potensi serangan XSS.
- **sanitized**: Membersihkan file PDF dari elemen berbahaya yang dapat digunakan untuk serangan XSS.

## Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/Candra-Julius/pdfSanitizer.git
   cd pdfSanitizer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Konfigurasi

Pastikan Anda memiliki Node.js terinstal pada sistem Anda. Konfigurasi tambahan dapat dilakukan di file `.env` jika diperlukan.

### **Instalasi Ghostscript**

Untuk menggunakan pdfSanitizer, Anda wajib menginstal **Ghostscript**.

#### **Windows**

1. Unduh Ghostscript dari [halaman resmi](https://www.ghostscript.com/download/gsdnld.html).
2. Jalankan installer dan ikuti petunjuk instalasi.
3. Pastikan `gswin64c.exe` atau `gswin32c.exe` tersedia di PATH.

#### **Linux**

Jalankan perintah berikut:

```bash
sudo apt update && sudo apt install ghostscript -y  # Untuk Debian/Ubuntu
sudo dnf install ghostscript -y  # Untuk Fedora
sudo pacman -S ghostscript  # Untuk Arch Linux
```

#### **MacOS**

Jalankan perintah berikut:

```bash
brew install ghostscript
```

## Menjalankan Server

Jalankan server dengan perintah berikut:

```bash
npm start
```

Server akan berjalan pada `http://localhost:3000` secara default.

## API Endpoint

### 1. **Test XSS pada PDF**

- **Endpoint**: `POST /testXss`
- **Deskripsi**: Menguji apakah sebuah file PDF mengandung elemen berbahaya untuk XSS.
- **Request**:
  - Form-data dengan key `file` yang berisi file PDF.

### 2. **Sanitasi PDF**

- **Endpoint**: `POST /sanitized`
- **Deskripsi**: Membersihkan file PDF dari potensi ancaman XSS.
- **Request**:
  - Form-data dengan key `file` yang berisi file PDF.

## Teknologi yang Digunakan

- **Node.js**
- **Express.js**
- **PDF parsing & sanitization library**

## Kontribusi

Pull request selalu diterima! Pastikan untuk membuka issue terlebih dahulu jika ingin menambahkan fitur baru.

## Lisensi

Proyek ini menggunakan lisensi ISC. Silakan lihat file `LICENSE` untuk informasi lebih lanjut.

