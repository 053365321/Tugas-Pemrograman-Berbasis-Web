var app = new Vue({
  el: '#app',
  data: {
    pengirimanList: [
      { kode: "REG", nama: "JNE Reguler (3-5 hari)" },
      { kode: "EXP", nama: "JNE Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
    ],
    tracking: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },
    showForm: false,
    newDO: {
      nomorDO: '',
      nim: '',
      nama: '',
      ekspedisi: '',
      paketKode: '',
      tanggalKirim: '',
      total: 0
    }
  },
  computed: {
    // Generate nomor DO otomatis
    nextNomorDO() {
      const year = new Date().getFullYear();
      const keys = Object.keys(this.tracking);
      
      if (keys.length === 0) {
        return `DO${year}-0001`;
      }
      
      // Ambil nomor terakhir
      const lastKey = keys[keys.length - 1];
      const lastNum = parseInt(lastKey.split('-')[1]);
      const nextNum = String(lastNum + 1).padStart(4, '0');
      
      return `DO${year}-${nextNum}`;
    },
    
    // Get selected paket detail
    selectedPaket() {
      if (!this.newDO.paketKode) return null;
      return this.paket.find(p => p.kode === this.newDO.paketKode);
    },
    
    // Total harga dari paket yang dipilih
    totalHarga() {
      if (!this.selectedPaket) return 'Rp 0';
      return `Rp ${this.formatHarga(this.selectedPaket.harga)}`;
    }
  },
  watch: {
    // Watcher 1: Update nomor DO ketika form ditampilkan
    showForm(newVal) {
      if (newVal) {
        this.newDO.nomorDO = this.nextNomorDO;
        // Set tanggal hari ini
        const today = new Date().toISOString().split('T')[0];
        this.newDO.tanggalKirim = today;
      }
    },
    
    // Watcher 2: Update total harga ketika paket berubah
    'newDO.paketKode'(newVal) {
      if (newVal && this.selectedPaket) {
        this.newDO.total = this.selectedPaket.harga;
        console.log(`Paket dipilih: ${this.selectedPaket.nama}, Harga: Rp ${this.formatHarga(this.selectedPaket.harga)}`);
      }
    }
  },
  methods: {
    formatHarga(harga) {
      return harga.toLocaleString('id-ID');
    },
    
    tambahDO() {
      // Validasi
      if (!this.newDO.nim || !this.newDO.nama || !this.newDO.ekspedisi || !this.newDO.paketKode) {
        alert('Semua field harus diisi!');
        return;
      }
      
      // Validasi NIM (harus angka)
      if (!/^\d+$/.test(this.newDO.nim)) {
        alert('NIM harus berupa angka!');
        return;
      }
      
      // Buat DO baru
      const nomorDO = this.newDO.nomorDO;
      const ekspedisiNama = this.pengirimanList.find(e => e.kode === this.newDO.ekspedisi).nama;
      
      this.tracking[nomorDO] = {
        nim: this.newDO.nim,
        nama: this.newDO.nama,
        status: "Menunggu Pengiriman",
        ekspedisi: ekspedisiNama,
        tanggalKirim: this.newDO.tanggalKirim,
        paket: this.newDO.paketKode,
        total: this.newDO.total,
        perjalanan: [
          {
            waktu: `${this.newDO.tanggalKirim} ${new Date().toLocaleTimeString('id-ID')}`,
            keterangan: "DO dibuat dan menunggu pengiriman"
          }
        ]
      };
      
      alert(`Delivery Order ${nomorDO} berhasil dibuat!`);
      this.batalForm();
    },
    
    batalForm() {
      this.showForm = false;
      this.newDO = {
        nomorDO: '',
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: '',
        total: 0
      };
    },
    
    getStatusClass(status) {
      const statusMap = {
        'Menunggu Pengiriman': 'pending',
        'Dalam Perjalanan': 'progress',
        'Terkirim': 'delivered'
      };
      return statusMap[status] || 'pending';
    }
  }
});