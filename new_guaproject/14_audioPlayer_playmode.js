/*
本项目要给上一个项目做的 播放器 软件添加功能

项目放在和 5_dictionary.js 同目录下运行，并且需要在 resource/audio 目录下存放 .mp3 文件

增加的功能如下
1，顺序播放
2，随机播放
3，单曲循环

*/
const kuai = require('./kuai')
const log = kuai.log


class MainScene extends kuai.Scene {
    constructor(game) {
        super(game)
        this.game = game
        this.setup()
    }
    setup() {
        const self = this
        let audioPath = 'resource/audio/canon.mp3'
        self.audio = kuai.Audio.load(audioPath)
        self.currentTime = 0
        self.audioList = ['resource/audio/canon.mp3', 'resource/audio/Happy.mp3']
        //
        self.started = false

        let c0 = {
            position: [230, 0],
            // text: '开始',
            backgroundNormal: 'resource/image/CD.png',
            backgroundDown: 'resource/image/CD.jpg',
            callback: function() {
                log('开始')
                self.started = true
                self.audio.play(self.currentTime)
            },
        }
        self.imgButton = new kuai.Button(c0)
        self.add(self.imgButton)

        let c1 = {
            position: [360, 400],
            // text: '开始',
            backgroundNormal: 'resource/image/音乐播放.png',
            backgroundDown: 'resource/image/音乐播放.jpg',
            callback: function() {
                log('开始')
                self.started = true
                self.audio.play(self.currentTime)
            },
        }
        self.startButton = new kuai.Button(c1)
        self.add(self.startButton)

        let c2 = {
            position: [480, 400],
            // text: '暂停',
            backgroundNormal: 'resource/image/音乐暂停.png',
            backgroundDown: 'resource/image/音乐暂停.jpg',
            callback: function() {
                log('暂停', self.audio.duration)
                self.audio.pause()
                self.currentTime = self.audio.currentTime
            },
        }
        self.pauseButton = new kuai.Button(c2)
        self.add(self.pauseButton)

        self.playMode = 'order'
        let c3 = {
            position: [100, 400],
            // text: '顺序播放',
            backgroundNormal: 'resource/image/顺序播放.png',
            backgroundDown: 'resource/image/顺序播放.jpg',
            callback: function() {
                // 在这里切换播放模式
                self.playMode = 'order'
            },
        }
        self.order_modeButton = new kuai.Button(c3)
        self.add(self.order_modeButton)

        let c4 = {
            position: [230, 400],
            // text: '单曲循环',
            backgroundNormal: 'resource/image/单曲循环.png',
            backgroundDown: 'resource/image/单曲循环.jpg',
            callback: function() {
                // 在这里切换播放模式
                self.playMode = 'loop'
            },
        }
        self.loop_modeButton = new kuai.Button(c4)
        self.add(self.loop_modeButton)

        let c5 = {
            position: [600, 400],
            // text: '随机播放',
            backgroundNormal: 'resource/image/随机播放.png',
            backgroundDown: 'resource/image/随机播放.jpg',
            callback: function() {
                // 在这里切换播放模式
                self.playMode = 'shuffle'
            },
        }
        self.shuffle_modeButton = new kuai.Button(c5)
        self.add(self.shuffle_modeButton)

        // 引入进度条, 进度条的长度是定值
        self.slider = new kuai.Slider([160, 320])
        self.add(self.slider)
        //
        let clock = new kuai.Clock(function() {
            // 这里实现从音频到进度条的绑定
            let percent = self.audio.currentTime / self.audio.duration
            // log('percent:', percent)
            self.slider.percent = percent
            // 更改播放模式
            if (self.started) {
                if (!self.audio.isPlaying()) {
                    // 这里只写了顺序播放
                    self.switchMusic()
                }
            }
        }, 1000)
        self.add(clock)
        clock.run()
    }
    switchMusic() {
        // 切换播放模式
        const self = this
        if (self.playMode === 'order') {
            let src = self.audio.src
            let index = self.audioList.indexOf(src)
            if (index === self.audioList.length - 1) {
                // 说明是最后一个元素，此时去取第一个元素
                index = -1
            }
            let nextPath = self.audioList[index + 1]
            self.audio = kuai.Audio.load(nextPath)
            self.audio.play()
            self.slider.audio = self.audio
            log('顺序切歌成功', self.audio.src)
        } else if (self.playMode === 'loop') {
            // 处理单曲循环
            self.audio = kuai.Audio.load(self.audio.src)
            self.audio.play()
            self.slider.audio = self.audio
            log('单曲循环', self.audio.src)
        } else if (self.playMode === 'shuffle') {
            // 处理随机播放

            let shuffleNum = Math.ceil(Math.random() * (self.audioList.length - 1))
            log('随机数：', shuffleNum)
            let nextPath = self.audioList[shuffleNum]
            self.audio = kuai.Audio.load(nextPath)
            self.audio.play()
            self.slider.audio = self.audio
            log('随机切歌成功', self.audio.src)
        }
    }
}

const __main = function() {
    let title = 'Amber的音乐播放器哟~'
    // size 是窗口的宽高
    let size = [800, 600]
    let win = new kuai.Window(title, size)
    let scene = MainScene.new(win)
    win.runWithScene(scene)
}

__main()
