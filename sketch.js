var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var obstacle,ob1,ob2,ob3,ob4,ob5,ob6;
var gameOver,restart,gameOverImage,restartImage;
var checkPointSound, jumpSound, expireSound;

var obstacleGroup, cloudGroup;

var cloud,cloudImage;

var score = 0;

var play=1;

var gameState = play;

var end = 0;

function preload(){
  trex_running =      loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  checkPointSound = loadSound('checkPoint.mp3');
  jumpSound = loadSound('jump.mp3');
  expireSound = loadSound('die.mp3');
  
  groundImage = loadImage("ground2.png");
  
  ob1 = loadImage('obstacle1.png');
  ob2 = loadImage('obstacle2.png');
  ob3 = loadImage('obstacle3.png');
  ob4 = loadImage('obstacle4.png');
  ob5 = loadImage('obstacle5.png');
  ob6 = loadImage('obstacle6.png'); 
  
  cloudImage = loadImage("cloud.png");
  
  gameOverImage = loadImage('gameOver.png');
  restartImage = loadImage('restart.png');
}

function setup() {
  background(220)
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.debug=false;
  trex.setCollider('rectangle',0,0,80,100)
  trex.addAnimation('collided',trex_collided);
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //generate random numbers
 // var rand =  Math.round(random(1,100))
 // console.log(rand)
  
  gameOver = createSprite(300,70,13,13);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,100,13,13);
  restart.addImage(restartImage);
  restart.scale = 0.3;
  restart.visible = false;
  
  cloudGroup=createGroup();
  obstacleGroup=createGroup();

}

function draw() {
  //set background color
  background(150);
  
  if(gameState===play){
    if(score%500===0 && score>0){
      checkPointSound.play();
    }
    //everytime score = a multiple of 100, ground will get faster
    ground.velocityX = -(4+score/100);
    score=score+Math.round(frameRate()/60);  
    
  // jump when the space key is pressed
  if(keyDown("space")&& trex.y >= 160) {
    trex.velocityY = -15;
    jumpSound.play();
  }
    //Gives gravity
    trex.velocityY = trex.velocityY + 0.8
    
  //So the ground is infinite
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  spawnClouds();
  
  movingObstacle();
    
   if(obstacleGroup.isTouching(trex)) {
     gameState = end;
     expireSound.play();
   }
    
  }
  
  else if(gameState===end){
    
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
 
    trex.velocityY = 0;
    
    
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    trex.changeAnimation('collided',trex_collided);
    
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
      reset()
    }
  }
  
    fill('black');
    textSize(16);
    text('Score:'+ score,500,15);

  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  drawSprites();
  
  
}

//function to spawn the clouds
function spawnClouds(){
 // write your code here 
  
  
  if(frameCount%100===0){
    
  cloud = createSprite(600,100,10,10);
  
  cloud.velocityX = -4;
    
    
  cloud.addImage(cloudImage);
    
  cloud.scale = 0.5;  
  
  cloud.y=random(50,100);
    
  trex.depth=cloud.depth+1
    
  cloud.lifetime = 150;
    
  cloudGroup.add(cloud);
  } 
  
  
}


function movingObstacle(){
  if(frameCount%80===0){
    
    obstacle = createSprite(600,170,10,10);
    
    obstacle.velocityX = -(4+score/100);
        
    var rand = Math.round(random(1,6))
    
    switch(rand){
        
      case 1:  obstacle.addImage(ob1);
      break;
      
      case 2 : obstacle.addImage(ob2);
      break;
        
      case 3 : obstacle.addImage(ob3);
      break; 
        
      case 4 : obstacle.addImage(ob4);
      break;
      
      case 5 : obstacle.addImage(ob5);
      break;
     
      case 6 : obstacle.addImage(ob6);
      break;
      
      default:break;
     
    }
    
    obstacle.scale = 0.5;
    
    obstacle.lifetime = 150;
    
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gameState = play;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();

  gameOver.visible = false;
  restart.visible = false;
  score = 0;
  
  trex.changeAnimation("running", trex_running);
  
}