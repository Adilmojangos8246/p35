//Create variables here
var dog, happydog, database, foodS, FoodStock;
var lastFed, fedTime, foodObj;
function preload() {
  //load images here
  dog1 = loadImage("dogImg.png");
  happydog1 = loadImage("dogImg1.png");
  milkBottle = loadImage("Milk.png");
}

function setup() {
  createCanvas(1000, 500);
  database = firebase.database();
  dog = createSprite(200, 200);
  dog.addImage(dog1);
  dog.scale = 0.25;

  FoodStock = database.ref("food");
  FoodStock.on("value", readpStock);

  foodObj = new Food();
  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);

  if (keyWentDown(UP_ARROW)) {
    writeStock(foodS);
    dog.addImage(happydog);
  }

  fedTime = database.ref("feedTime");
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  foodObj.display();

  drawSprites();
  //add styles here

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last feed : " + (lastFed % 12) + "PM", 350, 30);
  } else if (lastFed == 0) {
    text("Last feed : 12 AM", 350, 30);
  } else {
    text("Last feed:" + lastFed + "AM", 350, 30);
  }
}
function readpStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  database.ref("/").update({
    food: x,
  });
}
*/
function addFoods() {
  foodS++;
  database.ref("/").update({
    Food: foodS,
  });
}

function feedDog() {
  dog.addImage(happydog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
  });
}
