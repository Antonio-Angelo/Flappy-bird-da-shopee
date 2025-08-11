// Velocidade de movimento do fundo
let move_speed = 3;

// Gavidade do pássaro
let gravity = 0.5;

// Referencia o elemento do pássaro
let bird = document.querySelector('.bird');
// Dificuldade Normal
let difficulty = 'normal';

let score = 0;

let previous_score = 0;

// Prorpriedades do pássaro
let bird_props = bird.getBoundingClientRect();
let background =
    document.querySelector('.background')
            .getBoundingClientRect();
let adjusted_bird = {
  top: bird_props.top - 100,
  bottom: bird_props.bottom + 100,
  left: bird_props.left - 250,
  right: bird_props.right + 250
};

let pipe_gap = 35; // em vh
let pipe_gap2 = 45; // mais espaço para passar


// Referencias para os elementos de pontuação
let score_val =
    document.querySelector('.score_val');
let message =
    document.querySelector('.message');
let score_title =
    document.querySelector('.score_title');

// Dificuldade do jogo

function setDifficulty(level) {
  difficulty = level;
  if (difficulty === 'easy') {
    move_speed = 2;
    gravity = 0.4;
  } else if (difficulty === 'normal') {
    move_speed = 3;
    gravity = 0.5;
  } else if (difficulty === 'hard') {
    move_speed = 4;
    gravity = 0.65;
  }

  document.getElementById('difficulty-select').style.display = 'none';
  message.innerHTML = 'Pressione Enter para começar';
}

// Iniciar jogo
let game_state = 'Start';

// Evento de pressionar tecla enter
document.addEventListener('keydown', (e) => {

  // Start the game if enter key is pressed
  if (e.key == 'Enter' &&
      game_state != 'Play') {
    document.querySelectorAll('.pipe_sprite')
              .forEach((e) => {
      e.remove();
    });
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    play();
  }
});
function play() {
function move() {
  // Checar se o jogo está em andamento
  if (game_state != 'Play') return;


  

  
  // Referência dos obstáculos
  let pipe_sprite = document.querySelectorAll('.pipe_sprite');

  pipe_sprite.forEach((element) => {
    let pipe_sprite_props = element.getBoundingClientRect();
    let bird_props = bird.getBoundingClientRect();

    if (pipe_sprite_props.right <= 0) {
      element.remove();
    } else {
      // Detecta colisão entre pássaro e obstáculo
      if (
        bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
        bird_props.left + bird_props.width > pipe_sprite_props.left &&
        bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
        bird_props.top + bird_props.height > pipe_sprite_props.top
      ) {
        // colisão detectada
        game_state = 'End';
        message.innerHTML = 'Press Enter To Restart';
        message.style.left = '28vw';
        return;
      } else {
        // Aumenta a pontuação se o pássaro passar pelo obstáculo

        function increaseSpeed() {
          let currentScore = parseInt(score_val.innerHTML);
          if (currentScore % 10 === 0 && currentScore !== previous_score) {
            move_speed += 0.5;  // ou o valor que desejar
            previous_score = currentScore;
          }
        }
        if (
          pipe_sprite_props.right < bird_props.left &&
          pipe_sprite_props.right + move_speed >= bird_props.left &&
          element.increase_score == '1'
        ) {
          score_val.innerHTML = +score_val.innerHTML + 1;
          element.increase_score = '0';
          increaseSpeed(); 
        }


        // Move o obstáculo
        element.style.left = pipe_sprite_props.left - move_speed + 'px';
      }
    }
  });

  // Chama o move() novamente para o próximo frame
  requestAnimationFrame(move);
}

// Inicia o loop do jogo
requestAnimationFrame(move);

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != 'Play') return;
    bird_dy = bird_dy + gravity;
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird_dy = -7.6;
      }
    });

    // Detecta se o pássaro colidiu

    if (bird_props.top <= 0 ||
        bird_props.bottom >= background.bottom) {
      game_state = 'End';
      message.innerHTML = 'Press Enter To Restart';
      message.style.left = '28vw';
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;

  // Constant value for the gap between two pipes
  let pipe_gap = 35;
  function create_pipe() {
    if (game_state != 'Play') return;

    // Cria um novo elemento de obstáculo 
    // a cada 115px de movimento
    // e o adiciona ao DOM
    if (pipe_seperation > 115) {
      pipe_seperation = 0

      // Calcula a posição do obstáculo
      // e cria o elemento de obstáculo
      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';

      // Adiciona o elemento de obstáculo
      // ao DOM
      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.dataset.increaseScore = '1';


      // Adiciona o elemento de obstáculo 

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
   }
function saveAndDisplayHighScores(score) {
  let highScores = JSON.parse(localStorage.getItem('flappy_high_scores')) || [];
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 5); // Mantém apenas top 5
  localStorage.setItem('flappy_high_scores', JSON.stringify(highScores));

  let highScoreText = '<br><strong>Top 5 Pontuações:</strong><br>';
  highScores.forEach((s, i) => {
    highScoreText += `${i + 1}. ${s}<br>`;
  });
  message.innerHTML += highScoreText;
}
saveAndDisplayHighScores(parseInt(score_val.innerHTML));