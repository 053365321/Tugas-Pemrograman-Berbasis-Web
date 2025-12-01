// Komponen untuk form delivery order baru
Vue.component('do-form', {
  template: '#tpl-do-form',
  props: {
    pengirimanList: Array,
    paket: Array,
    nextNomorDO: String
  },
  data() {
    return {
      formData: {
        nomorDO: '',
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: '',
        total: 0
      }
    };
  },
  filters: {
    currency(value) {
      return `Rp ${value.toLocaleString('id-ID')}`;
    },
    formatDate(dateStr) {
      const months = ['Januari','Februari','Maret','April','Mei','Juni',
                      'Juli','Agustus','September','Oktober','November','Desember'];
      const d = new Date(dateStr);
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  },
  computed: {
    selectedPaket() {
      if (!this.formData.paketKode) return null;
      return this.paket.find(p => p.kode === this.formData.paketKode);
    }
  },
  watch: {
    // Watcher: Update nomor DO saat prop berubah
    nextNomorDO: {
      immediate: true,
      handler(val) {
        this.formData.nomorDO = val;
        // Set tanggal hari ini
        this.formData.tanggalKirim = new Date().toISOString().split('T')[0];
      }
    },
    
    // Watcher: Update total harga saat paket dipilih
    'formData.paketKode'(newVal) {
      if (newVal && this.selectedPaket) {
        this.formData.total = this.selectedPaket.harga;
      }
    }
  },
  methods: {
    submitForm() {
      // Validasi
      if (!this.formData.nim || !this.formData.nama || 
          !this.formData.ekspedisi || !this.formData.paketKode) {
        alert('Semua field harus diisi!');
        return;
      }
      
      if (!/^\d+$/.test(this.formData.nim)) {
        alert('NIM harus berupa angka!');
        return;
      }
      
      this.$emit('add-do', { ...this.formData });
      this.resetForm();
    },
    
    resetForm() {
      this.formData = {
        nomorDO: this.nextNomorDO,
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: new Date().toISOString().split('T')[0],
        total: 0
      };
    },
    
    cancel() {
      this.resetForm();
      this.$emit('cancel');
    },
    
    handleKeydown(event) {
      if (event.key === 'Enter' && event.target.tagName !== 'SELECT') {
        event.preventDefault();
        this.submitForm();
      }
    }
  }
});
