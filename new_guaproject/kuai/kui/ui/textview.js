const ref = require('ref')

const sdl = require('../../sdl')
const ttf = require('../../ttf')

const GuaObject = require('../gua_object')
const Color = require('../color')

const log = require('../utils').log


class TextView extends GuaObject {
    constructor(text, position, size, fontSize=20, color=Color.black()) {
        super()
        this.size = size
        this.fontSize = fontSize
        this._text = text
        this.position = position
        this.color = color
        this.inset = 3
        this.borderColor = Color.black()
        this.setup(text, position)
    }
    setup(text, position) {
        // this.color = color
        // 加载 ttf
        this.loadFont()
        // 设置 size
        //this.updateSize()
        // 加载 texture
        // this.loadTexture()
        let [r, g, b, a] = this.color
        this.textColor = new sdl.SDL_Color({
            r,
            g,
            b,
            a,
        })
        this.textBGColor = new sdl.SDL_Color({
            r: 111,
            g: 111,
            b: 111,
            a: 255,
        })
    }
    __added(view) {
        super.__added(view)
        this.loadTexture()
    }
    loadTexture() {
        const self = this
        const renderer = self.renderer

        self.lineHeight = ttf.TTF_FontLineSkip(self.font)
        self.lines = self._text.split('\n')
        //log('font line height', self.lineHeight, self.lines.length)

        self.textures = []
        for(let line of self.lines) {
            if(line === '') {
                line = ' '
            }
            //let surface = ttf.TTF_RenderUTF8_Shaded(self.font, line, self.textColor, self.textBGColor)
            let surface = ttf.TTF_RenderUTF8_Blended(self.font, line, self.textColor)
            // 加载失败
            if (surface.isNull()) {
                log('text render error:', ttf.TTF_GetError())
                process.exit(1)
            }
            // 转成 texture
            let texture = sdl.SDL_CreateTextureFromSurface(renderer, surface)
            let {w} = surface.deref()

            sdl.SDL_FreeSurface(surface)

            // TODO: 这里是大坑, 把纹理和宽度都放这里了
            self.textures.push([texture, w])
        }
    }
    loadFont() {
        const self = this
        let path = './resource/font/font.ttf'
        self.font = ttf.TTF_OpenFont(path, this.fontSize)
        if (self.font.isNull()) {
            console.log(`OpenFont Error: (${ttf.TTF_GetError()})`)
            process.exit(1)
        }
    }
    draw() {
        this.drawBG()
        const self = this
        // const renderer = this.renderer
        // console.log('__ draw', this.texture)'
        let inset = self.inset
        for (let i = 0; i < self.textures.length; i++) {
            let [t, w] = self.textures[i]
            let offset = i * self.lineHeight
            var rect = new sdl.SDL_Rect({
                x: self.position[0] + inset,
                y: self.position[1] + offset + inset,
                w: w,
                h: self.lineHeight,
            })
            // this._rect = rect

            sdl.SDL_RenderCopy(this.renderer, t, null, rect.ref())
        }
    }
    drawBG() {
        // draw border
        let borderFrame = {
            x: this.position[0],
            y: this.position[1],
            w: this.size[0],
            h: this.size[1],
        }
        this.drawRect(borderFrame, this.borderColor)
        // draw content
        let offset = 1
        let frame = {
            x: this.position[0]+ offset,
            y: this.position[1] + offset,
            w: this.size[0] - offset * 2,
            h: this.size[1] - offset * 2,
        }
        this.drawRect(frame, Color.white())
    }
    remove() {
        //log('remove', this.textures.length)
        for(let t of this.textures) {
            sdl.SDL_DestroyTexture(t[0])
        }
        this.textures = []
    }
    get text() {
        return this._text
    }
    set text(t) {
        // console.log('触发了', t)
        this._text = t
        this.remove()
        // 重新 load
        //this.updateSize()
        this.loadTexture()
    }
}


module.exports = TextView
