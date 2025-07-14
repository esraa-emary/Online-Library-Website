 // Add confirmation dialog for delete buttons in all manage forms
    document.querySelectorAll('#manageform').forEach(function(form) {
        form.addEventListener('submit', function(e) {
              if (window.history.replaceState) {
                  window.history.replaceState(null, null, window.location.href);
                }
            var deleteBtn = form.querySelector('button.delete');
            if (document.activeElement === deleteBtn) {
                if (!confirm('Are you sure you want to delete this book?')) {
                    e.preventDefault();
                }
            }
        });
    });

    