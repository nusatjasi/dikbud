// TEACHER SPECIFIC FUNCTIONS
function updateTeacherTable(filteredTeachers = null) {
    const tableBody = document.getElementById('teacherTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    const teachersToDisplay = filteredTeachers || teachers;
  
    teachersToDisplay.forEach(teacher => {
      const statusClass = teacher.status === 'PNS' ? 'status-pns' : 
                         teacher.status === 'PPPK' ? 'status-pppk' : 'status-honor';
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <img src="${teacher.photo}" alt="${teacher.name}" class="teacher-photo">
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${teacher.name}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">${teacher.nip}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">${teacher.rank} (${teacher.group})</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="status-badge ${statusClass}">${teacher.status}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">${teacher.subject}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button onclick="viewTeacher(${teacher.id})" class="text-blue-600 hover:text-blue-900 mr-2" title="Lihat">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editTeacher(${teacher.id})" class="text-yellow-600 hover:text-yellow-900 mr-2" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="confirmDeleteTeacher(${teacher.id})" class="text-red-600 hover:text-red-900" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function viewTeacher(id) {
    const teacher = teachers.find(t => t.id === id);
    if (teacher) {
      document.getElementById('viewPhoto').src = teacher.photo;
      document.getElementById('viewName').textContent = teacher.name;
      document.getElementById('viewNip').textContent = `NIP: ${teacher.nip}`;
      document.getElementById('viewRankGroup').textContent = `${teacher.rank} (${teacher.group})`;
      document.getElementById('viewStatus').textContent = teacher.status;
      document.getElementById('viewGender').textContent = teacher.gender;
      document.getElementById('viewReligion').textContent = teacher.religion;
      document.getElementById('viewSubject').textContent = teacher.subject;
      document.getElementById('viewModal').classList.remove('hidden');
    }
  }
  
  function editTeacher(id) {
    const teacher = teachers.find(t => t.id === id);
    if (teacher) {
      document.getElementById('modalTitle').textContent = 'Edit Data Guru';
      document.getElementById('teacherId').value = teacher.id;
      document.getElementById('name').value = teacher.name;
      document.getElementById('nip').value = teacher.nip;
      document.getElementById('rank').value = teacher.rank;
      document.getElementById('group').value = teacher.group;
      document.getElementById('status').value = teacher.status;
      document.getElementById('gender').value = teacher.gender;
      document.getElementById('religion').value = teacher.religion;
      document.getElementById('subject').value = teacher.subject;
      document.getElementById('teacherModal').classList.remove('hidden');
    }
  }
  
  function confirmDeleteTeacher(id) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data guru akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTeacher(id);
      }
    });
  }
  
  function deleteTeacher(id) {
    teachers = teachers.filter(teacher => teacher.id !== id);
    localStorage.setItem('teachers', JSON.stringify(teachers));
    updateTeacherTable();
    updateAllDashboardData();
    
    Swal.fire(
      'Dihapus!',
      'Data guru telah dihapus.',
      'success'
    );
  }
  
  // TEACHER FORM HANDLING
  document.getElementById('teacherForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('teacherId').value;
    const name = document.getElementById('name').value;
    const nip = document.getElementById('nip').value;
    const rank = document.getElementById('rank').value;
    const group = document.getElementById('group').value;
    const status = document.getElementById('status').value;
    const gender = document.getElementById('gender').value;
    const religion = document.getElementById('religion').value;
    const subject = document.getElementById('subject').value;
    
    const photoInput = document.getElementById('photo');
    let photo = id ? teachers.find(t => t.id == id)?.photo : 'https://via.placeholder.com/150';
    
    if (photoInput.files.length > 0) {
      photo = URL.createObjectURL(photoInput.files[0]);
    }
    
    if (id) {
      const index = teachers.findIndex(t => t.id == id);
      teachers[index] = { 
        ...teachers[index],
        name, nip, rank, group, status, gender, religion, subject, photo 
      };
    } else {
      const newId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
      teachers.push({ 
        id: newId, 
        name, nip, rank, group, status, gender, religion, subject, photo 
      });
    }
    
    localStorage.setItem('teachers', JSON.stringify(teachers));
    updateTeacherTable();
    updateAllDashboardData();
    closeModal();
    
    Swal.fire(
      'Berhasil!',
      `Data guru ${name} telah ${id ? 'diperbarui' : 'ditambahkan'}.`,
      'success'
    );
  });
  
  // TEACHER SEARCH FUNCTIONALITY
  function setupTeacherSearch() {
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTeachers = teachers.filter(teacher => 
          teacher.name.toLowerCase().includes(searchTerm) || 
          teacher.nip.toLowerCase().includes(searchTerm) ||
          teacher.subject.toLowerCase().includes(searchTerm) ||
          teacher.status.toLowerCase().includes(searchTerm)
        );
        updateTeacherTable(filteredTeachers);
      });
    }
  }
  
  // INITIALIZE TEACHER PAGE
  document.addEventListener('DOMContentLoaded', function() {
    updateTeacherTable();
    setupTeacherSearch();
  });