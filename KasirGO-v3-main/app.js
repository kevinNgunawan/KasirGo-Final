/* ══════════════════════════════════════
   KasirGO — app.js  v4.0 (Unified Fix)
   Semua fitur disatukan, tidak ada konflik fungsi ganda
   ══════════════════════════════════════ */

// ═══════════════ STORAGE HELPERS ═══════════════
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ═══════════════ DATA ═══════════════
let accounts = LS.get('kg_accounts', [
  { username:'admin', password:'admin123', namaUsaha:'KasirGO Store', logo:'', alamat:'Jl. Sudirman No. 123, Jakarta', telp:'021-12345678', role:'admin' }
]);

let currentUser = LS.get('kg_currentUser', null);

let settings = LS.get('kg_settings', {
  namaUsaha: 'KasirGO Store',
  logo:       '',
  alamat:     'Jl. Sudirman No. 123, Jakarta',
  telp:       '021-12345678',
  ppn:        11,
  ppnAktif:   true,
  header:     'Terima kasih telah berbelanja!',
  footer:     'Barang yang sudah dibeli tidak dapat dikembalikan.',
});

let kategori = LS.get('kg_kategori', [
  { id:1, nama:'Minuman',    icon:'fa-solid fa-mug-hot' },
  { id:2, nama:'Makanan',    icon:'fa-solid fa-burger' },
  { id:3, nama:'Snack',      icon:'fa-solid fa-cookie' },
  { id:4, nama:'Sembako',    icon:'fa-solid fa-wheat-awn' },
  { id:5, nama:'Kebersihan', icon:'fa-solid fa-soap' },
]);

let produk = LS.get('kg_produk', [
  { id:1,  barcode:'8991234000001', nama:'Kopi Susu Sachet',      kategori_id:1, satuan:'pcs',  harga_beli:4000,  harga_jual:7000,  stok:50, gambar:'' },
  { id:2,  barcode:'8991234000002', nama:'Teh Botol Sosro',       kategori_id:1, satuan:'pcs',  harga_beli:4500,  harga_jual:8000,  stok:3,  gambar:'' },
  { id:3,  barcode:'8991234000003', nama:'Air Mineral 600ml',     kategori_id:1, satuan:'pcs',  harga_beli:2500,  harga_jual:4000,  stok:80, gambar:'' },
  { id:4,  barcode:'8991234000004', nama:'Nasi Goreng Spesial',   kategori_id:2, satuan:'pcs',  harga_beli:8000,  harga_jual:15000, stok:20, gambar:'' },
  { id:5,  barcode:'8991234000005', nama:'Mie Ayam Bakso',        kategori_id:2, satuan:'pcs',  harga_beli:7000,  harga_jual:13000, stok:4,  gambar:'' },
  { id:6,  barcode:'8991234000006', nama:'Risoles Mayo',          kategori_id:2, satuan:'pcs',  harga_beli:3000,  harga_jual:6000,  stok:15, gambar:'' },
  { id:7,  barcode:'8991234000007', nama:'Chitato Sapi Panggang', kategori_id:3, satuan:'pcs',  harga_beli:8000,  harga_jual:14000, stok:2,  gambar:'' },
  { id:8,  barcode:'8991234000008', nama:'Oreo Biskuit',          kategori_id:3, satuan:'pcs',  harga_beli:5000,  harga_jual:9000,  stok:25, gambar:'' },
  { id:9,  barcode:'8991234000009', nama:'Beras 5kg',             kategori_id:4, satuan:'kg',   harga_beli:62000, harga_jual:75000, stok:10, gambar:'' },
  { id:10, barcode:'8991234000010', nama:'Minyak Goreng 1L',      kategori_id:4, satuan:'liter',harga_beli:14000, harga_jual:18000, stok:8,  gambar:'' },
  { id:11, barcode:'8991234000011', nama:'Sabun Mandi Lifebuoy',  kategori_id:5, satuan:'pcs',  harga_beli:5500,  harga_jual:9000,  stok:30, gambar:'' },
  { id:12, barcode:'8991234000012', nama:'Shampo Sunsilk',        kategori_id:5, satuan:'pcs',  harga_beli:9000,  harga_jual:15000, stok:1,  gambar:'' },
]);

let transaksi = LS.get('kg_transaksi', [
  { id:1,  invoice:'INV-0001', tanggal:'2026-03-19', waktu:'08:30', pelanggan:'Umum', items:[{produk_id:1,qty:3},{produk_id:3,qty:2}], snapItems:[{produk_id:1,nama:'Kopi Susu Sachet',harga:7000,qty:3,subtotal:21000},{produk_id:3,nama:'Air Mineral 600ml',harga:4000,qty:2,subtotal:8000}], subtotal:29000, diskon:0, afterDiskon:29000, ppn:3190, total:32190, bayar:35000, kembali:2810, metode:'tunai', kasir:'admin' },
  { id:2,  invoice:'INV-0002', tanggal:'2026-03-19', waktu:'09:15', pelanggan:'Umum', items:[{produk_id:4,qty:2},{produk_id:6,qty:3}], snapItems:[{produk_id:4,nama:'Nasi Goreng Spesial',harga:15000,qty:2,subtotal:30000},{produk_id:6,nama:'Risoles Mayo',harga:6000,qty:3,subtotal:18000}], subtotal:48000, diskon:0, afterDiskon:48000, ppn:5280, total:53280, bayar:53280, kembali:0, metode:'qris', kasir:'admin' },
  { id:3,  invoice:'INV-0003', tanggal:'2026-03-20', waktu:'10:45', pelanggan:'Budi', items:[{produk_id:9,qty:1},{produk_id:10,qty:2}], snapItems:[{produk_id:9,nama:'Beras 5kg',harga:75000,qty:1,subtotal:75000},{produk_id:10,nama:'Minyak Goreng 1L',harga:18000,qty:2,subtotal:36000}], subtotal:111000, diskon:5, afterDiskon:105450, ppn:11600, total:117050, bayar:120000, kembali:2950, metode:'tunai', kasir:'admin' },
  { id:4,  invoice:'INV-0004', tanggal:'2026-03-20', waktu:'11:20', pelanggan:'Umum', items:[{produk_id:2,qty:4},{produk_id:8,qty:2}], snapItems:[{produk_id:2,nama:'Teh Botol Sosro',harga:8000,qty:4,subtotal:32000},{produk_id:8,nama:'Oreo Biskuit',harga:9000,qty:2,subtotal:18000}], subtotal:50000, diskon:0, afterDiskon:50000, ppn:5500, total:55500, bayar:55500, kembali:0, metode:'debit', kasir:'admin' },
  { id:5,  invoice:'INV-0005', tanggal:'2026-03-21', waktu:'13:00', pelanggan:'Sari', items:[{produk_id:11,qty:3},{produk_id:3,qty:5}], snapItems:[{produk_id:11,nama:'Sabun Mandi Lifebuoy',harga:9000,qty:3,subtotal:27000},{produk_id:3,nama:'Air Mineral 600ml',harga:4000,qty:5,subtotal:20000}], subtotal:47000, diskon:0, afterDiskon:47000, ppn:5170, total:52170, bayar:52170, kembali:0, metode:'qris', kasir:'admin' },
  { id:6,  invoice:'INV-0006', tanggal:'2026-03-21', waktu:'14:30', pelanggan:'Umum', items:[{produk_id:1,qty:5},{produk_id:7,qty:2}], snapItems:[{produk_id:1,nama:'Kopi Susu Sachet',harga:7000,qty:5,subtotal:35000},{produk_id:7,nama:'Chitato Sapi Panggang',harga:14000,qty:2,subtotal:28000}], subtotal:63000, diskon:10, afterDiskon:56700, ppn:6237, total:62937, bayar:65000, kembali:2063, metode:'tunai', kasir:'admin' },
  { id:7,  invoice:'INV-0007', tanggal:'2026-03-22', waktu:'12:00', pelanggan:'Rudi', items:[{produk_id:4,qty:1},{produk_id:5,qty:1}], snapItems:[{produk_id:4,nama:'Nasi Goreng Spesial',harga:15000,qty:1,subtotal:15000},{produk_id:5,nama:'Mie Ayam Bakso',harga:13000,qty:1,subtotal:13000}], subtotal:28000, diskon:0, afterDiskon:28000, ppn:3080, total:31080, bayar:35000, kembali:3920, metode:'tunai', kasir:'admin' },
  { id:8,  invoice:'INV-0008', tanggal:'2026-03-22', waktu:'15:45', pelanggan:'Umum', items:[{produk_id:6,qty:4},{produk_id:8,qty:3}], snapItems:[{produk_id:6,nama:'Risoles Mayo',harga:6000,qty:4,subtotal:24000},{produk_id:8,nama:'Oreo Biskuit',harga:9000,qty:3,subtotal:27000}], subtotal:51000, diskon:0, afterDiskon:51000, ppn:5610, total:56610, bayar:56610, kembali:0, metode:'debit', kasir:'admin' },
  { id:9,  invoice:'INV-0009', tanggal:'2026-03-23', waktu:'09:00', pelanggan:'Ani',  items:[{produk_id:9,qty:2},{produk_id:11,qty:2}], snapItems:[{produk_id:9,nama:'Beras 5kg',harga:75000,qty:2,subtotal:150000},{produk_id:11,nama:'Sabun Mandi Lifebuoy',harga:9000,qty:2,subtotal:18000}], subtotal:168000, diskon:0, afterDiskon:168000, ppn:18480, total:186480, bayar:200000, kembali:13520, metode:'tunai', kasir:'admin' },
  { id:10, invoice:'INV-0010', tanggal:'2026-03-23', waktu:'16:20', pelanggan:'Umum', items:[{produk_id:3,qty:10},{produk_id:2,qty:5}], snapItems:[{produk_id:3,nama:'Air Mineral 600ml',harga:4000,qty:10,subtotal:40000},{produk_id:2,nama:'Teh Botol Sosro',harga:8000,qty:5,subtotal:40000}], subtotal:80000, diskon:5, afterDiskon:76000, ppn:8360, total:84360, bayar:84360, kembali:0, metode:'qris', kasir:'admin' },
  { id:11, invoice:'INV-0011', tanggal:'2026-03-24', waktu:'10:10', pelanggan:'Deni', items:[{produk_id:1,qty:6},{produk_id:7,qty:1}], snapItems:[{produk_id:1,nama:'Kopi Susu Sachet',harga:7000,qty:6,subtotal:42000},{produk_id:7,nama:'Chitato Sapi Panggang',harga:14000,qty:1,subtotal:14000}], subtotal:56000, diskon:0, afterDiskon:56000, ppn:6160, total:62160, bayar:65000, kembali:2840, metode:'tunai', kasir:'admin' },
  { id:12, invoice:'INV-0012', tanggal:'2026-03-24', waktu:'11:55', pelanggan:'Umum', items:[{produk_id:10,qty:3},{produk_id:6,qty:2}], snapItems:[{produk_id:10,nama:'Minyak Goreng 1L',harga:18000,qty:3,subtotal:54000},{produk_id:6,nama:'Risoles Mayo',harga:6000,qty:2,subtotal:12000}], subtotal:66000, diskon:0, afterDiskon:66000, ppn:7260, total:73260, bayar:75000, kembali:1740, metode:'tunai', kasir:'admin' },
  { id:13, invoice:'INV-0013', tanggal:'2026-03-25', waktu:'14:00', pelanggan:'Rina', items:[{produk_id:12,qty:2},{produk_id:8,qty:4}], snapItems:[{produk_id:12,nama:'Shampo Sunsilk',harga:15000,qty:2,subtotal:30000},{produk_id:8,nama:'Oreo Biskuit',harga:9000,qty:4,subtotal:36000}], subtotal:66000, diskon:5, afterDiskon:62700, ppn:6897, total:69597, bayar:69597, kembali:0, metode:'debit', kasir:'admin' },
  { id:14, invoice:'INV-0014', tanggal:'2026-03-25', waktu:'17:30', pelanggan:'Umum', items:[{produk_id:5,qty:3},{produk_id:3,qty:8}], snapItems:[{produk_id:5,nama:'Mie Ayam Bakso',harga:13000,qty:3,subtotal:39000},{produk_id:3,nama:'Air Mineral 600ml',harga:4000,qty:8,subtotal:32000}], subtotal:71000, diskon:0, afterDiskon:71000, ppn:7810, total:78810, bayar:80000, kembali:1190, metode:'tunai', kasir:'admin' },
  { id:15, invoice:'INV-0015', tanggal:'2026-03-26', waktu:'08:45', pelanggan:'Hendra', items:[{produk_id:1,qty:4},{produk_id:11,qty:2}], snapItems:[{produk_id:1,nama:'Kopi Susu Sachet',harga:7000,qty:4,subtotal:28000},{produk_id:11,nama:'Sabun Mandi Lifebuoy',harga:9000,qty:2,subtotal:18000}], subtotal:46000, diskon:0, afterDiskon:46000, ppn:5060, total:51060, bayar:51060, kembali:0, metode:'qris', kasir:'admin' },
]);

