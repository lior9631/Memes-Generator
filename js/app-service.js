'use strict'

const keyMeme = 'meme'
const KEY_MEMES = 'memes'
const keyImgSrc = 'imgSrc'


/* line-text meme*/
var gLineClicked;//The last line clicked
var gLineClickedIdx;

/* MODAL */
var gMeme = loadMemeFromStorage();
var gImgMeme;

/**Create new meme */
function createMeme(imgId) {
    gMeme = {}
    gMeme.selectedImgId = imgId
    if (imgId === -1) {
        gMeme.url = gImgMeme.src
    } else {
        var imgIdx = getImgIdxById(imgId)
        gMeme.url = gImgs[imgIdx].url
    }

    gMeme.lines = []

    var canvasSize = getCanvasSize() //Get width and hight of the canvas

    //Set line position coordinates
    var linePos = {
        x: canvasSize.width / 2,
        y: 30
    }
    addLine(linePos.x, linePos.y)

    //Add another line
    linePos = {
        x: canvasSize.width / 2,
        y: canvasSize.height - 30
    }
    addLine(linePos.x, linePos.y)
    setLineClicked(0)
}

function addLine(xPos, yPos) {
    var canvasSize = getCanvasSize()

    if (!xPos) xPos = canvasSize.width / 2
    if (!yPos) yPos = canvasSize.height / 2


    /*Default properties line*/
    var newLine = {
        txt: 'Enter text',
        font: 'Impact',
        size: 50, align: 'center',
        stroke: 'black',
        color: 'white',
        pos: {
            x: xPos,
            y: yPos
        }
    }
    alignCenterLinePos(newLine)

    gMeme.lines.push(newLine)
}
function alignCenterLinePos(line) {
    setContextProperties(line)
    //Align line to center
    var lineWidth = gCtx.measureText(line.txt).width
    line.pos.x = line.pos.x - lineWidth / 2
    line.pos.y = line.pos.y - line.size / 2
}
function setLineArea(line) {
    gCtx.font = `${line.size}px ${line.font}`;

    var padding = 7
    line.limit = {
        top: line.pos.y - padding,
        left: line.pos.x - padding,
        right: line.pos.x + gCtx.measureText(line.txt).width + padding * 2,
        bottom: line.pos.y + line.size + padding * 2
    };
}

function deleteLine(idxLine) {
    var linesMeme = getLines()
    linesMeme.splice(idxLine, 1)
    changeLineClicked()
}


function getMeme() {
    return gMeme
}

function setMeme(meme) {
    gMeme = meme
}


function setImgMeme(img) {
    gImgMeme = img
}

function getImgMeme() {
    return gImgMeme
}

function saveMemeToStorage() {
    saveToStorage(keyMeme, gMeme)
}

function loadMemeFromStorage() {
    var meme = loadFromStorage(keyMeme)
    if (!meme) return null
    gMeme = meme
    setLineClicked(0)
    return meme
}

function changeLineProperty(keyProp, value) {
    if (keyProp === 'pos') {
        var deff = 5
        gLineClicked.pos.y += value * deff

    } else {
        if (keyProp === 'size') {
            var deff = 5
            value = gLineClicked.size + (deff * value)
        }
        gLineClicked[keyProp] = value
    }//END ELSE
}//END FUNCTION 'changeLineProperty'

function changeLineClicked() {
    var lines = getLines()
    var idxLine;
    if (!lines.length) {
        idxLine = null
    } else {
        idxLine = (idxLine === null) ? 0 : gLineClickedIdx + 1
        if (idxLine >= lines.length) idxLine = 0
    }
    setLineClicked(idxLine)
}

function setLineClicked(idxLine) {
    gLineClickedIdx = idxLine
    //Must to do (idxLine === null) because idxLine can also be equal to 0 (i went gLineClicked=null only if there is no index )
    gLineClicked = (idxLine === null) ? null : gMeme.lines[idxLine]
}

function getLines() {
    return gMeme.lines
}

function getLineClickedIdx() {
    return gLineClickedIdx
}

function getLineClicked() {
    return gLineClicked
}


function save() {
    const img = gCanvas.toDataURL()
    var memes = loadMemesFromStorage()
    if (!memes) memes = []
    memes.push({ gMeme, img })
    saveMemesToStorage(memes)
}
function saveMemesToStorage(memes) {
    saveToStorage(KEY_MEMES, memes)
}
function loadMemesFromStorage() {
    return loadFromStorage(KEY_MEMES)
}
function getMemes() {
    var memes = loadMemesFromStorage()
    if (memes) return memes
    return []
}

function deleteMeme(idx) {
    var memes = loadMemesFromStorage()
    memes.splice(idx, 1)
    saveMemesToStorage(memes)
}


function downloadMeme(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme.png'
}

function createImgObj(imgId) {
    if (imgId === -1) {
        var imgUrl = gMeme.url
    } else {
        var img = getImgById(imgId)
        var imgUrl = img.url
    }

    var imgObj = new Image()
    imgObj.src = imgUrl
    setImgMeme(imgObj)
}

function setCanvasSizeByImg(imgObj) {
    var canvasSize = getCanvasSize()
    var ratio = imgObj.height / imgObj.width
    //Determines the height of the canvas according to the aspect ratio of the image
    var heightCanvas = imgObj.height + (canvasSize.width - imgObj.width) * ratio;
    setCanvasSize(canvasSize.width, heightCanvas)
}
