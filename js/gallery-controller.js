'use strict'


function renderGallery(imgs = getImgs()) {
    var imgsHTMLs = imgs.map(getImgsHTMLs)

    var elGallery = document.querySelector('.gallery');
    elGallery.innerHTML = imgsHTMLs.join('')
}
/**Helpers Gallery render function */
function getImgsHTMLs(img) {
    return `
    <div class="img-gallery-box">
        <img src="${img.url}" alt="img-gallery" onclick="onImgGallery(${img.id})"/>
    </div>`
}

/**  Image-gallery handler */
function onImgGallery(imgId) {
    createImgObj(imgId)
    setCanvasSizeByImg(getImgMeme())
    createMeme(imgId)
    unDisableBtn(BTN_GALLERY)
    disableBtn(BTN_CREATOR)
    changeScreen(CREATOR)
    renderCanvas()
    renderLine()
}

function onSearchInput(input) {
    if (!input) renderGallery()
    var imgsForRender = getImgsToRenderByKeyword(input)
    renderGallery(imgsForRender)
}

