// Root Vue Instance untuk Halaman Tracking
var app = new Vue({
  el: '#app',
  data: {
    pengirimanList: [],
    paket: [],
    tracking: {},
    showForm: false
  },
  async mounted() {
    // Load data dari JSON
    const data = await dataService.loadData();
    if (data) {
      this.pengirimanList = data.pengirimanList || [];
      this.paket = data.paket || [];
      this.tracking = this.convertTracking(data.tracking || []);
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
    }
  },
  methods: {
    // Convert array tracking dari JSON ke object
    convertTracking(trackingArray) {
      const result = {};
      trackingArray.forEach(item => {
        Object.assign(result, item);
      });
      return result;
    },
    
    handleAddDO(formData) {
      const noDO = formData.nomorDO;
      const ekspedisi = this.pengirimanList.find(e => e.kode === formData.ekspedisi);
      
      this.$set(this.tracking, noDO, {
        nim: formData.nim,
        nama: formData.nama,
        status: "Menunggu Pengiriman",
        ekspedisi: ekspedisi ? ekspedisi.nama : formData.ekspedisi,
        tanggalKirim: formData.tanggalKirim,
        paket: formData.paketKode,
        total: formData.total,
        perjalanan: [
          {
            waktu: `${formData.tanggalKirim} ${new Date().toLocaleTimeString('id-ID')}`,
            keterangan: "DO dibuat dan menunggu pengiriman"
          }
        ]
      });
      
      this.showForm = false;
      alert(`Delivery Order ${noDO} berhasil dibuat!`);
    },
    
    handleAddProgress({ noDO, keterangan }) {
      if (this.tracking[noDO]) {
        const now = new Date();
        const waktu = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('id-ID')}`;
        
        this.tracking[noDO].perjalanan.push({
          waktu,
          keterangan
        });
        
        // Update status
        this.tracking[noDO].status = "Dalam Perjalanan";
      }
    },
    
    cancelForm() {
      this.showForm = false;
    }
  }
});
