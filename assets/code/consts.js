const width = 900
const height = 600

const y_start = 0
const y_end = 400
const press_window = 100
const letters_to_rows = {'a': 0, 'w': 1, 's': 2, 'd': 3}
const row_bias = 74;
const row_interval = 82;
const base_volume = 0.05

const speed_limit = 5
const player_speed = 0.5
const ball_starting_coordinate = row_bias + row_interval * 1.5

const health_decrease = 32
const health_small_decrease = 5  
const health_increase = 10
const health_width = 250  
const discord_link = 'https://discordapp.com/users/269881431465918464/'



const level_params = {
    1: {
    'num': 0,
    'bpm': 61, 
    'anim': 'level_1',
    'spd': 0.15,
    'ball_spd': 0.15,
    'time': 52 //52
    },
    2: {
      'num': 1,
      'bpm': 65, 
      'anim': 'level_2',
      'spd': 0.30,
      'ball_spd': 0.25,
      'time': 55 // 55
    },
    3: {
      'num': 2,
      'bpm': 96, 
      'anim': 'level_3',
      'spd': 0.35,
      'ball_spd': 0.3,
      'time': 62 // 62
    }
  }
  
const controls_text = '-WASD - to catch arrows \n\n-QE or arrows to control stress\n\n-<SPACE> to restart level'