const formInput = document.getElementById('formInput');
const formSumbit = document.getElementById('formSubmit');
const urlItemContainer = document.querySelector('.url-item__container');



class Data {
  async getShortUrl(query) {
    try {
      const res = await axios.post('https://rel.ink/api/links/', {
        url: query
      })
      const urlObject = {
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
  saveUrl(urlArray) {
    localStorage.setItem('urls', JSON.stringify(urlArray))
  }

}

class UI {
  renderItem(obj) {
    const url = obj.url;
    const shortenedUrl = obj.shortenedUrl;
    const html = `
    <div class="item" data-ID="">
      <span class="item__input" id="inputUrl">${url}</span>
      <div class="item__output-wrapper">
        <span class="item__output" id="shortenedUrl">${shortenedUrl}</span>
        <button class="btn btn--primary btn--small">Copy</button>
      </div>
    </div>
    `
    urlItemContainer.insertAdjacentHTML('afterbegin', html)
  }
}

const urlArray = (localStorage.length > 0) ? JSON.parse(localStorage.getItem('urls')) : [];

document.addEventListener('DOMContentLoaded', async function () {
  const data = new Data()
  const storage = new Storage();
  const ui = new UI();

  formSumbit.addEventListener('click', async (e) => {
    e.preventDefault();

    if (formInput.value) {
      const urlObject = await data.getShortUrl(formInput.value);
      urlArray.push(urlObject);
      storage.saveUrl(urlArray);
      ui.renderItem(urlObject);
    }
  })

});


(function toggleNavitation() {
  document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.mb-nav').classList.toggle('mb-nav--active');
  })
})();