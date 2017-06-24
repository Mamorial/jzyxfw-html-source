/**
 * 控制台输出，也用来断点
 * @param message
 * @private
 */
function _log(message) {
    var now = new Date(), y = now.getFullYear(), m = now.getMonth() + 1, // ！JavaScript中月分是从0开始的
        d = now.getDate(), h = now.getHours(), min = now.getMinutes(), s = now.getSeconds(), time = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
    try {
        if (window.console) {
            console.log(time + ' My App: ' + message);
        }
        if (message == "debug") {
            var a = 1;
            //break here
        }
    } catch (e) {
        // do nothing
    }
}