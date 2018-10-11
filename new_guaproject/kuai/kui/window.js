const sdl = require('../sdl')
const img = require('../image')
const ttf = require('../ttf')
const mix = require('../audio')
const Event = require('./event')
const Key = require('./keycode')

const ref = require('ref')
const log = require('./utils').log


class Window {
    constructor(title='Kuai UI', size=[800, 600]) {
        this.scene = null
        this.actions = {}
        this.size = {
            w: size[0],
            h: size[1],
        }
        this.title = title
        this.initSDL()
        this.initExt()
        this.quit = false
    }
    static new(...args) {
        // 单例
        this.i = this.i || new this(...args)
        return this.i
    }
    initSDL() {
        if (sdl.SDL_Init(sdl.SDL_INIT_VIDEO) < 0) {
            throw new Error(SDL_GetError())
        }
        this.window = sdl.SDL_CreateWindow(
            this.title,
            sdl.SDL_WINDOWPOS_UNDEFINED,
            sdl.SDL_WINDOWPOS_UNDEFINED,
            this.size.w,
            this.size.h,
            sdl.SDL_WINDOW_SHOWN);
        if (this.window.isNull()) {
            throw new Error(sdl.SDL_GetError())
        }
        // 
        this.renderer = sdl.SDL_CreateRenderer(
            this.window,
            -1,
            sdl.SDL_RendererFlags.SDL_RENDERER_ACCELERATED | sdl.SDL_RendererFlags.SDL_RENDERER_PRESENTVSYNC
        )
        if (this.renderer.isNull()) {
            throw new Error(sdl.SDL_GetError())
        }
    }
    initExt() {
        img.IMG_Init(3)
        if (ttf.TTF_Init() === -1) {
            console.log('Error:', ttf.TTF_GetError())
            process.exit(1)
        }
        if (mix.Mix_OpenAudio(44100, mix.MIX_DEFAULT_FORMAT, 2, 2048) < 0) {
            console.log("Mix_OpenAudio Error: " + mix.Mix_GetError())
            process.exit(1);
        }        
    }
    run() {
        // Event polling
        let e = new sdl.SDL_Event()
        // Calculate the amount of time that has passed since last tick.
        let currentTime = sdl.SDL_GetTicks()
        let oldTime = currentTime
        let deltaTime = 0;
        // Create the event loop.
        while (!this.quit) {
            // Calculate the delta time.
            oldTime = currentTime
            currentTime = sdl.SDL_GetTicks()
            deltaTime = (currentTime - oldTime) / 1000
            // Check for any incoming events.
            while (sdl.SDL_PollEvent(e.ref()) !== 0) {
                // Call the event handler.
                this.event(e)
                let isInput = e.type === Event.TEXTINPUT
                // log('*** event', isInput)
                if (isInput) {
                    continue
                    let text = e.text.text
                    log('text', typeof text, Object.keys(text))
                    let t = ref.readCString(text.buffer, 0)
                    log('text', typeof text)
                    log('----- input -----', text, t)
                }
            }
            // Update the game elements.
            this.update(deltaTime)
            this.clear()
            // Display the game on the screen.
            this.render()
        }
        // Event loop is complete, so close the game.
        this.destroy()
    }
    update(deltaTime) {
        this.scene.update(deltaTime)
    }
    draw() {
        this.scene.draw()
    }
    setPenColor(r, g, b, a) {
        if (sdl.SDL_SetRenderDrawColor(this.renderer, r, g, b, a) !== 0) {
            throw new Error(sdl.SDL_GetError())
        }
    }
    drawRect(x, y, w, h) {
        let rectToDraw = new sdl.SDL_Rect({ x, y, w, h })
        sdl.SDL_RenderFillRect(this.renderer, rectToDraw.ref())
    }
    replaceScene(scene) {
        this.scene = scene
    }
    runWithScene(scene) {
        this.replaceScene(scene)
        this.run()
    }
    event(e) {
        let mouseEvents = [
            Event.MOUSEBUTTONDOWN,
            Event.MOUSEBUTTONUP,
            Event.MOUSEMOTION,
        ]
        //
        let type = e.type
        if (type === Event.QUIT) {
            this.quit = true
        } else if (type === Event.KEYDOWN && e.key.keysym.scancode === Key.ESCAPE) {
            this.quit = true
        } else if (mouseEvents.includes(type)) {
            // log('mouseEvents', type)
            this.scene.mouseEvent(e)
        } else {
            this.scene.keyboardEvent(e)
        }
    }
    registerAction(key, callback) {
        this.actions[key] = callback
    }
    clear() {
        // Clear the renderer
        let color = this.scene.backgroundColor
        if (sdl.SDL_SetRenderDrawColor(this.renderer, ...color) !== 0) {
            throw new Error(sdl.SDL_GetError())
        }
        if (sdl.SDL_RenderClear(this.renderer) !== 0) {
            throw new Error(sdl.SDL_GetError())
        }
    }
    render() {
        this.draw()
        // Present it on the screen
        sdl.SDL_RenderPresent(this.renderer)
    }
    destroy() {
        // Kill the renderer.
        sdl.SDL_DestroyRenderer(this.renderer)
        // Close the window.
        sdl.SDL_DestroyWindow(this.window)
        // Close the application.
        sdl.SDL_Quit()
    }
}

module.exports = Window
