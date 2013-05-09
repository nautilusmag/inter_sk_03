
//Get the objects of Box2d Library
var b2Vec2 = Box2D.Common.Math.b2Vec2
	,  	b2AABB = Box2D.Collision.b2AABB
	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
	,	b2Body = Box2D.Dynamics.b2Body
	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	,	b2Fixture = Box2D.Dynamics.b2Fixture
	,	b2World = Box2D.Dynamics.b2World
	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	,  	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
	,  	b2Shape = Box2D.Collision.Shapes.b2Shape
	,	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	,	b2Joint = Box2D.Dynamics.Joints.b2Joint
	,	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
		,	b2Settings = Box2D.Common.b2Settings
	;
         
var game = {
	
'key_down' : function(e)
{
var code = e.keyCode;



//console.log(code);
if (code == 65){l_flppddl.ApplyTorque(100);}
if (code == 83){r_flppddl.ApplyTorque(-100);}

//left
if(code == 37){chng = -1;}
//right
if(code == 39){chng = 1;}
//fire
if(code == 38){

// nw = (nw == 90)? 91:nw;
// nw = (nw == 270)? 271:nw;
var theta = (nw-90)*Math.PI/180;
var x = (Math.cos(theta) * 355)+365;
var y = (Math.sin(theta) * 355)+365;

ddy = y - 365;
ddx = (730-x) - 365;
ang = (Math.atan2(ddy,ddx) * 180 / Math.PI);
create_circ(x,y,ang);
}} ,

'key_up' : function(e)
{
var code = e.keyCode;
chng = 0;


} ,
	'screen_width' : 0 ,
	'screen_height' : 0 ,
};

var world;
var ctx;
var canvas_height;
var nw = 0;
var chng = 0;
var pwr=0.9;
var rd = 12;
//1 metre of box2d length becomes 100 pixels on canvas
var scale = 100;
var l_flppddl;
var r_flppddl;


var circ = {
'restitution' : 2.0 , 
'linearDamping' : 1.0 , 
'angularDamping' : 1.0 , 
'density' : 2.2, 
'x_force':0,
'y_force':0,
'fx':0,
'fy':0,
};


$(function() 
{
	game.ctx = ctx = $('#canvas').get(0).getContext('2d');
	var canvas = $('#canvas');
	game.canvas_width = canvas_width = parseInt(canvas.width());
	game.canvas_height = canvas_height = parseInt(canvas.height());
	game.screen_width = game.canvas_width / scale;
	game.screen_height = game.canvas_height / scale;
	world = createWorld();

	$(document).keydown(function(e)
	{
		game.key_down(e);
		//return false;
	});
	
	$(document).keyup(function(e)
	{
		game.key_up(e);
		//return false;
	});
	
	//Start the Game Loop!!!!!!!
	game_loop();
});



function createWorld() 
{
	var gravity = new b2Vec2(0, -8.5);
	var doSleep = true;
	
	world = new b2World(gravity , doSleep);
	
	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(scale);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	world.SetDebugDraw(debugDraw);
	
createPox(world,0,0,.01,810,{ 'userdata' : "lft_wall" });	
createPox(world,539.09,0,.01,710,{ 'userdata' : "rgt_wall" });	
createPox(world,509.09,120,.01,330,{ 'userdata' : "shoot_wall" });	
createPox(world,0,0,540,.01,{ 'userdata' : "top_wall" });	

createShape(world,0,0,[0,0,0,120,120,0,],{ 'userdata' : "upper_left_triangle" });		
createShape(world,450,0,[0,0,90,90,90,0,],{ 'userdata' : "upper_right_triangle" });		
createShape(world,0,180,[0,0,0,180,60,120,60,60],{ 'userdata' : "left_banker" });		
createShape(world,510,120,[0,0,-90,150,-90,210,0,210,],{ 'userdata' : "right_banker" });		

createShape(world,60,450,[0,0,0,120,120,180],{ 'userdata' : "low_left_tri" });		
createShape(world,355,630,[0,0,120,-60,120,-180],{ 'userdata' : "low_left_tri" });		
createShape(world,30,600,[0,0,0,180,75,105,75,45],{ 'userdata' : "bot_left" });		
createShape(world,30,705,[0,0,0,75,210,75,75,0],{ 'userdata' : "bot_leftb" });		

createShape(world,510,600,[0,0,-75,45,-75,105,0,180],{ 'userdata' : "bot_right" });		
createShape(world,300,780,[0,0,210,0,210,-75,135,-75],{ 'userdata' : "bot_rightb" });		

// flip_left = createShape(world,240,540,[0,0,30,150,60,0],{ 'userdata' : "flipleft" });		
// flip_base = createShape(world,240,510,[0,0,0,60,60,60,60,0],{ 'userdata' : "flipleft" });		


l_flppddl = createShape(world,135-28,675,[0,0,28,120,56,0],{ 'userdata' : "bot_left",'type' : b2Body.b2_dynamicBody });		
l_flpcirc = createCircle(world, 135,675, 28,{'type' : b2Body.b2_staticBody});
var jointDef = new b2RevoluteJointDef();
jointDef.Initialize(l_flpcirc, l_flppddl, l_flpcirc.GetWorldCenter());
jointDef.upperAngle = (120/180) * b2Settings.b2_pi;   
jointDef.lowerAngle = (57/180) * b2Settings.b2_pi; 

jointDef.enableLimit = true;


jointDef.maxMotorTorque = 0.0;  
jointDef.motorSpeed = 10.0;  
jointDef.enableMotor = true;  

world.CreateJoint(jointDef);


r_flppddl = createShape(world,405-28,675,[0,0,28,120,56,0],{ 'userdata' : "bot_left",'type' : b2Body.b2_dynamicBody });		
r_flpcirc = createCircle(world, 405,675, 28,{'type' : b2Body.b2_staticBody});
var rjointDef = new b2RevoluteJointDef();
rjointDef.Initialize(r_flpcirc, r_flppddl, r_flpcirc.GetWorldCenter());
rjointDef.upperAngle = (-57/180) * b2Settings.b2_pi;   
rjointDef.lowerAngle = (-120/180) * b2Settings.b2_pi; 
rjointDef.enableLimit = true;

rjointDef.maxMotorTorque = 0.0;  
rjointDef.motorSpeed = 10.0;  
rjointDef.enableMotor = true;  



world.CreateJoint(rjointDef);




//http://www.gaanza.com/blog/pinball-flipper-with-box2d/



	return world;
}	