// ─── Hutang / Piutang ───
let hutangPiutang = LS.get('kg_hutang', [
  { id:1, jenis:'hutang',  nama:'Budi Santoso',  telp:'081234567890', jumlah:150000, tglCatat:'2026-04-01', jatuhTempo:'2026-04-21', status:'aktif',  keterangan:'Beli beras + minyak',      sisa:150000 },
  { id:2, jenis:'piutang', nama:'Toko Maju Jaya', telp:'082345678901', jumlah:500000, tglCatat:'2026-04-05', jatuhTempo:'2026-04-25', status:'aktif',  keterangan:'Hutang ke supplier sayur', sisa:500000 },
  { id:3, jenis:'hutang',  nama:'Sari Dewi',       telp:'083456789012', jumlah:75000,  tglCatat:'2026-04-10', jatuhTempo:'2026-04-20', status:'aktif',  keterangan:'Belanja minuman & snack',  sisa:75000  },
  { id:4, jenis:'hutang',  nama:'Rudi Hartono',    telp:'',             jumlah:200000, tglCatat:'2026-03-20', jatuhTempo:'2026-04-05', status:'lunas',  keterangan:'Sembako bulanan',          sisa:0      },
]);

// ═══════════════ STATE ═══════════════
let cart          = [];
let payMethod     = 'tunai';
let editProdukId  = null;
let editKategoriId= null;
let editHutangId  = null;
let hutangFilter  = 'semua';
let dtProduk      = null;
let dtLaporan     = null;
let lastStruk     = null;
let shiftStartTime= LS.get('kg_shiftStart', null);

// ═══════════════ PERSIST (UNIFIED) ═══════════════
function saveData() {
  LS.set('kg_kategori',  kategori);
  LS.set('kg_produk',    produk);
  LS.set('kg_transaksi', transaksi);
  LS.set('kg_settings',  settings);
  LS.set('kg_hutang',    hutangPiutang);
  _updateNavBadges();
}

// ═══════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════
function switchAuth(panel) {
  document.getElementById('panelLogin').style.display  = panel === 'login'  ? '' : 'none';
  document.getElementById('panelDaftar').style.display = panel === 'daftar' ? '' : 'none';
}

function doLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) { showToast('Isi username dan password!', 'warning'); return; }
  const acc = accounts.find(a => a.username === username && a.password === password);
  if (!acc) { showToast('Username atau password salah!', 'error'); return; }
  currentUser = { username: acc.username, namaUsaha: acc.namaUsaha };
  LS.set('kg_currentUser', currentUser);
  settings.namaUsaha = acc.namaUsaha || settings.namaUsaha;
  settings.logo      = acc.logo      || settings.logo;
  settings.alamat    = acc.alamat    || settings.alamat;
  settings.telp      = acc.telp      || settings.telp;
  saveData();
  applyBranding();
  showApp();
  showToast(`Selamat datang, ${acc.username}! 🎉`, 'success');
}

function doRegister() {
  const namaUsaha = document.getElementById('regNamaUsaha').value.trim();
  const username  = document.getElementById('regUsername').value.trim();
  const password  = document.getElementById('regPassword').value;
  const confirm   = document.getElementById('regConfirm').value;
  if (!namaUsaha) { showToast('Nama usaha wajib diisi!', 'error'); return; }
  if (!username)  { showToast('Username wajib diisi!', 'error'); return; }
  if (password.length < 6) { showToast('Password minimal 6 karakter!', 'error'); return; }
  if (password !== confirm) { showToast('Konfirmasi password tidak cocok!', 'error'); return; }
  if (accounts.find(a => a.username === username)) { showToast('Username sudah digunakan!', 'error'); return; }
  accounts.push({ username, password, namaUsaha, logo:'', alamat:'', telp:'', role:'admin' });
  LS.set('kg_accounts', accounts);
  showToast('Akun berhasil dibuat! Silakan masuk.', 'success');
  ['regNamaUsaha','regUsername','regPassword','regConfirm'].forEach(id => document.getElementById(id).value = '');
  switchAuth('login');
}

function doLogout() {
  Swal.fire({
    title: 'Keluar?', text: 'Anda akan keluar dari KasirGO.', icon: 'question',
    showCancelButton: true, confirmButtonColor: '#4a90e2', cancelButtonColor: '#aaa',
    confirmButtonText: 'Ya, keluar', cancelButtonText: 'Batal'
  }).then(r => {
    if (r.isConfirmed) {
      currentUser = null;
      LS.set('kg_currentUser', null);
      cart = [];
      destroyDT('produk'); destroyDT('laporan');
      document.getElementById('appWrapper').style.display  = 'none';
      document.getElementById('authWrapper').style.display = '';
      document.getElementById('loginUsername').value = '';
      document.getElementById('loginPassword').value = '';
    }
  });
}

function togglePwd(id, btn) {
  const inp  = document.getElementById(id);
  const icon = btn.querySelector('i');
  if (inp.type === 'password') { inp.type = 'text';     icon.className = 'fa-solid fa-eye-slash'; }
  else                         { inp.type = 'password'; icon.className = 'fa-solid fa-eye'; }
}

function showApp() {
  document.getElementById('authWrapper').style.display = 'none';
  document.getElementById('appWrapper').style.display  = '';
  initApp();
}

// ═══════════════ APP INIT (UNIFIED) ═══════════════
function initApp() {
  applyBranding();
  setDate();
  renderDashboard();
  _renderDashExtras();
  renderProdukGrid();
  populateKategoriFilter();
  updateInvNum();
  _updateNavBadges();
  if (!shiftStartTime) {
    shiftStartTime = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
    LS.set('kg_shiftStart', shiftStartTime);
  }
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function applyBranding() {
  const nama = settings.namaUsaha || 'KasirGO';
  const logo = settings.logo || '';
  const logoEl = document.getElementById('sidebarLogoImg');
  if (logoEl) { if (logo) logoEl.innerHTML = `<img src="${logo}" alt="logo"/>`; else logoEl.innerHTML = `<i class="fa-solid fa-cash-register"></i>`; }
  const sAppName    = document.getElementById('sidebarAppName');    if (sAppName)    sAppName.textContent    = nama;
  const sNamaUsaha  = document.getElementById('sidebarNamaUsaha');  if (sNamaUsaha)  sNamaUsaha.textContent  = currentUser?.namaUsaha || nama;
  const sUsername   = document.getElementById('sidebarUsername');   if (sUsername)   sUsername.textContent   = currentUser?.username || 'Admin';
  const sAvatar     = document.getElementById('sidebarAvatar');     if (sAvatar)     sAvatar.textContent     = (currentUser?.username || 'A')[0].toUpperCase();
  const mAppName    = document.getElementById('mobileAppName');     if (mAppName)    mAppName.textContent    = nama;
  const loginAppName= document.getElementById('loginAppName');      if (loginAppName) loginAppName.textContent= nama;
  const loginAppSub = document.getElementById('loginAppSub');       if (loginAppSub)  loginAppSub.textContent = settings.alamat || 'Aplikasi Kasir Modern';
  const loginLogoImg= document.getElementById('loginLogoImg');
  if (loginLogoImg) { if (logo) loginLogoImg.innerHTML = `<img src="${logo}" alt="logo"/>`; else loginLogoImg.innerHTML = `<i class="fa-solid fa-cash-register"></i>`; }
  const sNamaUsahaInput = document.getElementById('settNamaUsaha');
  if (sNamaUsahaInput) {
    sNamaUsahaInput.value = settings.namaUsaha || '';
    document.getElementById('settAlamat').value     = settings.alamat  || '';
    document.getElementById('settTelp').value       = settings.telp    || '';
    document.getElementById('settPpn').value        = settings.ppn     || 11;
    document.getElementById('settPpnAktif').checked = settings.ppnAktif !== false;
    document.getElementById('settHeader').value     = settings.header  || '';
    document.getElementById('settFooter').value     = settings.footer  || '';
    if (logo) { document.getElementById('logoPreviewWrap').innerHTML = `<img src="${logo}" alt="logo"/><div style="font-size:11px;color:var(--text-muted);margin-top:4px">Klik untuk ganti logo</div>`; }
  }
  const ppnLabel = document.getElementById('ppnPctLabel'); if (ppnLabel) ppnLabel.textContent = settings.ppn || 11;
  const ppnRow   = document.getElementById('ppnRow');      if (ppnRow)   ppnRow.style.display = settings.ppnAktif !== false ? '' : 'none';
}

function setDate() {
  const now = new Date();
  const s = now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  ['dashDate','txDate'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = s; });
}

