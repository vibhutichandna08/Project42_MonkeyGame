var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running, monkeyImage;
var banana, bananaImage, foodGroup;
var stone, stoneImage, obstacleGroup;
var jungle, jungleImage;
var score;
var ground;
var count;
var gameOver, gameOverImage;

function preload() {
  monkey_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");
  
  monkeyImage = loadImage("Monkey_02.png");

  jungleImage = loadImage("jungle.jpg");
  bananaImage = loadImage("banana.png");
  stoneImage = loadImage("stone.png");
  
  gameOverImage = loadImage("gameOver.png");
}

function setup() {
  createCanvas(600, 400);

  jungle = createSprite(500, 150, 1200, 20);
  jungle.addImage("jungle", jungleImage);
  jungle.x = jungle.width / 2;
  jungle.scale = 1.2;

  monkey = createSprite(50, 390, 20, 20);
  monkey.addAnimation("moving", monkey_running);
  monkey.addImage("collided", monkeyImage);
  monkey.scale = 0.1;


  ground = createSprite(200, 390, 1200, 10);
  ground.visible = false;
  
  gameOver = createSprite(300, 200);
  gameOver.addImage("gameOver", gameOverImage);
  //gameOver.scale=0.1;

  FoodGroup = createGroup();
  obstacleGroup = createGroup();

  score = 0;
  count = 0;
}

function draw() {
  background(220);
  
  jungle.velocityX = -6;
  
  if (jungle.x < 0) {
      jungle.x = jungle.width / 2;
    }

  if(gameState === PLAY){
    
    gameOver.visible = false;
    
    //jump when the space key is pressed
    if (keyDown("space") && monkey.y >= 320) {
      monkey.velocityY = -20;
    }

    if (monkey.isTouching(FoodGroup)) {
      score = score + 2;
      FoodGroup.destroyEach();
    }

    if (monkey.isTouching(obstacleGroup)) {
      monkey.scale = 0.1;
      obstacleGroup.destroyEach();
      score = 0;
      count = count + 1;
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;

    food();
    spawnObstacles();

    switch (score) {
      case 10:monkey.scale = 0.12;
            break;
      
      case 20:monkey.scale = 0.14;
            break;
      
      case 30:monkey.scale = 0.16;
            break;
      
      case 40:monkey.scale = 0.18;
            break;
      
      default:break;

    }
    
    if(count === 2){
      gameState = END;
    }

  }
  
  if(gameState === END){
     gameOver.visible = true;
    
    jungle.velocityX = 0;
    monkey.velocityY = 0;
    
    obstacleGroup.destroyEach();
    FoodGroup.destroyEach();
    
    monkey.changeAnimation("collided", monkeyImage);
  }
  
  //preventing the monkey from falling down
  monkey.collide(ground);

  drawSprites();

  //displaying the text
  stroke("white");
  textSize(20);
  fill("white");
  text("Score: " + score, 470, 50);
  
  textSize(18);
  fill("aqua");
  text("Number of deaths: " + count, 50, 50);
}

function food() {

  if (frameCount % 60 === 0) {
    banana = createSprite(600, 120, 40, 10);
    banana.y = Math.round(random(100, 200));
    banana.addImage("banana", bananaImage);
    banana.scale = 0.05;
    banana.velocityX = -4;


    //assign lifetime to the variable
    banana.lifetime = 150;

    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each banana to the group
    FoodGroup.add(banana);
  }
}

function spawnObstacles() {
  if (frameCount % 200 === 0) {
    stone = createSprite(600, 370, 40, 10);
    stone.addImage("obstacle", stoneImage);

    stone.scale = 0.1;
    stone.velocityX = -6;

    //assign lifetime to the variable
    stone.lifetime = 150;

    //add each obstacle to the group
    obstacleGroup.add(stone);
  }
}