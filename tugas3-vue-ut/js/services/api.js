// Data Service untuk mengakses dataBahanAjar.json
const dataService = {
  data: null,
  
  async loadData() {
    if (this.data) return this.data;
    
    try {
      const response = await fetch('/data/dataBahanAjar.json');
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },
  
  getData() {
    return this.data;
  }
};