// ═══════════════ NAVIGATION (UNIFIED) ═══════════════
function showPage(pageId, el) {
  if (window.innerWidth < 992) toggleSidebar(false);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + pageId);
  if (pageEl) pageEl.classList.add('active');
  if (el) el.classList.add('active');

  if (pageId === 'dashboard')  { renderDashboard(); _renderDashExtras(); }
  if (pageId === 'transaksi')  { renderProdukGrid(); _showStokNotifBar(); }
  if (pageId === 'produk')     { buildTableProduk(); _showStokNotifBar(); }
  if (pageId === 'kategori')   renderKategori();
  if (pageId === 'hutang')     renderHutangPage();
  if (pageId === 'laporan')    buildTableLaporan();
  if (pageId === 'kasir')      renderKasirPage();
  if (pageId === 'pengaturan') applyBranding();
}

function toggleSidebar(force) {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const open = force !== undefined ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  ov.classList.toggle('open', open);
}

// ═══════════════ TOAST ═══════════════
function showToast(msg, type='success') {
  const icons = { success:'fa-check', error:'fa-xmark', warning:'fa-exclamation', info:'fa-info' };
  const t = document.createElement('div');
  t.className = `toast-item ${type}`;
  t.innerHTML = `<div class="toast-icon"><i class="fa-solid ${icons[type]}"></i></div><div class="toast-msg">${msg}</div><button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => { t.style.animation='slideOut .3s ease forwards'; setTimeout(()=>t.remove(),300); }, 3500);
}

// ═══════════════ NAV BADGES ═══════════════
function _updateNavBadges() {
  const lowCount  = produk.filter(p => p.stok < 5).length;
  const stokBadge = document.getElementById('navStokBadge');
  if (stokBadge) {
    stokBadge.textContent    = lowCount;
    stokBadge.style.display  = lowCount > 0 ? '' : 'none';
  }
  const today       = new Date().toISOString().split('T')[0];
  const jatuhTempo  = hutangPiutang.filter(h => h.status === 'aktif' && h.jenis === 'hutang' && h.jatuhTempo && h.jatuhTempo <= today).length;
  const aktifCount  = hutangPiutang.filter(h => h.status === 'aktif').length;
  const hutangBadge = document.getElementById('navHutangBadge');
  if (hutangBadge) {
    if (jatuhTempo > 0)      { hutangBadge.textContent = jatuhTempo + ' JT'; hutangBadge.style.display = ''; }
    else if (aktifCount > 0) { hutangBadge.textContent = aktifCount;          hutangBadge.style.display = ''; }
    else                       hutangBadge.style.display = 'none';
  }
}

// ═══════════════ STOK NOTIF BAR ═══════════════
function _showStokNotifBar() {
  const old = document.getElementById('stokNotifBar');
  if (old) old.remove();
  const kritis  = produk.filter(p => p.stok === 0);
  const menipis = produk.filter(p => p.stok > 0 && p.stok < 5);
  if (kritis.length === 0 && menipis.length === 0) return;
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  const pageHeader = activePage.querySelector('.page-header');
  if (!pageHeader) return;
  const bar = document.createElement('div');
  bar.id = 'stokNotifBar';
  bar.className = 'stok-notif-bar';
  bar.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation"></i>
    <span>
      ${kritis.length > 0 ? `<strong style="color:var(--red)">${kritis.length} produk STOK HABIS</strong>` : ''}
      ${kritis.length > 0 && menipis.length > 0 ? ' &amp; ' : ''}
      ${menipis.length > 0 ? `<strong style="color:var(--yellow)">${menipis.length} produk stok menipis (&lt;5)</strong>` : ''}
      — segera lakukan restock!
    </span>
    <button class="snb-close" onclick="this.parentElement.remove()" title="Tutup"><i class="fa-solid fa-xmark"></i></button>`;
  pageHeader.after(bar);
}

// Auto cek stok setiap 30 menit
setInterval(() => {
  const lowCount = produk.filter(p => p.stok < 5).length;
  if (lowCount > 0) {
    showToast(`⚠️ ${lowCount} produk stok menipis — perlu restock!`, 'warning');
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification('KasirGO — Stok Menipis', {
          body: `${lowCount} produk perlu segera direstok`,
          icon: './icons/icon-192x192.png',
          badge: './icons/icon-192x192.png',
          tag: 'stok-notif',
        });
      }).catch(() => {});
    }
  }
}, 1800000);

// ═══════════════ DASHBOARD ═══════════════
function renderDashboard() {
  const today   = new Date().toISOString().split('T')[0];
  const todayTx = transaksi.filter(t => t.tanggal === today);
  document.getElementById('statPenjualan').textContent   = formatRp(todayTx.reduce((s,t)=>s+t.total,0));
  document.getElementById('statTransaksi').textContent   = todayTx.length;
  document.getElementById('statProduk').textContent      = produk.length;
  const low = produk.filter(p => p.stok < 5);
  document.getElementById('statStokMenipis').textContent = low.length;
  renderStokMenipis(low);
  renderTerlaris();
  renderChart();
}

function _renderDashExtras() {
  // Hutang quick list
  const el = document.getElementById('dashHutangList');
  if (el) {
    const aktif = hutangPiutang.filter(h => h.status === 'aktif').slice(0, 4);
    if (!aktif.length) {
      el.innerHTML = '<div style="text-align:center;padding:16px 0;color:var(--text-muted);font-size:12px"><i class="fa-solid fa-check-circle" style="color:var(--green);margin-right:6px"></i>Tidak ada hutang aktif</div>';
    } else {
      el.innerHTML = aktif.map(h => `
        <div class="dash-hutang-item">
          <div class="dhi-avatar ${h.jenis}">${h.nama[0].toUpperCase()}</div>
          <div>
            <div class="dhi-name">${h.nama}</div>
            <div style="font-size:10px;color:var(--text-muted)">${h.jenis === 'hutang' ? '💸 Hutang' : '💰 Piutang'} · ${formatTanggal(h.tglCatat)}</div>
          </div>
          <div class="dhi-amount ${h.jenis}">${formatRp(h.sisa)}</div>
        </div>`).join('');
    }
  }

  // Kasir info on dashboard
  const kasirEl = document.getElementById('dashKasirInfo');
  if (kasirEl) {
    const today   = new Date().toISOString().split('T')[0];
    const kasir   = currentUser?.username || 'admin';
    const shiftTx = transaksi.filter(t => t.tanggal === today && t.kasir === kasir);
    kasirEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-soft)">
        <div class="user-avatar" style="width:38px;height:38px;font-size:15px">${(kasir[0]||'A').toUpperCase()}</div>
        <div>
          <div style="font-size:13px;font-weight:700">${kasir}</div>
          <div style="font-size:11px;color:var(--text-muted)">Shift mulai: ${shiftStartTime || '—'}</div>
        </div>
        <span class="badge-custom green ms-auto">Aktif</span>
      </div>
      <div style="display:flex;gap:16px;padding:12px 0">
        <div style="flex:1;text-align:center">
          <div style="font-size:20px;font-weight:800;color:var(--primary)">${shiftTx.length}</div>
          <div style="font-size:11px;color:var(--text-muted)">Transaksi</div>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:15px;font-weight:800;color:var(--green)">${formatRp(shiftTx.reduce((s,t)=>s+t.total,0))}</div>
          <div style="font-size:11px;color:var(--text-muted)">Penjualan</div>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:20px;font-weight:800;color:var(--purple)">${accounts.length}</div>
          <div style="font-size:11px;color:var(--text-muted)">Kasir</div>
        </div>
      </div>`;
  }
}

function renderStokMenipis(list) {
  document.getElementById('stokMenipisCount').textContent = list.length;
  const el = document.getElementById('stokMenipisList');
  if (!list.length) { el.innerHTML='<div class="stok-item" style="color:var(--text-muted);font-size:12px;padding:12px 0;text-align:center">✅ Semua stok aman</div>'; return; }
  el.innerHTML = list.map(p=>`<div class="stok-item"><div class="stok-item-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><div><div class="stok-item-name">${p.nama}</div><div style="font-size:10px;color:var(--text-muted)">${getCatName(p.kategori_id)}</div></div><div class="stok-item-qty">${p.stok} ${p.satuan}</div></div>`).join('');
}

function renderTerlaris() {
  const sold = {};
  transaksi.forEach(tx => tx.items.forEach(i => { sold[i.produk_id]=(sold[i.produk_id]||0)+i.qty; }));
  const top5 = produk.map(p=>({...p, terjual:sold[p.id]||0, pendapatan:(sold[p.id]||0)*p.harga_jual})).sort((a,b)=>b.terjual-a.terjual).slice(0,5);
  document.getElementById('tabelTerlaris').innerHTML = top5.map((p,i)=>`<tr><td><span class="tag-badge blue">${i+1}</span></td><td><strong>${p.nama}</strong></td><td>${getCatName(p.kategori_id)}</td><td><span class="tag-badge green">${p.terjual}</span></td><td><strong>${formatRp(p.pendapatan)}</strong></td></tr>`).join('');
}

