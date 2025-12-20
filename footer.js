class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .social-icon {
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          transform: translateY(-3px);
          color: #6366f1;
        }
      </style>
      <footer class="bg-gray-800 text-white py-12">
        <div class="container mx-auto px-6">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
              <h2 class="text-2xl font-bold mb-2">Shradha Pateriya</h2>
              <p class="text-gray-400">Web & Python Developer</p>
            </div>
            
            <div class="flex space-x-6 mb-6 md:mb-0">
              <a href="#" class="social-icon text-gray-400 hover:text-white">
                <i data-feather="github"></i>
              </a>
              <a href="#" class="social-icon text-gray-400 hover:text-white">
                <i data-feather="linkedin"></i>
              </a>
              <a href="#" class="social-icon text-gray-400 hover:text-white">
                <i data-feather="twitter"></i>
              </a>
              <a href="#" class="social-icon text-gray-400 hover:text-white">
                <i data-feather="mail"></i>
              </a>
            </div>
            
            <div class="text-center md:text-right">
              <p class="text-gray-400">© ${new Date().getFullYear()} Shradha Pateriya. All rights reserved.</p>
              <p class="text-gray-500 text-sm mt-1">Made with ❤️ and code</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);