var app = new Vue({
  el: '#app',
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      },
      {
        kode: "MATH4101",
        judul: "Kalkulus I",
        kategori: "MK Wajib",
        upbjj: "Padang",
        lokasiRak: "R1-B1",
        harga: 70000,
        qty: 0,
        safety: 15,
        catatanHTML: "<strong>Kosong!</strong> Segera reorder"
      }
    ],
    // Filter states
    filterUpbjj: '',
    filterKategori: '',
    filterReorder: false,
    sortBy: '',
    // Form states
    showAddForm: false,
    editingItem: null,
    newItem: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    }
  },
  computed: {
    // Dependent options: kategori hanya muncul jika upbjj dipilih
    availableKategori() {
      if (!this.filterUpbjj) return [];
      
      const kategoriSet = new Set();
      this.stok.forEach(item => {
        if (item.upbjj === this.filterUpbjj) {
          kategoriSet.add(item.kategori);
        }
      });
      return Array.from(kategoriSet);
    },
    
    // Filtered and sorted stock
    filteredStok() {
      let result = this.stok;
      
      // Filter by upbjj
      if (this.filterUpbjj) {
        result = result.filter(item => item.upbjj === this.filterUpbjj);
      }
      
      // Filter by kategori
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }
      
      // Filter reorder (qty < safety atau qty = 0)
      if (this.filterReorder) {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }
      
      // Sort
      if (this.sortBy === 'judul') {
        result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (this.sortBy === 'qty') {
        result = result.slice().sort((a, b) => a.qty - b.qty);
      } else if (this.sortBy === 'harga') {
        result = result.slice().sort((a, b) => a.harga - b.harga);
      }
      
      return result;
    }
  },
  watch: {
    // Watcher 1: Reset kategori filter ketika upbjj berubah
    filterUpbjj(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.filterKategori = '';
      }
    },
    
    // Watcher 2: Monitor filter reorder untuk alert
    filterReorder(newVal) {
      if (newVal) {
        const reorderCount = this.stok.filter(item => 
          item.qty < item.safety || item.qty === 0
        ).length;
        console.log(`Filter Re-order aktif: ${reorderCount} item perlu perhatian`);
      }
    }
  },
  methods: {
    formatHarga(harga) {
      return harga.toLocaleString('id-ID');
    },
    
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterReorder = false;
      this.sortBy = '';
    },
    
    tambahBahanAjar() {
      // Validasi sederhana
      if (!this.newItem.kode || !this.newItem.judul) {
        alert('Kode dan Judul harus diisi!');
        return;
      }
      
      // Cek duplikasi kode
      const exists = this.stok.find(item => item.kode === this.newItem.kode);
      if (exists) {
        alert('Kode MK sudah ada!');
        return;
      }
      
      // Tambahkan ke stok
      this.stok.push({ ...this.newItem });
      
      // Reset form
      this.newItem = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      };
      this.showAddForm = false;
      
      alert('Bahan ajar berhasil ditambahkan!');
    },
    
    editItem(item) {
      this.editingItem = { ...item };
      this.showAddForm = false;
    },
    
    simpanEdit() {
      const index = this.stok.findIndex(item => item.kode === this.editingItem.kode);
      if (index !== -1) {
        this.stok.splice(index, 1, { ...this.editingItem });
        alert('Data berhasil diupdate!');
      }
      this.editingItem = null;
    }
  }
});