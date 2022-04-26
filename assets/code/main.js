
var fullscreen = false
var speed = 0.2
var note_size = 2

var config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  scene: {
      preload: preload,
      create: create,
      update: update
  },
  audio: {
    disableWebAudio: true
  }
};
var game = new Phaser.Game(config);

var strings = []
var notes = []
var fog;
var graphics;
var delta;

var saved_score = 0
var streak;
var streak_text = 0;
var pause = true
var pressed_key
var lost_screen
var keyUp, keyDown, keyLeft, keyRight, keyQ, keyE, keyR, keyLArrow, keyRArrow, keySpace
var bpm 
var speed_acc_delta
var current_level = 1
var time_to_win
var temp_time_text
var menu_sound
var level_sound = []
var ctrls_text
var screen
var start_button, ctrls_button, hard_button, back_button
var time_interval = 60 / bpm * (1000 / note_size)
var time_to_next_note = time_interval
var check_cooldown_parameter = 60 / bpm * (1000 / (note_size * 2))
var check_cooldown = check_cooldown_parameter
var disc

function preload ()
{
  
  this.load.path = 'assets/'
  this.load.image('ball', 'ball.png')
  this.load.image('left', 'left.png');
  this.load.image('right', 'right.png');
  this.load.image('up', 'up.png');
  this.load.image('down', 'down.png');
  this.load.image('fog1', 'fog1.png');
  this.load.image('fog2', 'fog2.png');
  this.load.image('ctrls', 'control_btn.png');
  this.load.image('start', 'start_button.png');
  this.load.image('disc', 'discord_ico.png')
  this.load.image('hardon', 'hardn.png')
  this.load.image('hardoff', 'hardf.png')
  this.load.image('back', 'backbutton.png')
  this.load.path = 'assets/bgs/'
  this.load.image('lost_screen', 'losescreen.png')
  this.load.image('clear', 'clear.png')
  this.load.image('menu', 'menu.png')
  this.load.image('pre_menu', 'pre_menu.png')
  this.load.image('win_screen', 'win_screen.png')
  this.load.image('info', 'info.png')
  this.load.image('1_1', '1_1.png')
  this.load.image('1_2', '1_2.png')
  this.load.image('2_1', '2_1.png')
  this.load.image('2_2', '2_2.png')
  this.load.image('2_3', '2_3.png')
  this.load.image('2_4', '2_4.png')
  this.load.image('3_1', '3_1.png')
  this.load.image('3_2', '3_2.png')
  this.load.path = 'assets/music/'
  this.load.audio('menu', 'theme.mp3')
  this.load.audio('lvl1', 'lithum.mp3')
  this.load.audio('lvl2', 'song2.mp3')
  this.load.audio('lvl3', 'filwag.mp3')
}

function create()
{
  create_animations(this)

  streak = this.add.text(460, 53);
  streak.setFontFamily('Pixel')
  streak.setDepth(2)
  streak.setFontSize(32)
  temp_time_text = this.add.text(440, 536)
  temp_time_text.setFontSize(32)
  temp_time_text.setFontFamily('Pixel')
  temp_time_text.setDepth(2)

  ctrls_text = this.add.text(200, 200)
  ctrls_text.setFontFamily('Pixel')
  ctrls_text.setFontSize(32)
  ctrls_text.setDepth(20)

  fog = this.add.sprite(ball_starting_coordinate, y_start, 'fg').play('fog')
  
  
  lost_screen = this.add.image(450, 300, 'lost_screen');
  
  lost_screen.on('pointerdown', () => restart())
  lost_screen.setDepth(-1)


  menu_sound = this.sound.add('menu', {volume : base_volume, loopEndOffset: -0.05})
  menu_sound.loop = true
  
  level_sound.push(this.sound.add('lvl1', {volume : base_volume}))
  level_sound.push(this.sound.add('lvl2', {volume : base_volume}))
  level_sound.push(this.sound.add('lvl3', {volume : base_volume}))

  level = this.add.sprite(width / 2, height / 2, 'lvl');
  ball = new Ball(this.add.image(ball_starting_coordinate, 500, 'ball').setScale(2));
  health = new HealthBar(this)
  add_controls(this)
  screen = this.add.image(450, 300, 'pre_menu')
  screen.setInteractive()
  screen.on('pointerdown', () => load_menu(this))

  disc = this.add.image(800, 550, 'disc')
  disc.setInteractive()
  disc.on('pointerdown', () => copy_disc_link())
  disc.setDepth(-2)

  back_button = this.add.image(850, 50, 'back')
  back_button.setInteractive()
  back_button.on('pointerdown', () => load_menu(this))
  back_button.setDepth(-1)
}

