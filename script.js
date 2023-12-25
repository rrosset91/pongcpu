const canvas = document.getElementById( "gameCanvas" );
const ctx = canvas.getContext( "2d" );
const audio1 = document.getElementById( "audio1" );
const audio2 = document.getElementById( "audio2" );
const ballSize = 10;
let gameStarted = false;
let ballColor = "#f00";
let balls = [];
const initialSpeed = 1;
const angleVariation = 1.1;

function Ball ( x, y, speedX, speedY, color ) {
	this.x = x;
	this.y = y;
	this.speedX = speedX;
	this.speedY = speedY;
	this.color = color;
}

function drawGame () {
	// Desenha o fundo
	ctx.fillStyle = "#000";
	ctx.fillRect( 0, 0, canvas.width, canvas.height );

	// Desenha todas as bolas
	balls.forEach( ball => {
		ctx.fillStyle = ball.color;
		ctx.fillRect( ball.x - ballSize / 2, ball.y - ballSize / 2, ballSize, ballSize );
	} );
}

function createBallAtOppositeSide ( originalBall ) {
	let oppositeX = originalBall.x;
	let oppositeY = originalBall.y;
	let oppositeSpeedX = -originalBall.speedX;
	let oppositeSpeedY = -originalBall.speedY;

	if ( originalBall.y < 0 )
	{
		oppositeY = canvas.height;
	} else if ( originalBall.y > canvas.height )
	{
		oppositeY = 0;
	}

	if ( originalBall.x < 0 )
	{
		oppositeX = canvas.width;
	} else if ( originalBall.x > canvas.width )
	{
		oppositeX = 0;
	}

	const newBall = new Ball( oppositeX, oppositeY, oppositeSpeedX, oppositeSpeedY, getRandomColor() );
	balls.push( newBall );
}

function updateGame () {
	for ( let i = 0; i < balls.length; i++ )
	{
		for ( let j = i + 1; j < balls.length; j++ )
		{
			checkBallCollision( balls[i], balls[j] );
		}
	}

	balls.forEach( ball => {
		ball.x += ball.speedX;
		ball.y += ball.speedY;

		if ( ball.y < 0 || ball.y > canvas.height )
		{
			playSound( 1 );
			ball.speedY *= -1;
			changeBallColor( ball );
			createBallAtOppositeSide( ball );
		}

		if ( ball.x < 0 || ball.x > canvas.width )
		{
			playSound( 1 );
			ball.speedX *= -1;
			changeBallColor( ball );
			createBallAtOppositeSide( ball );
		}
	} );
}

function startMovement ( directionX, directionY ) {
	const angleVariationX = ( directionX === 1 ) ? angleVariation : -angleVariation;
	const angleVariationY = ( directionY === 1 ) ? angleVariation : -angleVariation;

	const newBall = new Ball( canvas.width / 2, canvas.height / 2, initialSpeed * directionX + angleVariationX, initialSpeed * directionY + angleVariationY, getRandomColor() );
	balls.push( newBall );
}

document.addEventListener( "keydown", ( event ) => {
	if ( gameStarted ) return;

	if ( event.key === "ArrowLeft" || event.key === "a" )
	{
		startMovement( -1, 0 );
	} else if ( event.key === "ArrowRight" || event.key === "d" )
	{
		startMovement( 1, 0 );
	}
	gameStarted = true;
} );

function changeBallColor ( ball ) {
	ball.color = getRandomColor();
}

function getRandomColor () {
	const colors = ["#ff0000", "#00ff00", "#0000ff", "#d142f5", "#00ffa2", "#ff00ff", "#ffff00", "#00ffff", "#ff03bc"];
	const randomIndex = Math.floor( Math.random() * colors.length );
	return colors[randomIndex];
}

function gameLoop () {
	drawGame();
	updateGame();
}

function checkBallCollision ( ballA, ballB ) {
	const dx = ballB.x - ballA.x;
	const dy = ballB.y - ballA.y;
	const distance = Math.sqrt( dx * dx + dy * dy );

	if ( distance < ballSize )
	{
		playSound( 2 );
		const angle = Math.atan2( dy, dx );
		const sin = Math.sin( angle );
		const cos = Math.cos( angle );

		// Rotaciona as velocidades
		const velocityX1 = ballA.speedX * cos + ballA.speedY * sin;
		const velocityY1 = ballA.speedY * cos - ballA.speedX * sin;
		const velocityX2 = ballB.speedX * cos + ballB.speedY * sin;
		const velocityY2 = ballB.speedY * cos - ballB.speedX * sin;

		// Troca as velocidades na direção x
		ballA.speedX = cos * velocityX2 - sin * velocityY1;
		ballA.speedY = sin * velocityX2 + cos * velocityY1;
		ballB.speedX = cos * velocityX1 - sin * velocityY2;
		ballB.speedY = sin * velocityX1 + cos * velocityY2;
	}
}

function playSound ( type ) {
	if ( type === 1 )
	{
		audio1.play();
	}
	else
	{
		audio2.play();
	}
}

setInterval( gameLoop, 1000 / 60 );
