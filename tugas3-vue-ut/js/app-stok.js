// Root Vue Instance untuk Halaman Stok
var app = new Vue({
  el: '#app',
  data: {
    upbjjList: [],
    kategoriList: [],
    stok: [],
    // Filter states
    filterUpbjj: '',
    filterKategori: '',
    filterReorder: false,
    sortBy: '',
    // Form states
    showAddForm: false,
    editingItem: null
  },
  async mounted() {
    // Load data dari JSON
    const data = await dataService.loadData();
    if (data) {
      this.upbjjList = data.upbjjList || [];
      this.kategoriList = data.kategoriList || [];
      this.stok = data.stok || [];
    }
  },
  computed: {
    // Filtered and sorted stock dengan computed property
    filteredStok() {
      let result = this.stok;
      
      // Filter by upbjj
      if (this.filterUpbjj) {
        result = result.filter(item => item.upbjj === this.filterUpbjj);
      }
      
      // Filter by kategori (dependent on upbjj)
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
    
    // Watcher 2: Monitor filter reorder
    filterReorder(newVal) {
      if (newVal) {
        const count = this.stok.filter(item => 
          item.qty < item.safety || item.qty === 0
        ).length;
        console.log(`Filter Re-order aktif: ${count} item perlu perhatian`);
      }
    }
  },
  methods: {
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterReorder = false;
      this.sortBy = '';
    },
    
    handleAddItem(item) {
      // Cek duplikasi
      const exists = this.stok.find(i => i.kode === item.kode);
      if (exists) {
        alert('Kode MK sudah ada!');
        return;
      }
      
      this.stok.push({ ...item });
      this.showAddForm = false;
      alert('Bahan ajar berhasil ditambahkan!');
    },
    
    handleEditItem(item) {
      this.editingItem = { ...item };
      this.showAddForm = false;
    },
    
    handleUpdateItem(item) {
      const index = this.stok.findIndex(i => i.kode === item.kode);
      if (index !== -1) {
        this.stok.splice(index, 1, { ...item });
        alert('Data berhasil diupdate!');
      }
      this.editingItem = null;
    },
    
    handleDeleteItem(item) {
      const index = this.stok.findIndex(i => i.kode === item.kode);
      if (index !== -1) {
        this.stok.splice(index, 1);
        alert('Data berhasil dihapus!');
      }
    },
    
    cancelForm() {
      this.showAddForm = false;
      this.editingItem = null;
    }
  }
});
