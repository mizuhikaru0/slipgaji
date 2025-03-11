// js/slipGaji.js
export function generateSlipGaji() {
    if (!window.activeEmployee) {
      alert("Pilih karyawan terlebih dahulu!");
      return;
    }
    document.getElementById("slipNamaKaryawan").textContent = window.activeEmployee.nama;
    document.getElementById("slipGajiHarian").textContent = window.activeEmployee.gajiHarian
      ? window.activeEmployee.gajiHarian.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "-";
    document.getElementById("slipTotalHari").textContent = window.activeEmployee.totalHari || "-";
    const hadir = window.activeEmployee.absensi
      ? window.activeEmployee.absensi.filter(status => status).length
      : 0;
    document.getElementById("slipHadir").textContent = hadir;
    const totalGaji = window.activeEmployee.gajiHarian * hadir;
    document.getElementById("slipTotalGaji").textContent = totalGaji
      ? totalGaji.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "-";
    const totalLemburHours = window.activeEmployee.lemburList
      ? window.activeEmployee.lemburList.reduce((sum, v) => sum + v, 0)
      : 0;
    const lembur = totalLemburHours * (window.activeEmployee.gajiHarian / 8) * 1.5;
    document.getElementById("slipLembur").textContent = lembur
      ? lembur.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "-";
    const totalKasbon = window.activeEmployee.kasbonList
      ? window.activeEmployee.kasbonList.reduce((sum, v) => sum + v, 0)
      : 0;
    document.getElementById("slipKasbon").textContent = totalKasbon
      ? totalKasbon.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "-";
    const gajiBersih = totalGaji + lembur - totalKasbon;
    document.getElementById("slipGajiBersih").textContent = gajiBersih
      ? gajiBersih.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "-";
    document.getElementById("slipTanggal").textContent = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const slipDiv = document.getElementById("slipGajiTemplate");
    slipDiv.style.display = "block";
    html2canvas(slipDiv).then(canvas => {
      slipDiv.style.display = "none";
      const imgData = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`slip-gaji-${window.activeEmployee.nama}-${Date.now()}.pdf`);
    });
  }
  