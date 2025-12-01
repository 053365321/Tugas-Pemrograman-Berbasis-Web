// Komponen untuk menampilkan tracking delivery order
Vue.component('do-tracking', {
  template: '#tpl-do-tracking',
  props: {
    tracking: Object
  },
  data() {
    return {
      searchQuery: '',
      searchType: 'noDO' // 'noDO' atau 'nim'
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
    filteredTracking() {
      if (!this.searchQuery) return this.tracking;
      
      const query = this.searchQuery.toLowerCase();
      const result = {};
      
      Object.keys(this.tracking).forEach(noDO => {
        const item = this.tracking[noDO];
        if (this.searchType === 'noDO') {
          if (noDO.toLowerCase().includes(query)) {
            result[noDO] = item;
          }
        } else if (this.searchType === 'nim') {
          if (item.nim && item.nim.includes(query)) {
            result[noDO] = item;
          }
        }
      });
      
      return result;
    }
  },
  methods: {
    getStatusClass(status) {
      const map = {
        'Menunggu Pengiriman': 'pending',
        'Dalam Perjalanan': 'progress',
        'Terkirim': 'delivered'
      };
      return map[status] || 'pending';
    },
    
    handleKeydown(event) {
      if (event.key === 'Enter') {
        // Sudah otomatis search dengan v-model
      } else if (event.key === 'Escape') {
        this.searchQuery = '';
      }
    },
    
    addProgress(noDO) {
      const keterangan = prompt('Masukkan keterangan progress:');
      if (keterangan) {
        this.$emit('add-progress', { noDO, keterangan });
      }
    }
  }
});
