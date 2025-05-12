// STAFF SPECIFIC FUNCTIONS
function updateStaffTable(filteredStaffs = null) {
    const tableBody = document.getElementById('staffTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    const staffsToDisplay = filteredStaffs || staffs;
  
    staffsToDisplay.forEach(staff => {
      const statusClass = staff.status === 'PNS' ? 'status-pns' : 
                         staff.status === 'PPPK' ? 'status-pppk' : 'status-honor';
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <img src="${staff.photo}" alt="${staff.name}" class="staff-photo">
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${staff.name}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">${staff.nip}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">${staff.position}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="status-badge ${statusClass}">${staff.status}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button onclick="viewStaff(${staff.id})" class="text-blue-600 hover:text-blue-900 mr-2" title="Lihat">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editStaff(${staff.id})" class="text-yellow-600 hover:text-yellow-900 mr-2" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="confirmDeleteStaff(${staff.id})" class="text-red-600 hover:text-red-900" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function viewStaff(id) {
    const staff = staffs.find(s => s.id === id);
    if (staff) {
      document.getElementById('viewPhoto').src = staff.photo;
      document.getElementById('viewName').textContent = staff.name;
      document.getElementById('viewNip').textContent = `NIP: ${staff.nip}`;
      document.getElementById('viewPosition').textContent = staff.position;
      document.getElementById('viewStatus').textContent = staff.status;
      document.getElementById('viewGender').textContent = staff.gender;
      document.getElementById('viewModal').classList.remove('hidden');
    }
  }
  
  function editStaff(id) {
    const staff = staffs.find(s => s.id === id);
    if (staff) {
      document.getElementById('modalTitle').textContent = 'Edit Data Tendik';
      document.getElementById('staffId').value = staff.id;
      document.getElementById('name').value = staff.name;
      document.getElementById('nip').value = staff.nip;
      document.getElementById('position').value = staff.position;
      document.getElementById('status').value = staff.status;
      document.getElementById('gender').value = staff.gender;
      document.getElementById('staffModal').classList.remove('hidden');
    }
  }
  
  function confirmDeleteStaff(id) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data tendik akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStaff(id);
      }
    });
  }
  
  function deleteStaff(id) {
    staffs = staffs.filter(staff => staff.id !== id);
    localStorage.setItem('staffs', JSON.stringify(staffs));
    updateStaffTable();
    updateAllDashboardData();
    
    Swal.fire(
      'Dihapus!',
      'Data tendik telah dihapus.',
      'success'
    );
  }
  
  // STAFF FORM HANDLING
  document.getElementById('staffForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('staffId').value;
    const name = document.getElementById('name').value;
    const nip = document.getElementById('nip').value;
    const position = document.getElementById('position').value;
    const status = document.getElementById('status').value;
    const gender = document.getElementById('gender').value;
    
    const photoInput = document.getElementById('photo');
    let photo = id ? staffs.find(s => s.id == id)?.photo : 'https://via.placeholder.com/150';
    
    if (photoInput.files.length > 0) {
      photo = URL.createObjectURL(photoInput.files[0]);
    }
    
    if (id) {
      const index = staffs.findIndex(s => s.id == id);
      staffs[index] = { 
        ...staffs[index],
        name, nip, position, status, gender, photo 
      };
    } else {
      const newId = staffs.length > 0 ? Math.max(...staffs.map(s => s.id)) + 1 : 1;
      staffs.push({ 
        id: newId, 
        name, nip, position, status, gender, photo 
      });
    }
    
    localStorage.setItem('staffs', JSON.stringify(staffs));
    updateStaffTable();
    updateAllDashboardData();
    closeModal();
    
    Swal.fire(
      'Berhasil!',
      `Data tendik ${name} telah ${id ? 'diperbarui' : 'ditambahkan'}.`,
      'success'
    );
  });
  
  // STAFF SEARCH FUNCTIONALITY
  function setupStaffSearch() {
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredStaffs = staffs.filter(staff => 
          staff.name.toLowerCase().includes(searchTerm) || 
          staff.nip.toLowerCase().includes(searchTerm) ||
          staff.position.toLowerCase().includes(searchTerm) ||
          staff.status.toLowerCase().includes(searchTerm)
        );
        updateStaffTable(filteredStaffs);
      });
    }
  }
  
  // INITIALIZE STAFF PAGE
  document.addEventListener('DOMContentLoaded', function() {
    updateStaffTable();
    setupStaffSearch();
  });