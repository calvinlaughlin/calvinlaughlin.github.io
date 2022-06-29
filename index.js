const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1785
canvas.height = 897

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

window.addEventListener('load', function () {
    const image = new Image()
    image.src = './images/background4.jpg'

    const foreground = new Image()
    foreground.src = './images/foreground.png'

    const mainPlayerImageRight = new Image()
    mainPlayerImageRight.src = './images/main-character-right.png'

    const mainPlayerImageLeft = new Image()
    mainPlayerImageLeft.src = './images/main-character-left.png'

    const playerImageRight = new Image()
    playerImageRight.src = './images/character-right.png'

    const playerImageLeft = new Image()
    playerImageLeft.src = './images/character-left.png'

    const playerImageLeft2 = new Image()
    playerImageLeft2.src = './images/character-left2.png'

    const playerImageRight2 = new Image()
    playerImageRight2.src = './images/character-right2.png'

    const trainHead = new Image()
    trainHead.src = './images/locomotive2.png'

    const purpleShirtLeft = new Image()
    purpleShirtLeft.src = './images/clothing/purple-left.png'

    const purpleShirtRight = new Image()
    purpleShirtRight.src = './images/clothing/purple-right.png'

    const greenShirtLeft = new Image()
    greenShirtLeft.src = './images/clothing/green-left.png'

    const greenShirtRight = new Image()
    greenShirtRight.src = './images/clothing/green-right.png'

    const sunglassesRight = new Image()
    sunglassesRight.src = './images/clothing/sunglasses-right.png'

    const sunglassesLeft = new Image()
    sunglassesLeft.src = './images/clothing/sunglasses-left.png'

    const eyeglassesRight = new Image()
    eyeglassesRight.src = './images/clothing/eyeglasses-right.png'

    const eyeglassesLeft = new Image()
    eyeglassesLeft.src = './images/clothing/eyeglasses-left.png'


    // Numbers for sign
    const zero = new Image()
    zero.src = './numbers/number0.png'

    const one = new Image()
    one.src = './numbers/number1.png'

    const two = new Image()
    two.src = './numbers/number2.png'

    const three = new Image()
    three.src = './numbers/number3.png'

    const four = new Image()
    four.src = './numbers/number4.png'

    const five = new Image()
    five.src = './numbers/number5.png'

    const six = new Image()
    six.src = './numbers/number6.png'

    const seven = new Image()
    seven.src = './numbers/number7.png'

    const eight = new Image()
    eight.src = './numbers/number8.png'

    const nine = new Image()
    nine.src = './numbers/number9.png'

    const playerWidth = 81

    let time = 0

    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }

    function shirtDirection(color, direction) {
        if (color == 'green') {
            if (direction == 'left') return greenShirtLeft
            else return greenShirtRight
        } else if (color == 'purple') {
            if (direction == 'left') return purpleShirtLeft
            else return purpleShirtRight
        }
    }

    function glassesDirection(type, direction) {
        if (type == 'sun') {
            if (direction == 'left') return sunglassesLeft
            else return sunglassesRight
        } else if (type == 'eye') {
            if (direction == 'left') return eyeglassesLeft
            else return eyeglassesRight
        }
    }

    function playerDirection(type, direction) {
        if (type == 'c') {
            if (direction == 'left') return playerImageLeft
            else return playerImageRight
        } else if (type == 'b') {
            if (direction == 'left') return playerImageLeft2
            else return playerImageRight2
        } 
    }

    class Number {
        constructor(number, image) {
            this.number = number
            this.image = image
        }

        draw(x, y) {
            c.drawImage(this.image, x, y)
        }
    }

    var nums = new Array()

    const Zero = new Number(0, zero)
    nums.push(Zero)
    const One = new Number(1, one)
    nums.push(One)
    const Two = new Number(2, two)
    nums.push(Two)
    const Three = new Number(3, three)
    nums.push(Three)
    const Four = new Number(4, four)
    nums.push(Four)
    const Five = new Number(5, five)
    nums.push(Five)
    const Six = new Number(6, six)
    nums.push(Six)
    const Seven = new Number(7, seven)
    nums.push(Seven)
    const Eight = new Number(8, eight)
    nums.push(Eight)
    const Nine = new Number(9, nine)
    nums.push(Nine)

    class Sprite {
        constructor({ position, velocity, image, frames, trainArrived }) {
            this.position = position
            this.image = image
            this.frames = frames
            this.val = 0
            this.elapsed = 0
            this.moving = false
            this.trainArrived = false
            this.departing = false
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y)
        }

        drawAnimated() {
            c.drawImage(
                this.image,
                this.val * playerWidth,
                0,
                this.image.width / this.frames,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames,
                this.image.height
            )

            if (!this.moving) return

            this.elapsed++
            if (this.elapsed % 10 == 0) {
                if (this.val < this.frames - 1) this.val++
                else this.val = 0
            }
        }

        trainArrival() {
            this.draw()
            var pos = this.position.x
            if (pos < 0) {
                this.position.x += 4
            } else if (pos < canvas.width / 5) {
                this.position.x += 4
            } else if (pos < canvas.width / 3) {
                this.position.x += 3
            } else {
                this.trainArrived = true
            }
        }

        trainDeparture() {
            this.draw()
            var pos = this.position.x
            if (pos < canvas.width - 500) {
                this.position.x += 2
            } else if (pos < canvas.width - 300) {
                this.position.x += 3
            } else if (pos < canvas.width) {
                this.position.x += 4
            } else {
                time = 0
                this.trainArrived = false
                this.departing = false
                this.position.x = -3000
            }
        }
    }

    class NPC {
        constructor({ position, image, frames, arrived, shirtImage, color, glassesImage, glassesType, direction, playerType }) {
            this.position = position
            this.image = image
            this.frames = frames
            this.val = 0
            this.elapsed = 0
            this.moving = false
            this.arrived = false
            this.randomDestination = getRandomInt(canvas.width)
            this.shirtImage = shirtImage
            this.color = color
            this.glassesImage = sunglassesLeft
            this.glassesType = glassesType
            this.direction = direction
            this.playerType = playerType
        }

        drawAnimated() {
            c.drawImage(
                playerDirection(this.playerType, this.direction),
                this.val * playerWidth,
                0,
                this.image.width / this.frames,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames,
                this.image.height
            )

            if (this.color != 'red') {
                c.drawImage(
                    this.shirtImage,
                    this.val * playerWidth,
                    0,
                    this.image.width / this.frames,
                    this.image.height,
                    this.position.x,
                    this.position.y,
                    this.image.width / this.frames,
                    this.image.height
                )
            }

            if (this.glassesType != 'none') {
                c.drawImage(
                    glassesDirection(this.glassesType, this.direction),
                    this.val * playerWidth,
                    0,
                    this.image.width / this.frames,
                    this.image.height,
                    this.position.x,
                    this.position.y,
                    this.image.width / this.frames,
                    this.image.height
                )
            }


            if (!this.moving) return

            this.elapsed++
            if (this.elapsed % 10 == 0) {
                if (this.val < this.frames - 1) this.val++
                else this.val = 0
            }
        }
    }


    const background = new Sprite(
        {position: {
            x: 0, 
            y: 0
        },
        image: image
    })

    const fg = new Sprite(
        {position: {
            x: 0,
            y: 0
        },
        image: foreground
    })

    const player = new Sprite(
        {position: {
            x: canvas.width / 2,
            y: 708
        },
        image: mainPlayerImageRight,
        frames: 2
    })

    const trainFront = new Sprite(
        {position: {
            x: -3000,
            y: 575
        },
        image: trainHead,
    })


    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        }
    }

    function trainClock(time) {
        let x = 710
        let y = 656

        realTime = time * 0.01

        let tens = Math.floor(realTime / 10)
        let ones = Math.floor(realTime % 10)

        nums.forEach(function(num) {
            if (num.number == tens) {
                num.draw(x, y)
            }
            if (num.number == ones) {
                num.draw(x + 27, y)
            }
            if (realTime < 0) {
                Zero.draw(x, y)
                Zero.draw(x + 27, y)
            }
        })
    }

    var npcs = new Array()
    let trainTime = getRandomInt(2000) + 1000

    function animate() {
        var startTime = performance.now()

        window.requestAnimationFrame(animate)
        background.draw()

        trainClock(trainTime - time + 1000)

        player.moving = false
        if((keys.a.pressed && lastKey == 'a') || 
        (keys.ArrowLeft.pressed && lastKey == 'ArrowLeft')) {
            player.moving = true
            if (player.position.x > 0) {
                player.position.x -= 3
            }
            player.image = mainPlayerImageLeft
        }
        if((keys.d.pressed && lastKey == 'd') ||
        (keys.ArrowRight.pressed && lastKey == 'ArrowRight')) {
            player.moving = true
            if (player.position.x < (canvas.width - playerWidth)) {
                player.position.x += 3
            }
            player.image = mainPlayerImageRight
        }


        // Spawn NPC (1 / 200 chance) 
        // Only occurs when train not present
        if (getRandomInt(200) == 1 && !trainFront.trainArrived) {
            let shirtColor = 'red'
            let shirtImageChoice = 'none'

            let chosenGlasses = 'none'
            let chosenGlassesType = 'none'
            // Generate side
            if (getRandomInt(2) == 1) {
                var pos = -100
            } else {
                var pos = canvas.width + 100
            }

            // Generate shirt
            if (getRandomInt(2) == 1) {
                shirtImageChoice = greenShirtRight
                shirtColor = 'green'
            }
            else if (getRandomInt(2) == 1) {
                shirtImageChoice = purpleShirtRight
                shirtColor = 'purple'
            }

            // Generate glasses
            if (getRandomInt(10) == 1) {
                chosenGlassesType = 'sun'
            }
            else if (getRandomInt(10) == 1) {
                chosenGlassesType = 'eye'
            }

            // Generate player
            let player = 'c'
            if (getRandomInt(2) == 1) {
                player = 'b'
            }

            const nonplayer = new NPC(
            {position: {
                x: pos,
                y: 708
            },
            playerType: player,
            frames: 2,
            shirtImage: shirtImageChoice,
            color: shirtColor,
            glassesType: chosenGlassesType,
            direction: 'right'
            })

            npcs.push(nonplayer)
        }

        npcs.forEach(function(nonplayer) {
            if ((nonplayer.randomDestination - nonplayer.position.x > 10) && !trainFront.trainArrived) {
                nonplayer.direction = 'right'
                nonplayer.image = playerImageRight
                nonplayer.shirtImage = shirtDirection(nonplayer.color, 'right')
                glasses = glassesDirection(nonplayer.glassType, 'right')
                nonplayer.moving = true
                nonplayer.position.x += 2
            } else if ((nonplayer.randomDestination - nonplayer.position.x < 0) && !trainFront.trainArrived) {
                nonplayer.direction = 'left'
                nonplayer.image = playerImageLeft
                nonplayer.shirtImage = shirtDirection(nonplayer.color, 'left')
                nonplayer.moving = true
                nonplayer.position.x -= 2
            } else if (!trainFront.trainArrived) {
                nonplayer.moving = false
                nonplayer.arrived = true
            }

            nonplayer.drawAnimated()

        })

        npcs.forEach(function(nonplayer) {
            if (nonplayer.arrived &&  getRandomInt(500) == 1 && !trainFront.trainArrived) {
                nonplayer.arrived = false
                nonplayer.randomDestination = getRandomInt(canvas.width)
            }
        })

        player.drawAnimated()

        // Train arrival
        if (time > 600 + trainTime && !trainFront.departing) {
            trainFront.trainArrival()
        }

        // Board passenders (shirt and glasses functionality?)
        if (trainFront.trainArrived) {
            npcs.forEach(function(nonplayer) {
                const trainCenter = trainFront.position.x + (trainFront.image.width / 4)
                if (trainCenter - nonplayer.position.x > 10) {
                    nonplayer.direction = 'right'
                    nonplayer.moving = true
                    nonplayer.image = playerImageRight
                    nonplayer.shirtImage = shirtDirection(nonplayer.color, 'right')
                    nonplayer.position.x += 2
                } else if (trainCenter - nonplayer.position.x < 0) {
                    nonplayer.direction = 'left'
                    nonplayer.moving = true
                    nonplayer.image = playerImageLeft
                    nonplayer.shirtImage = shirtDirection(nonplayer.color, 'left')
                    nonplayer.position.x -= 2
                } else {
                    const index = npcs.indexOf(nonplayer)
                    if (index > -1) {
                        npcs.splice(index, 1)
                    }
                }
            })
        }

        if (npcs.length == 0 && trainFront.trainArrived) {
            trainFront.departing = true
            trainFront.trainDeparture()
            trainTime = getRandomInt(2000)
        }

        time++

        var endTime = performance.now()

        fg.draw()

    }
    animate()

    let lastKey = ''
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'a': // and arrow left
                keys.a.pressed = true
                lastKey = 'a'
                break
            case 'd':
                keys.d.pressed = true
                lastKey = 'd'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                lastKey = 'ArrowLeft'
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                lastKey = 'ArrowRight'
                break
        }
    })

    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'a': // and arrow left
                keys.a.pressed = false
                break
            case 'd':
                keys.d.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
        }
    })

})