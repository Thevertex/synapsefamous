define(function(require, exports, module) {
   
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var RenderNode = require('famous/core/RenderNode');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var Vector = require('famous/math/Vector');
    var Scene      = require("famous/core/Scene");

     var SsgScene = new Scene({
        id: "root",
        opacity: 1,
    });
    
    // create the main context
    var mainContext = Engine.createContext();
    var PE = new PhysicsEngine();

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
      velocity: [0, 0, 0]
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