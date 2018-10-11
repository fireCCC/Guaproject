const GuaObject = require('../gua_object')

const Event = require('../../kui/event')
const Color = require('../color')
const Label = require('./label')
const ImageView = require('./image')

const log = require('../utils').log


class Button extends GuaObject {
    // color 参数并没有使用，暂注释
    // constructor(text, position, callback, color=[0, 0, 255, 255]) {
    constructor(config) {
        super()
        this.config = config
        this.eventEnabled = true
        // 点中后设置这个标记
        this.__pressed = false
        this.size.w = 100
        this.size.h = 50
        // 按中后的颜色
        this.color = Color.buttonNormal()
        this.pressedColor = Color.buttonPressed()
        //
        this.setup()
    }
    setup() {
        const self = this
        self.text = self.config.text
        let [x, y] = self.config.position
        self.position = {
            x,
            y,
        }
        self.renderer = self.config.renderer
    }
    __added(view) {
        super.__added(view)
        const self = this
        let parent = self.parent
        self.callback = self.config.callback.bind(parent)
        if (self.text === undefined) {
            let p = self.config.position
            // 必须传递 renderer
            let renderer = self.parent.game.renderer
            self.backgroundNormal = new ImageView(p, self.config.backgroundNormal, renderer)
            self.backgroundDown = new ImageView(p, self.config.backgroundDown, renderer)
        } else {
            // 带文本的按钮
            // TODO, label 默认 font size 是 20，这也是 label 的高度
            self.label = new Label(self.text, [0, 0], 20, Color.white())
            self.add(self.label)
            // add 后 label 才会渲染才有具体的 size
            let {w, h} = self.label.size
            let p = {
                x: self.position.x + self.size.w / 2 - w / 2,
                y: self.position.y + self.size.h / 2 - h / 2,
            }
            self.label.position = p
            console.log('button label pos', p, w, h, self.label.color)
        }
    }
    draw() {
        const self = this
        // self.renderer = renderer
        let frame = {
            x: self.position.x,
            y: self.position.y,
            w: self.size.w,
            h: self.size.h,
        }
        // 在 background 存在时不需要渲染 label 和 rect
        // todo 这里代码可以进一步用 && || 优化
        if (self.backgroundDown && self.backgroundNormal) {
            if (self.__pressed) {
                self.backgroundDown.draw()
            } else {
                self.backgroundNormal.draw()
            }
        } else {
            // 根据按钮按下的状态设置不同的颜色
            if (self.__pressed) {
                self.drawRect(frame, self.pressedColor)
            } else {
                self.drawRect(frame, self.color)
            }
            self.label.draw()
        }
    }
    mouseEvent(event) {
        let e = event
        let type = e.type
        // 先看现在的状态是否是点中了
        if (type === Event.MOUSEMOTION) {
            // move
        } else {
            // button up and down
            let {x, y, state} = e.button
            // down: state = 1, up: state = 0
            let mouseInside = this.collide(x, y)
            // log('button mouseInside', x, y, state, mouseInside)
            if (mouseInside) {
                // log('*** mouseInside', state, this.callback)
                if (state === 1) {
                    this.__pressed = true
                } else {
                    if (this.__pressed) {
                        this.callback && this.callback()
                    } else {
                        // 这里是在按钮外面点击，在里面松开
                    }
                }
            }
            if (state === 0) {
                this.__pressed = false
            }
        }
        // log('mouse type', type)
    }
}

module.exports = Button
