let lastTime = 0

global.requestAnimationFrame = callback => {
    const currentTime = new Date().getTime()
    const timeToCall = Math.max(0, 16 - (currentTime - lastTime))
    const timer = global.setTimeout(function () {
        callback(currentTime + timeToCall)
    }, timeToCall)

    lastTime = currentTime + timeToCall

    return timer
}

global.cancelAnimationFrame = timer => {
    clearTimeout(timer)
}