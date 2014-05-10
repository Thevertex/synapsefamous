define(function (require, exports, module) {

    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var EventHandler    = require('famous/core/EventHandler');
    var View            = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var InputSurface = require('famous/surfaces/InputSurface');
    var RenderNode = require('famous/core/RenderNode');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var Vector = require('famous/math/Vector');
    var NavigationBar = require('famous/widgets/NavigationBar');
    var Scene = require("famous/core/Scene");
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Body            = require('famous/physics/bodies/Body');
    var Circle          = require('famous/physics/bodies/Circle');
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
    var Modifier  = require('famous/core/Modifier');
    var Draggable = require('famous/modifiers/Draggable');
    
    var r = 22;
    
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
    

    var draggable = new Draggable( {
        snapX: 10, 
        snapY: 10, 
        xRange: [-420, 420],
        yRange: [-420, 420],
    });
    
    // create the main context
    var mainContext = Engine.createContext();
    
    
    //layout
    var layout = new HeaderFooterLayout({
        headerSize: 100,
        footerSize: 50
    });

    var nav = new NavigationBar('Menu');
    
    var input = new InputSurface({
        size: ['10%','10%'],
        name: 'inputSurface',
        placeholder: 'Type text here',
        value: '',
        type: 'text'
    });
    
    layout.header.add(new Surface({
        size: [undefined, 100],
        content: "",
        classes: ["grey-bg"],
        properties: {
            lineHeight: "100px",
        }
    })).add(nav).add(input);


    layout.footer.add(new Surface({
        size: [undefined, 50],
        content: "",
        classes: ["gray-bg"],
        properties: {
            lineHeight: "50px",
        }
    }));
    
    mainContext.add(layout);
    
    var PE = new PhysicsEngine();
    var handler = new EventHandler();
    var balls = new Array();
        
    for( var i=0; i<vertices.length; i++ ){
            
        var dim = Math.floor((Math.random() * 100) + 1);
        
        var ball = new Surface ({
          size: [dim,dim],
          properties: {
            backgroundColor: 'gray',
            borderRadius: '100px'
          }
        })

        // Create a physical particle with position (p), velocity (v), mass(m)
        ball.particle = new Particle({
            mass: 1,
            position: [vertices[i].x, vertices[i].y, vertices[i].z],
            velocity: [0, 0, 0]
        });
        
        ball.state = new StateModifier({origin:[0.5,0.5]});
        
        // Create a spring that will act on the particle
        /*ball.spring = new Spring({
            anchor: [vertices[i].x, vertices[i].y, vertices[i].z],
            period: 400, // <= Play with these values :-)
            dampingRatio: 0.07, // <=
            length: 0
        });*/


        // Link the spring, particle and surface together
        //PE.attach(ball.spring, ball.particle);
        PE.addBody(ball.particle);
        
        /*ball.on("click", function (e) {
            ball.particle.applyForce(new Vector(0, 0, -0.005 * 100));
        });*/
        
        /*collision = new @fam.Collision({restitution : 0.7 })
		@physicsEngine.attach(collision, unit1.body, unit2.body)
		console.log("addCollision", unit1, unit2)
		collision.on 'collision', (evt) =>*/
        
        layout.content.add(ball.state).add(ball.particle).add(ball);
        
        balls.push(ball);
        /*balls[balls.length-1].on("click",function(){
          balls[balls.length-1].particle.setVelocity([1,1,0]);
        });*/
    }
    
    
     // your app here
    var logo = new ImageSurface({
        size: [229, 227],
        content: 'content/images/ssg-logo.png',
        classes: ['backfaceVisibility'],
        properties: {
            cursor: 'pointer'
        }
    });
    
    logo.pipe(draggable);
    
    logo.on('click', function() {
        console.log(logo.particle.position)
    })
    
    // Create a physical particle with position (p), velocity (v), mass(m)
    var particle = new Particle({
      mass: 1,
      position: [0, 0, 0],
      velocity: [0, 0, 0]
    });
    
    logo.particle = particle;

    // Create a spring that will act on the particle
    var spring = new Spring({
      anchor: [0, 0, 0],
      period: 400,  // <= Play with these values :-)
      dampingRatio: 0.07, // <=
      length: 0
    });

    // Link the spring, particle and surface together
    PE.attach(spring, particle);
    PE.addBody(particle);

    // Create the scene, applying a top level modifier to center
    // the scene vertically in the viewport
    
    logo.state = new StateModifier({origin:[0.5,0.5]});
    layout.content.add(logo.state).add(particle).add(draggable).add(logo);
    
    mainContext.setPerspective(1000);
    
    previousX = 0;
    previousY = 0;
    previousZ = 0;
    
    Engine.on('prerender', function(){
        var t = Math.random();
        for( var i=0; i<balls.length; i++ ){
            //balls[i].state.halt();
            balls[i].state.setTransform(Transform.rotateY(t*Math.PI/2), {duration: 500 });
            balls[i].state.setTransform(Transform.rotateX(t*Math.PI/2), {duration: 500 });
            balls[i].state.setTransform(Transform.rotateZ(t*Math.PI/2), {duration: 500 });
            
            
            //if( previousZ != particle.position.z ){
              //  var modifierZ = previousZ - particle.position.Z;
                //balls[i].state.setTransform(Transform.translate(balls[i].particle.getPosition().x,balls[i].particle.getPosition().y,balls[i].particle.getPosition().z+modifierZ), {duration: 500 });
            //}
            //balls[i].state.setOrigin();
            //balls[i].state.setTransform(Transform.rotateZ(Math.random()*Math.PI/2), {duration: 500 });
            //balls[i].state.setTransform(Transform.rotateX(Math.random()*Math.PI/2), {duration: 500 });
        }
        particle.applyForce(new Vector(0, 0, -0.005 * 10));
        
        previousX = particle.position.x;
        previousY = particle.position.y;
        previousZ = particle.position.z;
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
