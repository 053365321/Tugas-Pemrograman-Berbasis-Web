// Komponen untuk filter dan sort stok
Vue.component('ba-stock-filter', {
  template: '#tpl-stock-filter',
  props: {
    upbjjList: Array,
    kategoriList: Array,
    filterUpbjj: String,
    filterKategori: String,
    filterReorder: Boolean,
    sortBy: String
  },
  computed: {
    // Dependent options: kategori hanya muncul jika upbjj dipilih
    availableKategori() {
      if (!this.filterUpbjj) return [];
      return this.kategoriList;
    }
  },
  methods: {
    updateFilterUpbjj(value) {
      this.$emit('update:filterUpbjj', value);
    },
    updateFilterKategori(value) {
      this.$emit('update:filterKategori', value);
    },
    updateFilterReorder(value) {
      this.$emit('update:filterReorder', value);
    },
    updateSortBy(value) {
      this.$emit('update:sortBy', value);
    },
    resetFilter() {
      this.$emit('reset-filter');
    }
  }
});
