import { Edge, Vec2, World } from "planck";

export const physicsWorld = new World({
	gravity: new Vec2(0, 9.8),
});

export function createWorldEdges(width: number, height: number) {
	const ground = physicsWorld.createBody({
		type: "static",
		position: new Vec2(0, height),
	});

	ground.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(width, 0)),
	});

	const ceiling = physicsWorld.createBody({
		type: "static",
		position: new Vec2(0, 0),
	});

	ceiling.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(width, 0)),
	});

	const leftWall = physicsWorld.createBody({
		type: "static",
		position: new Vec2(0, 0),
	});

	leftWall.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(0, height)),
	});

	const rightWall = physicsWorld.createBody({
		type: "static",
		position: new Vec2(width, 0),
	});

	rightWall.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(0, height)),
	});
}
