// js/main.js
import { initializeDB } from './db.js';
import {
  loadEmployees,
  addEmployee,
  loadEmployeeDetail,
  updateEmployeeData,
  tambahKasbon,
  tambahLembur,
  resetLocalStorage
} from './employee.js';
import { generateDates, updateAbsensi } from './ui.js';
import { generateSlipGaji } from './slipGaji.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeDB(() => {
    loadEmployees();
  });

  // Bind fungsi-fungsi ke objek global agar dapat dipanggil dari HTML
  window.addEmployee = addEmployee;
  window.loadEmployeeDetail = loadEmployeeDetail;
  window.updateEmployeeData = updateEmployeeData;
  window.tambahKasbon = tambahKasbon;
  window.tambahLembur = tambahLembur;
  window.resetLocalStorage = resetLocalStorage;
  window.generateDates = generateDates;
  window.updateAbsensi = updateAbsensi;
  window.generateSlipGaji = generateSlipGaji;
});
