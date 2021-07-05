'use strict'

/* CANVAS */
var gCanvas;
var gCtx;
var gIsDownload

const GALLERY = '.container-gallery'
const CREATOR = '.meme-creator'
const MEMES = '.memes'

const BTN_GALLERY = '.btn-gallery'
const BTN_CREATOR = '.btn-creator'
const BTN_MEMES = '.btn-memes'

var gIsMouseDown;
var gRowIdxMouseOn;
var gIsMouseOnTxt
var gMouseDownPos;


function init() {
    InitializeCanvas()
    renderGallery()
    gIsDownload = false
    var meme = getMeme()
    if (meme) {
        unDisableBtn('.btn-creator')
    }
}


/***  Canvas functions ***/
/** */
function InitializeCanvas() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d')
    setCanvasSize(500, 500)

}
function setCanvasSize(width, height) {
    gCtx.canvas.width = width;
    gCtx.canvas.height = height;
}
/**Canvas render */
function renderCanvas() {
    var meme = getMeme()
    var imgObj = getImgMeme()
    gCtx.drawImage(imgObj, 0, 0, gCanvas.width, gCanvas.height)
    meme.lines.forEach(setLineArea)
    if (!gIsDownload) renderLineMarker()
    meme.lines.forEach(renderLineCanvas)
}



function setContextProperties(line) {
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = 'left';
    gCtx.textBaseline = 'top';
    gCtx.lineWidth = 4;
    gCtx.strokeStyle = line.stroke;
    gCtx.fillStyle = line.color;
}
/**Helpers for 'renderCanvas()' function */
function renderLineCanvas(line) {
    setContextProperties(line);
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
    gCtx.fillText(line.txt, line.pos.x, line.pos.y);
}
function renderLineMarker() {
    var line = getLineClicked()
    if (!line) return
    setContextProperties(line)
    gCtx.fillStyle = 'rgba(220, 220, 220, 0.6)';
    gCtx.fillRect(line.limit.left, line.limit.top, line.limit.right - line.pos.x, line.limit.bottom - line.pos.y);
}


function renderLine() {
    var line = getLineClicked()
    var lineIdx = getLineClickedIdx()

    var lineHTML = line ? getHTMLLineDOM(line, lineIdx) : `Click '+' button to add text`;
    document.querySelector('.line').innerHTML = lineHTML
}

/** Render DOM - line */
function renderLinesDOM() {
    var lines = getLines()
    var strHTMLs = lines.map(getHTMLLineDOM)
    document.querySelector('.line').innerHTML = strHTMLs.join('');
}
/** helpers for on renderLinesDOM**/
function getHTMLLineDOM(line, idx) {
    return ` 
    <div class="panel-row line-${idx}">
        <textarea  class="txt-line" onclick="onLine(${idx})" 
            oninput="onLineProperty('txt', this.value)">${line.txt}</textarea>
        <button class="btn-delete-line btn-panel icon-background" onclick="onDeleteLine(${idx})"></button>
    </div>`
}


/* header handles */
function onCreator() {
    changeScreen(CREATOR)
    disableBtn(BTN_CREATOR)
    unDisableBtn(BTN_GALLERY)
    unDisableBtn(BTN_MEMES)

    createImgObj(getMeme().selectedImgId)
    setCanvasSizeByImg(getImgMeme())
    renderCanvas()
    renderLine()
}
function onGallery() {
    changeScreen(GALLERY)
    disableBtn(BTN_GALLERY)
    if (getMeme()) unDisableBtn(BTN_CREATOR)
    unDisableBtn(BTN_MEMES)
}
function onMemes() {
    var memes = getMemes()
    renderMemes(memes)
    disableBtn(BTN_MEMES)
    if (getMeme()) unDisableBtn(BTN_CREATOR)
    unDisableBtn(BTN_GALLERY)
    changeScreen(MEMES)
}

function renderMemes(memes) {
    var elGalleryMemes = document.querySelector('.memes-gallery')
    elGalleryMemes.innerHTML = (memes.length) ? memes.map(getMemesHTMLs).join('') : 'You don\'t have any saved memes yet'
}
function getMemesHTMLs(memeObj, idx) {
    var img = memeObj.img
    return `
        <div class="meme-gallery-box">
            <img class="img-meme" src="${img}" onclick="onMemeBox(${idx})" />
            <button class="btn-meme-delete" onclick="onDeleteMeme(${idx})"></button>
        </div>
    `
}
function onMemeBox(idx) {
    var memes = loadMemesFromStorage()
    var meme = memes[idx].gMeme
    setMeme(meme)
    createImgObj(meme.selectedImgId)
    getImgMeme().onload = () => {
        setCanvasSizeByImg(getImgMeme())
        setLineClicked(0)
        renderCanvas()
        unDisableBtn(BTN_MEMES)
        changeScreen(CREATOR)
    }
}
function onDeleteMeme() {
    deleteMeme()
    renderMemes(getMemes())
}

