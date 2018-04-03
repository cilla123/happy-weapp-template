import TWEEN from 'tween.js'

TWEEN.now = function () {
    return new Date().getTime()
}

global.TWEEN = TWEEN