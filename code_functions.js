function redraw_world(world, context) 
{
	//convert the canvas coordinate directions to cartesian
	ctx.save();
	ctx.translate(0 , canvas_height);
	ctx.scale(1 , -1);
	world.DrawDebugData();
	ctx.restore();
	}

	

function createPox(world, x, y, width, height, options) 
{
	 //default setting
	options = $.extend(true, {
		'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.5 ,		
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,		
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_staticBody
	}, options);

	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	fix_def.shape = new b2PolygonShape();
	nw=width/scale;
	nh=height/scale;
	nx=x/scale;
	ny=y/scale;
 	nx=nx+(nw*1);
 	ny=ny+(nh*1);
	ny = game.screen_height-ny;
	fix_def.shape.SetAsBox( nw , nh );
	body_def.position.Set(nx , ny);
	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	body_def.type = options.type;
	
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);

	return b;
}

function createShape(world, x, y,cords,options) 
{
	 //default setting
	options = $.extend(true, {
	'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.5 ,
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_staticBody
	}, options);
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	fix_def.shape = new b2PolygonShape();
	nx=x/scale;
	ny=y/scale;
	ny = game.screen_height-ny;
	s=1/scale;
	  	
tt = new Array;
	for (var i=0; i<cords.length; i=i+2) {
		tt.push(new b2Vec2(s*cords[i], -1*(s*cords[i+1])));
	}
fix_def.shape.SetAsArray(tt);
	body_def.position.Set(nx , ny);
	body_def.linearDamping = options.linearDamping;
	body_def.userData = options.userdata;
		body_def.type = options.type;
	body_def.angularDamping = options.angularDamping;
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);
	return b;
}

function createBox(world, x, y, width, height, options) 
{
	 //default setting
	options = $.extend(true, {
		'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.2 ,
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_dynamicBody
	}, options);
	
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	fix_def.shape = new b2PolygonShape();
	fix_def.shape.SetAsBox( width , height );
	body_def.position.Set(x , y);
	body_def.userData = options.userdata;
	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	body_def.type = options.type;
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);
	return b;
}

function createCircle(world, x, y, radius, options) 
{
	options = $.extend(true, {
		'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.2 ,
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_dynamicBody
	}, options);
	
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	fix_def.shape = new b2CircleShape(radius);
	body_def.position.Set(x , y);
	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	body_def.type = options.type;
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);
	return b;
}



function flipcirc(world, x, y, radius, options) 
{
	options = $.extend(true, {
		'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.2 ,
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_staticBody
	}, options);
	
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	fix_def.shape = new b2CircleShape(radius/scale);

	nx=x/scale;
	ny=y/scale;
	ny = game.screen_height-ny;

console.log(scale);

	body_def.position.Set(nx,ny);

	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	body_def.type = options.type;
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);
	return b;
}





function game_loop() 
{
	var fps = 60;
	var time_step = 1.0/fps;
	rotcn();
	world.Step(time_step , 8 , 3);
	world.ClearForces();
	redraw_world(world , ctx);
	setTimeout('game_loop()', 1000/60);
}

function create_circ(x,y,dd){
//console.log(dd);
circ.body = createCircle(world, x/scale, game.screen_height-(y/scale),rd ,{ 'density' : 2.0 });

impulse = new b2Vec2(pwr*Math.cos(dd*Math.PI/180),pwr*Math.sin(dd*Math.PI/180));

circ.body.ApplyImpulse(impulse, circ.body.GetWorldCenter());
}

function c(x){console.log(x);}

function rotcn(){
nw=nw+chng;
nw = (nw<0)? nw=360+nw:nw;
nw = (nw>360)? nw=nw-360:nw;
		$('#cnnon').css('-webkit-transform','rotate('+nw+'deg)');
		$('#cnnon').css('-moz-transform','rotate('+nw+'deg)'); 
		$('#cnnon').css('-ms-transform','rotate('+nw+'deg)');
		$('#cnnon').css('-o-transform','rotate('+nw+'deg)');
		$('#cnnon').css('transform','rotate('+nw+'deg)');  
}


