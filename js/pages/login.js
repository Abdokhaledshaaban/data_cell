// Login Page

const toggleIcon = document.getElementById('togglePassword');
const passwordInput = document.getElementById('loginPassword');

if (toggleIcon && passwordInput) {
  const updateIconState = () => {
    const isHidden = passwordInput.type === 'password';
    toggleIcon.classList.toggle('fa-eye', isHidden);
    toggleIcon.classList.toggle('fa-eye-slash', !isHidden);
  };

  const toggleIconVisibility = () => {
    toggleIcon.style.display = passwordInput.value.length === 0 ? 'none' : 'block';
  };

  toggleIcon.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    updateIconState();
  });

  toggleIconVisibility();
  updateIconState();
  passwordInput.addEventListener('input', toggleIconVisibility);
}
