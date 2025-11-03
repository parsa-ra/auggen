window.HELP_IMPROVE_VIDEOJS = false;

function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();

    let succeeded = false;
    try {
        succeeded = document.execCommand('copy');
    } catch (err) {
        succeeded = false;
    }

    document.body.removeChild(textArea);
    return succeeded ? Promise.resolve() : Promise.reject();
}

function showCopyFeedback(button) {
    const labelSpan = button.querySelector('span:last-child');
    if (!labelSpan) {
        return;
    }

    const originalText = button.dataset.defaultLabel || labelSpan.textContent;
    labelSpan.textContent = 'Copied!';
    button.classList.add('is-success');

    setTimeout(() => {
        labelSpan.textContent = originalText;
        button.classList.remove('is-success');
    }, 2000);
}

$(document).ready(function() {
    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    bulmaCarousel.attach('.carousel', options);
    bulmaSlider.attach();

    const bibtexBlock = document.getElementById('bibtex-entry');
    if (!bibtexBlock) {
        return;
    }

    const bibtexText = bibtexBlock.innerText.trim();
    const copyButtons = document.querySelectorAll('button[data-target="bibtex-entry"]');

    copyButtons.forEach((button) => {
        const labelSpan = button.querySelector('span:last-child');
        if (labelSpan && !button.dataset.defaultLabel) {
            button.dataset.defaultLabel = labelSpan.textContent;
        }

        button.addEventListener('click', () => {
            copyTextToClipboard(bibtexText)
                .then(() => showCopyFeedback(button))
                .catch(() => console.error('Failed to copy BibTeX to clipboard.'));
        });
    });
});