function renderChart() {
  const ctx = document.getElementById('chartPenjualan');
  if (!ctx) return;
  const labels=[], values=[];
  for (let i=6;i>=0;i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds = d.toISOString().split('T')[0];
    labels.push(d.toLocaleDateString('id-ID',{weekday:'short',day:'numeric'}));
    values.push(transaksi.filter(t=>t.tanggal===ds).reduce((s,t)=>s+t.total,0));
  }
  if (window._chart) window._chart.destroy();
  window._chart = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[{ label:'Penjualan', data:values, borderColor:'#4a90e2', backgroundColor:'rgba(74,144,226,.09)', borderWidth:2.5, fill:true, tension:.4, pointBackgroundColor:'#4a90e2', pointRadius:5, pointHoverRadius:7 }] },
    options:{ responsive:true, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>' '+formatRp(c.parsed.y) } } }, scales:{ x:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{font:{family:'Plus Jakarta Sans',size:11},color:'#7c8fa6'} }, y:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ font:{family:'DM Mono',size:10}, color:'#7c8fa6', callback:v=>'Rp'+(v>=1000?(v/1000).toFixed(0)+'rb':v) } } } }
  });
}

// ═══════════════ TRANSAKSI ═══════════════
function renderProdukGrid() {
  const q  = (document.getElementById('searchProduk')?.value||'').toLowerCase();
  const kf = document.getElementById('filterKategoriTx')?.value||'';
  const grid = document.getElementById('produkGrid');
  if (!grid) return;
  const list = produk.filter(p => (p.nama.toLowerCase().includes(q)||p.barcode.includes(q)) && (!kf || String(p.kategori_id)===kf));
  grid.innerHTML = list.length ? list.map(p=>{
    const low = p.stok>0 && p.stok<5;
    return `<div class="produk-card ${p.stok===0?'stok-habis':''}">
      <div class="produk-img-wrap">${p.gambar?`<img src="${p.gambar}" alt="${p.nama}"/>`:'<span>'+getProdukEmoji(p.kategori_id)+'</span>'}</div>
      <div class="produk-info">
        <div class="produk-name" title="${p.nama}">${p.nama}</div>
        <div class="produk-price">${formatRp(p.harga_jual)}</div>
        <div class="produk-stok ${low?'low':''}">${p.stok===0?'❌ Habis':`Stok: ${p.stok} ${p.satuan}${low?' ⚠️':''}`}</div>
      </div>
      ${p.stok>0?`<button class="btn-add-produk" onclick="addToCart(${p.id})"><i class="fa-solid fa-plus me-1"></i>Tambah</button>`:''}\n    </div>`;
  }).join('') : `<div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--text-muted)"><i class="fa-solid fa-search" style="font-size:24px;margin-bottom:10px;display:block;opacity:.3"></i>Produk tidak ditemukan</div>`;
}

function populateKategoriFilter() {
  const sel = document.getElementById('filterKategoriTx');
  if (!sel) return;
  sel.innerHTML = '<option value="">Semua Kategori</option>' + kategori.map(k=>`<option value="${k.id}">${k.nama}</option>`).join('');
}

function addToCart(id) {
  const p = produk.find(x=>x.id===id);
  if (!p||p.stok===0) return;
  const ex = cart.find(c=>c.produk_id===id);
  if (ex) { if (ex.qty>=p.stok) { showToast(`Stok ${p.nama} tidak cukup!`,'warning'); return; } ex.qty++; }
  else { cart.push({produk_id:id, qty:1}); }
  showToast(`${p.nama} ditambahkan 🛒`,'success');
  renderCart();
}

function removeFromCart(id) { cart = cart.filter(c=>c.produk_id!==id); renderCart(); }

function changeQty(id, d) {
  const item = cart.find(c=>c.produk_id===id);
  const p    = produk.find(x=>x.id===id);
  if (!item) return;
  item.qty += d;
  if (item.qty<=0) { removeFromCart(id); return; }
  if (item.qty>p.stok) { item.qty=p.stok; showToast('Melebihi stok!','warning'); }
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cartCount').textContent = count;
  const el = document.getElementById('cartItems');
  if (!cart.length) { el.innerHTML='<div class="empty-cart"><i class="fa-solid fa-cart-shopping"></i><p>Keranjang kosong</p></div>'; calcTotal(); return; }
  el.innerHTML = cart.map(c=>{
    const p=produk.find(x=>x.id===c.produk_id);
    const sub=p.harga_jual*c.qty;
    return `<div class="cart-row">
      <div class="cart-row-info"><div class="cart-row-name">${p.nama}</div><div class="cart-row-price">${formatRp(p.harga_jual)}/${p.satuan}</div></div>
      <div class="cart-qty-ctrl"><button class="btn-qty" onclick="changeQty(${p.id},-1)">−</button><span class="qty-num">${c.qty}</span><button class="btn-qty" onclick="changeQty(${p.id},1)">+</button></div>
      <div class="cart-subtotal ms-1">${formatRp(sub)}</div>
      <button class="btn-del-cart ms-1" onclick="removeFromCart(${p.id})"><i class="fa-solid fa-trash"></i></button>
    </div>`;
  }).join('');
  calcTotal();
}

function calcTotal() {
  const subtotal = cart.reduce((s,c)=>{ const p=produk.find(x=>x.id===c.produk_id); return s+(p?p.harga_jual*c.qty:0); },0);
  const disc     = parseFloat(document.getElementById('discountInput')?.value||0);
  const ppnPct   = settings.ppnAktif!==false ? (settings.ppn||11) : 0;
  const afterD   = subtotal*(1-disc/100);
  const ppn      = afterD*(ppnPct/100);
  const total    = afterD+ppn;
  document.getElementById('cartSubtotal').textContent = formatRp(subtotal);
  document.getElementById('cartPpn').textContent      = formatRp(ppn);
  document.getElementById('cartTotal').textContent    = formatRp(total);
  const qrisAmt  = document.getElementById('qrisAmount');  if (qrisAmt)  qrisAmt.textContent  = formatRp(total);
  const debitAmt = document.getElementById('debitAmount'); if (debitAmt) debitAmt.textContent = formatRp(total);
  calcChange();
  return { subtotal, afterD, ppn, total, disc };
}

function calcChange() {
  if (payMethod!=='tunai') return;
  const totalText = document.getElementById('cartTotal').textContent;
  const total = parseInt(totalText.replace(/[^0-9]/g,''))||0;
  const bayar = parseFloat(document.getElementById('payAmount')?.value||0);
  const change= bayar-total;
  const el    = document.getElementById('changeAmount');
  if (el) { el.textContent = formatRp(Math.max(0,change)); el.style.color = change<0?'var(--red)':'var(--green)'; }
}

function setPayMethod(m, el) {
  payMethod=m;
  document.querySelectorAll('.pay-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tunaiSection').style.display  = m==='tunai'?'':'none';
  document.getElementById('qrisSection').style.display   = m==='qris' ?'':'none';
  document.getElementById('debitSection').style.display  = m==='debit'?'':'none';
  if (m==='tunai') calcChange();
}

function clearCart() {
  if (!cart.length) return;
  Swal.fire({ title:'Kosongkan keranjang?', text:'Semua item akan dihapus.', icon:'warning', showCancelButton:true, confirmButtonColor:'#ea5455', cancelButtonColor:'#aaa', confirmButtonText:'Ya', cancelButtonText:'Batal' })
  .then(r=>{ if(r.isConfirmed){ cart=[]; document.getElementById('discountInput').value=0; document.getElementById('payAmount').value=''; renderCart(); } });
}

function prosesTransaksi() {
  if (!cart.length) { showToast('Keranjang masih kosong!','warning'); return; }
  if (payMethod === 'qris') {
    const totals = calcTotal();
    Swal.fire({
      title: '📱 Konfirmasi QRIS',
      html: `<div style="margin:10px 0"><div style="font-size:13px;color:#7c8fa6;margin-bottom:6px">Total yang harus dibayar:</div><div style="font-size:26px;font-weight:800;color:#4a90e2">${formatRp(totals.total)}</div><div style="font-size:11px;color:#7c8fa6;margin-top:8px;padding:8px;background:#f0f4f9;border-radius:8px">Pastikan pembayaran QRIS sudah berhasil di aplikasi nasabah sebelum melanjutkan</div></div>`,
      showCancelButton:true, confirmButtonColor:'#4a90e2', cancelButtonColor:'#aaa',
      confirmButtonText:'✅ Sudah Bayar', cancelButtonText:'Batal'
    }).then(r => { if (r.isConfirmed) prosesTransaksiInternal(); });
    return;
  }
  if (payMethod === 'debit') {
    const totals = calcTotal();
    Swal.fire({
      title: '💳 Konfirmasi Kartu Debit',
      html: `<div style="margin:10px 0"><div style="font-size:13px;color:#7c8fa6;margin-bottom:6px">Total yang harus dibayar:</div><div style="font-size:26px;font-weight:800;color:#4a90e2">${formatRp(totals.total)}</div><div style="font-size:11px;color:#7c8fa6;margin-top:8px;padding:8px;background:#f0f4f9;border-radius:8px">Masukkan kartu, minta PIN nasabah, dan pastikan transaksi telah disetujui mesin EDC</div></div>`,
      showCancelButton:true, confirmButtonColor:'#4a90e2', cancelButtonColor:'#aaa',
      confirmButtonText:'✅ Sudah Disetujui', cancelButtonText:'Batal'
    }).then(r => { if (r.isConfirmed) prosesTransaksiInternal(); });
    return;
  }
  // Tunai
  const totals = calcTotal();
  const bayar  = parseFloat(document.getElementById('payAmount').value||0);
  if (bayar < totals.total) { showToast('Jumlah bayar kurang!','error'); return; }
  prosesTransaksiInternal();
}

function prosesTransaksiInternal() {
  const totals  = calcTotal();
  const newInv  = 'INV-'+String(transaksi.length+1).padStart(4,'0');
  const today   = new Date().toISOString().split('T')[0];
  const disc    = parseFloat(document.getElementById('discountInput').value||0);
  const bayar   = payMethod==='tunai'?parseFloat(document.getElementById('payAmount').value||0):totals.total;
  const snapItems = [];
  cart.forEach(c=>{
    const p=produk.find(x=>x.id===c.produk_id);
    if (p) { p.stok -= c.qty; snapItems.push({ produk_id:c.produk_id, nama:p.nama, harga:p.harga_jual, qty:c.qty, subtotal:p.harga_jual*c.qty }); if (p.stok<5 && p.stok>=0) showToast(`⚠️ Stok ${p.nama} tinggal ${p.stok}!`,'warning'); }
  });
  const txData = {
    id: transaksi.length+1, invoice: newInv, tanggal: today,
    waktu: new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}),
    pelanggan: 'Umum', items: cart.map(c=>({produk_id:c.produk_id,qty:c.qty})), snapItems,
    subtotal: totals.subtotal, diskon: disc, afterDiskon: totals.afterD, ppn: totals.ppn,
    total: totals.total, bayar, kembali: payMethod==='tunai'?bayar-totals.total:0,
    metode: payMethod, kasir: currentUser?.username||'Admin',
  };
  transaksi.push(txData); lastStruk = txData; saveData();
  showStruk(txData);
  cart=[]; document.getElementById('discountInput').value=0; document.getElementById('payAmount').value='';
  updateInvNum(); renderCart(); renderProdukGrid();
}

