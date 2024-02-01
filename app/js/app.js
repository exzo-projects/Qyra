const containerEl = document.querySelector(".container");
const autoContainers = document.querySelectorAll(".container--auto");

const app = () => {
  return {
    isMenuActive: false,
    activeModal: null,
    isFormVisible: window.innerWidth > 650 ? true : false,
    tab: "innovation",

    selectTab(tab) {
      this.tab = tab;
    },

    toggleMenu() {
      this.isMenuActive = !this.isMenuActive;
    },

    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    },

    onMenuLinkClick(el) {
      console.log(el);
      if (el.classList.contains("nav__link")) {
        this.isMenuActive = false;
      }
    },

    hideModal() {
      if (this.activeModal == "video") {
        const videoModal = document.querySelector(".videos__frame");

        setTimeout(() => {
          videoModal.removeChild(videoModal.firstChild);
        }, 300);
      }

      this.activeModal = null;
    },

    handleForm(form) {
      if (window.innerWidth <= 650) {
        this.toggleForm();
      }

      this.activeModal = "form";
    },

    playVideo(el) {
      const videoItem = el.closest(".videos__item");
      const videoContainer = videoItem.querySelector(".videos__item_img");
      const videoModal = document.querySelector(".videos__frame");

      const url = videoContainer.dataset.video;
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.setAttribute("width", "100%");
      iframe.setAttribute("height", "100%");
      videoModal.appendChild(iframe);

      this.activeModal = "video";
    },
  };
};

const initAutoContainers = () => {
  if (autoContainers.length > 0) {
    let distanceToLeft = document.querySelector(".container").getBoundingClientRect();
    autoContainers.forEach((container) => {
      container.style.marginLeft = `${distanceToLeft.left / 16}rem`;
    });
  }
};

window.addEventListener("resize", initAutoContainers);
window.addEventListener("DOMContentLoaded", initAutoContainers);

const videosSlider = document.getElementById("videos-slider");
if (videosSlider) {
  new Swiper(videosSlider, {
    slidesPerView: "auto",
    spaceBetween: 25,
    slidesOffsetAfter: 15,
    navigation: {
      nextEl: ".videos__navigation_next",
      prevEl: ".videos__navigation_prev",
    },
    breakpoints: {
      320: {
        spaceBetween: 15,
      },
      768: {
        spaceBetween: 25,
      },
    },
  });
}

const publicationsSlider = document.getElementById("publications-slider");
if (publicationsSlider) {
  new Swiper(publicationsSlider, {
    slidesPerView: "auto",
    slidesOffsetAfter: 15,
    navigation: {
      nextEl: ".publications__navigation_next",
      prevEl: ".publications__navigation_prev",
    },
    breakpoints: {
      320: {
        spaceBetween: 15,
        slidesOffsetBefore: 0,
      },
      768: {
        spaceBetween: 25,
        slidesOffsetBefore: 0,
      },
      1100: {
        spaceBetween: 25,
        slidesOffsetBefore: 25,
      },
    },
  });
}

const mediaSlider = document.getElementById("media-slider");
if (mediaSlider) {
  new Swiper(mediaSlider, {
    navigation: {
      nextEl: ".media__navigation_next",
      prevEl: ".media__navigation_prev",
    },
    breakpoints: {
      320: {
        spaceBetween: 20,
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        slidesPerView: "auto",
      },
      996: {
        spaceBetween: 35,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        slidesPerView: 3,
      },
    },
  });
}

const storesSlider = document.getElementById("stores-slider");
if (storesSlider) {
  new Swiper(storesSlider, {
    slidesPerColumnFill: "row",
    spaceBetween: 20,
    navigation: {
      nextEl: ".stores__navigation_next",
      prevEl: ".stores__navigation_prev",
    },
    breakpoints: {
      320: {
        spaceBetween: 10,
        slidesPerView: 2,
        slidesPerColumn: 2,
      },
      450: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      996: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      },
    },
  });
}

const initMap = () => {
  var myMap,
    collections = [];

  window.addEventListener("load", () => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src =
      "https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=70911650-3a88-477e-a2ce-8509010c4745&amp;ver=5.3.4";
    const position = document.getElementsByTagName("head")[0];
    position.appendChild(mapScript);
    mapScript.onload = () => {
      ymaps.ready(init);
    };

    function init() {
      // Создание экземпляра карты.
      myMap = new ymaps.Map(
        "map-container",
        {
          center: [55.753215, 37.622504],
          zoom: 4,
          controls: [],
        },
        {
          maxZoom: 17,
          minZoom: 2,
          avoidFractionalZoom: false,
        }
      );

      // myMap.margin.setDefaultMargin(0);

      // Создание экземпляра элемента управления
      myMap.controls.add(new ymaps.control.ZoomControl());

      myMap.behaviors.disable("scrollZoom");

      for (var i = 0, l = groups.length; i < l; i++) {
        collections.push(new ymaps.GeoObjectCollection(null));

        // Добавляем коллекцию на карту.
        myMap.geoObjects.add(collections[i]);

        for (var j = 0, m = groups[i].items.length; j < m; j++) {
          appendObjects(groups[i].items[j], collections[i], groups[i].key);
        }
      }

      function appendObjects(item, collection, group_key) {
        var objectItem = jQuery(".map__item[data-clinic='" + item.id + "']");

        // Создаем метку.
        var placemark = new ymaps.Placemark(item.center, {
          balloonContentHeader: item.name,
          balloonContentBody: item.logo + item.desc,
        });

        // выставляем цвет
        placemark.options.set("preset", item.preset);

        // Добавляем метку в коллекцию.
        collection.add(placemark);

        // Добавляем пункт в подменю.
        objectItem
          // При клике по пункту подменю открываем/закрываем баллун у метки.
          .find(".map__item_title")
          .bind("click", function () {
            if (!placemark.balloon.isOpen()) {
              myMap.setCenter(item.center, 13);
              placemark.balloon.open();
            } else {
              placemark.balloon.close();

              myMap.setZoom(4);
              myMap.setBounds(myMap.geoObjects.getBounds(), {
                checkZoomRange: true,
                preciseZoom: true,
                zoomMargin: 25,
              });
            }
            return false;
          });
      }

      // Выставляем масштаб карты чтобы были видны все группы.
      myMap.setBounds(myMap.geoObjects.getBounds(), {
        checkZoomRange: true,
        preciseZoom: true,
        zoomMargin: 25,
      });
    }
  });
};

const initMapListener = () => {
  const mapSelect = document.querySelector(".map__selector_item");

  mapSelect.addEventListener("change", (e) => {
    const target = e.target.value;
    const content = document.querySelector(`[data-city="${target}"]`);
    const contentList = document.querySelectorAll(".map__content");

    if (content) {
      for (let i = 0; i < contentList.length; i++) {
        contentList[i].classList.remove("map__content--active");
      }

      content.classList.add("map__content--active");
    }
  });
};

//initMap();
//initMapListener();
