$.fn.setCursorPosition = function (a) {
    return 0 == this.lengh ? this : $(this).setSelection(a, a)
}, $.fn.setSelection = function (a, b) {
    if (0 == this.lengh)return this;
    if (input = this[0], input.createTextRange) {
        var c = input.createTextRange();
        c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()
    } else input.setSelectionRange && (input.focus(), input.setSelectionRange(a, b));
    return this
}, $.fn.focusEnd = function () {
    this.setCursorPosition(this.val().length)
}

function message() {
    var a = $.blinkTitle.show();
    setTimeout(function () {
        $.blinkTitle.clear(a)
    }, 8e3)
}

(function blinkTitle(a) {
    a.extend({blinkTitle: {show: function () {
        var a = 0, b = document.title;
        if (-1 == document.title.indexOf("\u3010"))var c = setInterval(function () {
            a++, 3 == a && (a = 1), 1 == a && (document.title = "\u3010\u3000\u3000\u3000\u3011" + b), 2 == a && (document.title = "\u3010\u65b0\u6d88\u606f\u3011" + b)
        }, 500);
        return[c, b]
    }, clear: function (a) {
        a && (clearInterval(a[0]), document.title = a[1])
    }}})
})(jQuery);