function updateInvNum() {
  const n  = String(transaksi.length+1).padStart(4,'0');
  const el = document.getElementById('invNum'); if (el) el.textContent = n;
}

// ═══════════════ STRUK ═══════════════
function buildStrukHtml(tx) {
  const logo = settings.logo;
  const logoHtml = logo
    ? `<div class="struk-logo"><img src="${logo}" alt="logo"/></div>`
    : `<div class="struk-logo"><i class="fa-solid fa-cash-register"></i></div>`;
  const metodeLabel = { tunai:'TUNAI', qris:'QRIS', debit:'KARTU DEBIT' };
  const itemsHtml = (tx.snapItems||[]).map(i=>`
    <div class="struk-item-row">
      <div class="struk-item-name">${i.nama}</div>
      <div class="struk-item-qty">${i.qty} × ${formatRpNoSymbol(i.harga)}</div>
      <div class="struk-item-price">${formatRp(i.subtotal)}</div>
    </div>`).join('');
  const kembaliHtml = tx.metode==='tunai' ? `
    <div class="struk-bayar-row"><span>Bayar</span><span>${formatRp(tx.bayar)}</span></div>
    <div class="struk-kembali-row"><span>Kembalian</span><span>${formatRp(tx.kembali)}</span></div>` : `
    <div class="struk-bayar-row"><span>Pembayaran</span><span><b>${metodeLabel[tx.metode]}</b></span></div>`;
  return `
  <div class="struk-header">
    ${logoHtml}
    <div class="struk-toko-nama">${settings.namaUsaha}</div>
    ${settings.alamat?`<div class="struk-toko-alamat">${settings.alamat}</div>`:''}
    ${settings.telp?`<div class="struk-toko-telp">Telp: ${settings.telp}</div>`:''}
    ${settings.header?`<div class="struk-header-msg">${settings.header}</div>`:''}
  </div>
  <div class="struk-divider"></div>
  <div class="struk-info">
    <table>
      <tr><td>Invoice</td><td>:</td><td>${tx.invoice}</td></tr>
      <tr><td>Tanggal</td><td>:</td><td>${formatTanggal(tx.tanggal)}</td></tr>
      <tr><td>Waktu</td><td>:</td><td>${tx.waktu||'-'}</td></tr>
      <tr><td>Kasir</td><td>:</td><td>${tx.kasir}</td></tr>
      <tr><td>Metode</td><td>:</td><td><span class="struk-metode">${metodeLabel[tx.metode]||tx.metode}</span></td></tr>
    </table>
  </div>
  <div class="struk-divider"></div>
  <div class="struk-items-header">
    <span style="flex:1">Item</span><span style="width:100px;text-align:center">Qty × Harga</span><span style="width:80px;text-align:right">Jumlah</span>
  </div>
  <div class="struk-items">${itemsHtml}</div>
  <div class="struk-divider"></div>
  <div class="struk-summary">
    <div class="struk-summary-row"><span>Subtotal</span><span>${formatRp(tx.subtotal)}</span></div>
    ${tx.diskon?`<div class="struk-summary-row"><span>Diskon (${tx.diskon}%)</span><span>-${formatRp(tx.subtotal-tx.afterDiskon)}</span></div>`:''}
    ${tx.ppn?`<div class="struk-summary-row"><span>PPN (${settings.ppn}%)</span><span>${formatRp(tx.ppn)}</span></div>`:''}
    <div class="struk-total-row"><span>TOTAL</span><span>${formatRp(tx.total)}</span></div>
    ${kembaliHtml}
  </div>
  ${settings.footer?`<div class="struk-divider"></div><div class="struk-footer">${settings.footer}</div>`:''}
  <div class="struk-footer" style="font-weight:600;border-top:none;margin-top:4px">✦ Terima Kasih ✦</div>`;
}

function showStruk(tx) {
  document.getElementById('strukContent').innerHTML = buildStrukHtml(tx);
  new bootstrap.Modal(document.getElementById('modalStruk')).show();
  showToast(`${tx.invoice} berhasil diproses! 🎉`,'success');
}

function cetakStruk() {
  const content   = document.getElementById('strukContent').innerHTML;
  const printArea = document.getElementById('printArea');
  printArea.innerHTML = `
    <style>
      *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
      body { background:white; }
      .struk-wrap { width:80mm; margin:0 auto; padding:3mm 2mm; font-family:'Courier New',Courier,monospace; font-size:11px; color:#000; }
      .struk-header { text-align:center; margin-bottom:6px; }
      .struk-logo { width:48px; height:48px; border-radius:8px; overflow:hidden; margin:0 auto 6px; background:#eee; display:flex; align-items:center; justify-content:center; font-size:20px; border:1px solid #000; }
      .struk-logo img { width:100%; height:100%; object-fit:cover; }
      .struk-toko-nama { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; }
      .struk-toko-alamat, .struk-toko-telp { font-size:9px; margin-top:1px; }
      .struk-header-msg { font-size:9px; margin-top:2px; font-style:italic; }
      .struk-divider { border-top:1px dashed #000; margin:5px 0; }
      .struk-info table { width:100%; font-size:10px; border-collapse:collapse; }
      .struk-info td { padding:1px 1px; vertical-align:top; }
      .struk-info td:first-child { width:52px; }
      .struk-info td:nth-child(2){ width:8px; }
      .struk-metode { font-weight:700; }
      .struk-items-header { display:flex; font-size:9px; font-weight:700; text-transform:uppercase; margin:3px 0 2px; border-bottom:1px solid #000; padding-bottom:2px; }
      .struk-item-row { display:flex; justify-content:space-between; font-size:10px; padding:2px 0; border-bottom:1px dotted #bbb; }
      .struk-item-name { flex:1; word-break:break-word; }
      .struk-item-qty  { width:88px; text-align:center; font-size:9px; white-space:nowrap; }
      .struk-item-price{ width:68px; text-align:right; font-weight:700; white-space:nowrap; }
      .struk-summary-row { display:flex; justify-content:space-between; font-size:10px; margin-bottom:1px; }
      .struk-total-row { display:flex; justify-content:space-between; font-size:13px; font-weight:700; border-top:2px solid #000; border-bottom:2px solid #000; margin:3px 0; padding:3px 0; }
      .struk-bayar-row  { display:flex; justify-content:space-between; font-size:10px; margin-top:2px; }
      .struk-kembali-row{ display:flex; justify-content:space-between; font-size:12px; font-weight:700; }
      .struk-footer { text-align:center; font-size:9px; margin-top:5px; padding-top:5px; border-top:1px dashed #000; line-height:1.5; }
      .cut-line { text-align:center; font-size:9px; color:#999; border-top:1px dashed #aaa; margin-top:8px; padding-top:4px; }
      @page { margin:0; size:80mm auto; }
    </style>
    <div class="struk-wrap">
      ${content}
      <div class="cut-line">✂ ────────────── potong di sini ────────────── ✂</div>
    </div>`;
  window.print();
}

// ═══════════════ DATATABLES HELPER ═══════════════
function destroyDT(which) {
  if (which === 'produk'  && dtProduk)  { try { dtProduk.destroy();  } catch(e){} dtProduk  = null; }
  if (which === 'laporan' && dtLaporan) { try { dtLaporan.destroy(); } catch(e){} dtLaporan = null; }
}

// ═══════════════ PRODUK ═══════════════
function buildTableProduk() {
  destroyDT('produk');
  const tbody = document.getElementById('tableProdukBody');
  if (!tbody) return;
  tbody.innerHTML = produk.map(p=>{
    const stokBadge = p.stok===0?`<span class="tag-badge red">${p.stok}</span>`:p.stok<5?`<span class="tag-badge yellow">${p.stok}</span>`:`<span class="tag-badge green">${p.stok}</span>`;
    return `<tr>
      <td><code style="font-size:11px">${p.barcode}</code></td>
      <td><strong>${p.nama}</strong></td>
      <td>${getCatName(p.kategori_id)}</td>
      <td>${p.satuan}</td>
      <td>${formatRp(p.harga_beli)}</td>
      <td><strong>${formatRp(p.harga_jual)}</strong></td>
      <td>${stokBadge}</td>
      <td><button class="btn-tbl edit" onclick="openModalProduk(${p.id})" title="Edit"><i class="fa-solid fa-pen"></i></button><button class="btn-tbl delete" onclick="hapusProduk(${p.id})" title="Hapus"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`;
  }).join('');
  try {
    dtProduk = $('#tableProduk').DataTable({
      language: { search:'Cari:', lengthMenu:'Tampilkan _MENU_ data', info:'Data _START_–_END_ dari _TOTAL_', paginate:{next:'›',previous:'‹'}, zeroRecords:'Tidak ada data', infoEmpty:'Tidak ada data', infoFiltered:'(difilter dari _MAX_ total)' },
      columnDefs:[{orderable:false,targets:-1}], order:[[1,'asc']], pageLength:10, destroy:true,
    });
  } catch(e) { console.warn('DataTable produk:', e.message); }
}

