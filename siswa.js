// Initialize jsPDF
const { jsPDF } = window.jspdf;

// Student data structure
let students = JSON.parse(localStorage.getItem('students_kelas7')) || [];
let allStudents = JSON.parse(localStorage.getItem('all_students')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  updateStudentTable();
  updateTotalStudents();
  updateDashboardData();
  updateJamDigital();
  setupStudentSearch();
});

// Update student table
function updateStudentTable(filteredStudents = null) {
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = '';

  const studentsToDisplay = filteredStudents || students;

  studentsToDisplay.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <img src="${student.photo}" alt="${student.name}" class="student-photo">
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${student.name}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">${student.nis || '-'}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">${student.gender}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">${student.class}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onclick="viewStudent('${student.id}')" class="text-blue-600 hover:text-blue-900 mr-2" title="Lihat">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="editStudent('${student.id}')" class="text-yellow-600 hover:text-yellow-900 mr-2" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="confirmDeleteStudent('${student.id}')" class="text-red-600 hover:text-red-900" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Update total student count
function updateTotalStudents() {
  document.getElementById('totalStudents').textContent = students.length;
}

// Update dashboard data
function updateDashboardData() {
  // Save student data
  localStorage.setItem('students_kelas7', JSON.stringify(students));
  
  // Update all students data
  const kelas7Students = JSON.parse(localStorage.getItem('students_kelas7')) || [];
  const kelas8Students = JSON.parse(localStorage.getItem('students_kelas8')) || [];
  const kelas9Students = JSON.parse(localStorage.getItem('students_kelas9')) || [];
  
  allStudents = [...kelas7Students, ...kelas8Students, ...kelas9Students];
  localStorage.setItem('all_students', JSON.stringify(allStudents));
  
  // Count students by gender
  const genderCounts = {
    Laki: allStudents.filter(s => s.gender === 'Laki-laki').length,
    Perempuan: allStudents.filter(s => s.gender === 'Perempuan').length
  };
  
  localStorage.setItem('studentGenderData', JSON.stringify(genderCounts));
  localStorage.setItem('studentCount', allStudents.length);
}

// Modal functions
function showAddModal() {
  document.getElementById('modalTitle').textContent = 'Tambah Data Siswa';
  document.getElementById('studentForm').reset();
  document.getElementById('studentId').value = '';
  document.getElementById('studentModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('studentModal').classList.add('hidden');
}

function closeViewModal() {
  document.getElementById('viewModal').classList.add('hidden');
}

// View student details
function viewStudent(id) {
  const student = students.find(s => s.id === id);
  if (student) {
    document.getElementById('viewPhoto').src = student.photo;
    document.getElementById('viewName').textContent = student.name;
    document.getElementById('viewNis').textContent = student.nis ? `NIS: ${student.nis}` : 'NIS: -';
    document.getElementById('viewGender').textContent = student.gender;
    document.getElementById('viewClass').textContent = student.class;
    document.getElementById('viewReligion').textContent = student.religion;
    document.getElementById('viewModal').classList.remove('hidden');
  }
}

// Edit student
function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (student) {
    document.getElementById('modalTitle').textContent = 'Edit Data Siswa';
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('nis').value = student.nis;
    document.getElementById('gender').value = student.gender;
    document.getElementById('class').value = student.class;
    document.getElementById('religion').value = student.religion;
    document.getElementById('studentModal').classList.remove('hidden');
  }
}

// Confirm delete student
function confirmDeleteStudent(id) {
  const student = students.find(s => s.id === id);
  Swal.fire({
    title: 'Apakah Anda yakin?',
    html: `Anda akan menghapus data <strong>${student.name}</strong>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteStudent(id);
    }
  });
}

// Delete student
function deleteStudent(id) {
  students = students.filter(student => student.id !== id);
  localStorage.setItem('students_kelas7', JSON.stringify(students));
  updateStudentTable();
  updateTotalStudents();
  updateDashboardData();
  
  Swal.fire(
    'Dihapus!',
    'Data siswa telah dihapus.',
    'success'
  );
}

// Handle form submission
document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const id = document.getElementById('studentId').value;
  const name = document.getElementById('name').value;
  const nis = document.getElementById('nis').value;
  const gender = document.getElementById('gender').value;
  const studentClass = document.getElementById('class').value;
  const religion = document.getElementById('religion').value;
  
  const photoInput = document.getElementById('photo');
  let photo = id ? students.find(s => s.id == id)?.photo : 'https://via.placeholder.com/150';
  
  if (photoInput.files.length > 0) {
    photo = URL.createObjectURL(photoInput.files[0]);
  }
  
  if (id) {
    // Update existing student
    const index = students.findIndex(s => s.id == id);
    students[index] = { 
      ...students[index],
      name, 
      nis, 
      gender, 
      class: studentClass, 
      religion, 
      photo 
    };
  } else {
    // Add new student
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.push({ 
      id: newId, 
      name, 
      nis, 
      gender, 
      class: studentClass, 
      religion, 
      photo 
    });
  }
  
  localStorage.setItem('students_kelas7', JSON.stringify(students));
  updateStudentTable();
  updateTotalStudents();
  updateDashboardData();
  closeModal();
  
  Swal.fire(
    'Berhasil!',
    `Data siswa ${name} telah ${id ? 'diperbarui' : 'ditambahkan'}.`,
    'success'
  );
});

// Export to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = "DATA SISWA KELAS 7";
  const schoolName = "Nama Sekolah Anda";
  const date = new Date().toLocaleDateString('id-ID');
  
  // Add title and school info
  doc.setFontSize(16);
  doc.text(title, 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(schoolName, 105, 22, { align: 'center' });
  doc.text(`Tanggal: ${date}`, 105, 29, { align: 'center' });
  
  // Prepare table data
  const headers = [["No", "Nama", "NIS", "Jenis Kelamin", "Kelas"]];
  const data = students.map((student, index) => [
    index + 1,
    student.name,
    student.nis || '-',
    student.gender,
    student.class
  ]);

  // Add table
  doc.autoTable({
    head: headers,
    body: data,
    startY: 35,
    styles: {
      cellPadding: 3,
      fontSize: 10,
      valign: 'middle',
      halign: 'left'
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    }
  });

  doc.save(`data_siswa_kelas7_${new Date().toISOString().slice(0,10)}.pdf`);
}

// Search functionality
function setupStudentSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        (student.nis && student.nis.toLowerCase().includes(searchTerm)) ||
        student.gender.toLowerCase().includes(searchTerm) ||
        student.class.toLowerCase().includes(searchTerm)
      );
      updateStudentTable(filteredStudents);
    });
  }
}

// Refresh data
function refreshData() {
  students = JSON.parse(localStorage.getItem('students_kelas7')) || [];
  updateStudentTable();
  updateTotalStudents();
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Data telah diperbarui',
    showConfirmButton: false,
    timer: 1500
  });
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('w-64');
  sidebar.classList.toggle('w-0');
  sidebar.classList.toggle('hidden');
}

// Toggle submenu
function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  submenu.classList.toggle('hidden');
  icon.classList.toggle('rotate-180');
}

// Digital clock
function updateJamDigital() {
  const jam = document.getElementById("jamDigital");
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  jam.textContent = now.toLocaleTimeString('id-ID', options);
}
setInterval(updateJamDigital, 1000);

// Logout function
function logout() {
  Swal.fire({
    title: 'Keluar dari sistem?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, keluar',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '../login.html';
    }
  });
}