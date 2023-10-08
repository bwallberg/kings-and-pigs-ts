import { ContactEdge, Edge, Settings, Vec2, World } from "planck";
import { EntityType } from "../constants";

Settings.lengthUnitsPerMeter = 10;

export const physicsWorld = new World({
	gravity: new Vec2(0, 9.8),
});

// TODO: Should these also be entities? 
export function createWorldEdges(width: number, height: number) {
	const ground = physicsWorld.createBody({
		type: "static",
		position: new Vec2(0, height),
		userData: EntityType.GROUND,
	});

	ground.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(width, 0)),
	});

	const leftWall = physicsWorld.createBody({
		type: "static",
		position: new Vec2(0, 0),
		userData: EntityType.WALL,
	});

	leftWall.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(0, height)),
		friction: 0
	});

	const rightWall = physicsWorld.createBody({
		type: "static",
		position: new Vec2(width, 0),
		userData: EntityType.WALL,
	});

	rightWall.createFixture({
		shape: new Edge(new Vec2(0, 0), new Vec2(0, height)),
		friction: 0
	});
}

export function isEntityTypeInContact(
	contactList: ContactEdge,
	entityType: (typeof EntityType)[keyof typeof EntityType],
) {
	for (let list: ContactEdge | null = contactList; list; list = list.next) {
		const fixtures = [list.contact.getFixtureA(), list.contact.getFixtureB()];
		if (
			fixtures.some((fixture) => fixture.getBody().getUserData() === entityType)
		) {
			return true;
		}
	}
	return false;
}
