const GuaObject = require('./gua_object')
const Event = require('./event')
const log = require('./utils').log


class Scene extends GuaObject {
    constructor(game) {
        super()
        this.eventEnabled = true
        this.backgroundColor = [255, 255, 255, 255]
        this.game = game
        this.elements = []
    }
    static new(...args) {
        return new this(...args)
    }
    mouseEvent(event) {
        let e = event
        let type = e.type
        for (let e of this.elements) {
            if (e.eventEnabled) {
                e.mouseEvent && e.mouseEvent(event)
            }
        }
        // log('mouse type', type)
    }
    keyboardEvent(event) {
        let e = event
        let type = e.type
        for (let e of this.elements) {
            if (e.eventEnabled) {
                e.keyboardEvent && e.keyboardEvent(event)
            }
        }
        // log('mouse type', type)
    }
    draw() {
        super.draw()
    }

    update() {

    }
}

module.exports = Scene
