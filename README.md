# Sosial Media Crawling

Crawling data sosial media menggunakan Playwright. Dapat melakukan crawling pada platform-platform seperti Instagram, TikTok, Twitter, dan YouTube.

## Persyaratan

Sebelum Anda mulai, pastikan Anda telah menginstal [Node.js](https://nodejs.org/en/download/) dan npm (Node Package Manager) di komputer Anda. Anda juga memerlukan akun GitHub jika ingin berkontribusi pada proyek ini.

## Instalasi

1. Clone repository ini

    ```bash
    git clone https://github.com/mudaberani/sosmedcrawling.git
    ```

2. Buka direktori proyek:

    ```bash
    cd sosmedcrawling
    ```

3. Install pnpm:

    ```bash
    npm install -g pnpm
    ```

4. Install dependensi:

    ```bash
    pnpm install
    ```

## Penggunaan

1. Buat file `.env` dengan mengikuti format pada file `.env.example` dan mengisi data yang dibutuhkan. Contoh:

    ```env
    INSTAGRAM_USERNAME=your_username
    INSTAGRAM_PASSWORD=your_password
    ```

2. Jalankan perintah

    ```bash
    pnpm start
    ```

3. Hasil crawling akan disimpan pada folder `result`
