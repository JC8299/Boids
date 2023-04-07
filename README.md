# Boids with Quadtree optimization

This is my exploration into boids. Boids are a type of artificial life program that simulate the behavior of flocking birds, fish, or other animals. The term "boid" is a shortened version of "bird-oid," meaning "bird-like." The goal of the boid algorithm is to create a simulation of a flock or school that behaves in a way that mimics the behavior of real animals.

My implementation of the boid algorithm in JavaScript, HTML, and CSS included a quadtree optimization. A quadtree is a tree data structure in which each node has four children, dividing the space into four quadrants. This allows for more efficient collision detection in the simulation, as objects in each quadrant only need to be checked against other objects in that quadrant or nearby quadrants.

The boid algorithm works by defining a set of rules that govern the behavior of each boid in the simulation. These rules typically include separation, alignment, and cohesion. Separation ensures that boids avoid colliding with each other, alignment causes boids to move in the same direction as nearby boids, and cohesion causes boids to move towards the center of the flock. By applying these rules to each boid in the simulation, a realistic flocking behavior can be achieved.

A lot of my implementation was an inefficient use of time since I made javascript files for an implementation of quadtrees and vectors.

[Link to my implementation of boids](https://jc8299.github.io/Boids/)

## Resources
- For animation loop setup:
  - https://codepen.io/gamealchemist/pen/VeawyL?editors=0010
- For Quadtree setup:
  - https://codingee.com/boids-algorithm-implementation-with-quadtree/
  - https://github.com/hiiambhanu/cg-boids
  - https://hiiambhanu.github.io/cg-boids/
- For boids algorithm:

  - <a href="http://www.youtube.com/watch?feature=player_embedded&v=mhjuuHl6qHM
" target="_blank"><img src="http://img.youtube.com/vi/mhjuuHl6qHM/0.jpg" 
alt="Coding Challenge #124: Flocking Simulation by The Coding Train" width="240" height="180" border="10" /></a><br>
    https://www.youtube.com/watch?v=mhjuuHl6qHM

### TODO in future:
- change between basic and quadtree
- tweak minor things for the aesthetics
- explore different optimizations
