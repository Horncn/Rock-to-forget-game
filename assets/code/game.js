function unpaused_game(scene, dt){
  time_to_win -= dt / 1000
  if (time_to_win < 0){
    current_level ++
    if (current_level <= Object.keys(level_params).length){
      create_mid_screen(scene)
      pause = true
    } else {
      create_win_screen(scene)
      pause = true
    }
  }
  temp_time_text.setText(Math.round(time_to_win))
  streak.setText(saved_score + streak_text)
  if (time_to_next_note <= 0 && time_to_win >= 2){
    time_to_next_note = time_interval
    row = getRandomInt(4)
    switch (row){
      
      case 0:
        nt = scene.add.image(row_bias + row * row_interval, y_start - 200, 'left').setScale(2)
        break;
      case 1:
        nt = scene.add.image(row_bias + row * row_interval, y_start - 200, 'up').setScale(2)
        break;
      case 2:
        nt = scene.add.image(row_bias + row * row_interval, y_start - 200, 'down').setScale(2)
        break;
      case 3:
        nt = scene.add.image(row_bias + row * row_interval, y_start - 200, 'right').setScale(2)
        break;
      default:
        console.log('unexpected error in note spawn')
    }
    notes.push(new Note(row, nt))
    // console.log('note added, total:' + notes.length)
  }
  // note block
  time_to_next_note -= dt
  if (check_cooldown > 0){
    check_cooldown -= dt
  }
  delta_distance = dt * speed
  pressed_key = check_keys()
  for (let i=0; i<notes.length; i++){
    notes[i].update_coord(delta_distance)
    notes[i].image.y = notes[i].y_coordinate
    }
  if (notes.length){
    if(notes[0].y_coordinate > y_end){
      notes[0].image.destroy()
      notes.shift()

      if (health.decrease()){
          lost()
      } 
      check_cooldown = check_cooldown_parameter
    }
    if (check_cooldown <= 0){
      if (notes[0].y_coordinate > y_end - press_window){
        if (check_if_note_is_pressed_in_time(notes[0], pressed_key)){
          health.increase()   
          notes[0].image.destroy()
          notes.shift()
          streak_text++
          check_cooldown = check_cooldown_parameter
        }
      } 
    }
    if (check_keys() != undefined && check_cooldown <= 0){
      check_cooldown = check_cooldown_parameter
      if (health.decrease_small()){
        lost()
      } 
    } 
  }
  

  // stress ball block

  ball.change_x(dt)
  if (keyE.isDown || keyRArrow.isDown){
    ball.change_x_by_player(dt)
  }
  else if (keyQ.isDown || keyLArrow.isDown){
    ball.change_x_by_player(dt * -1)
  }
  ball.image.x = ball_starting_coordinate + ball.x_coordinate


  fog.y = y_end - (y_end * ball.proportion) 
}

  
  function check_keys(){
    if (keyUp.isDown){
      return 'w'
    }
    if (keyDown.isDown){
      return 's'
    }
    if (keyLeft.isDown){
      return 'a'
    }
    if (keyRight.isDown){
      return 'd'
    }
  }
  
  function check_if_note_is_pressed_in_time(note, key) {
    if (letters_to_rows[key] == note.row){
      return true
    }
    return false 
  }
  
class Note{
  constructor(row, image){
    this.row = row
    this.y_coordinate = y_start
    this.image = image
  }

  update_coord(delta_distance){
    this.y_coordinate += delta_distance 
  }

}




class Ball{
  constructor(image){
    this.x_coordinate = 0
    this.space_limit = row_interval * 2 - 30
    this.image = image
  }

  reset(){
      this.x_coordinate = 0
  }


  change_x(delta){
    if (this.x_coordinate < this.space_limit && this.x_coordinate > this.space_limit * -1){
      if (this.x_coordinate > 0){
        this.x_coordinate += speed_acc_delta * delta
      } else {
        this.x_coordinate -= speed_acc_delta * delta
      }
    }
  }

  change_x_by_player(delta){
    if ((this.x_coordinate < this.space_limit && delta > 0) || (this.x_coordinate > this.space_limit * -1 && delta < 0)){
      this.x_coordinate += delta * player_speed}
  }
  get proportion(){
    let x
    if (this.x_coordinate < 0){
      x = this.x_coordinate * -1
    } else {
      x = this.x_coordinate
    }
    return this.space_limit / (2 * x)
  }
}



class HealthBar{

  constructor(scene){
      this.bar = new Phaser.GameObjects.Graphics(scene);

      this.x = 90;
      this.y = 550;
      this.value = 100;
      this.p = health_width / 100;
      

      this.draw();

      scene.add.existing(this.bar);
  }

  reset(){
      this.value = 100
      this.draw()
  }

  decrease(){
      this.value -= health_decrease;

      if (this.value < 0)
      {
          this.value = 0;
      }

      
      this.draw();
      return (this.value === 0);
  }

  decrease_small(){
    this.value -= health_small_decrease
    if (this.value < 0)
    {
        this.value = 0;
    }

    
    this.draw();
    return (this.value === 0);
  }

  increase(){
    this.value += health_increase
    if (this.value > 100){
      this.value = 100
    }
    this.draw();
  }

  draw(){
      this.bar.clear();

      //  BG
      this.bar.fillStyle(0x000000);
      this.bar.fillRect(this.x, this.y + 3, health_width + 4, 16);

      //  Health

      this.bar.fillStyle(0xffffff);
      this.bar.fillRect((this.x + 2, this.y + 5, health_width, 12));

      if (this.value <= health_decrease)
      {
          this.bar.fillStyle(0xff0000);
      } else if (this.value <= health_decrease * 2){
          this.bar.fillStyle(0xffff00)
      } else {
          this.bar.fillStyle(0x00ff00);
      }

      var d = Math.floor(this.p * this.value);

      this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}

function lost(){
  pause = true
  if (lost_screen.depth < 0){
    lost_screen.setDepth(3)
    lost_screen.setInteractive()
    back_button.setDepth(4)
  }
  for (let i=0; i<level_sound.length; i++){
    level_sound[i].stop()
  }
  menu_sound.play()
  menu_sound.loop = true
}


function create_mid_screen(scene){
  saved_score += streak_text
  fog.setDepth(1)
  ball.image.setDepth(1)
  screen = scene.add.image(450, 300, 'clear')
  screen.setDepth(2)
  screen.setInteractive()
  screen.on('pointerdown', () => start_level(level_params[current_level]))
}

function create_win_screen(scene){
  fog.setDepth(1)
  ball.image.setDepth(1)
  pause = true
  screen = scene.add.image(450, 300, 'win_screen')
  screen.setDepth(2)
  disc.setDepth(3)
  back_button.setDepth(2)
  disc.x = 830
  disc.y = 560
  ctrls_text.setText('\n\n\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tSCORE: ' + (saved_score + streak_text))
}