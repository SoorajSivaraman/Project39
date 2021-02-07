var r, nero , nero_running, restartIcon;
var obstacle, obstacleImage1, obstacleImage2, obstacleImage3, obstacleImage4, restartIconImg;
var bgrd1, bgrd2, bgrdEndImage, bgrdImg;
var upperInvisible, lowerInvisible;
var lifeCount = 25;
var obstaclesGroup;
var gameState = "begin";
var startTime = null;
var latestTime = null; 
var elapsedTime = null;
let beginMusic, rockHitSound, restartMusic, endSound;

function preload()
{
 soundFormats('mp3','wav');
 endSound = loadSound("starWarsTheme.mp3");
 beginMusic = loadSound("spaceVoyagerNeroIntro.wav");
 rockHitSound = loadSound("explosion.wav");
 restartMusic = loadSound("restartMusic.wav");
 
 nero_running = loadAnimation("nero1.png", "nero2.png", "nero3.png");
 obstacleImage1 = loadImage("rock.png");
 obstacleImage2 = loadImage("meteor1.png");
 obstacleImage3 = loadImage("meteor2.png");
 obstacleImage4 = loadImage("meteor3.png");
 bgrdImg = loadImage("space.jpg");
 restartIconImg = loadImage("restartIcon.png")
 bgrdEndImage = loadImage("nero-mars.png");
}

function setup() 
{
  createCanvas(displayWidth, displayHeight - 112);

  if(gameState === "begin") 
  {
    beginMusic.play();
    background("lightblue");
    fill("maroon");
    textFont("Lucida Calligraphy");
    textSize(30);
    text("Space Voyager Nero!!", displayWidth - 900, displayHeight - 700);
    textSize(20);
    text("Rules of the Game:", displayWidth - 1100, displayHeight - 638.5);
    text("1) Friends !! You are the SPACE ASTRONAUT NERO !!", displayWidth - 1100, displayHeight - 575);
    text("2) The game is about ASTRONAUT NERO exploring\n    Space by overcoming all the obstacles.", displayWidth - 1100, displayHeight - 525);
    text("3) Nero has to survive as long as possible using 25 lives.", displayWidth - 1100, displayHeight - 450);
    text("4) Use the UP and DOWN arrows to help NERO avoid \n    obstacles in the form of METEORS.", displayWidth - 1100, displayHeight - 400);
    text("5) NERO loses a life for every METEOR bombarded.", displayWidth - 1100, displayHeight - 325);
    text("6) Press the blue RESTART icon on the right top, if you \n    want to replay the game.", displayWidth - 1100, displayHeight - 275);
    text("7) Press SPACE to Start the Game.", displayWidth - 1100, displayHeight - 200);
  }
  obstaclesGroup = createGroup();

  bgrd1 = createSprite(camera.position.x + 683, (displayHeight - 112)/2, displayWidth, displayHeight);
  bgrd1.addImage(bgrdImg);
  bgrd1.scale = 0.76;
  bgrd1.visible = false;

  bgrd2 = createSprite(camera.position.x + 2049, (displayHeight - 112)/2, displayWidth, displayHeight);
  bgrd2.addImage(bgrdImg);
  bgrd2.scale = 0.76;
  bgrd2.visible = false;

  nero = createSprite(camera.position.x + 80, (displayHeight - 112)/2, 20, 20);
  nero.addAnimation("moving", nero_running);
  nero.scale = 0.15;
  nero.visible = false;
  
  upperInvisible = createSprite(displayWidth/2, displayHeight - 748, displayWidth, 5);
  upperInvisible.visible = false;
  lowerInvisible = createSprite(displayWidth/2, displayHeight - 132, displayWidth, 5);
  lowerInvisible.visible = false;
  
  restartIcon = createSprite(displayWidth - 200, displayHeight - 753, 10, 10);
  restartIcon.addImage(restartIconImg);
  restartIcon.scale = 0.02;
  restartIcon.visible = false;
}

function draw() 
{
  if(keyDown("space") && gameState === "begin")
  {
    beginMusic.stop();
    gameState = "play";
    startTime = new Date();
  }  
  
  if(gameState === "play")
  {
    latestTime = new Date();
    elapsedTime = (latestTime - startTime)/1000;  
    bgrd1.visible = true;
    bgrd2.visible = true;
    nero.visible = true;
    restartIcon.visible = true;

    bgrd1.velocityX = -2;
    bgrd2.velocityX = -2;

    createObstacles();

    nero.collide(upperInvisible);  
    nero.collide(lowerInvisible);

    camera.position.x = nero.x + 608;
    camera.position.y = (displayHeight - 112)/2;
    
    if(bgrd2.x === camera.position.x - 5) bgrd1.x = camera.position.x + 1361;
    if(bgrd1.x === camera.position.x - 5) bgrd2.x = camera.position.x + 1361;

    if(keyDown("up")) nero.velocityY = -10; 
    if(keyDown("down")) nero.velocityY = 10;
    if(keyWentUp("up") || keyWentUp("down"))   nero.velocityY = 0;
      
    if(nero.isTouching(obstaclesGroup)) 
    {
      obstaclesGroup.destroyEach();
      lifeCount = lifeCount - 1;
      rockHitSound.play();
      if(lifeCount === 0) 
      {
        gameState = "end";
        endSound.play();
      }
    }
      if(mousePressedOver(restartIcon)) restartPressed(); 
  }

  if(gameState === "end")
  {
    nero.destroy();
    bgrd1.destroy();
    bgrd2.destroy();
    obstaclesGroup.destroyEach();
    restartIcon.visible = false;
    background(bgrdEndImage);
  }  
  
  drawSprites();

  if(gameState === "play")
  {  
    fill("white");
    textSize(15);
    textFont("Segoe Print");  
    text("Lives left: " + lifeCount, displayWidth - 1200, displayHeight - 748);
    if(Math.round(elapsedTime) === 1)
        text("Survival Time: " + Math.round((elapsedTime)) + " second", displayWidth - 760, displayHeight - 748);
    else 
        text("Survival Time: " + Math.round((elapsedTime)) + " seconds", displayWidth - 760, displayHeight - 748);  
  }
  
  if(gameState === "end")
    {
      fill("black");
    textSize(30);
    textFont("Lucida Calligraphy");
     if(Math.round(elapsedTime) === 1)
        text("Game Over !! Zero lives left !! \nYou have Survived " + Math.round(elapsedTime) + " second.", displayWidth - 1316, displayHeight - 450); 
     else 
        text("Game Over !! Zero lives left !! \nYou have Survived " + Math.round(elapsedTime) + " seconds.", displayWidth - 1316, displayHeight - 450);
    }
}

function createObstacles()
{
  r = Math.round(random(1, 4));
  if(World.frameCount % 10 === 0)
  {
    obstacle = createSprite(2*camera.position.x - 10, Math.round(random(displayHeight - 740, displayHeight - 140)), 20, 20);
    
    if(r === 1)
    {
      obstacle.addImage(obstacleImage1);
      obstacle.scale = 0.06;
    }
    else if(r === 2) 
    {obstacle.addImage(obstacleImage2);
     obstacle.scale = 0.27;
    }
    else if(r === 3)
    {
      obstacle.addImage(obstacleImage3);
      obstacle.scale = 0.12;
    }
    else
    {
      obstacle.addImage(obstacleImage4);
      obstacle.scale = 0.17;
    }  
    obstacle.velocityX = -50;
    obstacle.lifetime = 100;
    obstaclesGroup.add(obstacle);
  }  
}

function restartPressed()
{
   restartMusic.play();
   startTime = new Date();
   lifeCount = 25;
}