// Komponen untuk menampilkan tabel stok bahan ajar
Vue.component('ba-stock-table', {
  template: '#tpl-stock-table',
  props: {
    stok: {
      type: Array,
      required: true
    }
  },
  filters: {
    // Filter untuk format harga
    currency(value) {
      return `Rp ${value.toLocaleString('id-ID')}`;
    },
    // Filter untuk format qty dengan satuan
    qty(value) {
      return `${value} buah`;
    }
  },
  methods: {
    editItem(item) {
      this.$emit('edit-item', item);
    },
    
    deleteItem(item) {
      if (confirm(`Hapus bahan ajar "${item.judul}"?`)) {
        this.$emit('delete-item', item);
      }
    },
    
    getStatusClass(item) {
      if (item.qty === 0) return 'status-kosong';
      if (item.qty < item.safety) return 'status-menipis';
      return 'status-aman';
    },
    
    getStatusText(item) {
      if (item.qty === 0) return '❌ Kosong';
      if (item.qty < item.safety) return '⚠️ Menipis';
      return '✅ Aman';
    }
  }
});
