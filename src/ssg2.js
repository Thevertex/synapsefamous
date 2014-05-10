define(function (require, exports, module) {

    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var EventHandler    = require('famous/core/EventHandler');
    var View            = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var RenderNode = require('famous/core/RenderNode');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var Vector = require('famous/math/Vector');
    var Scene = require("famous/core/Scene");
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Body            = require('famous/physics/bodies/Body');
    var Circle          = require('famous/physics/bodies/Circle');
    
    var r = 25;
    
    // Calculate constants that will be used to generate vertices
    var phi = (Math.sqrt(5) - 1) / 2; // The golden ratio
    var R = (r / Math.sqrt(3));

    var a = (R * 1);
    var b = R / phi;
    var c = R * phi;

    // Generate each vertex
    var vertices = new Array();
    
    for (var i = -1; i < 2; i += 2) {
        for (var j = -1; j < 2; j += 2) {
            vertices.push({
                x:0,
                y:i * c * R,
                z:j * b * R});
            vertices.push({
                x:i * c * R,
                y:j * b * R,
                z:0});
            vertices.push({
                x:i * b * R,
                y:0,
                z:j * c * R});

            for (var k = -1; k < 2; k += 2)
                vertices.push({
                    x:i * a * R,
                    y:j * a * R,
                    z:k * a * R});
        }
    }
    

    var SsgScene = new Scene({
        id: "root",
        opacity: 1,
    });

    // create the main context
    var mainContext = Engine.createContext();
    var PE = new PhysicsEngine();
    var handler = new EventHandler();
    var balls = new Array();
        
    for( var i=0; i<vertices.length; i++ ){
            
        var ball = new Surface ({
          size: [50,50],
          properties: {
            backgroundColor: 'gray',
            borderRadius: '100px'
          }
        })

        // Create a physical particle with position (p), velocity (v), mass(m)
        ball.particle = new Particle({
            mass: 1,
            position: [vertices[i].x, vertices[i].y, vertices[i].z],
            velocity: [1, 0, 0]
        });
        
        ball.state = new StateModifier({origin:[0.5,0.5]});

        // Create a spring that will act on the particle
        ball.spring = new Spring({
            anchor: [vertices[i].x, vertices[i].y, vertices[i].z],
            period: 400, // <= Play with these values :-)
            dampingRatio: 0.07, // <=
            length: 0
        });


        // Link the spring, particle and surface together
        PE.attach(ball.spring, ball.particle);
        PE.addBody(ball.particle);
        
        /*ball.on("click", function (e) {
            ball.particle.applyForce(new Vector(0, 0, -0.005 * 100));
        });*/
        
        /*collision = new @fam.Collision({restitution : 0.7 })
		@physicsEngine.attach(collision, unit1.body, unit2.body)
		console.log("addCollision", unit1, unit2)
		collision.on 'collision', (evt) =>*/
        
        mainContext.add(ball.state).add(ball.particle).add(ball);
        
        balls.push(ball);
        /*balls[balls.length-1].on("click",function(){
          balls[balls.length-1].particle.setVelocity([1,1,0]);
        });*/
    }
    
    
     // your app here
    var logo = new ImageSurface({
        size: [229, 227],
        content: 'content/images/ssg-logo.png',
        classes: ['backfaceVisibility']
    });
    
    // Create a physical particle with position (p), velocity (v), mass(m)
    var particle = new Particle({
      mass: 1,
      position: [0, 0, 0],
      velocity: [1, 1, 1]
    });

    // Create a spring that will act on the particle
    var spring = new Spring({
      anchor: [0, 0, 0],
      period: 400,  // <= Play with these values :-)
      dampingRatio: 0.07, // <=
      length: 0
    });

    // Apply a force on the surface when its clicked
    logo.on("click", function (e) {
      particle.applyForce(new Vector(0, 0, -0.005 * 100));
    });

    // Link the spring, particle and surface together
    PE.attach(spring, particle);
    PE.addBody(particle);

    // Create the scene, applying a top level modifier to center
    // the scene vertically in the viewport
    mainContext.add(new Modifier({ origin: [.5, .5] })).add(particle).add(logo);
    
    
    mainContext.setPerspective(1000);
    
    
    Engine.on('prerender', function(){
        for( var i=0; i<balls.length; i++ ){
            balls[i].state.setTransform(Transform.rotateY(.1));
        }
    });


    /* var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/surfaces/ImageSurface");
    var Scene      = require("famous/core/Scene");
    var Transform  = require("famous/core/Transform");

    var mainContext = Engine.createContext();

    var myScene = new Scene({
        id: "root",
        opacity: 1,
        target: [
            {
                transform: Transform.translate(10, 10),
                target: {id: "foo"}
            },
            {
                transform: [
                    {rotateZ: 0.1},
                    {scale: [0.5, 0.5, 1]}
                ],
                origin: [0.5, 0.5],
                target: {id: "bar"}
            }
        ]
    });

    var surface = new ImageSurface({
        size: [200, 200],
        content: "Hello World",
        classes: ["red-bg"],
        properties: {
            lineHeight: "200px",
            textAlign: "center"
        }
    });

    var surfaceTwo = new Surface({
        size: [200, 200],
        content: "Secondary",
        classes: ["grey-bg"],
        properties: {
            lineHeight: "200px",
            textAlign: "center"
        }
    });

    myScene.id["foo"].add(surface);
    myScene.id["bar"].add(surfaceTwo);

    mainContext.add(myScene);*/
});
