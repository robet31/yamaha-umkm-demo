// Small demo data store used when VITE_USE_DEMO_DATA=true
export const demoStore: any = {
  users: [
    { id: 'u1', email: 'customer@demo.com', full_name: 'Demo Customer', role: 'customer' },
    { id: 'u2', email: 'admin@demo.com', full_name: 'Demo Admin', role: 'admin' },
    { id: 'u3', email: 'technician@demo.com', full_name: 'Demo Technician', role: 'technician' }
  ],
  profiles: [
    { id: 'u1', user_id: 'u1', full_name: 'Demo Customer', phone: '08123456789', role: 'customer', avatar_url: null },
    { id: 'u2', user_id: 'u2', full_name: 'Demo Admin', phone: '08123456780', role: 'admin', avatar_url: null },
    { id: 'u3', user_id: 'u3', full_name: 'Demo Technician', phone: '08123456781', role: 'technician', avatar_url: null }
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
  currentUser: { id: 'u1', email: 'customer@demo.com', full_name: 'Demo Customer', user_metadata: { full_name: 'Demo Customer', role: 'customer' } }
};

export default demoStore;
