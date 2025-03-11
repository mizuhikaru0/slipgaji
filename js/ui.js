// js/ui.js
import { db } from './db.js';

export function generateDates(totalHari) {
  const datesContainer = document.getElementById("datesContainer");
  datesContainer.innerHTML = "";
  
  totalHari = Number(totalHari);
  if (isNaN(totalHari) || totalHari < 1) {
    totalHari = 0;
  }
  
  let absensiStatus = [];
  if (window.activeEmployee && Array.isArray(window.activeEmployee.absensi)) {
    absensiStatus = window.activeEmployee.absensi.slice(0, totalHari);
    if (absensiStatus.length < totalHari) {
      absensiStatus = absensiStatus.concat(new Array(totalHari - absensiStatus.length).fill(false));
    }
    window.activeEmployee.absensi = absensiStatus;
  } else {
    absensiStatus = new Array(totalHari).fill(false);
  }
  
  if (totalHari > 0) {
    let tableHTML = `
      <h3 style="margin-bottom: 1rem"><i class="fas fa-calendar-check"></i> Kalender Kerja</h3>
      <table>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Kehadiran</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    for (let i = 1; i <= totalHari; i++) {
      const isChecked = absensiStatus[i - 1] ? true : false;
      const checked = isChecked ? "checked" : "";
      const status = isChecked
        ? '<span style="color: var(--accent)"><i class="fas fa-check"></i> Hadir</span>'
        : '<span style="color: #ef4444"><i class="fas fa-times"></i> Absen</span>';
  
      tableHTML += `
        <tr>
          <td>Hari ${i}</td>
          <td>
            <label class="checkbox-container">
              <input type="checkbox" id="day${i}" ${checked} onchange="updateAbsensi(${i})">
              <span class="checkmark"></span>
            </label>
          </td>
          <td>${status}</td>
        </tr>
      `;
    }
  
    tableHTML += `
        </tbody>
      </table>
    `;
  
    datesContainer.innerHTML = tableHTML;
  }
}

export function updateAbsensi(day) {
  if (window.activeEmployee && Array.isArray(window.activeEmployee.absensi)) {
    window.activeEmployee.absensi[day - 1] = !window.activeEmployee.absensi[day - 1];
  
    const transaction = db.transaction(["employees"], "readwrite");
    const store = transaction.objectStore("employees");
    const updateRequest = store.put(window.activeEmployee);
  
    updateRequest.onsuccess = () => {
      generateDates(Number(document.getElementById("totalHari").value));
    };
  
    updateRequest.onerror = (event) => {
      console.error("Gagal memperbarui data absensi:", event.target.error);
    };
  }
}
