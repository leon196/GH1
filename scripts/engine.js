var renderer, resolution, aspectRatio;
var stage, sprite, filter, text;
var renderTexture1, renderTexture2, currentTexture;
var timeStarted, timeElapsed, timeScale;

PIXI.loader.add('shader','shaders/test.frag');
PIXI.loader.add('video','videos/No Doubt - Don\'t Speak.mp4');
PIXI.loader.once('complete', onLoaded);
PIXI.loader.load();

function CustomFilter (fragmentSource)
{
	PIXI.AbstractFilter.call(this, null, fragmentSource, { uTime : { type : '1f', value : 0 } } );
}

CustomFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
CustomFilter.prototype.constructor = CustomFilter;

function onLoaded (loader, res)
{
	aspectRatio = window.innerWidth / window.innerHeight;
	// resolution = { x: 256 * aspectRatio, y: 256 };
	resolution = { x: window.innerWidth, y: window.innerHeight };
	renderer = new PIXI.WebGLRenderer(resolution.x, resolution.y);
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	renderTexture1 = new PIXI.RenderTexture(renderer, resolution.x, resolution.y, PIXI.SCALE_MODES.NEAREST);
	renderTexture2 = new PIXI.RenderTexture(renderer, resolution.x, resolution.y, PIXI.SCALE_MODES.NEAREST);
	currentTexture = renderTexture1;
	sprite = new PIXI.Sprite(currentTexture);
	stage.addChild(sprite);

	text = new PIXI.Text('SCREENSAVING',{font : '24px Arial', fill : 0xffffff, align : 'center'});
	text.anchor.set(0.5);
	text.position.x = resolution.x / 2;
	text.position.y = resolution.y / 2;
	stage.addChild(text);


	var videoSprite = new PIXI.Sprite(PIXI.Texture.fromVideo('videos/No Doubt - Don\'t Speak.mp4'));

	videoSprite.width = renderer.width;
	videoSprite.height = renderer.height;

	stage.addChild(videoSprite);

	var fragmentSrc = res.shader.data;
	filter = new CustomFilter(fragmentSrc);
	stage.filters = [filter];

	timeScale = 1000;
	timeStarted = new Date() / timeScale;
	timeElapsed = 0;

	animate();
}

function animate() 
{
	timeElapsed = new Date() / timeScale - timeStarted;

	requestAnimationFrame(animate);

	filter.uniforms.uTime.value = timeElapsed;
	text.tint = 0xffffff * Math.random();
	text.scale.x = 1. + Math.cos(timeElapsed * 10.) * 0.5 + 0.5;
	text.scale.y = 1. + Math.sin(timeElapsed * 10.) * 0.5 + 0.5;

	var temp = renderTexture1;
	renderTexture1 = renderTexture2;
	renderTexture2 = temp;
	sprite.texture = renderTexture1;

	renderTexture2.render(stage, null, false);
	renderer.render(stage);
}