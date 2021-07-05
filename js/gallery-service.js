'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [
    { id: 1, url: 'img/meme-imgs-full-size/1.jpg', keywords: ['movies', 'toys', 'friends'] },
    { id: 2, url: 'img/meme-imgs-full-size/2.jpg', keywords: ['happy', 'dance', 'woman'] },
    { id: 3, url: 'img/meme-imgs-full-size/3.jpg', keywords: ['president', 'donald trump', 'men'] },
    { id: 4, url: 'img/meme-imgs-full-size/4.jpg', keywords: ['animals', 'cute', 'dogs', 'friends'] },
    { id: 5, url: 'img/meme-imgs-full-size/5.jpg', keywords: ['baby', 'cute'] },
    { id: 6, url: 'img/meme-imgs-full-size/6.jpg', keywords: ['baby', 'Dogs', 'friends', 'animals', 'sleep'] },
    { id: 7, url: 'img/meme-imgs-full-size/7.jpg', keywords: ['animals', 'cat', 'sleep', 'cute'] },
    { id: 8, url: 'img/meme-imgs-full-size/8.jpg', keywords: ['movie', 'happy', 'smile'] },
    { id: 9, url: 'img/meme-imgs-full-size/9.jpg', keywords: ['happy', 'baby', 'laughs', 'evil'] },
    { id: 10, url: 'img/meme-imgs-full-size/10.jpg', keywords: ['movie', 'men'] },
    { id: 11, url: 'img/meme-imgs-full-size/11.jpg', keywords: ['movie', 'evil'] },
    { id: 12, url: 'img/meme-imgs-full-size/12.jpg', keywords: ['movie', 'chaim hecht'] },
    { id: 13, url: 'img/meme-imgs-full-size/13.jpg', keywords: ['kids', 'dance', 'happy', , 'friends'] },
    { id: 14, url: 'img/meme-imgs-full-size/14.jpg', keywords: ['president', 'donald trump', 'men'] },
    { id: 15, url: 'img/meme-imgs-full-size/15.jpg', keywords: ['baby,cute'] },
    { id: 16, url: 'img/meme-imgs-full-size/16.jpg', keywords: ['animals', 'dog'] },
    { id: 17, url: 'img/meme-imgs-full-size/17.jpg', keywords: ['smile', 'bark obama', 'laughs', 'happy'] },
    { id: 18, url: 'img/meme-imgs-full-size/18.jpg', keywords: ['kiss', 'men', 'man', 'friends'] },
]


/**  return gImage-modal */
function getImgs() {
    return gImgs
}

function getImgsToRenderByKeyword(keyword) {
    return gImgs.filter(img => {
        return img.keywords.some(word => {
            return word.includes(keyword.toLowerCase())
        })
    })
}

function getImgIdxById(imgId) {
    if (imgId === -1) return -1
    return gImgs.findIndex(img => img.id === imgId)
}
function getImgById(imgId) {
    if (imgId === -1) return getImgMeme()
    return gImgs.find(img => img.id === imgId)
}