function changeScreen(screenShow) {
    var screens = [GALLERY, CREATOR, MEMES]
    screens.forEach(screen => {
        if (screen === screenShow) {
            document.querySelector(screen).classList.remove('hidden')
        } else {
            document.querySelector(screen).classList.add('hidden')
        }
    })
}
function disableBtn(selector) {
    document.querySelector(selector).disabled = true
}
function unDisableBtn(selector) {
    document.querySelector(selector).disabled = false
}


function onLine(idxLine) {
    setLineClicked(idxLine)
    renderCanvas()
}
function onAddLine() {
    addLine()
    setLineClicked(getLines().length - 1)
    renderLine()
    renderCanvas()
    document.querySelector('.line textarea').focus();
}
function onDeleteLine(idxLine) {
    deleteLine(idxLine)
    renderLine()
    renderCanvas()
}
function onChange() {
    if (!getLineClicked()) return
    changeLineClicked()
    renderLine()
    renderCanvas()
    document.querySelector('.txt-line').focus();
}

function onPropertyTouch(keyProp, value, ev) {
    ev.preventDefault()
    onLineProperty(keyProp, value)
}
function onLineProperty(keyProp, value) {
    if (!getLineClicked()) return

    changeLineProperty(keyProp, value)
    renderCanvas()
}
function onStrokePickerColor(picker) {
    onLineProperty('stroke', '#' + picker)
}
function onPickerColor(picker) {
    onLineProperty('color', '#' + picker)
}

function getCanvasSize() {
    return {
        width: gCanvas.width,
        height: gCanvas.height
    }
}


function onSave(el) {
    gIsDownload = true
    renderCanvas()
    save(el)
    gIsDownload = false
    renderCanvas()
}

function onSelectImg(ev) {
    loadImageFromInput(ev, loadSelectedImg)
}
function loadSelectedImg(img) {
    setImgMeme(img)
    createMeme(-1)
    setCanvasSizeByImg(img)
    unDisableBtn(BTN_GALLERY)
    disableBtn(BTN_CREATOR)
    changeScreen(CREATOR)
    renderCanvas()
    renderLine()
}
function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function showMenu() {
    document.body.classList.toggle('show-menu');
}

function onDownload(elLink) {
    gIsDownload = true
    renderCanvas()
    downloadMeme(elLink)
    gIsDownload = false
    renderCanvas()
}


function onCanvasMove(ev) {
    canvasMove(ev)
}
function onCanvasUp(ev) {
    gIsMouseDown = false;
}
function onCanvasDown(ev) {
    gIsMouseDown = true;

    if (gIsMouseOnTxt) {
        setLineClicked(gRowIdxMouseOn)
        renderCanvas()
        renderLine()
        gMouseDownPos = ev
    }
}

function onTouchStart(ev) {
    ev.preventDefault
    var ops = {
        offsetX: ev.touches[0].clientX,
        offsetY: ev.touches[0].clientY
    }
    onCanvasDown(ops)
}
function onTouchMove(ev) {
    ev.preventDefault
    var ops = {
        offsetX: ev.touches[0].clientX,
        offsetY: ev.touches[0].clientY
    }
    onCanvasMove(ops)
}
function onTouchEnd(ev) {
    ev.preventDefault
    onCanvasUp(ev)
}



function canvasMove(ops) {

    if (gIsMouseDown && gIsMouseOnTxt) {
        var currPos = ops
        var line = getLineClicked()
        line.pos.x += currPos.offsetX - line.pos.x
        line.pos.y += currPos.offsetY - line.pos.y
        alignCenterLinePos(line)
        renderCanvas()
        document.querySelector('.txt-line').focus();
    } else {
        var lines = getLines()
        var isMouseOnTxt = lines.some((line, idx) => {
            let limit = line.limit
            if ((limit.left < ops.offsetX && limit.right - 7 > ops.offsetX)
                && (limit.top < ops.offsetY && limit.bottom - 7 > ops.offsetY)) {
                gRowIdxMouseOn = idx
                return true
            } else return false
        })

        var elCanvas = document.querySelector('.canvas')
        if (isMouseOnTxt) {
            elCanvas.style.cursor = 'pointer'
            gIsMouseOnTxt = true
        } else {
            elCanvas.style.cursor = 'default'
            gIsMouseOnTxt = false
        }
    }
}
