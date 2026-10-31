function calculateTotal() {
  const basePrice = parseInt(document.getElementById('webType').value);
  const speedMultiplier = parseFloat(document.getElementById('speed').value);
  
  let featuresTotal = 0;
  const featureCheckboxes = document.querySelectorAll('.feature:checked');
  featureCheckboxes.forEach((checkbox) => {
    featuresTotal += parseInt(checkbox.value);
  });

  const grandTotal = (basePrice + featuresTotal) * speedMultiplier;

  // Format angka ke format Rupiah
  document.getElementById('totalPrice').innerText = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(grandTotal);
}

function sendToWhatsApp() {
  const total = document.getElementById('totalPrice').innerText;
  const webTypeSelect = document.getElementById('webType');
  const webTypeName = webTypeSelect.options[webTypeSelect.selectedIndex].text;
  
  // Mengambil pilihan metode pembayaran
  const paymentSelect = document.getElementById('paymentMethod');
  const paymentMethodName = paymentSelect.options[paymentSelect.selectedIndex].value;

  const clientNote = document.getElementById('clientNote').value;

  // Menentukan nomor tujuan berdasarkan pilihan pembayaran klien
  let paymentInfo = "";
  if (paymentMethodName.includes("Transfer Bank")) {
    paymentInfo = "Silابق transfer ke Rekening BCA: 1234567890 (a.n. Nama Kamu)";
  } else if (paymentMethodName.includes("QRIS")) {
    paymentInfo = "Silakan scan QRIS atau transfer via E-Wallet (Dana/OVO: 085875120458)";
  } else {
    paymentInfo = "Silakan transfer DP 50% ke BCA: 1234567890 atau Dana: 085875120458";
  }

  // Menyusun pesan lengkap termasuk metode pembayaran & deskripsi
  let message = `Halo AL, saya ingin memesan website dari kalkulator web kamu.\n\n`;
  message += `- Tipe Paket: ${webTypeName}\n`;
  message += `- Metode Pembayaran: ${paymentMethodName}\n`;
  message += `- Total Estimasi: ${total}\n`;
  
  if (clientNote.trim() !== "") {
    message += `- Deskripsi Impian Klien:\n"${clientNote}"\n\n`;
  } else {
    message += `- Deskripsi: (Tidak ada catatan khusus)\n\n`;
  }

  message += `Mohon info nomor rekening / QRIS untuk melanjutkan pembayarannya ya!`;

  const waUrl = `https://wa.me/6285875120458?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}