function update (_, dt){

  
  if (!pause){
    unpaused_game(this, dt)
  } else {
    try{
      if((keySpace.isDown || keyR.isDown) && lost_screen.input.enabled){
        restart()
      }
    } catch(e){
      e
    }

      
  }
}



function create_animations(scene){
  scene.anims.create({
    key: 'level_1',
    frames: [
        { key: '1_1', frame: null, duration: 20 },
        { key: '1_2', frame: null, duration: 50 }
    ],
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
  key: 'level_2',
  frames: [
      { key: '2_1', frame: null, duration: 20 },
      { key: '2_2', frame: null, duration: 50 },
      { key: '2_3', frame: null, duration: 20 },
      { key: '2_2', frame: null, duration: 50 },
      { key: '2_1', frame: null, duration: 20 },
      { key: '2_4', frame: null, duration: 50 },
      { key: '2_1', frame: null, duration: 20 },
      { key: '2_2', frame: null, duration: 50 }
  ],
  frameRate: 8,
  repeat: -1
  });

  scene.anims.create({
    key: 'level_3',
    frames: [
        { key: '3_1', frame: null, duration: 20 },
        { key: '3_2', frame: null, duration: 50 },
    ],
    frameRate: 8,
    repeat: -1
    });

  scene.anims.create({
    key: 'fog',
    frames: [
      {key: 'fog1', frame: null, duration: 20},
      {key: 'fog2', frame: null, duration: 20}
    ],
    frameRate: 5,
    repeat: -1
  })
}


function add_controls(scene){
  keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
  keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  keyR = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
  keyLArrow = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
  keyRArrow = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
}




function restart(){
  while (notes.length) {
    notes[0].image.destroy()
    notes.shift()
  }
  lost_screen.setDepth(-1)
  correct_presses = null
  missed_presses = null
  ball.reset()
  health.reset()
  pause = false
  start_level(level_params[current_level])
  lost_screen.removeInteractive()
} 


function load_menu(scene){
  saved_score = 0
  disc.setDepth(2)
  fog.setDepth(-1)
  ball.image.setDepth(-1)
  lost_screen.setDepth(-1)
  back_button.setDepth(-1)
  ctrls_text.setText('')
  screen.setDepth(1)
  screen.setTexture('menu')
  screen.removeInteractive()
  streak.setText('')
  temp_time_text.setText('')

  menu_sound.play() 
  start_button = scene.add.image(450, 350, 'start')
  start_button.setInteractive()
  start_button.on('pointerdown', () => restart())
  start_button.setDepth(2)

  ctrls_button = scene.add.image(450, 450, 'ctrls')
  ctrls_button.setInteractive()
  ctrls_button.on('pointerdown',() => (tell_controls()))
  ctrls_button.setDepth(2)

  hard_button = scene.add.image(450, 250, 'hardoff')
  if (note_size == 4){
    hard_button.setTexture('hardon')
  }
  hard_button.setInteractive()
  hard_button.on('pointerdown',() => (change_difficulty()))
  hard_button.setDepth(2)
  lost_screen.removeInteractive()
}

function destroy_menu(){
  screen.setDepth(-1)
  start_button.destroy()
  ctrls_button.destroy()
  hard_button.destroy()
  disc.setDepth(-2)
}

function tell_controls(){
  lost_screen.removeInteractive()
  start_button.destroy()
  ctrls_button.destroy()
  hard_button.destroy()
  screen.setTexture('info')
  disc.setDepth(3)
  back_button.setDepth(2)
  ctrls_text.setText(controls_text)
}

function change_difficulty(){
  if (hard_button.texture.key == 'hardoff'){
    hard_button.setTexture('hardon')
    note_size = 4
    
  } else {
    hard_button.setTexture('hardoff')
    note_size = 2
  }
}

function recount_time(){
  time_interval = 60 / bpm * (1000 / note_size)
  time_to_next_note = time_interval
  check_cooldown_parameter = 60 / bpm * (1000 / (note_size * 2))
  check_cooldown = check_cooldown_parameter
}

function start_level(cfg){
  streak_text = 0
  pause = false
  destroy_menu()
  fog.setDepth(2)
  ball.image.setDepth(2)
  back_button.setDepth(-1)
  set_values(cfg['bpm'], cfg['spd'], cfg['ball_spd'])
  level.play(cfg['anim'])
  time_to_win = cfg['time']
  menu_sound.stop()
  level_sound[cfg['num']].play()
}


function set_values(bp, spd, bspb){
  bpm = bp
  speed = spd
  speed_acc_delta = bspb
  recount_time()
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function copy_disc_link(){
  window.open(discord_link, '_blank').focus()
}