const GuaObject = require('../gua_object')
const ref = require('ref')

const sdl = require('../../sdl')
const img = require('../../image')

const log = require('../utils').log


class ImageView extends GuaObject {
    constructor(position, path, renderer) {
        super()
        this.setup(position, path, renderer)
    }
    setup(position, path, renderer) {
        this.path = path
        // 添加 position 用来实现 background down/normal
        this.position = position
        this.renderer = renderer
    }
    __added(view) {
        super.__added(view)
    }
    draw() {
        let imageFile = this.path
        this.surface = img.IMG_Load(imageFile)
        this.texture = sdl.SDL_CreateTextureFromSurface(this.renderer, this.surface)
        this.rect = new sdl.SDL_Rect({
            x: this.position[0],
            y: this.position[1],
            w: this.surface.deref().w,
            h: this.surface.deref().h,
        })
        sdl.SDL_RenderCopy(this.renderer, this.texture, null, this.rect.ref())
        sdl.SDL_FreeSurface(this.surface)
        sdl.SDL_DestroyTexture(this.texture)
    }
    remove() {
        sdl.SDL_DestroyTexture(this.texture)
    }
}


module.exports = ImageView
