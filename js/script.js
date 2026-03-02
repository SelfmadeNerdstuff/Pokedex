function toggleLoading(isLoading) {
    let btn = document.getElementById('load-more-btn');
    let spinner = document.getElementById('loading-spinner');
    btn.disabled = isLoading;
    if (isLoading) spinner.classList.remove('d-none');
    else spinner.classList.add('d-none');
    if (!isLoading && typeof currentOffset !== 'undefined' && currentOffset >= 151) {
        btn.style.display = 'none';
    }
}

function checkScroll() {
    let btn = document.getElementById('scroll-to-top');
    if (window.scrollY > 300) btn.classList.remove('d-none');
    else btn.classList.add('d-none');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', checkScroll);