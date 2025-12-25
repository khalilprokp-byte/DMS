    <script>
        // Global State Management
        let drivers = JSON.parse(localStorage.getItem('drivers')) || [];
        let companies = JSON.parse(localStorage.getItem('companies')) || [];
        let stops = JSON.parse(localStorage.getItem('stops')) || [];
        let advances = JSON.parse(localStorage.getItem('advances')) || [];
        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        let settings = JSON.parse(localStorage.getItem('settings')) || {
            trainingDays: 15,
            targetOrders: 100,
            baseSalary: 120,
            bonusPerOrder: 1,
            driverCostPerOrder: 1.2
        };

        let currentEditId = null;
        let currentNotificationDriverId = null;
        let uploadedDocuments = [];
        let uploadedStopImage = null;
        let manyStopsEntries = [];

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            updateCurrentDayDate();
            setInterval(updateCurrentDayDate, 60000); // Update every minute
        });

        function initializeApp() {
            // Set default dates
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('salary-start-date').value = today;
            document.getElementById('salary-end-date').value = today;
            document.getElementById('report-date').value = today;
            document.getElementById('driver-join-date').value = today;
            if(document.getElementById('stop-date')) {
                document.getElementById('stop-date').value = today;
            }
            document.getElementById('advance-date').value = today;
            
            // Load settings
            loadSettings();
            
            // Render initial data
            renderDashboard();
            renderDrivers();
            renderCompanies();
            renderStops();
            renderAdvances();
            renderArchive();
            
            // Check for training periods
            checkTrainingPeriods();
            
            // Update notification badge
            updateNotificationBadge();
            
            // Setup advance deduction type handler
            document.getElementById('advance-deduction-type').addEventListener('change', function() {
                const partialSection = document.getElementById('partial-deduction-section');
                partialSection.style.display = this.value === 'partial' ? 'block' : 'none';
            });
        }

        // Update current day and date
        function updateCurrentDayDate() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateStr = now.toLocaleDateString('en-GB', options);
            const element = document.getElementById('current-day-date');
            if (element) {
                element.textContent = dateStr;
            }
        }

        // Page Navigation
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-section').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
            
            // Refresh page data
            if (pageId === 'dashboard') renderDashboard();
            else if (pageId === 'drivers') renderDrivers();
            else if (pageId === 'companies') renderCompanies();
            else if (pageId === 'stops') renderStops();
            else if (pageId === 'salaries') renderSalaries();
            else if (pageId === 'advances') renderAdvances();
            else if (pageId === 'reports') generateReport();
            else if (pageId === 'notifications') renderNotifications();
            else if (pageId === 'archive') renderArchive();
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        // Settings Management
        function loadSettings() {
            document.getElementById('setting-training-days').value = settings.trainingDays;
            document.getElementById('setting-target-stops').value = settings.targetOrders;
            document.getElementById('setting-base-salary').value = settings.baseSalary;
            document.getElementById('setting-bonus-per-order').value = settings.bonusPerOrder;
            document.getElementById('setting-driver-cost').value = settings.driverCostPerOrder;
            
            updateSystemInfo();
        }

        function saveSettings() {
            settings = {
                trainingDays: parseInt(document.getElementById('setting-training-days').value),
                targetOrders: parseInt(document.getElementById('setting-target-stops').value),
                baseSalary: parseFloat(document.getElementById('setting-base-salary').value),
                bonusPerOrder: parseFloat(document.getElementById('setting-bonus-per-order').value),
                driverCostPerOrder: parseFloat(document.getElementById('setting-driver-cost').value)
            };
            
            localStorage.setItem('settings', JSON.stringify(settings));
            alert('✅ Settings saved successfully!');
        }

        function updateSystemInfo() {
            const totalRecords = drivers.length + companies.length + stops.length + advances.length;
            document.getElementById('total-records').textContent = totalRecords;
            
            const storageSize = new Blob([JSON.stringify({drivers, companies, stops, advances})]).size;
            document.getElementById('storage-used').textContent = (storageSize / 1024).toFixed(2) + ' KB';
        }

        // Document Upload Management
        function previewDocuments(event) {
            const files = event.target.files;
            const previewContainer = document.getElementById('document-previews');
            
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'image-preview';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Document ${index + 1}">
                        <div class="image-preview-remove" onclick="removeDocument(${uploadedDocuments.length})">×</div>
                    `;
                    previewContainer.appendChild(preview);
                    
                    uploadedDocuments.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        }

        function removeDocument(index) {
            uploadedDocuments.splice(index, 1);
            const previewContainer = document.getElementById('document-previews');
            previewContainer.innerHTML = '';
            
            uploadedDocuments.forEach((doc, i) => {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${doc}" alt="Document ${i + 1}">
                    <div class="image-preview-remove" onclick="removeDocument(${i})">×</div>
                `;
                previewContainer.appendChild(preview);
            });
        }

        // Driver Management
        function openDriverModal(id = null) {
            const modal = document.getElementById('driver-modal');
            const title = document.getElementById('driver-modal-title');
            const form = document.getElementById('driver-form');
            
            form.reset();
            uploadedDocuments = [];
            document.getElementById('document-previews').innerHTML = '';
            
            if (id) {
                const driver = drivers.find(d => d.id === id);
                title.textContent = '✏️ Edit Driver';
                document.getElementById('driver-id').value = driver.id;
                document.getElementById('driver-name').value = driver.name;
                document.getElementById('driver-phone').value = driver.phone;
                document.getElementById('driver-email').value = driver.email;
                document.getElementById('driver-join-date').value = driver.joinDate;
                document.getElementById('driver-notes').value = driver.notes || '';
                
                if (driver.documents) {
                    uploadedDocuments = driver.documents;
                    const previewContainer = document.getElementById('document-previews');
                    driver.documents.forEach((doc, i) => {
                        const preview = document.createElement('div');
                        preview.className = 'image-preview';
                        preview.innerHTML = `
                            <img src="${doc}" alt="Document ${i + 1}">
                            <div class="image-preview-remove" onclick="removeDocument(${i})">×</div>
                        `;
                        previewContainer.appendChild(preview);
                    });
                }
            } else {
                title.textContent = '👨‍✈️ Add New Driver';
                document.getElementById('driver-id').value = '';
            }
            
            modal.classList.add('active');
        }

        function closeDriverModal() {
            document.getElementById('driver-modal').classList.remove('active');
            uploadedDocuments = [];
        }

        function saveDriver(event) {
            event.preventDefault();
            
            const id = document.getElementById('driver-id').value;
            const driver = {
                id: id || Date.now().toString(),
                name: document.getElementById('driver-name').value,
                phone: document.getElementById('driver-phone').value,
                email: document.getElementById('driver-email').value,
                joinDate: document.getElementById('driver-join-date').value,
                notes: document.getElementById('driver-notes').value,
                documents: uploadedDocuments,
                status: 'training', // Initial status
                salaryActivated: false,
                createdAt: id ? drivers.find(d => d.id === id).createdAt : new Date().toISOString()
            };
            
            if (id) {
                const index = drivers.findIndex(d => d.id === id);
                drivers[index] = { ...drivers[index], ...driver };
            } else {
                drivers.push(driver);
                
                // Create notification for training period
                const notification = {
                    id: Date.now().toString(),
                    driverId: driver.id,
                    driverName: driver.name,
                    type: 'training_complete',
                    message: `${driver.name} will complete training period on ${calculateTrainingEndDate(driver.joinDate)}`,
                    targetDate: calculateTrainingEndDate(driver.joinDate),
                    read: false,
                    createdAt: new Date().toISOString()
                };
                notifications.push(notification);
                localStorage.setItem('notifications', JSON.stringify(notifications));
            }
            
            localStorage.setItem('drivers', JSON.stringify(drivers));
            
            closeDriverModal();
            renderDrivers();
            renderDashboard();
            updateNotificationBadge();
            
            alert('✅ Driver saved successfully!');
        }

        function deleteDriver(id) {
            if (!confirm('Are you sure you want to delete this driver?')) return;
            
            drivers = drivers.filter(d => d.id !== id);
            localStorage.setItem('drivers', JSON.stringify(drivers));
            
            // Remove related notifications
            notifications = notifications.filter(n => n.driverId !== id);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            renderDrivers();
            renderDashboard();
            updateNotificationBadge();
        }

        function renderDrivers() {
            const tbody = document.getElementById('drivers-tbody');
            
            if (drivers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">No drivers found</td></tr>';
                return;
            }
            
            tbody.innerHTML = drivers.map(driver => {
                const totalAdvances = advances
                    .filter(a => a.driverId === driver.id && a.status !== 'paid')
                    .reduce((sum, a) => sum + a.remaining, 0);
                
                let statusBadge = '';
                if (!driver.salaryActivated) {
                    statusBadge = '<span class="badge badge-training">🎓 Training</span>';
                } else {
                    statusBadge = '<span class="badge badge-active">✅ Active</span>';
                }
                
                const driverStopsCount = stops.filter(s => s.driverId === driver.id).length;
                const completedStopsCount = stops.filter(s => s.driverId === driver.id && s.status === 'completed').length;
                const progressPercent = driverStopsCount > 0 ? (completedStopsCount / driverStopsCount * 100).toFixed(0) : 0;
                
                return `
                    <tr>
                        <td class="font-semibold">${driver.name}</td>
                        <td>${driver.phone}</td>
                        <td>${driver.email}</td>
                        <td>${driver.joinDate}</td>
                        <td>${statusBadge}</td>
                        <td class="font-bold ${totalAdvances > 0 ? 'text-red-600' : 'text-green-600'}">
                            £${totalAdvances.toFixed(2)}
                        </td>
                        <td>
                            <div class="text-xs">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-semibold">${completedStopsCount}/${driverStopsCount} stops</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${progressPercent}%"></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="openDriverModal('${driver.id}')">✏️</button>
                            <button class="btn btn-warning btn-sm" onclick="openAdvanceModalForDriver('${driver.id}')">💸</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteDriver('${driver.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
            
            populateDriverDropdowns();
        }

        function searchDrivers() {
            const searchTerm = document.getElementById('driver-search').value.toLowerCase();
            const filteredDrivers = drivers.filter(d => 
                d.name.toLowerCase().includes(searchTerm) ||
                d.phone.toLowerCase().includes(searchTerm) ||
                d.email.toLowerCase().includes(searchTerm)
            );
            
            const tbody = document.getElementById('drivers-tbody');
            tbody.innerHTML = filteredDrivers.map(driver => {
                const totalAdvances = advances
                    .filter(a => a.driverId === driver.id && a.status !== 'paid')
                    .reduce((sum, a) => sum + a.remaining, 0);
                
                let statusBadge = '';
                if (!driver.salaryActivated) {
                    statusBadge = '<span class="badge badge-training">🎓 Training</span>';
                } else {
                    statusBadge = '<span class="badge badge-active">✅ Active</span>';
                }
                
                const driverStopsCount = stops.filter(s => s.driverId === driver.id).length;
                const completedStopsCount = stops.filter(s => s.driverId === driver.id && s.status === 'completed').length;
                const progressPercent = driverStopsCount > 0 ? (completedStopsCount / driverStopsCount * 100).toFixed(0) : 0;
                
                return `
                    <tr>
                        <td class="font-semibold">${driver.name}</td>
                        <td>${driver.phone}</td>
                        <td>${driver.email}</td>
                        <td>${driver.joinDate}</td>
                        <td>${statusBadge}</td>
                        <td class="font-bold ${totalAdvances > 0 ? 'text-red-600' : 'text-green-600'}">
                            £${totalAdvances.toFixed(2)}
                        </td>
                        <td>
                            <div class="text-xs">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-semibold">${completedStopsCount}/${driverStopsCount} stops</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${progressPercent}%"></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="openDriverModal('${driver.id}')">✏️</button>
                            <button class="btn btn-warning btn-sm" onclick="openAdvanceModalForDriver('${driver.id}')">💸</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteDriver('${driver.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function populateDriverDropdowns() {
            const selects = document.querySelectorAll('#stop-driver, #advance-driver');
            const html = '<option value="">-- Select Driver --</option>' + 
                drivers.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
            
            selects.forEach(select => select.innerHTML = html);
        }

        // Company Management
        function openCompanyModal(id = null) {
            const modal = document.getElementById('company-modal');
            const title = document.getElementById('company-modal-title');
            const form = document.getElementById('company-form');
            
            form.reset();
            
            if (id) {
                const company = companies.find(c => c.id === id);
                title.textContent = '✏️ Edit Company';
                document.getElementById('company-id').value = company.id;
                document.getElementById('company-name').value = company.name;
                document.getElementById('company-contact').value = company.contact;
                document.getElementById('company-phone').value = company.phone;
                document.getElementById('company-email').value = company.email;
                document.getElementById('company-status').value = company.status;
                document.getElementById('company-notes').value = company.notes || '';
            } else {
                title.textContent = '🏢 Add New Company';
                document.getElementById('company-id').value = '';
            }
            
            modal.classList.add('active');
        }

        function closeCompanyModal() {
            document.getElementById('company-modal').classList.remove('active');
        }

        function saveCompany(event) {
            event.preventDefault();
            
            const id = document.getElementById('company-id').value;
            const company = {
                id: id || Date.now().toString(),
                name: document.getElementById('company-name').value,
                contact: document.getElementById('company-contact').value,
                phone: document.getElementById('company-phone').value,
                email: document.getElementById('company-email').value,
                status: document.getElementById('company-status').value,
                notes: document.getElementById('company-notes').value,
                createdAt: id ? companies.find(c => c.id === id).createdAt : new Date().toISOString()
            };
            
            if (id) {
                const index = companies.findIndex(c => c.id === id);
                companies[index] = company;
            } else {
                companies.push(company);
            }
            
            localStorage.setItem('companies', JSON.stringify(companies));
            
            closeCompanyModal();
            renderCompanies();
            renderDashboard();
            
            alert('✅ Company saved successfully!');
        }

        function deleteCompany(id) {
            if (!confirm('Are you sure you want to delete this company?')) return;
            
            companies = companies.filter(c => c.id !== id);
            localStorage.setItem('companies', JSON.stringify(companies));
            
            renderCompanies();
            renderDashboard();
        }

        function renderCompanies() {
            const tbody = document.getElementById('companies-tbody');
            
            if (companies.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500">No companies found</td></tr>';
                return;
            }
            
            tbody.innerHTML = companies.map(company => `
                <tr>
                    <td class="font-semibold">${company.name}</td>
                    <td>${company.contact}</td>
                    <td>${company.phone}</td>
                    <td>${company.email}</td>
                    <td>
                        ${company.status === 'active' ? 
                            '<span class="badge badge-active">✅ Active</span>' : 
                            '<span class="badge badge-inactive">⏸️ Inactive</span>'}
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="openCompanyModal('${company.id}')">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCompany('${company.id}')">🗑️</button>
                    </td>
                </tr>
            `).join('');
            
            populateCompanyDropdowns();
        }

        function searchCompanies() {
            const searchTerm = document.getElementById('company-search').value.toLowerCase();
            const filteredCompanies = companies.filter(c => 
                c.name.toLowerCase().includes(searchTerm) ||
                c.contact.toLowerCase().includes(searchTerm) ||
                c.email.toLowerCase().includes(searchTerm)
            );
            
            const tbody = document.getElementById('companies-tbody');
            tbody.innerHTML = filteredCompanies.map(company => `
                <tr>
                    <td class="font-semibold">${company.name}</td>
                    <td>${company.contact}</td>
                    <td>${company.phone}</td>
                    <td>${company.email}</td>
                    <td>
                        ${company.status === 'active' ? 
                            '<span class="badge badge-active">✅ Active</span>' : 
                            '<span class="badge badge-inactive">⏸️ Inactive</span>'}
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="openCompanyModal('${company.id}')">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCompany('${company.id}')">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }

        function populateCompanyDropdowns() {
            const select = document.querySelectorAll('#stop-company');
            const html = '<option value="">-- Select Company --</option>' + 
                companies.filter(c => c.status === 'active').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            
            select.forEach(sel => sel.innerHTML = html);
        }

        // Order Management
        function openStopModal('single',id = null) {
            const modal = document.getElementById('stop-modal');
            const title = document.getElementById('stop-modal-title');
            const form = document.getElementById('stop-form');
            
            form.reset();
            populateCompanyDropdowns();
            populateDriverDropdowns();
            
            if (id) {
                const order = stops.find(o => o.id === id);
                title.textContent = '✏️ Edit Order';
                document.getElementById('stop-id').value = order.id;
                document.getElementById('stop-company').value = order.companyId;
                document.getElementById('stop-driver').value = order.driverId;
                document.getElementById('stop-date').value = order.date;
                document.getElementById('stop-postcode').value = order.postcode || '';
                document.getElementById('stop-customer').value = order.customer || '';
                document.getElementById('stop-customer-phone').value = order.customerPhone || '';
                document.getElementById('stop-revenue').value = order.revenue;
                document.getElementById('stop-status').value = order.status;
                document.getElementById('stop-notes').value = order.notes || '';
            } else {
                title.textContent = '📦 Add New Order';
                document.getElementById('stop-id').value = '';
                document.getElementById('stop-date').value = new Date().toISOString().split('T')[0];
            }
            
            modal.classList.add('active');
        }

        function closeOrderModal() {
            document.getElementById('stop-modal').classList.remove('active');
        }

        function saveStop(event) {
            event.preventDefault();
            
            const id = document.getElementById('stop-id').value;
            const order = {
                id: id || Date.now().toString(),
                companyId: document.getElementById('stop-company').value,
                driverId: document.getElementById('stop-driver').value,
                date: document.getElementById('stop-date').value,
                postcode: document.getElementById('stop-postcode').value,
                customer: document.getElementById('stop-customer').value,
                customerPhone: document.getElementById('stop-customer-phone').value,
                revenue: parseFloat(document.getElementById('stop-revenue').value),
                status: document.getElementById('stop-status').value,
                notes: document.getElementById('stop-notes').value,
                createdAt: id ? stops.find(o => o.id === id).createdAt : new Date().toISOString()
            };
            
            if (id) {
                const index = stops.findIndex(o => o.id === id);
                stops[index] = order;
            } else {
                stops.push(order);
            }
            
            localStorage.setItem('stops', JSON.stringify(stops));
            
            closeOrderModal();
            renderStops();
            renderDashboard();
            
            alert('✅ Order saved successfully!');
        }

        function deleteStop(id) {
            if (!confirm('Are you sure you want to delete this order?')) return;
            
            stops = stops.filter(o => o.id !== id);
            localStorage.setItem('stops', JSON.stringify(stops));
            
            renderStops();
            renderDashboard();
        }

        function renderStops() {
            const tbody = document.getElementById('stops-tbody');
            
            if (stops.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">No stops found</td></tr>';
                return;
            }
            
            tbody.innerHTML = stops.map(order => {
                const company = companies.find(c => c.id === order.companyId);
                const driver = drivers.find(d => d.id === order.driverId);
                
                let statusBadge = '';
                if (order.status === 'completed') {
                    statusBadge = '<span class="badge badge-completed">✅ Completed</span>';
                } else if (order.status === 'in_progress') {
                    statusBadge = '<span class="badge badge-pending">🔄 In Progress</span>';
                } else {
                    statusBadge = '<span class="badge badge-pending">⏳ Pending</span>';
                }
                
                return `
                    <tr>
                        <td class="font-mono">#${order.id.slice(-6)}</td>
                        <td>${order.date}</td>
                        <td>${company ? company.name : 'N/A'}</td>
                        <td>${driver ? driver.name : 'N/A'}</td>
                        <td class="font-bold text-green-600">£${order.revenue.toFixed(2)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="openStopModal('single','${order.id}')">✏️</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteStop('${order.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function searchStops() {
            const searchTerm = document.getElementById('stop-search').value.toLowerCase();
            const filteredOrders = stops.filter(o => {
                const company = companies.find(c => c.id === o.companyId);
                const driver = drivers.find(d => d.id === o.driverId);
                return (
                    o.id.toLowerCase().includes(searchTerm) ||
                    (company && company.name.toLowerCase().includes(searchTerm)) ||
                    (driver && driver.name.toLowerCase().includes(searchTerm)) ||
                    o.postcode.toLowerCase().includes(searchTerm)
                );
            });
            
            const tbody = document.getElementById('stops-tbody');
            tbody.innerHTML = filteredOrders.map(order => {
                const company = companies.find(c => c.id === order.companyId);
                const driver = drivers.find(d => d.id === order.driverId);
                
                let statusBadge = '';
                if (order.status === 'completed') {
                    statusBadge = '<span class="badge badge-completed">✅ Completed</span>';
                } else if (order.status === 'in_progress') {
                    statusBadge = '<span class="badge badge-pending">🔄 In Progress</span>';
                } else {
                    statusBadge = '<span class="badge badge-pending">⏳ Pending</span>';
                }
                
                return `
                    <tr>
                        <td class="font-mono">#${order.id.slice(-6)}</td>
                        <td>${order.date}</td>
                        <td>${company ? company.name : 'N/A'}</td>
                        <td>${driver ? driver.name : 'N/A'}</td>
                        <td class="font-bold text-green-600">£${order.revenue.toFixed(2)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="openStopModal('single','${order.id}')">✏️</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteStop('${order.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Advance Management
        function openAdvanceModal(id = null) {
            const modal = document.getElementById('advance-modal');
            const title = document.getElementById('advance-modal-title');
            const form = document.getElementById('advance-form');
            
            form.reset();
            populateDriverDropdowns();
            
            if (id) {
                const advance = advances.find(a => a.id === id);
                title.textContent = '✏️ Edit Advance';
                document.getElementById('advance-id').value = advance.id;
                document.getElementById('advance-driver').value = advance.driverId;
                document.getElementById('advance-date').value = advance.date;
                document.getElementById('advance-amount').value = advance.amount;
                document.getElementById('advance-deduction-type').value = advance.deductionType;
                document.getElementById('advance-partial-amount').value = advance.partialAmount || '';
                document.getElementById('advance-notes').value = advance.notes || '';
                
                if (advance.deductionType === 'partial') {
                    document.getElementById('partial-deduction-section').style.display = 'block';
                }
            } else {
                title.textContent = '💸 Add Advance';
                document.getElementById('advance-id').value = '';
                document.getElementById('advance-date').value = new Date().toISOString().split('T')[0];
            }
            
            modal.classList.add('active');
        }

        function openAdvanceModalForDriver(driverId) {
            const driver = drivers.find(d => d.id === driverId);
            if (!driver) return;
            
            if (!confirm(`Add advance for ${driver.name}?`)) return;
            
            const modal = document.getElementById('advance-modal');
            const title = document.getElementById('advance-modal-title');
            const form = document.getElementById('advance-form');
            
            form.reset();
            populateDriverDropdowns();
            
            title.textContent = `💸 Add Advance for ${driver.name}`;
            document.getElementById('advance-id').value = '';
            document.getElementById('advance-driver').value = driverId;
            document.getElementById('advance-date').value = new Date().toISOString().split('T')[0];
            
            modal.classList.add('active');
        }

        function closeAdvanceModal() {
            document.getElementById('advance-modal').classList.remove('active');
        }

        function saveAdvance(event) {
            event.preventDefault();
            
            const id = document.getElementById('advance-id').value;
            const amount = parseFloat(document.getElementById('advance-amount').value);
            const deductionType = document.getElementById('advance-deduction-type').value;
            
            const advance = {
                id: id || Date.now().toString(),
                driverId: document.getElementById('advance-driver').value,
                date: document.getElementById('advance-date').value,
                amount: amount,
                remaining: id ? advances.find(a => a.id === id).remaining : amount,
                deductionType: deductionType,
                partialAmount: deductionType === 'partial' ? parseFloat(document.getElementById('advance-partial-amount').value) : null,
                notes: document.getElementById('advance-notes').value,
                status: 'active',
                createdAt: id ? advances.find(a => a.id === id).createdAt : new Date().toISOString()
            };
            
            if (id) {
                const index = advances.findIndex(a => a.id === id);
                advances[index] = { ...advances[index], ...advance };
            } else {
                advances.push(advance);
            }
            
            localStorage.setItem('advances', JSON.stringify(advances));
            
            closeAdvanceModal();
            renderAdvances();
            renderDrivers();
            
            alert('✅ Advance saved successfully!');
        }

        function deleteAdvance(id) {
            if (!confirm('Are you sure you want to delete this advance?')) return;
            
            advances = advances.filter(a => a.id !== id);
            localStorage.setItem('advances', JSON.stringify(advances));
            
            renderAdvances();
            renderDrivers();
        }

        function renderAdvances() {
            const tbody = document.getElementById('advances-tbody');
            
            if (advances.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500">No advances found</td></tr>';
                return;
            }
            
            tbody.innerHTML = advances.map(advance => {
                const driver = drivers.find(d => d.id === advance.driverId);
                
                let statusBadge = '';
                if (advance.status === 'paid') {
                    statusBadge = '<span class="badge badge-completed">✅ Paid</span>';
                } else {
                    statusBadge = '<span class="badge badge-pending">⏳ Active</span>';
                }
                
                return `
                    <tr>
                        <td class="font-semibold">${driver ? driver.name : 'N/A'}</td>
                        <td>${advance.date}</td>
                        <td class="font-bold text-blue-600">£${advance.amount.toFixed(2)}</td>
                        <td class="font-bold ${advance.remaining > 0 ? 'text-red-600' : 'text-green-600'}">
                            £${advance.remaining.toFixed(2)}
                        </td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="openAdvanceModal('${advance.id}')">✏️</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAdvance('${advance.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Salary Calculations
        function calculateAllSalaries() {
            const startDate = document.getElementById('salary-start-date').value;
            const endDate = document.getElementById('salary-end-date').value;
            
            if (!startDate || !endDate) {
                alert('⚠️ Please select start and end dates');
                return;
            }
            
            renderSalaries(startDate, endDate);
            alert('✅ Salaries calculated successfully!');
        }

        function filterSalaries() {
            const startDate = document.getElementById('salary-start-date').value;
            const endDate = document.getElementById('salary-end-date').value;
            
            if (!startDate || !endDate) {
                alert('⚠️ Please select start and end dates');
                return;
            }
            
            renderSalaries(startDate, endDate);
        }

        function renderSalaries(startDate = null, endDate = null) {
            const tbody = document.getElementById('salaries-tbody');
            
            if (!startDate || !endDate) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">Select dates and click Calculate</td></tr>';
                return;
            }
            
            const salaryData = drivers.map(driver => {
                // Filter stops for this driver within date range
                const driverOrders = stops.filter(o => 
                    o.driverId === driver.id &&
                    o.status === 'completed' &&
                    o.date >= startDate &&
                    o.date <= endDate
                );
                
                const orderCount = driverOrders.length;
                
                // Check if driver is still in training period
                const daysSinceJoin = Math.floor((new Date(endDate) - new Date(driver.joinDate)) / (1000 * 60 * 60 * 24));
                const inTraining = !driver.salaryActivated || daysSinceJoin < settings.trainingDays;
                
                // Calculate base salary
                let baseSalary = 0;
                let bonus = 0;
                
                if (!inTraining) {
                    if (orderCount >= settings.targetOrders) {
                        baseSalary = settings.baseSalary;
                        const extraOrders = orderCount - settings.targetOrders;
                        bonus = extraOrders * settings.bonusPerOrder;
                    }
                }
                
                // Calculate advance deductions
                let totalDeduction = 0;
                const driverAdvances = advances.filter(a => 
                    a.driverId === driver.id &&
                    a.status === 'active' &&
                    a.remaining > 0
                );
                
                driverAdvances.forEach(advance => {
                    if (advance.deductionType === 'full') {
                        const deduction = Math.min(advance.remaining, baseSalary + bonus);
                        totalDeduction += deduction;
                        advance.remaining -= deduction;
                        if (advance.remaining <= 0) {
                            advance.status = 'paid';
                            advance.remaining = 0;
                        }
                    } else if (advance.deductionType === 'partial' && advance.partialAmount) {
                        const deduction = Math.min(advance.partialAmount, advance.remaining, baseSalary + bonus);
                        totalDeduction += deduction;
                        advance.remaining -= deduction;
                        if (advance.remaining <= 0) {
                            advance.status = 'paid';
                            advance.remaining = 0;
                        }
                    }
                });
                
                // Save updated advances
                localStorage.setItem('advances', JSON.stringify(advances));
                
                const netSalary = baseSalary + bonus - totalDeduction;
                
                return {
                    driverId: driver.id,
                    driverName: driver.name,
                    stops: orderCount,
                    baseSalary,
                    bonus,
                    advances: totalDeduction,
                    netSalary,
                    inTraining,
                    period: `${startDate} to ${endDate}`
                };
            });
            
            tbody.innerHTML = salaryData.map(data => `
                <tr>
                    <td class="font-semibold">${data.driverName}</td>
                    <td class="text-sm">${data.period}</td>
                    <td class="font-bold">${data.stops}</td>
                    <td class="text-blue-600">£${data.baseSalary.toFixed(2)}</td>
                    <td class="text-green-600">£${data.bonus.toFixed(2)}</td>
                    <td class="text-red-600">-£${data.advances.toFixed(2)}</td>
                    <td class="font-bold text-purple-600">£${data.netSalary.toFixed(2)}</td>
                    <td>
                        ${data.inTraining ? 
                            '<span class="badge badge-training">🎓 Training</span>' : 
                            '<span class="badge badge-active">✅ Active</span>'}
                    </td>
                </tr>
            `).join('');
        }

        // Training Period Management
        function calculateTrainingEndDate(joinDate) {
            const date = new Date(joinDate);
            date.setDate(date.getDate() + settings.trainingDays);
            return date.toISOString().split('T')[0];
        }

        function checkTrainingPeriods() {
            const today = new Date().toISOString().split('T')[0];
            
            drivers.forEach(driver => {
                if (!driver.salaryActivated) {
                    const endDate = calculateTrainingEndDate(driver.joinDate);
                    
                    if (today >= endDate) {
                        // Check if notification already exists
                        const existingNotif = notifications.find(n => 
                            n.driverId === driver.id &&
                            n.type === 'training_complete' &&
                            !n.read
                        );
                        
                        if (!existingNotif) {
                            const notification = {
                                id: Date.now().toString() + Math.random(),
                                driverId: driver.id,
                                driverName: driver.name,
                                type: 'training_complete',
                                message: `${driver.name} has completed the training period! Please activate salary.`,
                                targetDate: endDate,
                                read: false,
                                actionRequired: true,
                                createdAt: new Date().toISOString()
                            };
                            notifications.push(notification);
                        }
                    }
                }
            });
            
            localStorage.setItem('notifications', JSON.stringify(notifications));
            updateNotificationBadge();
        }

        function updateNotificationBadge() {
            const unreadCount = notifications.filter(n => !n.read && n.actionRequired).length;
            const badge = document.getElementById('notification-count');
            
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        function renderNotifications() {
            const container = document.getElementById('notifications-list');
            
            if (notifications.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">No notifications</p>';
                return;
            }
            
            // Sort notifications by actionRequired and date
            const sortedNotifications = [...notifications].sort((a, b) => {
                if (a.actionRequired && !b.actionRequired) return -1;
                if (!a.actionRequired && b.actionRequired) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            container.innerHTML = sortedNotifications.map(notif => `
                <div class="notification-item ${notif.read ? '' : 'notification-unread'}">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${notif.actionRequired ? '🔔' : '📌'}</span>
                            <div>
                                <p class="font-bold text-gray-800">${notif.driverName}</p>
                                <p class="text-sm text-gray-600">${notif.message}</p>
                            </div>
                        </div>
                        ${notif.actionRequired ? 
                            `<button class="btn btn-success btn-sm" onclick="showTrainingNotification('${notif.driverId}', '${notif.id}')">
                                ✅ Activate
                            </button>` : 
                            ''}
                    </div>
                    <p class="text-xs text-gray-500">Created: ${new Date(notif.createdAt).toLocaleString()}</p>
                </div>
            `).join('');
        }

        function showTrainingNotification(driverId, notificationId) {
            const driver = drivers.find(d => d.id === driverId);
            if (!driver) return;
            
            currentNotificationDriverId = driverId;
            
            const modal = document.getElementById('training-notification-modal');
            const content = modal.querySelector('#notification-content p');
            
            content.textContent = `${driver.name} has completed the ${settings.trainingDays}-day training period. 
                Would you like to activate salary calculations for this driver?`;
            
            modal.classList.add('active');
        }

        function closeTrainingNotificationModal() {
            document.getElementById('training-notification-modal').classList.remove('active');
        }

        function confirmSalaryActivation() {
            if (!currentNotificationDriverId) return;
            
            const driver = drivers.find(d => d.id === currentNotificationDriverId);
            if (driver) {
                driver.salaryActivated = true;
                driver.status = 'active';
                localStorage.setItem('drivers', JSON.stringify(drivers));
                
                // Mark notification as read
                notifications = notifications.map(n => {
                    if (n.driverId === currentNotificationDriverId && n.actionRequired) {
                        return { ...n, read: true, actionRequired: false };
                    }
                    return n;
                });
                localStorage.setItem('notifications', JSON.stringify(notifications));
                
                renderDrivers();
                renderNotifications();
                updateNotificationBadge();
                
                alert(`✅ Salary activated for ${driver.name}!`);
            }
            
            closeTrainingNotificationModal();
            currentNotificationDriverId = null;
        }

        // Reports & Analytics
        function generateReport() {
            const reportType = document.getElementById('report-type').value;
            const reportDate = document.getElementById('report-date').value;
            
            if (!reportDate) {
                alert('⚠️ Please select a date');
                return;
            }
            
            let startDate, endDate;
            
            if (reportType === 'daily') {
                startDate = endDate = reportDate;
            } else if (reportType === 'weekly') {
                const date = new Date(reportDate);
                date.setDate(date.getDate() - date.getDay()); // Start of week
                startDate = date.toISOString().split('T')[0];
                date.setDate(date.getDate() + 6);
                endDate = date.toISOString().split('T')[0];
            } else if (reportType === 'monthly') {
                const date = new Date(reportDate);
                startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
                endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
            }
            
            const filteredOrders = stops.filter(o => 
                o.status === 'completed' &&
                o.date >= startDate &&
                o.date <= endDate
            );
            
            const totalOrders = filteredOrders.length;
            const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.revenue, 0);
            const totalCosts = totalOrders * settings.driverCostPerOrder;
            const netProfit = totalRevenue - totalCosts;
            
            document.getElementById('report-stops').textContent = totalOrders;
            document.getElementById('report-revenue').textContent = `£${totalRevenue.toFixed(2)}`;
            document.getElementById('report-costs').textContent = `£${totalCosts.toFixed(2)}`;
            document.getElementById('report-profit').textContent = `£${netProfit.toFixed(2)}`;
            
            // Generate detailed breakdown by driver
            const driverBreakdown = {};
            
            filteredOrders.forEach(order => {
                const driver = drivers.find(d => d.id === order.driverId);
                const driverName = driver ? driver.name : 'Unknown';
                
                if (!driverBreakdown[order.driverId]) {
                    driverBreakdown[order.driverId] = {
                        name: driverName,
                        stops: 0,
                        revenue: 0,
                        costs: 0,
                        profit: 0
                    };
                }
                
                driverBreakdown[order.driverId].stops++;
                driverBreakdown[order.driverId].revenue += order.revenue;
                driverBreakdown[order.driverId].costs += settings.driverCostPerOrder;
                driverBreakdown[order.driverId].profit = driverBreakdown[order.driverId].revenue - driverBreakdown[order.driverId].costs;
            });
            
            const tbody = document.getElementById('report-tbody');
            const breakdown = Object.values(driverBreakdown);
            
            if (breakdown.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500">No data for selected period</td></tr>';
                return;
            }
            
            tbody.innerHTML = breakdown.map(data => `
                <tr>
                    <td>${startDate}${startDate !== endDate ? ' - ' + endDate : ''}</td>
                    <td class="font-semibold">${data.name}</td>
                    <td class="font-bold">${data.stops}</td>
                    <td class="text-green-600">£${data.revenue.toFixed(2)}</td>
                    <td class="text-red-600">£${data.costs.toFixed(2)}</td>
                    <td class="font-bold text-purple-600">£${data.profit.toFixed(2)}</td>
                </tr>
            `).join('');
        }

        function exportReport() {
            const reportDate = document.getElementById('report-date').value;
            
            if (!reportDate) {
                alert('⚠️ Please generate a report first');
                return;
            }
            
            const stops = document.getElementById('report-stops').textContent;
            const revenue = document.getElementById('report-revenue').textContent;
            const costs = document.getElementById('report-costs').textContent;
            const profit = document.getElementById('report-profit').textContent;
            
            const reportContent = `
DRIVER MANAGEMENT SYSTEM - DAILY PROFIT REPORT
================================================

Report Date: ${reportDate}
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Completed Orders: ${stops}
Total Revenue: ${revenue}
Driver Costs: ${costs}
Net Profit: ${profit}

DETAILED BREAKDOWN
------------------
${document.getElementById('report-tbody').innerText}

================================================
            `;
            
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `profit-report-${reportDate}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('✅ Report exported successfully!');
        }

        // Request Management
        function openSOPModal() {
            document.getElementById('sop-modal').classList.add('active');
        }

        function closeSOPModal() {
            document.getElementById('sop-modal').classList.remove('active');
        }

        function saveSOP(event) {
            event.preventDefault();
            
            const type = document.getElementById('sop-type').value;
            const description = document.getElementById('sop-description').value;
            
            if (!type || !description) {
                alert('⚠️ Please fill all fields');
                return;
            }
            
            const notification = {
                id: Date.now().toString(),
                type: 'request',
                requestType: type,
                message: `New ${type} request: ${description}`,
                description: description,
                read: false,
                actionRequired: false,
                createdAt: new Date().toISOString()
            };
            
            notifications.push(notification);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            closeSOPModal();
            updateNotificationBadge();
            
            alert('✅ Request submitted successfully!');
        }

        // Data Management
        function exportAllData() {
            const data = {
                drivers,
                companies,
                stops,
                advances,
                notifications,
                settings,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dms-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            localStorage.setItem('lastBackup', new Date().toISOString());
            document.getElementById('last-backup').textContent = new Date().toLocaleString();
            
            alert('✅ Data exported successfully!');
        }

        function importData() {
            const fileInput = document.getElementById('import-file');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('⚠️ Please select a file to import');
                return;
            }
            
            if (!confirm('⚠️ This will replace all current data. Continue?')) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.drivers || !data.companies || !data.stops) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Import data
                    drivers = data.drivers || [];
                    companies = data.companies || [];
                    stops = data.stops || [];
                    advances = data.advances || [];
                    notifications = data.notifications || [];
                    settings = data.settings || settings;
                    
                    // Save to localStorage
                    localStorage.setItem('drivers', JSON.stringify(drivers));
                    localStorage.setItem('companies', JSON.stringify(companies));
                    localStorage.setItem('stops', JSON.stringify(stops));
                    localStorage.setItem('advances', JSON.stringify(advances));
                    localStorage.setItem('notifications', JSON.stringify(notifications));
                    localStorage.setItem('settings', JSON.stringify(settings));
                    
                    // Refresh all views
                    initializeApp();
                    
                    alert('✅ Data imported successfully!');
                } catch (error) {
                    alert('❌ Error importing data: ' + error.message);
                }
            };
            reader.readAsText(file);
        }

        function clearAllData() {
            if (!confirm('⚠️ WARNING: This will delete ALL data permanently. Are you absolutely sure?')) {
                return;
            }
            
            if (!confirm('⚠️ FINAL WARNING: This action cannot be undone!')) {
                return;
            }
            
            localStorage.clear();
            location.reload();
        }

        // Dashboard Rendering
        function renderDashboard() {
            // Update statistics
            document.getElementById('stat-drivers').textContent = drivers.length;
            document.getElementById('stat-companies').textContent = companies.filter(c => c.status === 'active').length;
            document.getElementById('stat-stops').textContent = stops.length;
            
            // Calculate daily revenue (today only)
            const today = new Date().toISOString().split('T')[0];
            const todayStops = stops.filter(s => s.date === today && s.status === 'completed');
            const dailyRevenue = todayStops.reduce((sum, s) => sum + s.revenue, 0);
            document.getElementById('stat-daily-revenue').textContent = `£${dailyRevenue.toFixed(2)}`;
            
            // Recent Orders
            const recentOrders = stops
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
            
            const recentOrdersHtml = recentOrders.length > 0 ?
                recentOrders.map(order => {
                    const company = companies.find(c => c.id === order.companyId);
                    const driver = drivers.find(d => d.id === order.driverId);
                    return `
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                                <p class="font-semibold text-sm">${company ? company.name : 'N/A'}</p>
                                <p class="text-xs text-gray-600">${driver ? driver.name : 'N/A'} • ${order.date}</p>
                            </div>
                            <span class="font-bold text-green-600">£${order.revenue.toFixed(2)}</span>
                        </div>
                    `;
                }).join('') :
                '<p class="text-gray-500 text-sm">No recent stops</p>';
            
            document.getElementById('recent-orders').innerHTML = recentOrdersHtml;
            
            // Active Drivers
            const activeDrivers = drivers.filter(d => d.salaryActivated).slice(0, 5);
            
            const activeDriversHtml = activeDrivers.length > 0 ?
                activeDrivers.map(driver => {
                    const driverOrders = stops.filter(o => o.driverId === driver.id && o.status === 'completed').length;
                    return `
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                                <p class="font-semibold text-sm">${driver.name}</p>
                                <p class="text-xs text-gray-600">${driver.phone}</p>
                            </div>
                            <span class="badge badge-active">${driverOrders} stops</span>
                        </div>
                    `;
                }).join('') :
                '<p class="text-gray-500 text-sm">No active drivers</p>';
            
            document.getElementById('active-drivers').innerHTML = activeDriversHtml;
            
            updateSystemInfo();
        }
    

        // ========== NEW STOPS & ARCHIVE FUNCTIONS ==========
// Stops Management Functions

function openStopModal(type = 'single', id = null) {
    const modal = document.getElementById('stop-modal');
    const title = document.getElementById('stop-modal-title');
    const form = document.getElementById('stop-form');
    const manyContainer = document.getElementById('many-stops-container');
    const singleForm = document.getElementById('single-stop-form');
    
    form.reset();
    uploadedStopImage = null;
    document.getElementById('stop-image-preview').innerHTML = '';
    document.getElementById('image-upload-section').style.display = 'none';
    
    document.getElementById('stop-type').value = type;
    
    if (type === 'many') {
        title.textContent = '🛑 Add Many Stops';
        manyContainer.style.display = 'block';
        singleForm.style.display = 'none';
        manyStopsEntries = [];
        addStopEntry(); // Add first entry
    } else {
        title.textContent = id ? '✏️ Edit Stop' : '🛑 Add New Stop';
        manyContainer.style.display = 'none';
        singleForm.style.display = 'block';
        
        if (id) {
            const stop = stops.find(s => s.id === id);
            document.getElementById('stop-id').value = stop.id;
            document.getElementById('stop-company').value = stop.companyId;
            document.getElementById('stop-driver').value = stop.driverId;
            document.getElementById('stop-date').value = stop.date;
            document.getElementById('stop-postcode').value = stop.postcode || '';
            document.getElementById('stop-customer').value = stop.customer || '';
            document.getElementById('stop-customer-phone').value = stop.customerPhone || '';
            document.getElementById('stop-revenue').value = stop.revenue;
            document.getElementById('stop-status').value = stop.status;
            document.getElementById('stop-notes').value = stop.notes || '';
            
            if (stop.status === 'completed') {
                document.getElementById('image-upload-section').style.display = 'block';
                if (stop.image) {
                    uploadedStopImage = stop.image;
                    document.getElementById('stop-image-preview').innerHTML = `
                        <div class="image-preview">
                            <img src="${stop.image}" alt="Stop Image">
                        </div>
                    `;
                }
            }
        } else {
            document.getElementById('stop-id').value = '';
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('stop-date').value = today;
        }
    }
    
    populateCompanyDropdowns();
    populateDriverDropdowns();
    modal.classList.add('active');
}

function closeStopModal() {
    document.getElementById('stop-modal').classList.remove('active');
    uploadedStopImage = null;
    manyStopsEntries = [];
}

function handleStatusChange() {
    const status = document.getElementById('stop-status').value;
    const imageSection = document.getElementById('image-upload-section');
    const imageWarning = document.getElementById('image-warning');
    
    if (status === 'completed') {
        imageSection.style.display = 'block';
        imageWarning.style.display = 'block';
    } else {
        imageSection.style.display = 'none';
        imageWarning.style.display = 'none';
    }
}

function previewStopImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedStopImage = e.target.result;
            document.getElementById('stop-image-preview').innerHTML = `
                <div class="image-preview">
                    <img src="${e.target.result}" alt="Stop Image">
                    <div class="image-preview-remove" onclick="removeStopImage()">×</div>
                </div>
            `;
            document.getElementById('image-warning').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function removeStopImage() {
    uploadedStopImage = null;
    document.getElementById('stop-image-preview').innerHTML = '';
    document.getElementById('stop-image').value = '';
    if (document.getElementById('stop-status').value === 'completed') {
        document.getElementById('image-warning').style.display = 'block';
    }
}

function addStopEntry() {
    const entryId = Date.now() + Math.random();
    const entryHtml = `
        <div class="stop-entry card mb-3 p-4" data-entry-id="${entryId}">
            <div class="flex justify-between items-center mb-3">
                <h4 class="font-bold text-gray-700">Stop #${manyStopsEntries.length + 1}</h4>
                ${manyStopsEntries.length > 0 ? `<button type="button" class="btn btn-danger btn-sm" onclick="removeStopEntry('${entryId}')">🗑️</button>` : ''}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold mb-1 text-gray-600">Postcode *</label>
                    <input type="text" class="input entry-postcode" placeholder="SW1A 1AA" required>
                </div>
                <div>
                    <label class="block text-xs font-bold mb-1 text-gray-600">Customer Name</label>
                    <input type="text" class="input entry-customer" placeholder="John Smith">
                </div>
                <div>
                    <label class="block text-xs font-bold mb-1 text-gray-600">Customer Phone</label>
                    <input type="tel" class="input entry-customer-phone" placeholder="+447700900001">
                </div>
                <div>
                    <label class="block text-xs font-bold mb-1 text-gray-600">Revenue (£) *</label>
                    <input type="number" class="input entry-revenue" min="0" step="0.01" placeholder="15.00" required>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('stops-list').insertAdjacentHTML('beforeend', entryHtml);
    manyStopsEntries.push(entryId);
}

function removeStopEntry(entryId) {
    const entry = document.querySelector(`[data-entry-id="${entryId}"]`);
    if (entry) {
        entry.remove();
        manyStopsEntries = manyStopsEntries.filter(id => id !== entryId);
        
        // Renumber remaining stops
        document.querySelectorAll('.stop-entry').forEach((el, index) => {
            el.querySelector('h4').textContent = `Stop #${index + 1}`;
        });
    }
}

function saveStop(event) {
    event.preventDefault();
    
    const type = document.getElementById('stop-type').value;
    const id = document.getElementById('stop-id').value;
    
    if (type === 'many') {
        saveManyStops();
    } else {
        saveSingleStop(id);
    }
}

function saveSingleStop(id) {
    const status = document.getElementById('stop-status').value;
    
    // Validate image for completed stops
    if (status === 'completed' && !uploadedStopImage && !id) {
        if (!confirm('⚠️ No image uploaded for completed stop. Continue without image?')) {
            return;
        }
    }
    
    const stop = {
        id: id || Date.now().toString(),
        companyId: document.getElementById('stop-company').value,
        driverId: document.getElementById('stop-driver').value,
        date: document.getElementById('stop-date').value,
        postcode: document.getElementById('stop-postcode').value,
        customer: document.getElementById('stop-customer').value,
        customerPhone: document.getElementById('stop-customer-phone').value,
        revenue: parseFloat(document.getElementById('stop-revenue').value),
        status: status,
        notes: document.getElementById('stop-notes').value,
        image: uploadedStopImage,
        hasImageWarning: status === 'completed' && !uploadedStopImage,
        createdAt: id ? stops.find(s => s.id === id).createdAt : new Date().toISOString()
    };
    
    if (id) {
        const index = stops.findIndex(s => s.id === id);
        stops[index] = stop;
    } else {
        stops.push(stop);
    }
    
    localStorage.setItem('stops', JSON.stringify(stops));
    
    closeStopModal();
    renderStops();
    renderDashboard();
    renderArchive();
    
    alert('✅ Stop saved successfully!');
}

function saveManyStops() {
    const company = document.getElementById('stop-company').value;
    const driver = document.getElementById('stop-driver').value;
    const date = document.getElementById('stop-date').value;
    
    if (!company || !driver) {
        alert('⚠️ Please select company and driver for all stops');
        return;
    }
    
    const entries = document.querySelectorAll('.stop-entry');
    let savedCount = 0;
    
    entries.forEach(entry => {
        const postcode = entry.querySelector('.entry-postcode').value;
        const customer = entry.querySelector('.entry-customer').value;
        const customerPhone = entry.querySelector('.entry-customer-phone').value;
        const revenue = parseFloat(entry.querySelector('.entry-revenue').value);
        
        if (postcode && revenue) {
            const stop = {
                id: Date.now().toString() + Math.random(),
                companyId: company,
                driverId: driver,
                date: date,
                postcode: postcode,
                customer: customer,
                customerPhone: customerPhone,
                revenue: revenue,
                status: 'pending',
                notes: '',
                image: null,
                hasImageWarning: false,
                createdAt: new Date().toISOString()
            };
            
            stops.push(stop);
            savedCount++;
        }
    });
    
    localStorage.setItem('stops', JSON.stringify(stops));
    
    closeStopModal();
    renderStops();
    renderDashboard();
    
    alert(`✅ ${savedCount} stops saved successfully!`);
}

function deleteStop(id) {
    if (!confirm('Are you sure you want to delete this stop?')) return;
    
    stops = stops.filter(s => s.id !== id);
    localStorage.setItem('stops', JSON.stringify(stops));
    
    renderStops();
    renderDashboard();
    renderArchive();
}

function renderStops() {
    const tbody = document.getElementById('stops-tbody');
    
    if (stops.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">No stops found</td></tr>';
        return;
    }
    
    tbody.innerHTML = stops.map(stop => {
        const company = companies.find(c => c.id === stop.companyId);
        const driver = drivers.find(d => d.id === stop.driverId);
        
        let statusBadge = '';
        if (stop.status === 'completed') {
            statusBadge = '<span class="badge badge-completed">✅ Completed</span>';
        } else if (stop.status === 'in_progress') {
            statusBadge = '<span class="badge badge-pending">🔄 In Progress</span>';
        } else {
            statusBadge = '<span class="badge badge-pending">⏳ Pending</span>';
        }
        
        let imageStatus = '';
        if (stop.status === 'completed') {
            if (stop.image) {
                imageStatus = '<span class="text-green-600 font-bold">✓</span>';
            } else {
                imageStatus = '<span class="text-red-600 font-bold" title="Missing image">⚠️</span>';
            }
        } else {
            imageStatus = '<span class="text-gray-400">—</span>';
        }
        
        return `
            <tr class="${stop.hasImageWarning ? 'bg-red-50' : ''}">
                <td class="font-mono">#${stop.id.slice(-6)}</td>
                <td>${stop.date}</td>
                <td>${company ? company.name : 'N/A'}</td>
                <td>${driver ? driver.name : 'N/A'}</td>
                <td class="font-bold text-green-600">£${stop.revenue.toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td class="text-center">${imageStatus}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openStopModal('single', '${stop.id}')">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStop('${stop.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function searchStops() {
    const searchTerm = document.getElementById('stop-search').value.toLowerCase();
    const filteredStops = stops.filter(s => {
        const company = companies.find(c => c.id === s.companyId);
        const driver = drivers.find(d => d.id === s.driverId);
        return (
            s.id.toLowerCase().includes(searchTerm) ||
            (company && company.name.toLowerCase().includes(searchTerm)) ||
            (driver && driver.name.toLowerCase().includes(searchTerm)) ||
            (s.postcode && s.postcode.toLowerCase().includes(searchTerm))
        );
    });
    
    const tbody = document.getElementById('stops-tbody');
    tbody.innerHTML = filteredStops.map(stop => {
        const company = companies.find(c => c.id === stop.companyId);
        const driver = drivers.find(d => d.id === stop.driverId);
        
        let statusBadge = '';
        if (stop.status === 'completed') {
            statusBadge = '<span class="badge badge-completed">✅ Completed</span>';
        } else if (stop.status === 'in_progress') {
            statusBadge = '<span class="badge badge-pending">🔄 In Progress</span>';
        } else {
            statusBadge = '<span class="badge badge-pending">⏳ Pending</span>';
        }
        
        let imageStatus = '';
        if (stop.status === 'completed') {
            if (stop.image) {
                imageStatus = '<span class="text-green-600 font-bold">✓</span>';
            } else {
                imageStatus = '<span class="text-red-600 font-bold" title="Missing image">⚠️</span>';
            }
        } else {
            imageStatus = '<span class="text-gray-400">—</span>';
        }
        
        return `
            <tr class="${stop.hasImageWarning ? 'bg-red-50' : ''}">
                <td class="font-mono">#${stop.id.slice(-6)}</td>
                <td>${stop.date}</td>
                <td>${company ? company.name : 'N/A'}</td>
                <td>${driver ? driver.name : 'N/A'}</td>
                <td class="font-bold text-green-600">£${stop.revenue.toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td class="text-center">${imageStatus}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openStopModal('single', '${stop.id}')">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStop('${stop.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Archive Page Functions
function renderArchive() {
    const grid = document.getElementById('archive-grid');
    const completedStops = stops.filter(s => s.status === 'completed' && s.image);
    
    if (completedStops.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 text-center col-span-full py-8">No archived stops with images</p>';
        return;
    }
    
    grid.innerHTML = completedStops.map(stop => {
        const company = companies.find(c => c.id === stop.companyId);
        const driver = drivers.find(d => d.id === stop.driverId);
        
        return `
            <div class="card">
                <div class="mb-3">
                    <img src="${stop.image}" alt="Stop ${stop.postcode}" class="w-full h-48 object-cover rounded-lg">
                </div>
                <div class="space-y-2 text-sm">
                    <p class="font-bold text-gray-800">📍 ${stop.postcode}</p>
                    <p class="text-gray-600"><strong>Company:</strong> ${company ? company.name : 'N/A'}</p>
                    <p class="text-gray-600"><strong>Driver:</strong> ${driver ? driver.name : 'N/A'}</p>
                    <p class="text-gray-600"><strong>Date:</strong> ${stop.date}</p>
                    <p class="text-gray-600"><strong>Customer:</strong> ${stop.customer || 'N/A'}</p>
                    <p class="text-green-600 font-bold"><strong>Revenue:</strong> £${stop.revenue.toFixed(2)}</p>
                    ${stop.notes ? `<p class="text-gray-600 text-xs italic">${stop.notes}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function searchArchive() {
    const searchTerm = document.getElementById('archive-search').value.toLowerCase();
    const completedStops = stops.filter(s => {
        if (s.status !== 'completed' || !s.image) return false;
        
        const company = companies.find(c => c.id === s.companyId);
        const driver = drivers.find(d => d.id === s.driverId);
        
        return (
            s.id.toLowerCase().includes(searchTerm) ||
            (company && company.name.toLowerCase().includes(searchTerm)) ||
            (driver && driver.name.toLowerCase().includes(searchTerm)) ||
            (s.postcode && s.postcode.toLowerCase().includes(searchTerm)) ||
            (s.customer && s.customer.toLowerCase().includes(searchTerm))
        );
    });
    
    const grid = document.getElementById('archive-grid');
    
    if (completedStops.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 text-center col-span-full py-8">No results found</p>';
        return;
    }
    
    grid.innerHTML = completedStops.map(stop => {
        const company = companies.find(c => c.id === stop.companyId);
        const driver = drivers.find(d => d.id === stop.driverId);
        
        return `
            <div class="card">
                <div class="mb-3">
                    <img src="${stop.image}" alt="Stop ${stop.postcode}" class="w-full h-48 object-cover rounded-lg">
                </div>
                <div class="space-y-2 text-sm">
                    <p class="font-bold text-gray-800">📍 ${stop.postcode}</p>
                    <p class="text-gray-600"><strong>Company:</strong> ${company ? company.name : 'N/A'}</p>
                    <p class="text-gray-600"><strong>Driver:</strong> ${driver ? driver.name : 'N/A'}</p>
                    <p class="text-gray-600"><strong>Date:</strong> ${stop.date}</p>
                    <p class="text-gray-600"><strong>Customer:</strong> ${stop.customer || 'N/A'}</p>
                    <p class="text-green-600 font-bold"><strong>Revenue:</strong> £${stop.revenue.toFixed(2)}</p>
                    ${stop.notes ? `<p class="text-gray-600 text-xs italic">${stop.notes}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// SOP Modal Functions
function openSOPModal() {
    document.getElementById('sop-modal').classList.add('active');
}

function closeSOPModal() {
    document.getElementById('sop-modal').classList.remove('active');
}

function saveSOP(event) {
    event.preventDefault();
    
    const type = document.getElementById('sop-type').value;
    const description = document.getElementById('sop-description').value;
    
    if (!type || !description) {
        alert('⚠️ Please fill all fields');
        return;
    }
    
    const notification = {
        id: Date.now().toString(),
        type: 'sop',
        sopType: type,
        message: `New ${type} SOP: ${description}`,
        description: description,
        read: false,
        actionRequired: false,
        createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    closeSOPModal();
    updateNotificationBadge();
    
    alert('✅ SOP submitted successfully!');
}



</script>
