// script.js — dashboard interactions for search, filters, table actions, and pagination
(function () {
  'use strict';

  const searchInput = document.getElementById('dashboardSearch');
  const departmentFilter = document.getElementById('filterDepartment');
  const semesterFilter = document.getElementById('filterSemester');
  const statusFilter = document.getElementById('filterStatus');
  const clearFiltersButton = document.getElementById('clearFilters');
  const courseRows = document.querySelectorAll('.course-row');
  const resultCount = document.getElementById('resultCount');
  const pageInfo = document.getElementById('pageInfo');

  function normalizeText(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function updateCounts(visibleRows) {
    const visible = visibleRows.length;
    const total = courseRows.length;
    resultCount.textContent = `Showing ${visible} of ${total} courses`;
    pageInfo.textContent = `Showing 1–${visible} of ${total} courses`;
  }

  function applyFilters() {
    const searchValue = normalizeText(searchInput?.value);
    const departmentValue = normalizeText(departmentFilter?.value);
    const semesterValue = normalizeText(semesterFilter?.value);
    const statusValue = normalizeText(statusFilter?.value);

    const visibleRows = Array.from(courseRows).filter((row) => {
      const rowText = normalizeText(row.dataset.search || row.textContent);
      const department = normalizeText(row.dataset.department);
      const semester = normalizeText(row.dataset.semester);
      const status = normalizeText(row.dataset.status);

      const matchesSearch = !searchValue || rowText.includes(searchValue);
      const matchesDepartment = !departmentValue || department === departmentValue;
      const matchesSemester = !semesterValue || semester === semesterValue;
      const matchesStatus = !statusValue || status === statusValue;

      return matchesSearch && matchesDepartment && matchesSemester && matchesStatus;
    });

    courseRows.forEach((row) => {
      row.style.display = visibleRows.includes(row) ? '' : 'none';
    });

    updateCounts(visibleRows);
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (departmentFilter) {
    departmentFilter.addEventListener('change', applyFilters);
  }

  if (semesterFilter) {
    semesterFilter.addEventListener('change', applyFilters);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', applyFilters);
  }

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      if (departmentFilter) departmentFilter.value = '';
      if (semesterFilter) semesterFilter.value = '';
      if (statusFilter) statusFilter.value = '';
      applyFilters();
    });
  }

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const courseId = this.dataset.id;
      const courseName = this.dataset.name;

      const confirmed = window.confirm(`Delete ${courseName} permanently?`);
      if (!confirmed) return;

      fetch(`/courses/${courseId}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            window.alert(data.error);
            return;
          }
          const row = document.querySelector(`.course-row[data-id="${courseId}"]`);
          if (row) row.remove();
          applyFilters();
        })
        .catch(() => {
          window.alert('Unable to delete course. Please try again.');
        });
    });
  });

  applyFilters();
})();
