
window.addEventListener('DOMContentLoaded', (event) => {
    // let inputs = [0]
    let max
    let score = []
    let scoreplay = 0
    const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
    for (let t = 0; t < 10000000; t++) {
        squaretable[`${t}`] = Math.sqrt(t)
        if (t > 999) {
            t += 9
        }
    }
    let canvas
    let canvas_context
    let keysPressed = {}
    let FLEX_engine
    let TIP_engine = {}
    let XS_engine
    let YS_engine
    TIP_engine.x = 350
    TIP_engine.y = 350

    class Line {
        constructor(x, y, x2, y2, color, width) {
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        angle() {
            return Math.atan2(this.y1 - this.y2, this.x1 - this.x2)
        }
        squareDistance() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.x1, this.y1)
            canvas_context.lineTo(this.x2, this.y2)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        squareDistance() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        angle() {
            return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }

    class Rectangle {
        constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
            this.stroke = stroke
            this.strokeWidth = strokeWidth
            this.fill = fill
        }
        draw() {
            canvas_context.fillStyle = this.color
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        xdraw() {
            output_canvas_context.fillStyle = this.color
            output_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move() {
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            if (point.x + point.radius >= this.x) {
                if (point.y + point.radius >= this.y) {
                    if (point.x - point.radius <= this.x + this.width) {
                        if (point.y - point.radius <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = strokeWidth
            this.strokeColor = strokeColor
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            // if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
                canvas_context.fill()
                canvas_context.stroke();
            canvas_context.closePath();

            // } else {
            //     //console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            // }
        }
        xdraw() {
            output_canvas_context.lineWidth = this.strokeWidth
            output_canvas_context.strokeStyle = this.color
            output_canvas_context.beginPath();
            // if (this.radius > 0) {
                output_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                output_canvas_context.fillStyle = this.color
                output_canvas_context.fill()
                output_canvas_context.stroke();
                output_canvas_context.closePath();

            // } else {
            //     //console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            // }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.xmom *= this.friction
            this.ymom *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.xmom /= this.friction
            this.ymom /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    }
    class Shape {
        constructor(shapes) {
            this.shapes = shapes
        }
        draw() {
            for (let t = 0; t < this.shapes.length; t++) {
                this.shapes[t].draw()
            }
        }
        isPointInside(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].isPointInside(point)) {
                    return true
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return true
                }
            }
            return false
        }
        innerShape(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return this.shapes[t]
                }
            }
            return false
        }
        isInsideOf(box) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (box.isPointInside(this.shapes[t])) {
                    return true
                }
            }
            return false
        }
        adjustByFromDisplacement(x, y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].fromRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].fromRatio
                    this.shapes[t].y += y * this.shapes[t].fromRatio
                }
            }
        }
        adjustByToDisplacement(x, y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].toRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].toRatio
                    this.shapes[t].y += y * this.shapes[t].toRatio
                }
            }
        }
        mixIn(arr) {
            for (let t = 0; t < arr.length; t++) {
                for (let k = 0; k < arr[t].shapes.length; k++) {
                    this.shapes.push(arr[t].shapes[k])
                }
            }
        }
        push(object) {
            this.shapes.push(object)
        }
    }

    function setUp(canvas_pass, style = "#000000") {
        canvas = canvas_pass
        canvas_context = canvas.getContext('2d');
        canvas.style.background = style
        window.setInterval(function () {
            main()
        }, 1)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
            // example usage: if(object.isPointInside(TIP_engine)){ take action }
        });
        window.addEventListener('pointermove', continued_stimuli);

        window.addEventListener('pointerup', e => {
            // window.removeEventListener("pointermove", continued_stimuli);
        })
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
        }
    }
    function getRandomColor() { // random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    let setup_canvas = document.getElementById('canvas') //getting canvas from document
    let output_canvas = document.getElementById('output') //getting canvas from document

    output_canvas_context = output_canvas.getContext('2d');
    output_canvas.style.background = "#000000"

    setUp(setup_canvas) // setting up canvas refrences, starting timer. 

    // object instantiation and creation happens here 

    class Weight {
        constructor(from, to) {
            this.value = this.weight()
            this.from = from
            this.to = to
            this.change = 0
            this.delta = 1
        }
        valueOf() {
            return this.value
        }
        weight() {
            return (Math.random()-.5)/2
        }
        setChange(num) {
            this.change = num
        }
        setWeight(num) {
            this.value = num
        }
    }
    class Perceptron {
        constructor(inputs) {
            this.bias = (Math.random() - .5) / 40
            this.value = this.bias
            this.weights = []
            this.outputConnections = []
            this.inputs = inputs
            this.error = 0
            this.delta = 1
            for (let t = 0; t < this.inputs.length; t++) {
                this.weights.push(this.weight(this.inputs[t]))
            }
            this.z = -1
            this.change = 0
        }
        setError(error) {
            this.error = error
        }
        setDelta(delta) {
            this.delta = delta
            for(let t = 0;t<this.outputConnections.length;t++){
                this.outputConnections[t].delta = this.delta
            }
        }
        setBias(bias) {
            this.bias = bias
        }
        setChange(num) {
            this.change = num
        }
        weight(link) {
            let weight = new Weight(link, this)
            if (typeof link != "number") {
                link.outputConnections.push(weight)
            }
            return weight
        }
        valueOf() {
            return this.value
        }
        compute(inputs = this.inputs) {
            this.inputs = inputs
            this.value = this.bias
            for (let t = 0; t < inputs.length; t++) {
                if (t > this.weights.length - 1) {
                    this.weights.push(this.weight())
                    this.value += (inputs[t].valueOf() * this.weights[t].valueOf())
                } else {
                    this.value += (inputs[t].valueOf() * this.weights[t].valueOf())
                }
            }
            this.relu()
            return this.value
        }
        relu() {
            this.value = Math.min(Math.max(this.value, .01), .99)
        }
    }
    class Network {
        constructor(inputs, layerSetupArray) {
            this.momentum =.0005
            this.learningRate = .0005 //lr
            this.setup = layerSetupArray
            this.inputs = inputs
            this.structure = []
            this.outputs = []
            for (let t = 0; t < layerSetupArray.length; t++) {
                let scaffold = []
                for (let k = 0; k < layerSetupArray[t]; k++) {
                    let cept
                    if (t == 0) {
                        cept = new Perceptron(this.inputs)
                    } else {
                        cept = new Perceptron(this.structure[t - 1])
                    }
                    scaffold.push(cept)
                }
                this.structure.push(scaffold)
            }
            this.lastinputs = [...this.inputs]
            this.lastgoals = [...this.lastinputs]
            this.swap = []
        }

        becomeNetworkFrom(network) { //using a js file with one variable can be good for this
            // console.log(this.structure[0][0].bias)
            for (let t = 0; t < this.structure.length; t++) {
                // console.log("h1")
                for (let k = 0; k < this.structure[t].length; k++) {
                    // console.log("h2")
                    this.structure[t][k].bias = network.structure[t][k].bias
                    for (let w = 0; w < this.structure[t][k].weights.length; w++) {
                        // console.log("h3")
                        this.structure[t][k].weights[w].setWeight(network.structure[t][k][w].valueOf())
                    }
                }
            }
            // console.log(this.structure[0][0].bias)
        }
        log() {
            let json = {}
            json.structure = []
            json.setup = [...this.setup]
            for (let t = 0; t < this.structure.length; t++) {
                json.structure.push({})
                for (let k = 0; k < this.structure[t].length; k++) {
                    json.structure[t][k] = {}
                    json.structure[t][k].bias = this.structure[t][k].bias.valueOf()
                    for (let w = 0; w < this.structure[t][k].weights.length; w++) {
                        json.structure[t][k][w] = (this.structure[t][k].weights[w].valueOf())
                    }
                }
            }
            console.log(json)
        }
        calculateDeltasSigmoid(goals) {
            let sume = 0
            for (let t = this.structure.length - 1; t >= 0; t--) {
                const layer = this.structure[t]
                for (let k = 0; k < layer.length; k++) {
                    const perceptron = layer[k]
                    let output = perceptron.valueOf() 
                    let error = 0
                    if (t === this.structure.length - 1) {
                        error = goals[k] - output;
                        sume+=Math.abs(error)
                    } else {
                        for (let k = 0; k < perceptron.outputConnections.length; k++) {
                            const currentConnection = perceptron.outputConnections[k]
                            //console.log(currentConnection)
                            error += currentConnection.to.delta * currentConnection.valueOf()
                            sume+=Math.abs(error)
                        }
                    }
                    perceptron.setError(error)
                    perceptron.setDelta(error * output * (1 - output))
                }
            }
            console.log(sume)
        }
        adjustWeights() {
            for (let t = 0; t < this.structure.length; t++) {
                const layer = this.structure[t]
                for (let k = 0; k < layer.length; k++) {
                    const perceptron = layer[k]
                    let delta = perceptron.delta
                    for (let i = 0; i < perceptron.weights.length; i++) {
                        const connection = perceptron.weights[i]
                        // console.log(perceptron.inputs)
                        let change = connection.change
                        change = (this.learningRate * delta * perceptron.inputs[i].valueOf()) + (this.momentum * change);
                        connection.setChange(change)
                        connection.setWeight(connection.valueOf() + change)
                    }
                    perceptron.setBias(perceptron.bias + (this.learningRate * delta))
                }
            }
        }
        clone(nw) {
            let input = nw.inputs
            let perc = new Network(input, nw.setup)
            for (let t = 0; t < nw.structure.length; t++) {
                for (let k = 0; k < nw.structure[t].length; k++) {
                    perc.structure[t][k] = new Perceptron([0, 0, 0, 0, 0, 0, 0])
                    for (let f = 0; f < nw.structure[t][k].weights.length; f++) {
                        perc.structure[t][k].weights[f] = nw.structure[t][k].weights[f]
                        perc.structure[t][k].bias = nw.structure[t][k].bias
                    }
                }
            }
            return perc
        }
        compute(inputs = this.inputs) {
            this.inputs = [...inputs]
            for (let t = 0; t < this.structure.length; t++) {
                for (let k = 0; k < this.structure[t].length; k++) {
                    if (t == 0) {
                        this.structure[t][k].compute(this.inputs)
                    } else {
                        this.structure[t][k].compute(this.structure[t - 1])
                    }
                }
            }
            this.outputs = []
            this.dataoutputs = []
            for (let t = 0; t < this.structure[this.structure.length - 1].length; t++) {
                this.outputs.push(this.structure[this.structure.length - 1][t].valueOf())
                this.dataoutputs.push(new Data(this.structure[this.structure.length - 1][t].valueOf()))
            }
        }
    }
    class Data {
        constructor(input = -100) {
            this.delta = 0
            this.outputConnections = []
            if (input == -100) {
                this.value = this.weight()
            } else {
                this.value = input
            }
        }
        valueOf() {
            return this.value
        }
        weight() {
            return Math.random() - .5
        }
    }
    TIP_engine.x = 350
    TIP_engine.y = 350
    let inp = []
    for(let t =0;t<512;t++){
        inp.push(new Data(Math.random()))
    }
    let perc = new Network(inp, [128,64, 600])
    perc.becomeNetworkFrom(tonenet)

    perc.compute(inp)
//10000000
    // for (let t = 0; t < 1000000; t++) {
    //     let r1 = Math.random()
    //     let r2 = Math.random()
    //     let inputs = [new Data(r1), new Data(r2)]
    //     let goals = [new Data(r1), new Data(r2)]
    //     perc.compute(inputs)
    //     let circle = new Circle(perc.outputs[0] * 700, perc.outputs[1] * 700, 3, "red")
    //     circle.draw()
    //     perc.calculateDeltasSigmoid(goals)
    //     perc.adjustWeights()
    // }


    class Viewer{
        constructor(net){
            this.net = net
        }
        draw(){
            let layers = this.net.structure.length+1
            this.circles = []
            this.lines = []
            let step =  canvas.height/(layers+2)
            for(let t = -1;t<this.net.structure.length;t++){
                let circlayer = []
                if(t==-1){
                    let chunk = canvas.width/(this.net.inputs.length+1)
                    for(let k = 0;k<this.net.inputs.length;k++){
                        let tint = Math.max((this.net.inputs[k]),0)
                        let circ = new Circle(chunk*(k+1), step*(t+2),10, `rgba(255,255,255,${tint})` )
                        circlayer.push(circ)
                    }
                }else{
                    let chunk = canvas.width/(this.net.structure[t].length+1)
                    for(let k = 0;k<this.net.structure[t].length;k++){
                        let circ = new Circle(chunk*(k+1), step*(t+2),10, `rgba(255,255,255,${this.net.structure[t][k].valueOf()})` )
                        for(let g = 0;g<this.net.structure[t][k].weights.length;g++){
                            //console.log(this.circles, this.net.structure[t][k].weights, g)
                            let link = new LineOP(circ, this.circles[t][g], "white", 3*Math.abs(this.net.structure[t][k].weights[g].valueOf()))
                            link.width = 1*Math.abs(this.net.structure[t][k].weights[g].valueOf())
                            if(this.net.structure[t][k].weights[g].valueOf() < 0){
                                link.color = "red"
                            }else{
                                link.color = "#00ff00"
                            }
                            this.lines.push(link)
                        }
                        circlayer.push(circ)
                    }
                }
                this.circles.push(circlayer)
            }


            for(let t = 0;t<this.lines.length;t++){
                this.lines[t].draw()
            }
            for(let t = 0;t<this.circles.length;t++){
                for(let k = 0;k<this.circles[t].length;k++){
                this.circles[t][k].draw()
            }
        }
        }
    }














    function audioBufferToWav(aBuffer) {
        let numOfChan = aBuffer.numberOfChannels,
            btwLength = aBuffer.length * numOfChan * 2 + 44,
            btwArrBuff = new ArrayBuffer(btwLength),
            btwView = new DataView(btwArrBuff),
            btwChnls = [],
            btwIndex,
            btwSample,
            btwOffset = 0,
            btwPos = 0;
        setUint32(0x46464952); // "RIFF"
        setUint32(btwLength - 8); // file length - 8
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt " chunk
        setUint32(16); // length = 16
        setUint16(1); // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(aBuffer.sampleRate);
        setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data" - chunk
        setUint32(btwLength - btwPos - 4); // chunk length

        for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
            btwChnls.push(aBuffer.getChannelData(btwIndex));

        while (btwPos < btwLength) {
            for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
                // interleave btwChnls
                btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
                btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
                btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
                btwPos += 2;
            }
            btwOffset++; // next source sample
        }

        let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
        let wavSamples = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);

        wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

        function setUint16(data) {
            btwView.setUint16(btwPos, data, true);
            btwPos += 2;
        }

        function setUint32(data) {
            btwView.setUint32(btwPos, data, true);
            btwPos += 4;
        }
    }

    function wavToMp3(channels, sampleRate, samples) {
        var buffer = [];
        var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        var remaining = samples.length;
        var samplesPerFrame = 1152;
        for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
            var mono = samples.subarray(i, i + samplesPerFrame);
            var mp3buf = mp3enc.encodeBuffer(mono);
            if (mp3buf.length > 0) {
                buffer.push(new Int8Array(mp3buf));
            }
            remaining -= samplesPerFrame;
        }
        var d = mp3enc.flush();
        if (d.length > 0) {
            buffer.push(new Int8Array(d));
        }

        var mp3Blob = new Blob(buffer, { type: 'audio/mp3' });
        var bUrl = window.URL.createObjectURL(mp3Blob);

        // send the download link to the console
        console.log('mp3 download:', bUrl);

    }

























    let source = {}
    source.state = 'dummy'

    let soundangles = [0, 0, 0, 0, 0, 0]

    let go = document.getElementById('go')
    go.onclick = gooo
    var myArrayBuffer
    let gone = 0
    function gooo() {
        gone = 1

        function audioBufferToWav(aBuffer) {
            let numOfChan = aBuffer.numberOfChannels,
                btwLength = aBuffer.length * numOfChan * 2 + 44,
                btwArrBuff = new ArrayBuffer(btwLength),
                btwView = new DataView(btwArrBuff),
                btwChnls = [],
                btwIndex,
                btwSample,
                btwOffset = 0,
                btwPos = 0;
            setUint32(0x46464952); // "RIFF"
            setUint32(btwLength - 8); // file length - 8
            setUint32(0x45564157); // "WAVE"
            setUint32(0x20746d66); // "fmt " chunk
            setUint32(16); // length = 16
            setUint16(1); // PCM (uncompressed)
            setUint16(numOfChan);
            setUint32(aBuffer.sampleRate);
            setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
            setUint16(numOfChan * 2); // block-align
            setUint16(16); // 16-bit
            setUint32(0x61746164); // "data" - chunk
            setUint32(btwLength - btwPos - 4); // chunk length

            for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
                btwChnls.push(aBuffer.getChannelData(btwIndex));

            while (btwPos < btwLength) {
                for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
                    // interleave btwChnls
                    btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
                    btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
                    btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
                    btwPos += 2;
                }
                btwOffset++; // next source sample
            }

            let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
            let wavSamples = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);

            wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

            function setUint16(data) {
                btwView.setUint16(btwPos, data, true);
                btwPos += 2;
            }

            function setUint32(data) {
                btwView.setUint32(btwPos, data, true);
                btwPos += 4;
            }
        }

        function wavToMp3(channels, sampleRate, samples) {
            var buffer = [];
            var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 1024);
            var remaining = samples.length;
            var samplesPerFrame = 512;
            for (var i = 0; remaining >= samplesPerFrame; i += (samplesPerFrame*1)) {
                var mono = samples.subarray(i, i +( samplesPerFrame*1));
                var mp3buf = mp3enc.encodeBuffer(mono);
                if (mp3buf.length > 0) {
                    buffer.push(new Int8Array(mp3buf));
                }
                remaining -= samplesPerFrame;
            }
            var d = mp3enc.flush();
            if (d.length > 0) {
                buffer.push(new Int8Array(d));
            }

            var mp3Blob = new Blob(buffer, { type: 'audio/mp3' });
            var bUrl = window.URL.createObjectURL(mp3Blob);

            // send the download link to the console
            console.log('mp3 download:', bUrl);
        }

        // var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // // Create an empty three-second stereo buffer at the sample rate of the AudioContext
        // myArrayBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate*1, 5000);

        // source = audioCtx.createBufferSource();
        // source.state = 'playing'
        // source.buffer = myArrayBuffer;
        // console.log(source)
        // // connect the AudioBufferSourceNode to the
        // // destination so we can hear the sound
        // // source.connect(audioCtx.destination);

        // // start the source playing
        // source.start();

            audioBufferToWav(source)
    }
    window.setInterval(function () {
        main()
        if (!source.state !== 'playing') {
            // gooo()
        }
        for (let t = 0; t < soundangles.length; t++) {
            soundangles[t] += (t + 3) / 16
        }

        if (gone == 1) {
            // let inp = []
            // if(Math.random()<.01){
            // for(let t = 88;t<600;t++){
            //     inp[t-88] =perc.outputs[t]
            // }
            // }else{
            //     for(let t = 0;t<512;t++){
            //         inp[t] =  perc.outputs[t] //+Math.random()
            //     }
            // }
            // perc.compute(inp)
            // for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
            //     // var nowBuffering = myArrayBuffer.getChannelData(channel);
            //     for (var i = 0; i < myArrayBuffer.length; i++) {
            //         // nowBuffering[i] = Math.max(0,Math.min(1,((inp[i%512]))))  //Math.cos(ctr.anglesto)
                   
            //     }
            // }
        }


    }, 11)
    function main() {

        canvas_context.clearRect(0, 0, canvas.width, canvas.height)
        output_canvas_context.clearRect(0, 0, canvas.width, canvas.height)
        // let inputs = [new Data(TIP_engine.x / 700), new Data(TIP_engine.y / 700)]
        // let goals =[new Data(TIP_engine.x / 700), new Data(TIP_engine.y / 700)]
        // perc.compute(inputs)
        // perc.calculateDeltasSigmoid(goals)
        // perc.adjustWeights()
        // let circle = new Circle(perc.outputs[0] * 700, perc.outputs[1] * 700, 3, "white")
        // circle.draw()

        // let inp = []
        // if(Math.random()<.5){
        // for(let t = 88;t<600;t++){
        //     inp[t-88] = perc.outputs[t-88]
        // }
        // }else{
        //     for(let t = 0;t<512;t++){
        //         inp[t] = perc.outputs[t]
        //     }
        // // }
        // perc.compute(inp)
        if(keysPressed['h']){
            let vi = new Viewer(perc)
            vi.draw()
            // console.log(vi)
            // for(let t = 0;t<perc.structure.length;t++){
            //     for(let k = 0;t<perc.structure[k].length;k++){
            //         // delete perc.structure[t][k].outputConnections
            //     }
            // }
        }

        let inp = []
        if(Math.random()<.01){
        for(let t = 88;t<600;t++){
            inp[t-88] =perc.outputs[t]
        }
        }else{
            for(let t = 0;t<512;t++){
                inp[t] =  perc.outputs[t] //+Math.random()
            }
        }
        // perc.compute(inp)
        for(let t = 0; t<perc.outputs.length; t++){
            // spops[t].move()
            // spops[t].height =  Math.max(perc.outputs[t]*80, 1)
            // spops[t].x = t*2
            // spops[t].y = 100-(spops[t].height*.5)

            // var r = ((spops[t].height/30)*400) + (10 * (t/512));
            // var g = 255 * (t/512);
            // var b = 70;

            // if(t<512){
            //     spops[t].color = "rgb(" + r + "," + g + "," + b + ")";
            // }else{

            // spops[t].color = "rgb(" + b + "," + r + "," + g + ")";
            // }
            // spops[t].draw()
            // spops[t].move()
            // spops[t].height =  Math.max(perc.inputs[t]*80, 1)
        //     spops[t].x = t*2
        //     spops[t].y = 100-(spops[t].height*.5)

        //      r = ((spops[t].height/30)*400) + (10 * (t/512));
        //      g = 255 * (t/512);
        //      b = 70;

        //     if(t<512){
        //         spops[t].color = "rgb(" + r + "," + g + "," + b + ")";
        //     }else{

        //     spops[t].color = "rgb(" + b + "," + r + "," + g + ")";
        //     }
        //     // spops[t].xdraw()
        }
        if(keysPressed['p']){
            perc.log()
        }
    }

    let spops = []

      for(let t = 0; t< 600; t++){
            
        circ = new Rectangle(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2, getRandomColor(), Math.random()-.5, Math.random()-.5)  // starts with ramndom velocities and color
        spops.push(circ)
    
    }
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    
    file.onchange = function() {

        let inputs = []
        for(let t = 0;t<512;t++){
            inputs.push(.5)
        }

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create an empty three-second stereo buffer at the sample rate of the AudioContext
        myArrayBuffer = audioCtx.createBuffer(1, 100000, 5000);
        myArrayBuffer2 = audioCtx.createBuffer(1, 100000, 5000);

        source = audioCtx.createBufferSource();
        source.state = 'playing'
        source.buffer = myArrayBuffer;
        // console.log(source)
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        // source.connect(audioCtx.destination);

        // start the source playing




      var files = this.files;
      audio.src = URL.createObjectURL(files[0]);
    //   audio.load();
    //   audio.play();
      var context = new AudioContext();
      var src = context.createMediaElementSource(audio);
      src.state = 'playing'
      src.buffer = myArrayBuffer2;
      var analyser = audioCtx.createAnalyser();
      var analyser2 = context.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser2.minDecibels = -90;
      analyser2.maxDecibels = -10;
      var canvas = document.getElementById("canvas");
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
      var canvas_context = canvas.getContext("2d");
    
      src.connect(analyser2);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser2.connect(context.destination)
      analyser.fftSize = 1024; //check these again
      analyser2.fftSize = 1024;
    
      var bufferLength = analyser2.frequencyBinCount;
      var bufferLength2 = analyser.frequencyBinCount;
    
      for(let t = 0; t< 600; t++){
            
        circ = new Rectangle(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2, getRandomColor(), Math.random()-.5, Math.random()-.5)  // starts with ramndom velocities and color
        spops.push(circ)
    
    }
    //   console.log(bufferLength);
    
    var dataArray2 = new Uint8Array(bufferLength);
    var dataArray = new Uint8Array(bufferLength2);

    //   for(let t = 0;t<512;t++){
    //     dataArray[t] = perc.outputs[t]
    //   }
    //   console.log(dataArray)
    
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
    
      var barWidth = (WIDTH / bufferLength) * 1;
      var barHeight;
      var x = 0;
    
      function renderFrame() {
    
        // canvas_context.fillStyle = "#000";
        // canvas_context.fillRect(0, 0, WIDTH, HEIGHT);
    
        requestAnimationFrame(renderFrame);
        // console.log(perc.inputs)
        for(let t = 0; t<512; t++){
            // spops[t].move()
            spops[t].height = Math.max(perc.inputs[t]*80, 1)
            spops[t].x = t*2
            spops[t].y = 400-(spops[t].height*.5)
            spops[t].draw()
        }

        for(let t = 0; t<perc.outputs.length; t++){
            // spops[t].move()
            spops[t].height =  Math.max(perc.outputs[t]*80, 1)
            spops[t].x = t*2
            spops[t].y = 100-(spops[t].height*.5)

            var r = ((spops[t].height/30)*max) + (10 * (t/512));
            var g = 255 * (t/512);
            var b = 70;

            if(t<511){
                spops[t].color = "rgb(" + r + "," + g + "," + b + ")";
            }else{

            spops[t].color = "rgb(" + b + "," + r + "," + g + ")";
            }
            spops[t].xdraw()
        }

        // for(let t = 0; t<spops.length; t++){
        //     if(spops[t].a < 0.01){
        //         spops.splice(t,1)
        //     }
        //     }
        
            // for(let t = 0; t<spops.length; t++){
            //     for(let f = 0; f<spops.length; f++){
            //         if(spops[t].doesPerimeterTouch(spops[f])){
            //             if(spops[t].boom == 1){
            //                 spops[f].b = 0
            //                 spops[f].g = 0
            //                 spops[f].color = `rgba(${ spops[f].r}, ${ spops[f].g}, ${ spops[f].b}, ${ spops[f].a})`
            //                 spops[f].detonate()
            //             }
            //         }
            //     }
            // }
        x = 0;
    
        analyser2.getByteFrequencyData(dataArray);

        let min = 99999999999
         max = 0.001
        let goals = []
        for (var i = 0; i < bufferLength2; i++) {
            let m = dataArray[i]*2
            if(m<min){
                min=m
            }
            if(m>max){
                max=m
            }
            goals.push(new Data(m))
        }
        // console.log(max)
        let k0 = 1/max
        for(let t = 0;t<goals.length;t++){
            goals[t]*=k0
        }


         inputs = [...goals]
        //  console.log(inputs)
        perc.compute(inputs)
        for(let t = 511;t<perc.outputs.length;t++){
            goals[t] = (perc.outputs[t])
        }

        // perc.calculateDeltasSigmoid(goals)
        // perc.adjustWeights()
    
                for(let t = 0;t<512;t++){
                    score.push(perc.outputs[t].valueOf()) //+Math.random()
                }
        for (var i = 0; i < bufferLength2; i++) {
        //   dataArray[i] = perc.outputs[i]
          barHeight = (dataArray[i]*2)//*(Math.sqrt(i)/3);
        
          var r = barHeight + (10 * (i/bufferLength2));
          var g = 255 * (i/bufferLength2)
          var b = 70;
          spops[i].height = (barHeight/30)+1
          spops[i].color ="rgb(" + r + "," + g + "," + b + ")";
          canvas_context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        //   canvas_context.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    
          x += barWidth + 1;
        }
        // spops.sort((a, b) => (a.body.radius > b.body.radius) ? -1: 1 )

        if(keysPressed[' ']){
            if(scoreplay == 0){
                for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
                    var nowBuffering = myArrayBuffer.getChannelData(channel);
                    for (var i = 0; i < myArrayBuffer.length; i++) {
                        nowBuffering[i] = score[i%(score.length-1)]  //Math.cos(ctr.anglesto)
                    }
                }
            }
            audioBufferToWav(myArrayBuffer)
            scoreplay = 1
        }
      }
      
    
    //   audio.play();

            let inp = []
            // if(Math.random()<.01){
            // for(let t = 88;t<600;t++){
            //     inp[t-88] = new Data(.5) //perc.outputs[t]
            // }
            // }else{
            // }
            // perc.compute(inp)


    source.start();
    // gooo()
      renderFrame();
    };
})
