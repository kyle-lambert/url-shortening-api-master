const formInput = document.getElementById('formInput');
const formMessage = document.getElementById('formMessage');
const formSumbit = document.getElementById('formSubmit');
const urlItemContainer = document.querySelector('.url-item__container');

class Data {
  async getShortUrl(query) {
    try {
      const res = await axios.post('https://rel.ink/api/links/', {
        url: query
      })
      const urlObject = {
        id: new Date().getTime().toString(),
        url: res.data.url,
        shortenedUrl: `https://rel.ink/${res.data.hashid}`,
      }
      return urlObject;
    } catch (error) {
      console.log(error);
    }
  }
}

class Storage {
  saveHistory(urlArray) {
    sessionStorage.setItem('urls', JSON.stringify(urlArray))
  }
}

class UI {
  renderItem(item) {
    const html = `
    <div class="item" data-ID="${item.id}">
      <span class="item__input" id="inputUrl">${item.url}</span>
      <div class="item__output-wrapper">
        <span class="item__output" id="shortenedUrl">${item.shortenedUrl}</span>
        <button class="btn btn--primary btn--small">Copy</button>
      </div>
    </div>
    `
    urlItemContainer.insertAdjacentHTML('afterbegin', html);
  }

  clearInput() {
    formInput.value = '';
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error);
      console.log('url did not copy');
    }
  }

  validateInput(query) {
    const regex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
    return regex.test(query);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const data = new Data()
  const storage = new Storage();
  const ui = new UI();

  const searchHistory = (sessionStorage['urls']) ? JSON.parse(sessionStorage.getItem('urls')) : [];

  searchHistory.forEach(item => {
    ui.renderItem(item);
  });

  formSumbit.addEventListener('click', async (e) => {
    e.preventDefault();

    const vaildUrl = ui.validateInput(formInput.value);
    const urlStart = formInput.value.substring(0, 4);

    if (!vaildUrl) {
      formInput.classList.add('form__input--error');
      formMessage.style.display = 'block';
      ui.clearInput();

    } else {
      if (urlStart === 'www.') {
        formInput.value = `https://${formInput.value}`
      }

      formInput.classList.remove('form__input--error');
      formMessage.style.display = 'none';

      const search = await data.getShortUrl(formInput.value);
      searchHistory.push(search);

      storage.saveHistory(searchHistory);
      ui.renderItem(search);

      ui.clearInput();
    }
  })

  urlItemContainer.addEventListener('click', (e) => {
    // Copy button pressed
    if (e.target.textContent === 'Copy') {
      const item = e.target.parentNode.parentNode;
      const itemButton = e.target;
      const itemID = item.dataset.id;
      const shortenedUrl = searchHistory.filter(item => item.id === itemID)[0].shortenedUrl;

      ui.copyToClipboard(shortenedUrl);

      itemButton.classList.add('btn--copied');
      itemButton.textContent = 'Copied';
      setTimeout(function () {
        itemButton.classList.remove('btn--copied');
        itemButton.textContent = 'Copy';
      }, 5000);
    }
  })
});

(function toggleNavitation() {
  document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.mb-nav').classList.toggle('mb-nav--active');
  })
})();