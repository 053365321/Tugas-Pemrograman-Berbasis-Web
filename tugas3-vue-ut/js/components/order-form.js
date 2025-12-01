// Komponen untuk form tambah/edit bahan ajar
Vue.component('ba-order-form', {
  template: '#tpl-order-form',
  props: {
    upbjjList: Array,
    kategoriList: Array,
    item: Object,
    mode: {
      type: String,
      default: 'add' // 'add' atau 'edit'
    }
  },
  data() {
    return {
      formData: {
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
    };
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.mode === 'edit') {
          this.formData = { ...newVal };
        }
      }
    }
  },
  methods: {
    submitForm() {
      // Validasi sederhana
      if (!this.formData.kode || !this.formData.judul) {
        alert('Kode dan Judul harus diisi!');
        return;
      }
      
      if (this.mode === 'add') {
        this.$emit('add-item', { ...this.formData });
      } else {
        this.$emit('update-item', { ...this.formData });
      }
      
      this.resetForm();
    },
    
    resetForm() {
      this.formData = {
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
    },
    
    cancel() {
      this.resetForm();
      this.$emit('cancel');
    },
    
    handleKeydown(event) {
      // Submit saat Enter
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.submitForm();
      }
    }
  }
});
