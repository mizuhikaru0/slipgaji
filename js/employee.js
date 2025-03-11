// js/employee.js
import { db } from './db.js';

export function addEmployee() {
  const namaInput = document.getElementById("namaKaryawanBaru");
  const nama = namaInput.value.trim();
  if (!nama) {
    alert("Masukkan nama karyawan!");
    return;
  }
  const employee = {
    nama: nama,
    gajiHarian: 0,
    totalHari: 0,
    absensi: [],
    kasbonList: [],
    lemburList: []
  };
  const transaction = db.transaction(["employees"], "readwrite");
  const store = transaction.objectStore("employees");
  const addRequest = store.add(employee);
  addRequest.onsuccess = () => {
    namaInput.value = "";
    loadEmployees();
  };
  addRequest.onerror = (event) => {
    console.error("Gagal menambahkan karyawan:", event.target.error);
  };
}

export function loadEmployees(callback) {
  const employeeListContainer = document.getElementById("employeeList");
  employeeListContainer.innerHTML = "";
  const transaction = db.transaction(["employees"], "readonly");
  const store = transaction.objectStore("employees");
  const cursorRequest = store.openCursor();
  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const employee = cursor.value;
      const div = document.createElement("div");
      div.className = "employee-item";
      div.textContent = employee.nama;
      div.onclick = () => {
        loadEmployeeDetail(employee.id);
        document.getElementById("employeeDetail").style.display = "block";
      };
      employeeListContainer.appendChild(div);
      cursor.continue();
    } else {
      if (callback) callback();
    }
  };
}

export function loadEmployeeDetail(employeeId) {
  const transaction = db.transaction(["employees"], "readonly");
  const store = transaction.objectStore("employees");
  const getRequest = store.get(employeeId);
  getRequest.onsuccess = (event) => {
    const employee = event.target.result;
    window.activeEmployee = employee;
    document.getElementById("selectedEmployeeName").textContent = employee.nama;
    document.getElementById("harian").value = employee.gajiHarian || "";
    document.getElementById("totalHari").value = employee.totalHari || "";
    if (window.generateDates) {
      window.generateDates(employee.totalHari);
    }
  };
  getRequest.onerror = (event) => {
    console.error("Gagal mengambil data karyawan:", event.target.error);
  };
}

export function updateEmployeeData() {
  if (!window.activeEmployee) {
    alert("Pilih karyawan terlebih dahulu!");
    return;
  }
  const gajiHarian = Number(document.getElementById("harian").value);
  const totalHari = Number(document.getElementById("totalHari").value);
  window.activeEmployee.gajiHarian = gajiHarian;
  window.activeEmployee.totalHari = totalHari;
  if (!Array.isArray(window.activeEmployee.absensi)) {
    window.activeEmployee.absensi = [];
  }
  const currentAbsensiLength = window.activeEmployee.absensi.length;
  if (currentAbsensiLength < totalHari) {
    const tambahan = Array(totalHari - currentAbsensiLength).fill(false);
    window.activeEmployee.absensi = window.activeEmployee.absensi.concat(tambahan);
  } else if (currentAbsensiLength > totalHari) {
    window.activeEmployee.absensi = window.activeEmployee.absensi.slice(0, totalHari);
  }
  const transaction = db.transaction(["employees"], "readwrite");
  const store = transaction.objectStore("employees");
  const updateRequest = store.put(window.activeEmployee);
  updateRequest.onsuccess = () => {
    alert("Data karyawan berhasil diperbarui!");
    loadEmployees();
    if (window.generateDates) {
      window.generateDates(totalHari);
    }
  };
  updateRequest.onerror = (event) => {
    console.error("Gagal memperbarui data karyawan:", event.target.error);
  };
}

export function tambahKasbon() {
  if (!window.activeEmployee) {
    alert("Pilih karyawan terlebih dahulu!");
    return;
  }
  const kasbonInput = document.getElementById("kasbon");
  const amount = Number(kasbonInput.value);
  if (!amount || amount <= 0) {
    alert("Masukkan jumlah kasbon yang valid!");
    return;
  }
  window.activeEmployee.kasbonList.push(amount);
  const totalKasbon = window.activeEmployee.kasbonList.reduce((sum, v) => sum + v, 0);
  document.getElementById("kasbonTotal").textContent = totalKasbon.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  kasbonInput.value = "";
  updateEmployeeData();
}

export function tambahLembur() {
  if (!window.activeEmployee) {
    alert("Pilih karyawan terlebih dahulu!");
    return;
  }
  const lemburInput = document.getElementById("lembur");
  const hours = Number(lemburInput.value);
  if (!hours || hours <= 0) {
    alert("Masukkan jumlah jam lembur yang valid!");
    return;
  }
  window.activeEmployee.lemburList.push(hours);
  const totalLembur = window.activeEmployee.lemburList.reduce((sum, v) => sum + v, 0);
  document.getElementById("lemburTotal").textContent = totalLembur.toFixed(1) + " Jam";
  lemburInput.value = "";
  updateEmployeeData();
}

export function resetLocalStorage() {
  if (confirm("Yakin ingin mereset semua data?")) {
    indexedDB.deleteDatabase("PayrollDB");
    location.reload();
  }
}
