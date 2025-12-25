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

