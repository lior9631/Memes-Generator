'use strict'
/** Gets item-id and items-array(objects array) and returns item with the same index  */
function getItemById(itemId, arr) {
    return arr.find(item => item.id === itemId)
}
/**  */
function getItemByIdx(idx, arry) {
    return arry[idx]
}
