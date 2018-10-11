const mix = require('../audio')

const log = require('./utils').log

class Audio {
    constructor(fileName) {
        this.setup(fileName)
    }
    static load(...args) {
        // 根据 fileName 返回 audio 对象
        return new this(...args)
    }
    setup(fileName) {
        this.src = fileName
        // 初始为 0
        this._currentTime = 0
        this.loadAudio()
    }
    loadAudio() {
        let src = this.src
        this.music = mix.Mix_LoadMUS('123')
        this.music = mix.Mix_LoadMUS(src)
    }
    play(offset=0) {
        const self = this
        let music = this.music
        if (offset === 0) {
            // 默认从 current time 开始播放
            offset = self._currentTime
        }
        mix.Mix_PlayMusic(music, 0)
        mix.Mix_SetMusicPosition(offset)
    }
    pause() {
        // 暂停播放（Mix_PauseMusic）
        mix.Mix_PauseMusic()
    }
    isPlaying() {
        // 返回是否播放（Mix_PlayingMusic）
        return mix.Mix_PlayingMusic() === 1
    }
    set currentTime(time) {
        this._currentTime = time
        mix.Mix_SetMusicPosition(this._currentTime)
        log('set', this._currentTime)
    }
    get currentTime() {
        const self = this
        return mix.Mix_GetMusicPosition(self.music)
    }
    get duration() {
        // 返回音频长度
        return mix.Mix_GetMusicTotalTime(this.music)
    }
    get volume() {
        // 返回音量（mix.Mix_VolumeMusic(-1)）
        return mix.Mix_VolumeMusic(-1)
    }
    set volume(newVolume) {
        // 设置音量（mix.Mix_VolumeMusic(volume)）
        mix.Mix_VolumeMusic(newVolume)
    }
}

module.exports = Audio