function openModalProduk(id=null) {
  editProdukId = id;
  document.getElementById('modalProdukTitle').textContent = id?'Edit Produk':'Tambah Produk';
  document.getElementById('pKategori').innerHTML = kategori.map(k=>`<option value="${k.id}">${k.nama}</option>`).join('');
  if (id) {
    const p = produk.find(x=>x.id===id);
    document.getElementById('pBarcode').value   = p.barcode;
    document.getElementById('pNama').value      = p.nama;
    document.getElementById('pKategori').value  = p.kategori_id;
    document.getElementById('pSatuan').value    = p.satuan;
    document.getElementById('pHargaBeli').value = p.harga_beli;
    document.getElementById('pHargaJual').value = p.harga_jual;
    document.getElementById('pStok').value      = p.stok;
    if (p.gambar) { document.getElementById('imgPreview').src = p.gambar; document.getElementById('imgPreviewWrap').style.display='block'; }
    else { document.getElementById('imgPreviewWrap').style.display='none'; }
  } else {
    ['pBarcode','pNama','pHargaBeli','pHargaJual','pStok'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('imgPreviewWrap').style.display='none';
    document.getElementById('pGambar').value='';
  }
  new bootstrap.Modal(document.getElementById('modalProduk')).show();
}

function simpanProduk() {
  const nama      = document.getElementById('pNama').value.trim();
  const katId     = parseInt(document.getElementById('pKategori').value);
  const hargaJual = parseFloat(document.getElementById('pHargaJual').value)||0;
  const stok      = parseInt(document.getElementById('pStok').value);
  if (!nama||!hargaJual||isNaN(stok)) { showToast('Lengkapi field wajib!','error'); return; }
  const imgEl  = document.getElementById('imgPreview');
  const gambar = imgEl && document.getElementById('imgPreviewWrap').style.display!=='none' ? imgEl.src : '';
  const data   = { barcode:document.getElementById('pBarcode').value||genBarcode(), nama, kategori_id:katId, satuan:document.getElementById('pSatuan').value, harga_beli:parseFloat(document.getElementById('pHargaBeli').value)||0, harga_jual:hargaJual, stok, gambar };
  if (editProdukId) { const i=produk.findIndex(p=>p.id===editProdukId); produk[i]={...produk[i],...data}; showToast(`Produk "${nama}" diperbarui!`,'success'); }
  else { produk.push({id:Date.now(),...data}); showToast(`Produk "${nama}" ditambahkan!`,'success'); }
  saveData();
  bootstrap.Modal.getInstance(document.getElementById('modalProduk')).hide();
  buildTableProduk();
}

function hapusProduk(id) {
  const p=produk.find(x=>x.id===id);
  Swal.fire({ title:'Hapus Produk?', html:`<b>${p.nama}</b> akan dihapus permanen.`, icon:'warning', showCancelButton:true, confirmButtonColor:'#ea5455', cancelButtonColor:'#aaa', confirmButtonText:'Hapus', cancelButtonText:'Batal' })
  .then(r=>{ if(r.isConfirmed){ produk=produk.filter(x=>x.id!==id); saveData(); showToast(`"${p.nama}" dihapus.`,'info'); buildTableProduk(); } });
}

function previewGambar(input) {
  if (input.files&&input.files[0]) {
    const r=new FileReader();
    r.onload=e=>{ document.getElementById('imgPreview').src=e.target.result; document.getElementById('imgPreviewWrap').style.display='block'; };
    r.readAsDataURL(input.files[0]);
  }
}

function genBarcode() { return '899'+Math.floor(Math.random()*1e10).toString().padStart(10,'0'); }

// ═══════════════ KATEGORI ═══════════════
function renderKategori() {
  document.getElementById('kategoriBody').innerHTML = kategori.map((k,i)=>`
    <tr><td>${i+1}</td><td><strong>${k.nama}</strong></td><td><i class="${k.icon}"></i> <small style="color:var(--text-muted);font-size:10px">${k.icon}</small></td><td><span class="tag-badge blue">${produk.filter(p=>p.kategori_id===k.id).length}</span></td><td><button class="btn-tbl edit" onclick="editKategori(${k.id})"><i class="fa-solid fa-pen"></i></button><button class="btn-tbl delete" onclick="hapusKategori(${k.id})"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('');
}

function tambahKategori() {
  const nama = document.getElementById('namaKategoriInput').value.trim();
  const icon = document.getElementById('iconKategoriInput').value.trim()||'fa-solid fa-tag';
  if (!nama) { showToast('Nama kategori wajib!','error'); return; }
  if (editKategoriId) { const i=kategori.findIndex(k=>k.id===editKategoriId); kategori[i]={...kategori[i],nama,icon}; showToast('Kategori diperbarui!','success'); batalEditKategori(); }
  else { kategori.push({id:Date.now(),nama,icon}); showToast(`Kategori "${nama}" ditambahkan!`,'success'); }
  document.getElementById('namaKategoriInput').value=''; document.getElementById('iconKategoriInput').value='';
  saveData(); renderKategori(); populateKategoriFilter();
}

function editKategori(id) {
  const k=kategori.find(x=>x.id===id); editKategoriId=id;
  document.getElementById('namaKategoriInput').value=k.nama; document.getElementById('iconKategoriInput').value=k.icon;
  document.getElementById('formKatTitle').textContent='Edit Kategori'; document.getElementById('btnKatLabel').textContent='Update Kategori'; document.getElementById('btnKatBatal').style.display='';
}

function batalEditKategori() {
  editKategoriId=null; document.getElementById('namaKategoriInput').value=''; document.getElementById('iconKategoriInput').value='';
  document.getElementById('formKatTitle').textContent='Tambah Kategori'; document.getElementById('btnKatLabel').textContent='Simpan Kategori'; document.getElementById('btnKatBatal').style.display='none';
}

function hapusKategori(id) {
  const k=kategori.find(x=>x.id===id);
  if (produk.some(p=>p.kategori_id===id)) { showToast('Kategori masih memiliki produk!','error'); return; }
  Swal.fire({ title:'Hapus Kategori?', html:`<b>${k.nama}</b> akan dihapus.`, icon:'warning', showCancelButton:true, confirmButtonColor:'#ea5455', cancelButtonColor:'#aaa', confirmButtonText:'Hapus', cancelButtonText:'Batal' })
  .then(r=>{ if(r.isConfirmed){ kategori=kategori.filter(x=>x.id!==id); saveData(); showToast('Kategori dihapus.','info'); renderKategori(); } });
}

// ═══════════════ LAPORAN ═══════════════
function buildTableLaporan() { destroyDT('laporan'); filterLaporan(); }

function filterLaporan() {
  const start   = document.getElementById('filterStart').value;
  const end     = document.getElementById('filterEnd').value;
  let filtered  = transaksi.filter(t=>{ if(start&&t.tanggal<start)return false; if(end&&t.tanggal>end)return false; return true; });
  const totPenjualan  = filtered.reduce((s,t)=>s+t.total,0);
  const totKeuntungan = filtered.reduce((s,t)=>s+(t.snapItems||[]).reduce((sub,i)=>{ const p=produk.find(x=>x.id===i.produk_id); return sub+(p?(p.harga_jual-p.harga_beli)*i.qty:0); },0),0);
  document.getElementById('lapTotalPenjualan').textContent  = formatRp(totPenjualan);
  document.getElementById('lapTotalTransaksi').textContent  = filtered.length;
  document.getElementById('lapTotalKeuntungan').textContent = formatRp(totKeuntungan);
  const mbadge={tunai:'green',qris:'blue',debit:'yellow'};
  const mlabel={tunai:'Tunai',qris:'QRIS',debit:'Debit'};
  const tbody=document.getElementById('laporanBody'); if (!tbody) return;
  tbody.innerHTML=filtered.sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).map(t=>`
    <tr><td>${formatTanggal(t.tanggal)}</td><td><code style="font-size:11px">${t.invoice}</code></td><td>${t.pelanggan}</td><td><strong>${formatRp(t.total)}</strong></td><td><span class="tag-badge ${mbadge[t.metode]||'blue'}">${mlabel[t.metode]||t.metode}</span></td><td>${t.kasir}</td><td><button class="btn-tbl eye" onclick="lihatStrukLaporan(${t.id})" title="Lihat Struk"><i class="fa-solid fa-eye"></i></button></td></tr>`).join('');
  destroyDT('laporan');
  try {
    dtLaporan = $('#tableLaporan').DataTable({
      language:{search:'Cari:',lengthMenu:'Tampilkan _MENU_ data',info:'Data _START_–_END_ dari _TOTAL_',paginate:{next:'›',previous:'‹'},zeroRecords:'Tidak ada data',infoEmpty:'Tidak ada data',infoFiltered:'(difilter dari _MAX_ total)'},
      order:[[0,'desc']], pageLength:10, destroy:true, columnDefs:[{orderable:false,targets:-1}],
    });
  } catch(e) { console.warn('DataTable laporan:', e.message); }
}

function lihatStrukLaporan(id) {
  const tx=transaksi.find(t=>t.id===id); if (!tx) return;
  if (!tx.snapItems||!tx.snapItems.length) {
    tx.snapItems=(tx.items||[]).map(i=>{ const p=produk.find(x=>x.id===i.produk_id); return { produk_id:i.produk_id, nama:p?p.nama:'Produk', harga:p?p.harga_jual:0, qty:i.qty, subtotal:(p?p.harga_jual:0)*i.qty }; });
  }
  document.getElementById('strukContent').innerHTML=buildStrukHtml(tx);
  new bootstrap.Modal(document.getElementById('modalStruk')).show();
}

function exportPDF() {
  const start  = document.getElementById('filterStart').value;
  const end    = document.getElementById('filterEnd').value;
  let filtered = transaksi.filter(t=>{ if(start&&t.tanggal<start)return false; if(end&&t.tanggal>end)return false; return true; }).sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
  const totPenjualan  = filtered.reduce((s,t)=>s+t.total,0);
  const totKeuntungan = filtered.reduce((s,t)=>s+(t.snapItems||[]).reduce((sub,i)=>{ const p=produk.find(x=>x.id===i.produk_id); return sub+(p?(p.harga_jual-p.harga_beli)*i.qty:0); },0),0);
  const mlabel={tunai:'Tunai',qris:'QRIS',debit:'Debit'};
  const periodeStr = start||end ? `${start?formatTanggal(start):'—'} s/d ${end?formatTanggal(end):'—'}` : 'Semua Periode';
  const rows = filtered.map((t,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${formatTanggal(t.tanggal)}${t.waktu?'<br><span style="font-size:10px;color:#555">'+t.waktu+'</span>':''}</td><td style="font-family:monospace;font-size:11px">${t.invoice}</td><td>${t.pelanggan}</td><td style="text-align:right;font-weight:600">${formatRp(t.total)}</td><td style="text-align:center">${mlabel[t.metode]||t.metode}</td><td>${t.kasir}</td></tr>`).join('');
  const logoHtml = settings.logo ? `<img src="${settings.logo}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;margin-bottom:8px;"/>` : '';
  const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><title>Laporan — ${settings.namaUsaha}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:Arial,sans-serif;color:#000;background:white;padding:12mm;}
    .header{text-align:center;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid #000;}
    h1{font-size:20px;font-weight:900;color:#000;margin:4px 0;text-transform:uppercase;letter-spacing:1px;}
    .sub{font-size:13px;color:#333;font-weight:700;margin:2px 0;}
    .periode{font-size:11px;color:#333;margin-top:2px;}
    .summary{display:flex;gap:10px;margin-bottom:14px;}
    .sumcard{flex:1;border:2px solid #000;border-radius:6px;padding:10px 12px;}
    .sumcard-label{font-size:10px;color:#333;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
    .sumcard-value{font-size:17px;font-weight:900;color:#000;margin-top:3px;}
    table{width:100%;border-collapse:collapse;font-size:11px;}
    thead tr th{background:#000;color:#fff;padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px;}
    tbody tr td{padding:6px 8px;border-bottom:1px solid #ccc;color:#000;vertical-align:top;}
    tbody tr:nth-child(even) td{background:#f5f5f5;}
    .footer{text-align:center;font-size:10px;color:#555;margin-top:14px;padding-top:8px;border-top:1px solid #ccc;}
    @page{margin:8mm;size:A4;}
  </style></head><body>
  <div class="header">
    ${logoHtml}
    <h1>${settings.namaUsaha}</h1>
    <div class="sub">LAPORAN PENJUALAN</div>
    <div class="periode">Periode: ${periodeStr}</div>
    <div class="periode">Dicetak: ${new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}, ${new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div>
    ${settings.alamat?`<div class="periode">${settings.alamat}${settings.telp?' | Telp: '+settings.telp:''}</div>`:''}
  </div>
  <div class="summary">
    <div class="sumcard"><div class="sumcard-label">Total Penjualan</div><div class="sumcard-value">${formatRp(totPenjualan)}</div></div>
    <div class="sumcard"><div class="sumcard-label">Jumlah Transaksi</div><div class="sumcard-value">${filtered.length} transaksi</div></div>
    <div class="sumcard"><div class="sumcard-label">Total Keuntungan</div><div class="sumcard-value">${formatRp(totKeuntungan)}</div></div>
  </div>
  <table><thead><tr><th>#</th><th>Tanggal</th><th>Invoice</th><th>Pelanggan</th><th style="text-align:right">Total</th><th style="text-align:center">Metode</th><th>Kasir</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="footer">KasirGO — ${settings.namaUsaha} | Laporan otomatis | Total ${filtered.length} transaksi</div>
  <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;
  const w = window.open('','_blank');
  if (!w) { showToast('Izinkan popup browser untuk mencetak PDF!','warning'); return; }
  w.document.write(html); w.document.close();
  showToast('Laporan PDF siap dicetak! 📄','success');
}

// ═══════════════ PENGATURAN ═══════════════
function uploadLogo(input) {
  if (input.files&&input.files[0]) {
    const r=new FileReader();
    r.onload=e=>{
      settings.logo=e.target.result;
      document.getElementById('logoPreviewWrap').innerHTML=`<img src="${settings.logo}" style="width:72px;height:72px;object-fit:cover;border-radius:12px;display:block;margin:0 auto 4px"/><div style="font-size:11px;color:var(--text-muted);text-align:center">Klik untuk ganti logo</div>`;
      applyBranding();
    };
    r.readAsDataURL(input.files[0]);
  }
}

function simpanPengaturan() {
  settings.namaUsaha = document.getElementById('settNamaUsaha').value.trim();
  settings.alamat    = document.getElementById('settAlamat').value.trim();
  settings.telp      = document.getElementById('settTelp').value.trim();
  settings.ppn       = parseFloat(document.getElementById('settPpn').value)||11;
  settings.ppnAktif  = document.getElementById('settPpnAktif').checked;
  settings.header    = document.getElementById('settHeader').value.trim();
  settings.footer    = document.getElementById('settFooter').value.trim();
  if (currentUser) {
    const acc=accounts.find(a=>a.username===currentUser.username);
    if (acc) { acc.namaUsaha=settings.namaUsaha; acc.logo=settings.logo; acc.alamat=settings.alamat; acc.telp=settings.telp; currentUser.namaUsaha=settings.namaUsaha; LS.set('kg_currentUser',currentUser); LS.set('kg_accounts',accounts); }
  }
  saveData(); applyBranding(); showToast('Pengaturan berhasil disimpan! ✅','success');
}

function gantiPassword() {
  const oldPwd = document.getElementById('settOldPwd').value;
  const newPwd = document.getElementById('settNewPwd').value;
  if (!oldPwd||!newPwd) { showToast('Isi semua field password!','error'); return; }
  if (newPwd.length<6)  { showToast('Password baru minimal 6 karakter!','error'); return; }
  const acc=accounts.find(a=>a.username===currentUser?.username);
  if (!acc||acc.password!==oldPwd) { showToast('Password lama salah!','error'); return; }
  acc.password=newPwd; LS.set('kg_accounts',accounts);
  document.getElementById('settOldPwd').value=''; document.getElementById('settNewPwd').value='';
  showToast('Password berhasil diubah!','success');
}

// ═══════════════ HUTANG / PIUTANG ═══════════════
function renderHutangPage() {
  const today  = new Date().toISOString().split('T')[0];
  const aktif  = hutangPiutang.filter(h => h.status === 'aktif');
  const lunas  = hutangPiutang.filter(h => h.status === 'lunas');
  const totalH = aktif.filter(h=>h.jenis==='hutang').reduce((s,h)=>s+h.sisa, 0);
  const totalP = aktif.filter(h=>h.jenis==='piutang').reduce((s,h)=>s+h.sisa, 0);
  const jt     = aktif.filter(h=>h.jatuhTempo && h.jatuhTempo <= today).length;
  const $ = id => document.getElementById(id);
  if ($('statHutangTotal'))  $('statHutangTotal').textContent  = formatRp(totalH);
  if ($('statPiutangTotal')) $('statPiutangTotal').textContent = formatRp(totalP);
  if ($('statJatuhTempo'))   $('statJatuhTempo').textContent   = jt;
  if ($('statLunas'))        $('statLunas').textContent        = lunas.length;
  renderHutangTable();
}

function filterHutang(filter, elBtn) {
  hutangFilter = filter;
  ['tabSemua','tabHutang','tabPiutang','tabJT'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.classList.remove('btn-primary-custom','btn-tab-active');
    b.classList.add('btn-outline-custom');
  });
  if (elBtn) {
    elBtn.classList.remove('btn-outline-custom');
    elBtn.classList.add('btn-primary-custom','btn-tab-active');
  }
  renderHutangTable();
}

function renderHutangTable() {
  const today = new Date().toISOString().split('T')[0];
  const q     = (document.getElementById('searchHutang')?.value || '').toLowerCase();
  const list  = hutangPiutang.filter(h => {
    if (q && !h.nama.toLowerCase().includes(q)) return false;
    if (hutangFilter === 'hutang')      return h.jenis === 'hutang'  && h.status === 'aktif';
    if (hutangFilter === 'piutang')     return h.jenis === 'piutang' && h.status === 'aktif';
    if (hutangFilter === 'jatuh_tempo') return h.status === 'aktif' && h.jatuhTempo && h.jatuhTempo <= today;
    return true;
  }).sort((a,b) => b.tglCatat.localeCompare(a.tglCatat));

  const tbody = document.getElementById('hutangBody');
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:28px;color:var(--text-muted)">
      <i class="fa-solid fa-inbox" style="font-size:28px;margin-bottom:8px;display:block;opacity:.3"></i>
      Tidak ada data ditemukan</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(h => {
    const isJT = h.status === 'aktif' && h.jatuhTempo && h.jatuhTempo <= today;
    const statusBadge = h.status === 'lunas'
      ? `<span class="hp-badge lunas">✅ Lunas</span>`
      : isJT
        ? `<span class="hp-badge jatuh-tempo">⚠️ Jatuh Tempo</span>`
        : `<span class="hp-badge" style="background:var(--primary-light);color:var(--primary)">🔵 Aktif</span>`;
    const jenisBadge = h.jenis === 'hutang'
      ? `<span class="hp-badge hutang">💸 Hutang</span>`
      : `<span class="hp-badge piutang">💰 Piutang</span>`;
    return `<tr>
      <td><strong>${h.nama}</strong>${h.telp ? `<br><small style="color:var(--text-muted)">${h.telp}</small>` : ''}</td>
      <td>${jenisBadge}</td>
      <td>${formatRp(h.jumlah)}</td>
      <td><strong style="color:${h.sisa>0?'var(--red)':'var(--green)'}">${formatRp(h.sisa)}</strong></td>
      <td>${formatTanggal(h.tglCatat)}</td>
      <td>${h.jatuhTempo ? `<span style="color:${isJT?'var(--red)':'var(--text)'}">${formatTanggal(h.jatuhTempo)}</span>` : '—'}</td>
      <td>${statusBadge}</td>
      <td style="font-size:11px;color:var(--text-muted);max-width:140px">${h.keterangan || '—'}</td>
      <td>
        ${h.status==='aktif' ? `
        <button class="btn-tbl edit" onclick="bayarSebagian(${h.id})" title="Bayar/Cicil"><i class="fa-solid fa-money-bill-wave"></i></button>
        <button class="btn-tbl eye" onclick="lunasHutang(${h.id})" title="Lunas"><i class="fa-solid fa-check"></i></button>` : ''}
        <button class="btn-tbl edit" onclick="openModalHutang(${h.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-tbl delete" onclick="hapusHutang(${h.id})" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function openModalHutang(id = null) {
  editHutangId = id;
  document.getElementById('modalHutangTitle').textContent = id ? 'Edit Catatan' : 'Catat Hutang / Piutang';
  const today = new Date().toISOString().split('T')[0];
  if (id) {
    const h = hutangPiutang.find(x => x.id === id);
    document.getElementById('hJenis').value      = h.jenis;
    document.getElementById('hNama').value        = h.nama;
    document.getElementById('hTelp').value        = h.telp || '';
    document.getElementById('hJumlah').value      = h.jumlah;
    document.getElementById('hTanggal').value     = h.tglCatat;
    document.getElementById('hJatuhTempo').value  = h.jatuhTempo || '';
    document.getElementById('hKeterangan').value  = h.keterangan || '';
  } else {
    document.getElementById('hJenis').value      = 'hutang';
    document.getElementById('hNama').value        = '';
    document.getElementById('hTelp').value        = '';
    document.getElementById('hJumlah').value      = '';
    document.getElementById('hTanggal').value     = today;
    document.getElementById('hJatuhTempo').value  = '';
    document.getElementById('hKeterangan').value  = '';
  }
  new bootstrap.Modal(document.getElementById('modalHutang')).show();
}

function simpanHutang() {
  const nama    = document.getElementById('hNama').value.trim();
  const jenis   = document.getElementById('hJenis').value;
  const jumlah  = parseFloat(document.getElementById('hJumlah').value) || 0;
  const tanggal = document.getElementById('hTanggal').value;
  if (!nama)    { showToast('Nama wajib diisi!', 'error'); return; }
  if (!jumlah)  { showToast('Jumlah wajib diisi!', 'error'); return; }
  if (!tanggal) { showToast('Tanggal wajib diisi!', 'error'); return; }
  const data = {
    jenis, nama,
    telp:       document.getElementById('hTelp').value.trim(),
    jumlah,
    tglCatat:   tanggal,
    jatuhTempo: document.getElementById('hJatuhTempo').value || null,
    keterangan: document.getElementById('hKeterangan').value.trim(),
  };
  if (editHutangId) {
    const i = hutangPiutang.findIndex(h => h.id === editHutangId);
    hutangPiutang[i] = { ...hutangPiutang[i], ...data };
    showToast('Catatan berhasil diperbarui!', 'success');
  } else {
    hutangPiutang.push({ id: Date.now(), ...data, status: 'aktif', sisa: jumlah });
    showToast(`${jenis === 'hutang' ? 'Hutang' : 'Piutang'} "${nama}" dicatat!`, 'success');
  }
  saveData();
  renderHutangPage();
  bootstrap.Modal.getInstance(document.getElementById('modalHutang')).hide();
}

function bayarSebagian(id) {
  const h = hutangPiutang.find(x => x.id === id);
  Swal.fire({
    title: `💳 Bayar — ${h.nama}`,
    html: `<div style="margin:8px 0">
      <div style="font-size:12px;color:#7c8fa6;margin-bottom:6px">Sisa tagihan:</div>
      <div style="font-size:22px;font-weight:800;color:#ea5455;margin-bottom:12px">${formatRp(h.sisa)}</div>
      <input type="number" id="swalBayarNom" class="swal2-input" placeholder="Jumlah yang dibayar" max="${h.sisa}" min="1"/>
    </div>`,
    showCancelButton: true,
    confirmButtonColor: '#28c76f',
    confirmButtonText: '✅ Konfirmasi Bayar',
    cancelButtonText: 'Batal',
    cancelButtonColor: '#aaa',
    preConfirm: () => {
      const val = parseFloat(document.getElementById('swalBayarNom').value) || 0;
      if (!val || val <= 0) { Swal.showValidationMessage('Masukkan jumlah bayar!'); return false; }
      if (val > h.sisa)     { Swal.showValidationMessage('Melebihi sisa hutang!');  return false; }
      return val;
    }
  }).then(r => {
    if (r.isConfirmed) {
      h.sisa -= r.value;
      if (h.sisa <= 0) { h.sisa = 0; h.status = 'lunas'; showToast(`✅ ${h.nama} LUNAS!`, 'success'); }
      else { showToast(`Bayar ${formatRp(r.value)} — sisa ${formatRp(h.sisa)}`, 'info'); }
      saveData(); renderHutangPage();
    }
  });
}

function lunasHutang(id) {
  const h = hutangPiutang.find(x => x.id === id);
  Swal.fire({
    title: 'Tandai Lunas?',
    html: `<b>${h.nama}</b><br><span style="color:#ea5455">${formatRp(h.sisa)}</span> dianggap telah dibayar penuh.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28c76f',
    cancelButtonColor: '#aaa',
    confirmButtonText: '✅ Ya, Lunas',
    cancelButtonText: 'Batal'
  }).then(r => {
    if (r.isConfirmed) {
      h.status = 'lunas'; h.sisa = 0;
      saveData(); renderHutangPage();
      showToast(`✅ ${h.nama} telah lunas!`, 'success');
    }
  });
}

function hapusHutang(id) {
  const h = hutangPiutang.find(x => x.id === id);
  Swal.fire({
    title: 'Hapus Catatan?',
    html: `<b>${h.nama}</b> akan dihapus permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ea5455',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then(r => {
    if (r.isConfirmed) {
      hutangPiutang = hutangPiutang.filter(x => x.id !== id);
      saveData(); renderHutangPage();
      showToast('Catatan dihapus.', 'info');
    }
  });
}

// ═══════════════ MANAJEMEN KASIR ═══════════════
function renderKasirPage() {
  const today = new Date().toISOString().split('T')[0];
  const kasir = currentUser?.username || 'admin';
  const acc   = accounts.find(a => a.username === kasir);
  const $ = id => document.getElementById(id);

  if ($('kasirAktifNama'))   $('kasirAktifNama').textContent   = kasir;
  if ($('kasirAktifAvatar')) $('kasirAktifAvatar').textContent = kasir[0].toUpperCase();
  if ($('kasirAktifRole'))   $('kasirAktifRole').textContent   = acc?.role === 'admin' ? '👑 Super Admin' : '🖥️ Kasir';

  if (!shiftStartTime) {
    shiftStartTime = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
    LS.set('kg_shiftStart', shiftStartTime);
  }
  if ($('shiftMulai')) $('shiftMulai').textContent = shiftStartTime;
  const shiftTx = transaksi.filter(t => t.tanggal === today && t.kasir === kasir);
  if ($('shiftTransaksi')) $('shiftTransaksi').textContent = shiftTx.length;
  if ($('shiftPenjualan')) $('shiftPenjualan').textContent  = formatRp(shiftTx.reduce((s,t)=>s+t.total, 0));

  const tbody = $('kasirBody');
  if (!tbody) return;
  tbody.innerHTML = accounts.map(a => {
    const isMe = a.username === kasir;
    const role = a.role || 'admin';
    return `<tr>
      <td><div class="user-avatar" style="width:34px;height:34px;font-size:13px">${a.username[0].toUpperCase()}</div></td>
      <td><strong>${a.username}</strong>${isMe ? '<span class="badge-custom green ms-1" style="font-size:10px">Anda</span>' : ''}</td>
      <td>${a.namaUsaha || '—'}</td>
      <td><span class="role-badge ${role}">${role==='admin'?'👑 Admin':'🖥️ Kasir'}</span></td>
      <td><span class="badge-custom ${isMe ? 'green' : 'blue'}" style="font-size:10px">${isMe ? '● Login' : 'Terdaftar'}</span></td>
      <td>
        <button class="btn-tbl edit" onclick="gantiRoleKasir('${a.username}')" title="Ganti Role"><i class="fa-solid fa-user-gear"></i></button>
        ${!isMe ? `<button class="btn-tbl delete" onclick="hapusKasir('${a.username}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function openModalKasir() {
  ['kasirNamaUsaha','kasirUsername','kasirPassword'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('kasirRole').value = 'kasir';
  new bootstrap.Modal(document.getElementById('modalKasir')).show();
}

function simpanKasirBaru() {
  const namaUsaha = document.getElementById('kasirNamaUsaha').value.trim();
  const username  = document.getElementById('kasirUsername').value.trim();
  const password  = document.getElementById('kasirPassword').value;
  const role      = document.getElementById('kasirRole').value;
  if (!namaUsaha) { showToast('Nama usaha wajib diisi!', 'error'); return; }
  if (!username)  { showToast('Username wajib diisi!', 'error'); return; }
  if (password.length < 6) { showToast('Password minimal 6 karakter!', 'error'); return; }
  if (accounts.find(a => a.username === username)) { showToast('Username sudah digunakan!', 'error'); return; }
  accounts.push({ username, password, namaUsaha, logo:'', alamat:'', telp:'', role });
  LS.set('kg_accounts', accounts);
  bootstrap.Modal.getInstance(document.getElementById('modalKasir')).hide();
  showToast(`Kasir "${username}" berhasil ditambahkan!`, 'success');
  renderKasirPage();
}

function hapusKasir(username) {
  Swal.fire({
    title: 'Hapus Kasir?',
    html: `Akun <b>${username}</b> akan dihapus permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ea5455',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then(r => {
    if (r.isConfirmed) {
      accounts = accounts.filter(a => a.username !== username);
      LS.set('kg_accounts', accounts);
      showToast(`Kasir "${username}" dihapus.`, 'info');
      renderKasirPage();
    }
  });
}

function gantiRoleKasir(username) {
  const acc = accounts.find(a => a.username === username);
  if (!acc) return;
  const newRole = acc.role === 'admin' ? 'kasir' : 'admin';
  Swal.fire({
    title: 'Ganti Role?',
    html: `Ubah <b>${username}</b> menjadi <b>${newRole === 'admin' ? '👑 Admin' : '🖥️ Kasir'}</b>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4a90e2',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Ya, Ubah',
    cancelButtonText: 'Batal'
  }).then(r => {
    if (r.isConfirmed) {
      acc.role = newRole;
      LS.set('kg_accounts', accounts);
      showToast(`Role ${username} → ${newRole}`, 'success');
      renderKasirPage();
    }
  });
}

// ═══════════════ HELPERS ═══════════════
function formatRp(n)         { return 'Rp '+(Math.round(n)||0).toLocaleString('id-ID'); }
function formatRpNoSymbol(n) { return (Math.round(n)||0).toLocaleString('id-ID'); }
function formatTanggal(s)    { return new Date(s+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}); }
function getCatName(id)      { const k=kategori.find(x=>x.id===id); return k?k.nama:'-'; }
function getProdukEmoji(katId) { return ({1:'☕',2:'🍜',3:'🍪',4:'🌾',5:'🧼'})[katId]||'📦'; }

// ═══════════════ ENTRY POINT ═══════════════
document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) { showApp(); }
  else {
    document.getElementById('authWrapper').style.display = '';
    document.getElementById('appWrapper').style.display  = 'none';
    applyBranding();
  }
});
