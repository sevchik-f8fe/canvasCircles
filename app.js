(() => {
    const config = {
        dotMinRadius: 6,
        dotMaxRadius: 20,
        massFactor: 0.002,
        defaultColor: `rgba(57, 149, 230, 0.9)`,
        smooth: 0.85,
        spherRadius: 300,
        mainDotRadius: 35,
        mouseSize: 120,
    }

    const TWO_PI = 2 * Math.PI;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    let w, h, mouse, dots;

    class Dot {
        constructor(mdr) {
            this.position = { x: mouse.x, y: mouse.y };
            this.velocity = { x: 0, y: 0 };
            this.radius = mdr || random(config.dotMinRadius, config.dotMaxRadius);
            this.mass = this.radius * config.massFactor;
            this.color = config.defaultColor;
        }

        draw(x, y) {
            this.position.x = x || this.position.x + this.velocity.x;
            this.position.y = y || this.position.y + this.velocity.y;

            createCircle(this.position.x, this.position.y, this.radius, true, this.color);
            createCircle(this.position.x, this.position.y, this.radius, false, config.defaultColor);
        }
    }

    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let accration = { x: 0, y: 0 };

            for (let j = 0; j < dots.length; j++) {
                if (i == j) continue;

                let [a, b] = [dots[i], dots[j]];

                let delta = {
                    x: b.position.x - a.position.x,
                    y: b.position.y - a.position.y
                };

                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (dist - config.spherRadius) / dist * b.mass;

                if (j == 0) {
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(57, 149, 230, ${alpha})`;
                    dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
                }

                accration.x += delta.x * force;
                accration.y += delta.y * force;
            }

            dots[i].velocity.x = dots[i].velocity.x * config.smooth + accration.x * dots[i].mass;
            dots[i].velocity.y = dots[i].velocity.y * config.smooth + accration.y * dots[i].mass;
        }

        dots.map((dot) => dot == dots[0] ? dot.draw(mouse.x, mouse.y) : dot.draw());
    }

    function createCircle(x, y, radius, fill, color) {
        ctx.fillStyle = ctx.strokeRect = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TWO_PI);
        ctx.closePath;
        fill ? ctx.fill() : ctx.stroke();
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        mouse = { x: w / 2, y: h / 2, down: false };
        dots = [];

        dots.push(new Dot(config.mainDotRadius));
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.down) {
            dots.push(new Dot());
        }

        updateDots();

        window.requestAnimationFrame(loop);
    }

    init();
    loop();

    function setPosition({ layerX, layerY }) {
        [mouse.x, mouse.y] = [layerX, layerY];
    }

    function isDown() {
        mouse.down = !mouse.down;
    }

    canvas.addEventListener('mousemove', setPosition);
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);

})();