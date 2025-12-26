// Script to check if buttons work in the actual page

// Check if openStopModal exists
console.log('=== Checking openStopModal ===');
console.log('Type:', typeof openStopModal);
console.log('Exists:', typeof openStopModal === 'function');

if (typeof openStopModal === 'function') {
    console.log('✅ openStopModal is defined');
    
    // Try calling it
    console.log('Testing openStopModal("single")...');
    try {
        openStopModal('single');
        console.log('✅ Function executed without errors');
    } catch (e) {
        console.error('❌ Error calling function:', e);
    }
} else {
    console.error('❌ openStopModal is NOT defined');
}

// Check if modal element exists
console.log('\n=== Checking modal elements ===');
const modal = document.getElementById('stop-modal');
console.log('stop-modal element:', modal ? '✅ Found' : '❌ Not found');

if (modal) {
    console.log('Modal HTML:', modal.tagName);
    console.log('Modal classes:', modal.className);
}

// Check buttons on Stops page
console.log('\n=== Checking buttons on Stops page ===');
const addStopBtn = document.querySelector('button[onclick*="openStopModal"]');
console.log('Add Stop button:', addStopBtn ? '✅ Found' : '❌ Not found');

if (addStopBtn) {
    console.log('Button text:', addStopBtn.textContent.trim());
    console.log('Button onclick:', addStopBtn.getAttribute('onclick'));
}
