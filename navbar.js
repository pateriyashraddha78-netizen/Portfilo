class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .navbar {
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #6366f1;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      </style>
      <nav class="navbar fixed w-full z-10 py-4 px-6 bg-white shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <a href="#" class="text-2xl font-bold text-indigo-600">Shradha<span class="text-gray-800">.</span></a>
          
          <div class="hidden md:flex space-x-8">
            <a href="#about" class="nav-link text-gray-700 hover:text-indigo-600">About</a>
            <a href="#projects" class="nav-link text-gray-700 hover:text-indigo-600">Projects</a>
            <a href="#education" class="nav-link text-gray-700 hover:text-indigo-600">Education</a>
            <a href="#certifications" class="nav-link text-gray-700 hover:text-indigo-600">Certifications</a>
            <a href="#contact" class="nav-link text-gray-700 hover:text-indigo-600">Contact</a>
          </div>
          
          <button class="md:hidden focus:outline-none" id="mobile-menu-button">
            <i data-feather="menu" class="text-gray-700"></i>
          </button>
        </div>
        
        <!-- Mobile menu -->
        <div class="md:hidden hidden bg-white w-full py-4 px-6 shadow-lg" id="mobile-menu">
          <div class="flex flex-col space-y-4">
            <a href="#about" class="text-gray-700 hover:text-indigo-600">About</a>
            <a href="#projects" class="text-gray-700 hover:text-indigo-600">Projects</a>
            <a href="#education" class="text-gray-700 hover:text-indigo-600">Education</a>
            <a href="#certifications" class="text-gray-700 hover:text-indigo-600">Certifications</a>
            <a href="#contact" class="text-gray-700 hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </nav>
    `;
    
    // Add scroll event listener for navbar
    const navbar = this.shadowRoot.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Mobile menu toggle
    const mobileMenuButton = this.shadowRoot.getElementById('mobile-menu-button');
    const mobileMenu = this.shadowRoot.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      feather.replace();
    });
  }
}

customElements.define('custom-navbar', CustomNavbar);