import { Edge, World as PlanckWorld, Vec2 } from "planck";
import { ECS, System } from "../ecs";

export const physicsWorld = new PlanckWorld({
	gravity: new Vec2(0, 100),
});

const ground = physicsWorld.createBody({
  type: "static",
  position: new Vec2(0, 720)
});

ground.createFixture({
  shape: new Edge(new Vec2(0, 0), new Vec2(1280, 0)),
});

const ceiling = physicsWorld.createBody({
  type: "static",
  position: new Vec2(0, 0)
});

ceiling.createFixture({
  shape: new Edge(new Vec2(0, 0), new Vec2(1280, 0)),
});

const leftWall = physicsWorld.createBody({
  type: "static",
  position: new Vec2(0, 0)
});

leftWall.createFixture({
  shape: new Edge(new Vec2(0, 0), new Vec2(0, 720)),
});

const rightWall = physicsWorld.createBody({
	type: "static",
	position: new Vec2(1280, 0)
})

rightWall.createFixture({
  shape: new Edge(new Vec2(0, 0), new Vec2(0, 720)),
});

export const PhysicsSystem = (ecs: ECS): System => ({
	query: {},
	handler() {
		// TODO: Handle catchup etc.
		physicsWorld.step(1 / 60);
	},
});
