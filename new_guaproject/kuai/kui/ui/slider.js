const sdl = require('../../sdl')

const Event = require('../../kui/event')
const GuaObject = require('../gua_object')
const Color = require('../color')

const log = require('../utils').log

class Slider extends GuaObject {
    constructor(position, color1=Color.lightblue(), color2=Color.black()) {
        super()
        this.setup(position, color1, color2)
    }
    setup(position, color1, color2) {
        const self = this
        self.eventEnabled = true
        self.position = {
            x: position[0],
            y: position[1],
        }
        self.color1 = color1
        self.color2 = color2
        self.size = {
            w: 230,
            h: 10,
        }
        // 默认为 0
        self._percent = 0
    }
    __added(view) {
        super.__added(view)
        // 使进度条和 音频文件 绑定
        this.audio = this.parent.audio
    }
    draw() {
        const self = this
        let c1 = {
            x: self.position.x,
            y: self.position.y,
            w: self.size.w,
            h: self.size.h,
        }
        self.drawRect(c1, self.color1)
        let c2 = {
            x: self.position.x,
            y: self.position.y,
            w: self.size.w * self.percent,
            h: self.size.h,
        }
        self.drawRect(c2, self.color2)
    }
    mouseEvent(event) {
        let e = event
        let type = e.type
        // 先看现在的状态是否是点中了
        if (type === Event.MOUSEBUTTONDOWN) {
            // move
            let {x, y, state} = e.button
            // down: state = 1, up: state = 0
            let mouseInside = this.collide(x, y)
            if (mouseInside) {
                // 计算 x 在 size 的比例
                let diff = x - this.position.x
                let percent = diff / this.size.w
                this.percent = percent
                this.audio.currentTime = this.audio.duration * this.percent
            }
        }
    }
    get percent() {
        return this._percent
    }
    set percent(p) {
        this._percent = p
    }
    remove() {
        sdl.SDL_DestroyTexture(this.texture)
    }
}

module.exports = Slider
