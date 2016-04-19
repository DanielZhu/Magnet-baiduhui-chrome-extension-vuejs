/* global chrome:false */

/**
 * Magnet Badge徽标动画
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var BadgeIconAnimate = function () {
    var self = this;
    this.size = {
        width: 19,
        height: 19
    };
    var animCostTime = 2500;
    var animPerRound = 50;
    var canvas = document.createElement('canvas');
    canvas.width = this.size.width;
    canvas.height = this.size.height;

    this.ctx = canvas.getContext('2d');

    // Shake config
    this.angleInDegrees = 0;
    this.limitAngel = 30;
    this.clockwise = true;
    this.shakeStep = 25;

    // Fly config
    this.directOpts = ['up', 'right', 'down', 'left'];
    this.flyStartXOpts = [0, -this.size.width, 0, this.size.width];
    this.flyStartYOpts = [this.size.height, 0, -this.size.height, 0];
    this.flyStartX = 0;
    this.flyStartY = 0;
    this.direct = 'up';
    this.flyStep = this.size.width * 7 / animCostTime * animPerRound;
    // 每50ms增加x px的距离，在1200ms内要完成38px

    this.image = document.createElement('img');
    this.image.onload = function () {
        self.ctx.drawImage(self.image, 0, 0, 19, 19);
    };
    this.image.src = './src/assets/images/icon29x29.png';

    // Need to be overide
    this.playIcon = function () {};

    // Entry
    this.startAnim = function (endFn) {
        var self = this;
        var shakeIconTimer = setInterval(function () {
            self.playIcon.call(self);
        }, animPerRound);

        setTimeout(function () {
            clearInterval(shakeIconTimer);
            chrome.browserAction.setIcon({path: self.image.src}, function () {});
            endFn.call(self);
        }, animCostTime);
    };
};

BadgeIconAnimate.prototype = {

    randomAnim: function () {
        var randomOpt = Math.random() < 0.25;
        if (randomOpt) {
            this.startShake();
        }
        else {
            var randomDirect = parseInt(Math.random() * 10 % 2.5, 10);
            this.startFlyIn(this.directOpts[randomDirect]);
        }
    },

    randomFlayIn: function () {
        var randomDirect = parseInt(Math.random() * 10 % 2.5, 10);
        this.startFlyIn(this.directOpts[randomDirect]);
    },

    startFlyIn: function (direct) {
        var self = this;
        var directIndex = self.directOpts.indexOf(direct);
        this.direct = direct;

        // @overide
        this.playIcon = function () {
            switch (self.direct) {
                case 'up':
                    if (self.flyStartY <= self.size.height && self.flyStartY >= -self.size.height) {
                        self.flyStartY += -self.flyStep;
                    }
                    else if (self.flyStartY < -self.size.height) {
                        self.flyStartY = self.flyStartYOpts[directIndex];
                    }
                    break;
                case 'right':
                    if (self.flyStartX <= self.size.width && self.flyStartX >= -self.size.width) {
                        self.flyStartX += self.flyStep;
                    }
                    else if (self.flyStartX > self.size.width) {
                        self.flyStartX = self.flyStartXOpts[directIndex];
                    }
                    break;
                case 'down':
                    if (self.flyStartY <= self.size.height && self.flyStartY >= -self.size.height) {
                        self.flyStartY += self.flyStep;
                    }
                    else if (self.flyStartY > self.size.height) {
                        self.flyStartY = self.flyStartYOpts[directIndex];
                    }
                    break;
                case 'left':
                    if (self.flyStartX <= self.size.width && self.flyStartX >= -self.size.width) {
                        self.flyStartX += -self.flyStep;
                    }
                    else if (self.flyStartX < -self.size.width) {
                        self.flyStartX = self.flyStartXOpts[directIndex];
                    }
                    break;
                default:
                    break;
            }

            drawTranslated(self.flyStartX, self.flyStartY);
            chrome.browserAction.setIcon({imageData: self.ctx.getImageData(0, 0, 19, 19)}, function () {});
        };

        this.startAnim(function () {
            self.direct = 'up';
        });

        function drawTranslated(posX, posY) {
            self.ctx.clearRect(0, 0, self.size.width, self.size.height);
            self.ctx.save();
            self.ctx.drawImage(self.image, posX, posY, 19, 19);
            self.ctx.restore();
        }
    },

    startShake: function () {
        var self = this;
        function drawRotated(degrees) {
            self.ctx.clearRect(0, 0, self.size.width, self.size.height);
            self.ctx.save();
            self.ctx.translate(self.size.width / 2, self.size.height / 2);
            self.ctx.rotate(degrees * Math.PI / 180);
            self.ctx.translate(-self.size.width / 2, -self.size.height / 2);
            self.ctx.drawImage(self.image, 0, 0, 19, 19);
            self.ctx.restore();
        }

        // @overide
        this.playIcon = function () {
            self.angleInDegrees += (self.clockwise ? self.shakeStep : -self.shakeStep);
            if (self.angleInDegrees > self.limitAngel) {
                self.clockwise = false;
            }

            if (self.angleInDegrees < -self.limitAngel) {
                self.clockwise = true;
            }

            drawRotated(self.angleInDegrees);
            chrome.browserAction.setIcon({imageData: self.ctx.getImageData(0, 0, 19, 19)}, function () {});
        };

        this.startAnim(function () {
            self.angleInDegrees = 0;
        });
    }
};
