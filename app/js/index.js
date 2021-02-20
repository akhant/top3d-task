menuHandler();
mobileMenuHandler();

function menuHandler() {
  const botItem = document.getElementsByClassName('h-menu-bot__item');

  for (let elem of botItem) {
    elem.addEventListener('mouseenter', (e) => {
      const submenu = document.getElementsByClassName('submenu');
      // open menu with delay
      let timer = setTimeout(show, 500);
      elem.addEventListener('mouseleave', (ev) => {
        clearTimeout(timer);
      });

      function closeClick(event) {
        if (
          event.target.matches('.h-menu-bot__item') ||
          event.target.matches('.submenu')
        ) {
          submenu[0].style.display = 'block';
        } else {
          submenu[0].style.display = 'none';
        }
      }
      function show() {
        submenu[0].style.display = 'block';
        let h1 = document.querySelector('.submenu h1');
        if (!h1) {
          h1 = document.createElement('h1');
        }
        h1.innerText = e.target.innerText;
        h1.style.textAlign = 'center';
        submenu[0].append(h1);
        window.addEventListener('click', closeClick);
      }
    });
  }
}

function mobileMenuHandler() {
  const btnMobileMenuOpen = document.getElementsByClassName(
    'mobile-menu__btn-open'
  )[0];
  const btnMobileMenuClose = document.getElementsByClassName(
    'mobile-menu__btn-close'
  )[0];
  const btnMobileSearchOpen = document.getElementsByClassName(
    'mobile-search__btn-open'
  )[0];
  const btnMobileSearchClose = document.getElementsByClassName(
    'mobile-search__btn-close'
  )[0];
  const btnMobileSearcSubElem = document.getElementsByClassName(
    'mobile-search-elem'
  )[0];
  let mobileSubmenu = document.getElementsByClassName('mobile-submenu')[0];

  const mobileMenuElements = [
    btnMobileMenuOpen,
    btnMobileMenuClose,
    mobileSubmenu,
  ];
  const mobileSearchElements = [
    btnMobileSearchOpen,
    btnMobileSearchClose,
    btnMobileSearcSubElem,
  ];

  const toggle = (arr) => {
    for (let el of arr) {
      el.classList.toggle('show');
    }
  };

  const addBtnOnClick = (arr) => {
    for (let btn of arr.slice(0, 2)) {
      btn.addEventListener('click', () => {
        toggle(arr);
      });
    }
  };

  addBtnOnClick(mobileMenuElements);
  addBtnOnClick(mobileSearchElements);
}
