class Level extends Phaser.Scene {
    constructor(key) {
      super(key);
      this.levelKey = key
      this.nextLevel = {
        
        'Level1': 'Level2',
        'Level2': 'Level3',
        'Level3': 'Level4',
        'Level4': 'GameEnd'
         
      }
    }

    preload() {
      this.load.spritesheet('playerRun', 'assets/ninjaFrog/run32x32.png', {frameHeight: 32, frameWidth: 32});
      this.load.spritesheet('playerJump', 'assets/ninjaFrog/jump32x32.png', {frameHeight:32, frameWidth: 32});
      this.load.spritesheet('playerIdle', 'assets/ninjaFrog/idle.png', {frameHeight:32, frameWidth: 32});
      this.load.spritesheet('playerHit', 'assets/ninjaFrog/hit32x32.png', { frameHeight: 32, frameWidth: 32})
      this.load.spritesheet('apple', 'assets/apple544x32.png', {frameHeight: 32, frameWidth: 32});
      this.load.spritesheet('goal', 'assets/end64x64.png', {frameHeight: 64, frameWidth: 64});
      this.load.spritesheet('start', 'assets/start64x64.png', {frameHeight: 64, frameWidth: 64});
      this.load.spritesheet('fruitPop', 'assets/collect32x32.png', {frameHeight: 32, frameWidth: 32});
      this.load.spritesheet('saw', 'assets/Saw/saw38x38.png', {frameHeight: 38, frameWidth: 38})
      this.load.image('platformSmall', 'assets/32x8.png');
      this.load.image('platformLarge', 'assets/256x8.png');
      this.load.image('box', 'assets/box28x24.png');
      this.load.image('spark', 'assets/spark.png')
      var url;
  
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);
    };

    create() {
      g.active = true;
      g.player = this.physics.add.sprite(60, 170, 'playerIdle');

      if (window.innerWidth < 500) {
          this.input.addPointer(3)
      g.jumpBox2 = this.add.rectangle(config.width/2 + 150, config.height/2 + 260, 60, 60, 0x888888).setScrollFactor(0)
      g.jumpBox = this.add.rectangle(config.width/2 + 150, config.height/2 + 260, 40, 40, 0xcccccc).setScrollFactor(0)
      g.point = this.input.activePointer;
      this.stick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: config.width/2,
        y: config.height/2 + 260,
        radius: 40,
        base: this.add.circle(0, 0, 40, 0x888888),
        thumb: this.add.circle(0, 0, 20, 0xcccccc),
        dir: '8dir', 
        forceMin: 10,
        enable: true 
    })

      g.jumpBox.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        if (g.player.body.touching.down) {
        g.player.anims.play('jump', true);
        g.player.setVelocityY(-500);}
    })
    this.stickCursors = this.stick.createCursorKeys();
      }
      
      //g.player.setBounce(0.15);
      g.time = 0;
      g.saw1 = this.physics.add.sprite(220, 70, 'saw')
      g.saw1.alpha = 0
      g.saw1.setGravityY(-800)
      g.box = this.physics.add.sprite(20, 20, 'box')
      g.box.setGravityY(-800).setAlpha(0)
      g.box1 = this.physics.add.group();

      if (typeof(Storage) !== "undefined" && localStorage.bestScore == null && localStorage.lastScore == null) {
        best.innerHTML = 'Your Best Score: 0';
        local.innerHTML = 'Your Last Score: 0';
      } 
      else if (typeof(Storage) !== "undefined") {
        local.innerHTML = 'Your Last Score: ' + localStorage.getItem('lastScore');

      } else {
        local.innerHTML = 'Your browser does not support local storage';
      };

      if (localStorage.lastScore > localStorage.bestScore) {
        localStorage.setItem('bestScore', localStorage.getItem('lastScore'))
       
      }
      best.innerHTML = 'Your Best Score: ' + localStorage.getItem('bestScore');
      
      
      /* this.add.text(10, 500, `High Score: ${livesBonus}`, {fontSize: 20, fill: '#000', fontStyle: 800, strokeThickness: 5}).setScrollFactor(0) */
      
      
      g.saw = this.physics.add.group();
      g.platformSmall = this.physics.add.staticGroup();
      g.platformLarge = this.physics.add.staticGroup();
      g.platformLarge2 = this.physics.add.staticGroup();
      g.apple = this.physics.add.staticGroup();
      g.applex = this.physics.add.staticGroup()
      g.apple2 = this.physics.add.staticGroup();
      g.apple2x = this.physics.add.staticGroup();
      g.apple3 = this.physics.add.staticGroup();
      g.apple3x = this.physics.add.staticGroup();
      g.apple4 = this.physics.add.staticGroup()
      g.apple4x = this.physics.add.staticGroup()
      score = this.add.text(10, 530, `Apples: ${appleCollect}`, {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
      score.setScrollFactor(0)

      lifeCounter = this.add.text(10, 570, `Lives: ${lives}`, {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
      lifeCounter.setScrollFactor(0)
      g.player.setScale(1)
      oneUp = this.add.text(g.player.x,g.player.y,'1up!',{fontSize:15,fill:'red',strokeThickness: 5}).setOrigin(0.5,0.5)
      oneUp.setAlpha(0)
      
      g.timer = this.add.text(10, 490, `Time: ${g.time}`, {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
      g.timer.setScrollFactor(0)
      
      
    
      
      
      this.createAnimations();
      this.levelSetup();
      
      this.myTimer;
      
      this.cameras.main.setBounds(0, 0, g.width, g.height);
      this.physics.world.setBounds(0, 0, g.width, g.height + g.player.height);

      this.cameras.main.startFollow(g.player, true, .5, .5);
      g.player.setCollideWorldBounds(true);

      this.physics.add.collider(g.player, g.platformSmall);
      this.physics.add.collider(g.player, g.platformLarge);
      this.physics.add.collider(g.goal, g.platformSmall);
      this.physics.add.collider(g.goal, g.platformLarge);
      this.physics.add.collider(g.player, g.platformLarge2);
      this.physics.add.collider(g.player, g.box1, function(bug,boo) {
        bug.x = boo.x
      })
      
     
      this.physics.add.overlap(g.player, g.apple, function(bug, boo) {
        boo.disableBody(true, true)
        appleCollect += 1
        score.setText(`Apples: ${appleCollect}`)
      })

      this.physics.add.overlap(g.player, g.applex, function(bug, boo) {
        boo.anims.play('applePop', true)
        
        setTimeout(() => {
          boo.destroy()
        }, 600);
      })

      this.physics.add.overlap(g.player, g.apple2, function(bug, boo) {
        boo.disableBody(true, true)
        appleCollect += 1
        score.setText(`Apples: ${appleCollect}`)
      })
      this.physics.add.overlap(g.player, g.apple2x, function(bug, boo) {
        boo.anims.play('applePop', true)
        
        setTimeout(() => {
          boo.destroy()
        }, 600);
      })

      this.physics.add.overlap(g.player, g.apple3, function(bug, boo) {
        boo.disableBody(true, true)
        appleCollect += 1
        score.setText(`Apples: ${appleCollect}`)
      })
      this.physics.add.overlap(g.player, g.apple3x, function(bug, boo) {
        boo.anims.play('applePop', true)
        setTimeout(() => {
          boo.destroy()
        }, 600);
      })

      this.physics.add.overlap(g.player, g.apple4, function(bug, boo) {
        boo.disableBody(true, true)
        appleCollect += 1
        score.setText(`Apples: ${appleCollect}`)
      })
      this.physics.add.overlap(g.player, g.apple4x, function(bug, boo) {
        boo.anims.play('applePop', true)
        setTimeout(() => {
          boo.destroy()
        }, 600);
      })
      
      
      g.cursors = this.input.keyboard.createCursorKeys();
      
      //this.input.keyboard.on('keydown-SPACE', function(event) {
        setInterval(() => {
          
        
        if (appleCollect > 14 && appleCollect < 30 && jump == 0) {
          lives += 1
          lifeCounter.setText(`Lives: ${lives}`)
          jump = 1
          oneUp.setAlpha(1)
          oneUp.x = g.player.x
          setTimeout(() => {
            oneUp.setAlpha(0)
          }, 700);
        } if (appleCollect > 29 && appleCollect < 45 && jump == 1) {
          lives += 1
          lifeCounter.setText(`Lives: ${lives}`)
          jump = 2
          oneUp.setAlpha(1)
          oneUp.x = g.player.x
          setTimeout(() => {
            oneUp.setAlpha(0)
          }, 500);
        } if (appleCollect > 44 && appleCollect < 60 && jump == 2) {
          lives += 1
          lifeCounter.setText(`Lives: ${lives}`)
          jump = 3
          oneUp.setAlpha(1)
          oneUp.x = g.player.x
          setTimeout(() => {
            oneUp.setAlpha(0)
          }, 500);
        } if (appleCollect > 59 && appleCollect < 75 && jump == 3) {
          lives += 1
          lifeCounter.setText(`Lives: ${lives}`)
          jump = 4
          oneUp.setAlpha(1)
          oneUp.x = g.player.x
          setTimeout(() => {
            oneUp.setAlpha(0)
          }, 500);
        } if (appleCollect > 74 && appleCollect < 90 && jump == 4) {
          lives += 1
          lifeCounter.setText(`Lives: ${lives}`)
          jump = 0
          oneUp.setAlpha(1)
          oneUp.x = g.player.x
          setTimeout(() => {
            oneUp.setAlpha(0)
          }, 500);
        }}, 500);
      //})
    };

    createBox(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.box1.create(xIndex * 150, yIndex, 'box').setGravityY(-800).setImmovable(true)
        
      }
    }

    createSaw(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.saw.create(xIndex * 150, yIndex, 'saw').setOrigin(0, 0).play('sawSpin', true).setGravityY(-800).setImmovable(true)
        
      }
    }

    
    createPlatformLarge(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.platformLarge.create(xIndex * 200, yIndex, 'platformLarge').setOrigin(0, 0).refreshBody();

      }
    }

    createPlatformLarge2(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.platformLarge2.create(xIndex * 10, yIndex, 'platformLarge').setOrigin(0, 0).refreshBody();

      }
    }

    createPlatformSmall(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.platformSmall.create(xIndex * 200, yIndex, 'platformSmall').setOrigin(0, 0).refreshBody()

      }
    }

    
    createApple(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.apple.create(xIndex * 20, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        g.applex.create(xIndex * 20, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        
      }
    }

    createApple2(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.apple2.create(xIndex * 195, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        g.apple2x.create(xIndex * 195, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        g.apple3.create(xIndex * 205, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        g.apple3x.create(xIndex * 205, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
      }
    }

    createApple3(xIndex, yIndex) {
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {

        g.apple4.create(xIndex * 300, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        g.apple4x.create(xIndex * 300, yIndex, 'apple').setOrigin(0, 0).play('appleMove', true).refreshBody()
        
      }
    }
        

    createAnimations() {
      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 11 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 10 }),
        frameRate: 20,
        repeat: -1
      });

      this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('playerJump',{start: 0, end: 1}),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'frogHit',
        frames: this.anims.generateFrameNumbers('playerHit', {start: 0, end: 5}),
        frameRate: 20,
        repeat: -1
      })

      this.anims.create({
        key: 'trophy',
        frames: this.anims.generateFrameNumbers('goal', {start: 0, end: 7}),
        frameRate: 10,
        repeat: -1
      })

      this.anims.create({
        key: 'appleMove',
        frames: this.anims.generateFrameNumbers('apple', {start: 0, end: 16}),
        frameRate: 32,
        repeat: -1
      })

      this.anims.create({
        key: 'applePop',
        frames: this.anims.generateFrameNumbers('fruitPop', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 1
      })

      this.anims.create({
        key: 'sawSpin',
        frames: this.anims.generateFrameNumbers('saw', {start: 0, end: 7}),
        frameRate: 20,
        repeat: -1
      })
    };
    
    
    levelSetup() {
      for (const [xIndex, yIndex] of this.largePlat.entries()) {
        this.createPlatformLarge(xIndex, yIndex);
        
      }

      for (const [xIndex, yIndex] of this.largePlat2.entries()) {
        this.createPlatformLarge2(xIndex, yIndex);
        
      }
      
      for (const [xIndex, yIndex] of this.smallPlat.entries()) {
        this.createPlatformSmall(xIndex, yIndex);
      }

      for (const [xIndex, yIndex] of this.appleCreate.entries()) {
        this.createApple(xIndex, yIndex);
      }

      for (const [xIndex, yIndex] of this.appleCreate2.entries()) {
        this.createApple2(xIndex, yIndex);
      }

      for (const [xIndex, yIndex] of this.appleCreate3.entries()) {
        this.createApple3(xIndex, yIndex);
      }

      for (const [xIndex, yIndex] of this.sawCreate.entries()) {
        this.createSaw(xIndex, yIndex);
      }
        
      for (const [xIndex, yIndex] of this.boxCreate.entries()) {
        this.createBox(xIndex, yIndex);
      }

      g.goal = this.physics.add.sprite(g.width - 40, 100, 'goal');
      
      let myTimer = 
      setInterval(() => {
        g.time++
        
        g.timer.setText(`Time: ${g.time}`)
      }, 1000);

      this.physics.add.overlap(g.player, g.goal, function() {
        /* if (lvl == 5) {
          this.scene.stop('Level4')
          game.scene.start('GameEnd')
        } */
        this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
          
          if (progress > .9) {
            lvl++
            startTime.push(g.time)
            clearInterval(myTimer)
            this.scene.start(this.nextLevel[this.levelKey])
            console.log(startTime)
          }
          
        })
      }, null, this)

        
        if (lvl == 1){
          level = this.add.text(10, 10, 'Level 1', {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
          level.setScrollFactor(.5)
          const graphics = this.add.graphics()
          graphics.fillGradientStyle(0xdadaff, 0x6cfafa, 0xfccaff, 0xdadaff, 1)
          graphics.fillRect(0,0,g.width, g.height)
          graphics.depth = -1



          
        } else if (lvl == 2) {
            level = this.add.text(10, 10, 'Level 2', {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
            level.setScrollFactor(0.5)
            
        } else if (lvl == 3) {
            level = this.add.text(10, 10, 'Level 3', {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
            level.setScrollFactor(0.5)
            
        } else {
            level = this.add.text(10, 10, 'Level 4', {fontSize: 20, fill: '#000000', fontStyle: 800, strokeThickness: 5});
            level.setScrollFactor(0.5)
            
        }
      
    }

   

    update() {
      
      if (g.active) {
        this.physics.add.collider(g.player, g.saw, () => {
          if (lives == 1) {
            this.cameras.main.fade(3000,0,0,0,false,function(camera,progress){
              this.add.text(300,300,'Game Over',{fontSize:30,fill: 'red'}).setOrigin(.5,.5)
              if(progress > .9) {
                lives = 3
                appleCollect = 0
                jump = 0
                lvl = 1
                window.location.reload()
             
              }
            })
            
           }
          lives -= 1
          lifeCounter.setText(`Lives: ${lives}`)
          this.cameras.main.shake(200, .01, false)
          g.player.x = 70
          g.player.y = 170 
        })
        
        if (g.box.x < 100) {
          g.box.setVelocityX(100)
          g.box1.setVelocityX(100)
        } else if (g.box.x > 300) {
          g.box.setVelocityX(-100)
          g.box1.setVelocityX(-100)
        }
        g.saw1.play('sawSpin', true)
        if(g.saw1.y <= 70) {
          g.saw.setVelocityY(100)
          g.saw1.setVelocityY(100)
        } else if (g.saw1.y >= 300) {
          g.saw1.setVelocityY(-100)
          g.saw.setVelocityY(-100)
        }
        
        g.goal.anims.play('trophy', true);

        if (window.innerWidth < 500) {
          if (this.stickCursors.right.isDown) {
            g.player.flipX = false;
            g.player.setVelocityX(g.speed);
            g.player.anims.play('run', true);
          } else if (this.stickCursors.left.isDown) {
            g.player.flipX = true;
            g.player.setVelocityX(-g.speed)
            g.player.anims.play('run', true);
          } else {
            g.player.setVelocityX(0);
            g.player.anims.play('idle', true);
            
          }
        }
        if (window.innerWidth >= 500) {
        if (g.cursors.right.isDown) {
          g.player.flipX = false;
          g.player.setVelocityX(g.speed);
          g.player.anims.play('run', true);
        } else if (g.cursors.left.isDown) {
          g.player.flipX = true;
          g.player.setVelocityX(-g.speed)
          g.player.anims.play('run', true);
        } else {
          g.player.setVelocityX(0);
          g.player.anims.play('idle', true);
          
        }}
        if (Phaser.Input.Keyboard.JustDown(g.cursors.space) && g.player.body.touching.down) {
          g.player.anims.play('jump', true);
          g.player.setVelocityY(-500);
        }
        if (!g.player.body.touching.down) {
          g.player.anims.play('jump', true);
        }
        if (g.player.y > g.height) {
          lives -= 1
          if (lives == 0) {
            this.cameras.main.fade(3000,0,0,0,false,function(camera,progress){
              this.add.text(300,300,'Game Over',{fontSize:30,fill: 'red'}).setOrigin(.5,.5)
              if(progress > .9) {
                lives = 3
                appleCollect = 0
                jump = 0
                lvl = 1
                window.location.reload()
             
              }
            })
        
           }
          
          lifeCounter.setText(`Lives: ${lives}`)
          
          
          this.cameras.main.shake(200, .01, false, function(camera, progress) {
            if (progress < 1) {
              
              g.player.y = 170
              g.player.x = 110
              
            } 
          }); 
          
        }
      }
    }
    
    
};



class Level1 extends Level {
    constructor() {
      super('Level1')
      this.largePlat = [200, null, null, null, 220, null, null, null, null, 300];
      this.largePlat2 = [null, 100]
      this.smallPlat = [null, null, 300, 300, null, null, 170, 500, 400]
      this.appleCreate = [70, 70, 70, 70, 70, 70,70]
      this.appleCreate2 = [null, null, 270, 270, 190, 190,null,300,null,270]
      this.appleCreate3 = [null, 100, 100, null, null, 290,270];
      this.sawCreate = [null,null, null, 200,null,null,180,null,null,170]
      this.boxCreate = [null]
      
      }
    
};
  
class Level2 extends Level {
    constructor() {
      super('Level2')
      this.largePlat = [null,null,200,null,null,null,250,null,null,400];
      this.largePlat2 = [400]
      this.smallPlat = [null,null,300,null,null,350]
      this.appleCreate = [null,null,null,null,null,null,null]
      this.appleCreate2 = [null,null,200,170,null,null,220,null,null,300]
      this.appleCreate3 = [null, 280,null,200,null,null,300]
      this.sawCreate = [null, null, 200,null,null,100,null,null,100,null,null,120]
      this.boxCreate = [null]
      
    }
};
  
class Level3 extends Level {
    constructor() {
      super('Level3')
      this.largePlat = [400, null, null, 220, null, null, null, null, 300,400];
      this.largePlat2 = [null, 100]
      this.smallPlat = [null, 300,null,null,null,null,null,null,480]
      this.appleCreate = [70, 70, 70, 70, 70, 70,70]
      this.appleCreate2 = [null,270, null, 190, 190,350,250,160,260,360]
      this.appleCreate3 = [null, 100,null,350,null,null,360]
      this.sawCreate = [null,null, null, 100, null,null,null,300,null,150]
      this.boxCreate = [null, 200,null,null,null,400,null,300]
    }
    
};
  
class Level4 extends Level {
    constructor() {
      super('Level4')
      this.largePlat = [400,null,null,null,null,null,null,null,null,200];
      this.largePlat2 = [null]
      this.smallPlat = [300,200,null,null,450,null,null,null,300]
      this.appleCreate = [null,null,null,null,90,90,90]
      this.appleCreate2 = [null,null,null,null,300,350,250,300,null,160]
      this.appleCreate3 = [null,null,null,null,200,200,160]
      this.sawCreate = [null,110,110,null,70,null,null,null,280,null,200,100]
      this.boxCreate = [null,null,200,null,null,null,400,null,400]
    }
};

class GameEnd extends Level {
  constructor() {
    super('GameEnd')
  }
  preload() {
    this.load.spritesheet('frogIdle', 'assets/ninjaFrog/idle.png', {frameHeight: 32, frameWidth: 32})
    this.load.spritesheet('frogJump', 'assets/ninjaFrog/doubleJump32x32.png', {frameHeight: 32, frameWidth: 32})
  }
  create() {
    
    g.totalTime = startTime[0] + startTime[1] + startTime[2] + startTime[3] 
    
    livesBonus = (appleCollect * lives) - g.totalTime 
    //bestScore = 0
    this.add.text(config.width/2, 100, 'CONGRATULATIONS!\nYou beat the Game!', {fontSize: 25, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    this.add.text(config.width/2, 370, `Total Time: ${g.totalTime} seconds`, {fontSize: 25, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    this.add.text(config.width/2, 400, `Total Apples: ${appleCollect}`, {fontSize: 25, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    this.add.text(config.width/2, 430, `Lives Remaining: ${lives}`, {fontSize: 25, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    this.add.text(config.width/2, 460, `Score: ${livesBonus}`, {fontSize: 25, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    this.add.text(config.width/2, 500, '\nClick to Restart', {fontSize: 15, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    this.add.text(config.width/2, 570, 'Score calculation: \n(Total Apples * Lives Remaining) - Total Time', {fontSize: 12, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(.5,.5)
    
    
    
    

    
    g.froggy = this.physics.add.sprite(0,300,'frogIdle').setOrigin(0.5,0.5).setScale(3)
    g.froggy.setGravityY(-800)
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('frogIdle', {start: 0, end: 10}),
      frameRate: 20,
      repeat: -1
    }) 
    this.anims.create({
      key: 'jumpFroggy',
      frames: this.anims.generateFrameNumbers('frogJump', {start: 0, end: 10}),
      frameRate: 20,
      repeat: 1
    })
    setInterval(() => {

      //g.froggy.play('idle',true)
    }, 500)
    this.input.on('pointerdown', function() {
      appleCollect = 0
      lives = 3
      jump = 0
      lvl = 1
      startTime = []
      //game.scene.stop('GameEnd')
      window.location.reload()
      //game.scene.start('StartGame')
    
    })
     

    if (typeof(Storage) !== "undefined") {
      //localStorage.clear()
        
      //localStorage.setItem('lowScoreA', livesBonus)
      //localStorage.setItem('lowScoreB', bestScore)
      localStorage.setItem('lastScore', livesBonus )
      //localStorage.setItem('bestScore', 0)
      
      
      local.innerHTML = 'Your Last Score: ' + localStorage.getItem('lastScore')
    } else {
      local.innerHTML = 'Your browser does not support local storage'
    }
    
    if (Number(localStorage.lastScore) > Number(localStorage.bestScore) || localStorage.bestScore == 'NaN') {
      localStorage.setItem('bestScore', localStorage.getItem('lastScore'))
     
    } 
        
        
    best.innerHTML = 'Your Best Score: ' + localStorage.getItem('bestScore')
     
    
    
  }
  update() {
  
   
    g.froggy.setVelocityX(200)
    if (g.froggy.x > 510) {
      g.froggy.x = -10
      g.froggy.y = 250
    }
    if (g.froggy.x > 150 && g.froggy.x < 220) {
      g.froggy.setVelocityY(-200)
      g.froggy.play('jumpFroggy', true)
    } else {g.froggy.setVelocityY(20);g.froggy.play('idle',true)}
  }
}

class StartGame extends Level{
  constructor() {
    super('StartGame')
  }
  preload() {
    this.load.spritesheet('frog', 'assets/ninjaFrog/idle.png', {frameHeight: 32, frameWidth: 32})
    this.load.image('spark', 'assets/spark.png')
  }
  create() {
      
      g.particle = this.add.particles('spark')
      g.particle.createEmitter({
        x: { min: 0, max: g.width },
        y: 0,
        lifespan: 3500,
        speedY: {min: 100, max: 200 },
        scale: .3,
        quantity: 1,
        blendMode: 'SCREEN'
      })
     
      if (typeof(Storage) !== "undefined" && localStorage.bestScore == null && localStorage.lastScore == null) {
          localStorage.setItem('bestScore', 0)
          localStorage.setItem('lastScore', 0)
        best.innerHTML = 'Your Best Score: 0';
        local.innerHTML = 'Your Last Score: 0';
      } 
      else if (typeof(Storage) !== "undefined") {
        best.innerHTML = 'Your Best Score: ' + localStorage.getItem('bestScore');
        local.innerHTML = 'Your Last Score: ' + localStorage.getItem('lastScore');
      } else {
        local.innerHTML = 'Your browser does not support local storage';
      };
    g.frog = this.add.sprite(config.width/2,300,'frog').setOrigin(0.5).setScale(5)
    this.add.text(config.width/2, 100, 'The Adventures of Ninja Frog', {fontSize: 25, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(0.5)
    this.add.text(config.width/2, 150, 'Click to Start', {fontSize: 15, fill: 'red', fontStyle: 800, strokeThickness: 5}).setOrigin(0.5)
    this.add.text(config.width/2, 500, 'Left Arrow Key = Move Left\n\nRight Arrow Key = Move Right\n\nSpacebar to Jump\n\nEvery 15 apples is an extra life',{ fill: '#000000', fontStyle: 800, strokeThickness: 5}).setOrigin(0.5)
    this.input.on('pointerdown', function() {
        game.scene.stop('StartGame')
        game.scene.start('Level1')
        
      
    })

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('frog', {start: 0, end: 10}),
      frameRate: 20,
      repeat: -1
    }) 
    g.frog.play('idle',true)
  }
}



const g = {
    speed: 240,
    ups: 380,
    width: 2000,
    height: 600,
};
const local = document.getElementById('local')
const best = document.getElementById('best')
let bestScore = 0
let lives = 3;
let lifeCounter;
let appleCollect = 0;
let score;
let level;
let lvl = 1;
let jump = 0;
let livesBonus = 0;
let newLivesBonus = 0;
let oneUp;
let startTime = []
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 600,
    fps: {target: 60},
    backgroundColor: "b9baff",
    physics: {
      default: 'arcade',
      arcade: {
         
        gravity: { y: 800 },
        enableBody: true,
        debug: false
      }
    },
    
    scene: [StartGame, Level1, Level2, Level3, Level4, GameEnd]
};
if (window.innerWidth > 600) {
  config.width = 600
}

const game = new Phaser.Game(config);