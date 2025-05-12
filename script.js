// GLOBAL VARIABLES
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
let staffs = JSON.parse(localStorage.getItem('staffs')) || [];
let employeeChart, studentChart;

// MAIN FUNCTION TO UPDATE ALL DATA
function updateDashboardData() {
    // 1. Update counts for cards
    updateCountCards();
    
    // 2. Process combined employee data (guru + tendik)
    const combinedEmployeeData = processEmployeeData();
    
    // 3. Process student data
    const studentData = JSON.parse(localStorage.getItem('studentGenderData')) || { Laki: 0, Perempuan: 0 };
    
    // 4. Update charts
    updateCharts(combinedEmployeeData, studentData);
    
    // 5. Update information table
    updateInfoTable(JSON.parse(localStorage.getItem('latestInfo')) || []);
    
    // 6. Update running text
    updateRunningText();
}

// HELPER FUNCTIONS

function updateCountCards() {
    document.getElementById('teacherCount').textContent = teachers.length;
    document.getElementById('staffCount').textContent = staffs.length;
    document.getElementById('studentCount').textContent = localStorage.getItem('studentCount') || 0;
    document.getElementById('classCount').textContent = localStorage.getItem('classCount') || 0;
    
    // Save to localStorage
    localStorage.setItem('teacherCount', teachers.length);
    localStorage.setItem('staffCount', staffs.length);
}

function processEmployeeData() {
    // Combine all status possibilities
    const allStatuses = ['PNS', 'PPPK', 'Honor Sekolah', 'Honor Daerah', 'Tenaga Kontrak'];
    
    // Process teachers
    const teacherStatusCounts = teachers.reduce((acc, teacher) => {
        acc[teacher.status] = (acc[teacher.status] || 0) + 1;
        return acc;
    }, {});
    
    // Process staff
    const staffStatusCounts = staffs.reduce((acc, staff) => {
        acc[staff.status] = (acc[staff.status] || 0) + 1;
        return acc;
    }, {});
    
    // Combine results
    const combined = {};
    allStatuses.forEach(status => {
        combined[status] = (teacherStatusCounts[status] || 0) + (staffStatusCounts[status] || 0);
    });
    
    // Save to localStorage
    localStorage.setItem('employeeStatusData', JSON.stringify(combined));
    
    return combined;
}

function updateCharts(employeeData, studentData) {
    const ctxPegawai = document.getElementById('chartPegawai').getContext('2d');
    
    // Prepare data for chart
    const statusLabels = Object.keys(employeeData).filter(k => employeeData[k] > 0);
    const statusValues = statusLabels.map(label => employeeData[label]);
    
    // Employee Status Chart
    if (employeeChart) {
        employeeChart.data.labels = statusLabels;
        employeeChart.data.datasets[0].data = statusValues;
        employeeChart.update();
    } else {
        employeeChart = new Chart(ctxPegawai, {
            type: 'bar',
            data: {
                labels: statusLabels,
                datasets: [{
                    label: 'Jumlah Pegawai',
                    data: statusValues,
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
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
    
    // Student Gender Chart (unchanged)
    const ctxSiswa = document.getElementById('chartSiswa').getContext('2d');
    if (!studentChart) {
        studentChart = new Chart(ctxSiswa, {
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
            options: { responsive: true }
        });
    }
}

function updateRunningText() {
    const texts = [
        `Total Guru: ${teachers.length} | Tendik: ${staffs.length}`,
        `Total Siswa: ${localStorage.getItem('studentCount') || 0}`,
        "Selamat datang di Sistem Informasi Sekolah",
        "Gunakan menu untuk navigasi"
    ];
    document.getElementById('runningText').textContent = 
        texts[Math.floor(Math.random() * texts.length)];
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    // Load data from storage
    teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    staffs = JSON.parse(localStorage.getItem('staffs')) || [];
    
    // Initialize dashboard
    updateDashboardData();
    updateJamDigital();
    
    // Set auto-refresh
    setInterval(updateDashboardData, 30000); // Refresh every 30 seconds
    setInterval(updateJamDigital, 1000);
});

// OTHER FUNCTIONS (keep existing)
function updateInfoTable(infoData) { /* ... */ }
function toggleSidebar() { /* ... */ }
function toggleSubmenu(id) { /* ... */ }
function updateJamDigital() { /* ... */ }

// STORAGE EVENT LISTENER
window.addEventListener('storage', function(event) {
    if (['teachers', 'staffs', 'studentCount', 'classCount'].includes(event.key)) {
        updateDashboardData();
    }
});





  // Cek session saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('userSession')) {
      Swal.fire({
        title: 'Akses Ditolak',
        text: 'Anda harus login terlebih dahulu',
        icon: 'warning',
        confirmButtonText: 'Ke Halaman Login'
      }).then(() => {
        window.location.href = 'https://nusatjasi.github.io/logindapo2/';
      });
    }
  });