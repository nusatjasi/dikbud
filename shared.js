// DASHBOARD SPECIFIC FUNCTIONS
function updateDashboardUI() {
    // Update card counts
    document.getElementById('teacherCount').textContent = localStorage.getItem('teacherCount') || 0;
    document.getElementById('staffCount').textContent = localStorage.getItem('staffCount') || 0;
    document.getElementById('studentCount').textContent = localStorage.getItem('studentCount') || 0;
    document.getElementById('classCount').textContent = localStorage.getItem('classCount') || 0;
    
    // Update charts
    updateCharts();
    
    // Update information table
    updateInfoTable();
  }
  
  function updateCharts() {
    // Employee Status Chart
    const employeeData = JSON.parse(localStorage.getItem('employeeStatusData')) || {};
    const ctxPegawai = document.getElementById('chartPegawai');
    if (ctxPegawai) {
      const labels = Object.keys(employeeData).filter(k => employeeData[k] > 0);
      const data = labels.map(label => employeeData[label]);
      
      new Chart(ctxPegawai, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Jumlah Pegawai',
            data: data,
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        }
      });
    }
    
    // Student Gender Chart
    const studentData = JSON.parse(localStorage.getItem('studentGenderData')) || {};
    const ctxSiswa = document.getElementById('chartSiswa');
    if (ctxSiswa) {
      new Chart(ctxSiswa, {
        type: 'pie',
        data: {
          labels: ['Laki-laki', 'Perempuan'],
          datasets: [{
            label: 'Jumlah Siswa',
            data: [studentData.Laki || 0, studentData.Perempuan || 0],
            backgroundColor: ['#60A5FA', '#F472B6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true
        }
      });
    }
  }
  
  function updateInfoTable() {
    const infoData = JSON.parse(localStorage.getItem('latestInfo')) || [];
    const tableBody = document.getElementById('infoTableBody');
    
    if (!tableBody) return;
    
    if (infoData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center py-4">Tidak ada informasi terbaru</td>
        </tr>
      `;
      return;
    }
    
    const displayData = infoData.slice(0, 5);
    tableBody.innerHTML = displayData.map(info => `
      <tr>
        <td class="border px-2 py-1">${info.date}</td>
        <td class="border px-2 py-1">${info.message}</td>
        <td class="border px-2 py-1">${info.sender}</td>
      </tr>
    `).join('');
  }
  
  // INITIALIZE DASHBOARD
  document.addEventListener('DOMContentLoaded', function() {
    updateDashboardUI();
    setInterval(updateDashboardUI, 30000); // Refresh every 30 seconds
  });