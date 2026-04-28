// Small demo data store used when VITE_USE_DEMO_DATA=true
export const demoStore: any = {
  users: [
    { id: 'u1', email: 'customer@demo.com', full_name: 'Demo Customer', role: 'customer' },
    { id: 'u2', email: 'admin@demo.com', full_name: 'Demo Admin', role: 'admin' }
  ],
  profiles: [
    { id: 'p1', user_id: 'u1', phone: '08123456789' }
  ],
  vehicles: [
    { id: 1, name: 'Yamaha NMax', license_plate: 'B 1234 CD', user_id: 'u1' },
    { id: 2, name: 'Yamaha Aerox', license_plate: 'B 5678 EF', user_id: 'u1' }
  ],
  jobs: [
    { id: 1, customer_id: 'u1', vehicle_id: 1, status: 'pending', notes: 'Ganti oli' },
    { id: 2, customer_id: 'u1', vehicle_id: 2, status: 'processing', notes: 'Servis berkala' }
  ],
  kv_store_c1ef5280: [],
  currentUser: { id: 'u1', email: 'customer@demo.com', full_name: 'Demo Customer' }
};

export default demoStore;
